import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Play, Pause, X, Lock, Flame, Trophy, Share2, 
  RotateCcw, ArrowRight, ShieldAlert, Sparkles, CheckCircle2 
} from 'lucide-react';
import { ActiveSessionState, UserStats, UserSettings, AppView } from '../types';
import { BreakLockModal } from './BreakLockModal';
import { ShareModal } from './ShareModal';
import { playLockInSound, playCompletionSound } from '../utils/audio';

interface FocusViewProps {
  stats: UserStats;
  settings: UserSettings;
  activeSession: ActiveSessionState | null;
  onStartSession: (goal: string, durationMinutes: number) => void;
  onPauseResumeSession: (isPaused: boolean, remainingSeconds: number) => void;
  onEndSessionEarly: () => void;
  onSessionComplete: (goal: string, durationMinutes: number) => void;
  onNavigate: (view: AppView) => void;
  initialPresetGoal?: string;
}

const DISTRACTION_MESSAGES = [
  'Distraction detected. Back to work.',
  'Your goal is still waiting.',
  'Stay locked in.',
  'You came here to finish. Finish.',
];

export const FocusView: React.FC<FocusViewProps> = ({
  stats,
  settings,
  activeSession,
  onStartSession,
  onPauseResumeSession,
  onEndSessionEarly,
  onSessionComplete,
  onNavigate,
  initialPresetGoal,
}) => {
  // Setup state
  const [goalInput, setGoalInput] = useState<string>(() => {
    if (initialPresetGoal) return initialPresetGoal;
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('currentGoal');
      if (stored) return stored;
    }
    return '';
  });
  const [selectedDuration, setSelectedDuration] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const storedDuration = localStorage.getItem('focusDuration');
      if (storedDuration && !isNaN(Number(storedDuration))) {
        return Number(storedDuration);
      }
    }
    return settings.defaultDurationMinutes || 25;
  });
  const [goalError, setGoalError] = useState<string | null>(null);

  // Runtime timer state
  const [remainingSeconds, setRemainingSeconds] = useState<number>(() => {
    if (!activeSession) return (selectedDuration || 25) * 60;
    if (activeSession.isPaused) return activeSession.remainingSecondsWhenPaused;
    return Math.max(0, Math.round((activeSession.targetEndTimestamp - Date.now()) / 1000));
  });

  // Modal & notification state
  const [showBreakModal, setShowBreakModal] = useState<boolean>(false);
  const [showShareModal, setShowShareModal] = useState<boolean>(false);
  const [distractionNotice, setDistractionNotice] = useState<string | null>(null);
  const [justCompletedSession, setJustCompletedSession] = useState<{
    goal: string;
    duration: number;
  } | null>(null);

  const goalInputRef = useRef<HTMLInputElement>(null);
  const sessionCompletedRef = useRef<boolean>(false);
  const distractionTimeoutRef = useRef<number | null>(null);

  // Update preset if passed in
  useEffect(() => {
    if (initialPresetGoal) {
      setGoalInput(initialPresetGoal);
    }
  }, [initialPresetGoal]);

  // Main accurate timer loop
  useEffect(() => {
    if (!activeSession) {
      sessionCompletedRef.current = false;
      return;
    }

    if (activeSession.isPaused) {
      setRemainingSeconds(activeSession.remainingSecondsWhenPaused);
      return;
    }

    // Accurate timestamp delta check
    const updateTime = () => {
      const now = Date.now();
      const left = Math.max(0, Math.round((activeSession.targetEndTimestamp - now) / 1000));
      setRemainingSeconds(left);

      if (left <= 0 && !sessionCompletedRef.current) {
        sessionCompletedRef.current = true;
        if (settings.soundEnabled) {
          playCompletionSound();
        }
        setJustCompletedSession({
          goal: activeSession.goal,
          duration: activeSession.durationMinutes,
        });
        onSessionComplete(activeSession.goal, activeSession.durationMinutes);
      }
    };

    updateTime();
    const interval = window.setInterval(updateTime, 250);

    return () => clearInterval(interval);
  }, [activeSession, onSessionComplete, settings.soundEnabled]);

  // Tab visibility detection
  const handleVisibilityChange = useCallback(() => {
    if (!activeSession || activeSession.isPaused || sessionCompletedRef.current) return;

    if (!document.hidden && settings.motivationalPromptsEnabled) {
      // User just returned to the tab
      const randomMsg = DISTRACTION_MESSAGES[Math.floor(Math.random() * DISTRACTION_MESSAGES.length)];
      setDistractionNotice(randomMsg);

      if (distractionTimeoutRef.current) {
        window.clearTimeout(distractionTimeoutRef.current);
      }
      distractionTimeoutRef.current = window.setTimeout(() => {
        setDistractionNotice(null);
      }, 4500);
    }
  }, [activeSession, settings.motivationalPromptsEnabled]);

  useEffect(() => {
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (distractionTimeoutRef.current) {
        window.clearTimeout(distractionTimeoutRef.current);
      }
    };
  }, [handleVisibilityChange]);

  // Handle Form Submit
  const handleStartSession = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = goalInput.trim();
    if (!trimmed) {
      setGoalError('Enter the single goal you are locking in for.');
      goalInputRef.current?.focus();
      return;
    }

    setGoalError(null);
    if (settings.soundEnabled) {
      playLockInSound();
    }
    try {
      localStorage.setItem('currentGoal', trimmed);
      localStorage.setItem('focusDuration', String(selectedDuration));
    } catch {}
    sessionCompletedRef.current = false;
    setJustCompletedSession(null);
    onStartSession(trimmed, selectedDuration);
  };

  // Format MM:SS
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // Circular progress calculations
  const totalDurationSecs = activeSession ? activeSession.totalSeconds : selectedDuration * 60;
  const progressRatio = totalDurationSecs > 0 ? (totalDurationSecs - remainingSeconds) / totalDurationSecs : 0;
  const circumference = 2 * Math.PI * 130; // Radius = 130
  const strokeDashoffset = circumference - (progressRatio * circumference);

  // -------------------------------------------------------------
  // VIEW C: SESSION COMPLETED STATE
  // -------------------------------------------------------------
  if (justCompletedSession) {
    return (
      <div className="mx-auto max-w-xl px-4 py-12 md:py-20 text-center animate-in fade-in duration-300">
        <div className="relative mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-3xl bg-[#111512] border-2 border-[#B6FF00] text-[#B6FF00] glow-neon">
          <Trophy className="h-12 w-12 stroke-[2]" />
          <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-[#B6FF00] animate-ping" />
        </div>

        <div className="inline-flex items-center gap-2 rounded-full border border-[#242B24] bg-[#111512] px-4 py-1.5 text-xs font-black tracking-widest text-[#B6FF00] uppercase mb-4">
          <Sparkles className="h-3.5 w-3.5" />
          <span>RESPECT +1</span>
        </div>

        <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-[#F5F7F2] mb-3">
          YOU SHOWED UP.
        </h2>

        <p className="text-base text-[#8B948A] mb-8">
          You kept your promise to yourself.
        </p>

        {/* Completed session recap card */}
        <div className="rounded-2xl border border-[#242B24] bg-[#111512] p-6 mb-8 text-left">
          <div className="text-xs font-bold uppercase tracking-wider text-[#8B948A] mb-1">
            Finished Objective
          </div>
          <div className="text-xl font-bold text-[#F5F7F2] mb-6">
            {justCompletedSession.goal}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-[#1C221C]">
            <div className="bg-[#161B16] p-3 rounded-xl border border-[#242B24]">
              <div className="text-[11px] text-[#8B948A]">Duration</div>
              <div className="text-lg font-bold font-mono-numbers text-[#F5F7F2]">
                {justCompletedSession.duration}m
              </div>
            </div>

            <div className="bg-[#161B16] p-3 rounded-xl border border-[#242B24]">
              <div className="text-[11px] text-[#8B948A]">Current Streak</div>
              <div className="text-lg font-bold font-mono-numbers text-[#B6FF00]">
                {stats.currentStreak} {stats.currentStreak === 1 ? 'Day' : 'Days'}
              </div>
            </div>

            <div className="bg-[#161B16] p-3 rounded-xl border border-[#242B24]">
              <div className="text-[11px] text-[#8B948A]">Total Sessions</div>
              <div className="text-lg font-bold font-mono-numbers text-[#F5F7F2]">
                {stats.totalCompletedSessions}
              </div>
            </div>

            <div className="bg-[#161B16] p-3 rounded-xl border border-[#242B24]">
              <div className="text-[11px] text-[#8B948A]">Focus Minutes</div>
              <div className="text-lg font-bold font-mono-numbers text-[#F5F7F2]">
                {stats.totalFocusedMinutes}m
              </div>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-4">
          <button
            onClick={() => {
              setJustCompletedSession(null);
              setGoalInput('');
            }}
            className="flex items-center justify-center gap-2 rounded-xl bg-[#B6FF00] px-8 py-4 text-xs font-black uppercase tracking-wider text-[#080A09] hover:bg-[#c6ff24] active:scale-[0.98] transition-all glow-neon min-h-[48px]"
          >
            <span>LOCK IN AGAIN</span>
            <RotateCcw className="h-4 w-4" />
          </button>

          <button
            onClick={() => setShowShareModal(true)}
            className="flex items-center justify-center gap-2 rounded-xl border border-[#242B24] bg-[#111512] px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#F5F7F2] hover:border-[#B6FF00] hover:text-[#B6FF00] transition-colors min-h-[48px]"
          >
            <Share2 className="h-4 w-4" />
            <span>Share My Win</span>
          </button>
        </div>

        <button
          onClick={() => onNavigate('landing')}
          className="text-xs text-[#8B948A] hover:text-[#F5F7F2] transition-colors underline underline-offset-4 py-2"
        >
          BACK TO HOME
        </button>

        <ShareModal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          goal={justCompletedSession.goal}
          durationMinutes={justCompletedSession.duration}
          totalCompletedSessions={stats.totalCompletedSessions}
          currentStreak={stats.currentStreak}
        />
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW B: ACTIVE FOCUS SESSION
  // -------------------------------------------------------------
  if (activeSession) {
    return (
      <div className="relative mx-auto max-w-2xl px-4 py-8 sm:py-16 text-center flex flex-col items-center">
        
        {/* Distraction Toast Banner (Non-blocking, auto-dismissing) */}
        {distractionNotice && (
          <aside
            aria-live="polite"
            className="fixed top-20 z-50 left-1/2 -translate-x-1/2 w-11/12 max-w-md rounded-2xl border border-[#B6FF00]/40 bg-[#111512]/95 backdrop-blur-md p-4 text-left shadow-2xl animate-in slide-in-from-top-4 duration-200"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#161B16] text-[#B6FF00]">
                <ShieldAlert className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-black uppercase tracking-wider text-[#B6FF00]">
                  Focus Alert
                </div>
                <div className="text-sm font-semibold text-[#F5F7F2] truncate">
                  {distractionNotice}
                </div>
              </div>
              <button
                onClick={() => setDistractionNotice(null)}
                className="text-[#8B948A] hover:text-[#F5F7F2] p-1 min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Dismiss alert"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </aside>
        )}

        {/* Goal shown prominently at top */}
        <div className="mb-4 max-w-xl w-full text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#F5F7F2] tracking-tight break-words">
            🎯 Focusing on: <span className="text-[#B6FF00]">{activeSession.goal}</span>
          </h1>
        </div>

        {/* Subtle active status pill */}
        <div className="flex items-center gap-2 mb-6 px-3.5 py-1.5 rounded-full border border-[#242B24] bg-[#111512]">
          <span className={`h-2 w-2 rounded-full ${activeSession.isPaused ? 'bg-[#8B948A]' : 'bg-[#B6FF00] animate-pulse'}`} />
          <span className="text-xs font-bold uppercase tracking-wider text-[#8B948A]">
            {activeSession.isPaused ? 'Session Paused' : 'Locked In · Tab Guard Armed'}
          </span>
        </div>

        {/* Circular Countdown Timer */}
        <div className="relative my-4 flex items-center justify-center w-72 h-72 sm:w-80 sm:h-80">
          <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 300 300">
            {/* Background circle */}
            <circle
              cx="150"
              cy="150"
              r="130"
              fill="transparent"
              stroke="#161B16"
              strokeWidth="10"
            />
            {/* Glowing neon progress stroke */}
            <circle
              cx="150"
              cy="150"
              r="130"
              fill="transparent"
              stroke={activeSession.isPaused ? '#8B948A' : '#B6FF00'}
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-300 ease-linear"
            />
          </svg>

          {/* Central Numerals */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-mono-numbers text-5xl sm:text-6xl font-black tracking-tight text-[#F5F7F2] select-none text-glow-neon">
              {formatTime(remainingSeconds)}
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#8B948A] mt-2">
              {activeSession.isPaused ? 'PAUSED' : `${Math.round(progressRatio * 100)}% COMPLETE`}
            </span>
          </div>
        </div>

        {/* Timer Controls: Pause/Resume & End Session */}
        <div className="mt-6 flex items-center gap-4">
          <button
            onClick={() => {
              const nextPaused = !activeSession.isPaused;
              onPauseResumeSession(nextPaused, remainingSeconds);
            }}
            className="flex items-center justify-center gap-2 rounded-xl bg-[#111512] border border-[#242B24] hover:border-[#B6FF00] px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-[#F5F7F2] transition-colors min-h-[48px] min-w-[140px]"
          >
            {activeSession.isPaused ? (
              <>
                <Play className="h-4 w-4 fill-[#F5F7F2]" />
                <span>Resume</span>
              </>
            ) : (
              <>
                <Pause className="h-4 w-4 fill-[#F5F7F2]" />
                <span>Pause</span>
              </>
            )}
          </button>

          <button
            onClick={() => setShowBreakModal(true)}
            className="flex items-center justify-center gap-2 rounded-xl border border-[#242B24] bg-[#080A09] hover:border-[#EF4444]/60 hover:text-[#EF4444] px-5 py-3.5 text-xs font-semibold text-[#8B948A] transition-colors min-h-[48px]"
          >
            <X className="h-4 w-4" />
            <span>End Session</span>
          </button>
        </div>

        <div className="mt-8 text-xs text-[#556054]">
          Accidental refresh safe · Timestamps calculate exact elapsed time
        </div>

        {/* Session Break Early Modal */}
        <BreakLockModal
          isOpen={showBreakModal}
          onResume={() => setShowBreakModal(false)}
          onConfirmEnd={() => {
            setShowBreakModal(false);
            onEndSessionEarly();
          }}
        />
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW A: GOAL SETUP STATE
  // -------------------------------------------------------------
  return (
    <div className="mx-auto max-w-xl px-4 py-8 sm:py-16 text-center animate-in fade-in duration-200">
      
      <div className="inline-flex items-center gap-2 rounded-full border border-[#242B24] bg-[#111512] px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-[#B6FF00] mb-4">
        <Lock className="h-3.5 w-3.5" />
        <span>GHOSTLOCK SESSION</span>
      </div>

      <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-[#F5F7F2] mb-3">
        WHAT ARE YOU LOCKING IN FOR?
      </h1>

      <p className="text-base text-[#8B948A] mb-8">
        One goal. One session. No distractions.
      </p>

      {/* Goal Entry Form */}
      <form onSubmit={handleStartSession} className="space-y-6 text-left">
        <div>
          <label htmlFor="goal-input" className="block text-xs font-bold uppercase tracking-wider text-[#8B948A] mb-2">
            Target Objective
          </label>
          <div className="relative">
            <input
              id="goal-input"
              ref={goalInputRef}
              type="text"
              value={goalInput}
              onChange={(e) => {
                setGoalInput(e.target.value);
                if (goalError) setGoalError(null);
              }}
              placeholder="Finish my assignment..."
              maxLength={120}
              className={`w-full rounded-2xl border bg-[#111512] px-5 py-4 text-base sm:text-lg font-medium text-[#F5F7F2] placeholder-[#556054] outline-none transition-all ${
                goalError 
                  ? 'border-[#EF4444] focus:border-[#EF4444] focus:ring-1 focus:ring-[#EF4444]' 
                  : 'border-[#242B24] focus:border-[#B6FF00] focus:ring-1 focus:ring-[#B6FF00]'
              }`}
            />
          </div>
          {goalError && (
            <p className="mt-2 text-xs font-semibold text-[#EF4444]">
              {goalError}
            </p>
          )}
        </div>

        {/* Duration Selector: Presets 15, 25, 50 mins */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#8B948A]">
              Focus Duration
            </span>
            <span className="text-xs text-[#556054]">
              Default: 25 minutes
            </span>
          </div>

          <div className="grid grid-cols-4 gap-2.5">
            {[5, 15, 25, 50].map((mins) => (
              <button
                key={mins}
                type="button"
                onClick={() => {
                  setSelectedDuration(mins);
                  try {
                    localStorage.setItem('focusDuration', String(mins));
                  } catch {}
                }}
                className={`flex flex-col items-center justify-center rounded-xl p-3 border transition-all min-h-[48px] ${
                  selectedDuration === mins
                    ? 'border-[#B6FF00] bg-[#161B16] text-[#B6FF00] glow-neon-sm'
                    : 'border-[#242B24] bg-[#111512] text-[#8B948A] hover:border-[#8B948A]/40 hover:text-[#F5F7F2]'
                }`}
              >
                <span className="font-mono-numbers text-lg sm:text-xl font-extrabold text-[#F5F7F2]">
                  {mins}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider">
                  {mins === 5 ? 'Demo' : 'Mins'}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Lock In Button */}
        <button
          type="submit"
          className="w-full flex items-center justify-center gap-3 rounded-2xl bg-[#B6FF00] py-4 px-6 text-sm sm:text-base font-black uppercase tracking-wider text-[#080A09] hover:bg-[#c6ff24] active:scale-[0.98] transition-all glow-neon min-h-[52px]"
        >
          <span>LOCK IN</span>
          <ArrowRight className="h-5 w-5" />
        </button>
      </form>

      {/* Quick stats reminder */}
      <div className="mt-10 pt-8 border-t border-[#1C221C] flex items-center justify-between text-xs text-[#8B948A]">
        <div className="flex items-center gap-2">
          <Flame className="h-4 w-4 text-[#B6FF00]" />
          <span>Active Streak: <strong className="text-[#F5F7F2] font-mono-numbers">{stats.currentStreak} {stats.currentStreak === 1 ? 'day' : 'days'}</strong></span>
        </div>
        <div>
          <span>Total Locked: <strong className="text-[#F5F7F2] font-mono-numbers">{stats.totalFocusedMinutes}m</strong></span>
        </div>
      </div>
    </div>
  );
};
