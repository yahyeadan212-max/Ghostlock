import React, { useState } from 'react';
import { 
  Flame, Trophy, Clock, CheckCircle, RotateCcw, 
  Calendar, AlertCircle, ArrowRight, ShieldAlert 
} from 'lucide-react';
import { UserStats, AppView } from '../types';
import { getLocalDateString } from '../utils/storage';

interface ProgressViewProps {
  stats: UserStats;
  onResetProgress: () => void;
  onNavigate: (view: AppView) => void;
}

export const ProgressView: React.FC<ProgressViewProps> = ({
  stats,
  onResetProgress,
  onNavigate,
}) => {
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);

  // Calculate today's completed sessions
  const todayStr = getLocalDateString(new Date());
  const todaySessions = stats.history.filter((s) => s.date === todayStr);

  // Generate 7-day activity data (past 6 days + today)
  const past7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateStr = getLocalDateString(d);
    const dayLabel = d.toLocaleDateString(undefined, { weekday: 'narrow' }); // M, T, W, etc.
    const monthDay = d.toLocaleDateString(undefined, { month: 'numeric', day: 'numeric' });
    
    const daySessions = stats.history.filter((s) => s.date === dateStr);
    const count = daySessions.length;
    const minutes = daySessions.reduce((acc, curr) => acc + curr.durationMinutes, 0);

    return {
      dateStr,
      dayLabel,
      monthDay,
      isToday: dateStr === todayStr,
      count,
      minutes,
      hasSession: count > 0,
    };
  });

  const maxDailyMinutes = Math.max(50, ...past7Days.map((d) => d.minutes));

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:py-14 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#B6FF00]">
            PROOF OF DISCIPLINE
          </span>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-[#F5F7F2] mt-1">
            Streaks & Progress
          </h1>
        </div>

        <button
          onClick={() => onNavigate('focus')}
          className="self-start sm:self-auto flex items-center gap-2 rounded-xl bg-[#B6FF00] px-5 py-2.5 text-xs font-black uppercase tracking-wider text-[#080A09] hover:bg-[#c6ff24] transition-all glow-neon-sm min-h-[44px]"
        >
          <span>Start Focus</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {/* Current Streak */}
        <div className="rounded-2xl border border-[#242B24] bg-[#111512] p-5">
          <div className="flex items-center justify-between text-[#8B948A] mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Current Streak</span>
            <Flame className="h-4 w-4 text-[#B6FF00]" />
          </div>
          <div className="font-mono-numbers text-3xl sm:text-4xl font-black text-[#B6FF00]">
            {stats.currentStreak}
          </div>
          <div className="text-[11px] text-[#8B948A] mt-1">
            {stats.currentStreak === 1 ? 'day active' : 'consecutive days'}
          </div>
        </div>

        {/* Longest Streak */}
        <div className="rounded-2xl border border-[#242B24] bg-[#111512] p-5">
          <div className="flex items-center justify-between text-[#8B948A] mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Longest Streak</span>
            <Trophy className="h-4 w-4 text-[#8B948A]" />
          </div>
          <div className="font-mono-numbers text-3xl sm:text-4xl font-black text-[#F5F7F2]">
            {stats.longestStreak}
          </div>
          <div className="text-[11px] text-[#8B948A] mt-1">
            {stats.longestStreak === 1 ? 'day record' : 'days personal best'}
          </div>
        </div>

        {/* Total Sessions */}
        <div className="rounded-2xl border border-[#242B24] bg-[#111512] p-5">
          <div className="flex items-center justify-between text-[#8B948A] mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Sessions</span>
            <CheckCircle className="h-4 w-4 text-[#8B948A]" />
          </div>
          <div className="font-mono-numbers text-3xl sm:text-4xl font-black text-[#F5F7F2]">
            {stats.totalCompletedSessions}
          </div>
          <div className="text-[11px] text-[#8B948A] mt-1">
            {todaySessions.length} completed today
          </div>
        </div>

        {/* Total Minutes */}
        <div className="rounded-2xl border border-[#242B24] bg-[#111512] p-5">
          <div className="flex items-center justify-between text-[#8B948A] mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Focused</span>
            <Clock className="h-4 w-4 text-[#8B948A]" />
          </div>
          <div className="font-mono-numbers text-3xl sm:text-4xl font-black text-[#F5F7F2]">
            {stats.totalFocusedMinutes}m
          </div>
          <div className="text-[11px] text-[#8B948A] mt-1">
            {(stats.totalFocusedMinutes / 60).toFixed(1)} total hours
          </div>
        </div>
      </div>

      {/* 7-Day Activity Visualization */}
      <div className="rounded-2xl border border-[#242B24] bg-[#111512] p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-[#B6FF00]" />
            <h2 className="text-base font-bold text-[#F5F7F2]">
              Past 7 Days Activity
            </h2>
          </div>
          <span className="text-xs text-[#8B948A]">
            {todaySessions.length > 0 ? 'Today completed' : 'Lock in today to keep streak'}
          </span>
        </div>

        <div className="grid grid-cols-7 gap-2 sm:gap-4 items-end h-44 pb-2 border-b border-[#1C221C]">
          {past7Days.map((day) => {
            const barHeightPct = day.minutes > 0 
              ? Math.max(14, Math.round((day.minutes / maxDailyMinutes) * 100))
              : 6;

            return (
              <div key={day.dateStr} className="flex flex-col items-center h-full justify-end group">
                {/* Tooltip on hover */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] text-[#8B948A] mb-1 text-center font-mono-numbers">
                  {day.minutes}m
                </div>

                {/* Bar */}
                <div className="w-full max-w-[48px] bg-[#161B16] rounded-lg p-1 flex flex-col justify-end h-28">
                  <div
                    style={{ height: `${barHeightPct}%` }}
                    className={`w-full rounded-md transition-all ${
                      day.hasSession
                        ? day.isToday
                          ? 'bg-[#B6FF00] shadow-sm shadow-[#B6FF00]/50'
                          : 'bg-[#B6FF00]/80'
                        : 'bg-[#242B24]/40'
                    }`}
                  />
                </div>

                {/* Day labels */}
                <div className="mt-2 text-center">
                  <span className={`block text-xs font-bold ${day.isToday ? 'text-[#B6FF00]' : 'text-[#8B948A]'}`}>
                    {day.dayLabel}
                  </span>
                  <span className="block text-[10px] text-[#556054]">
                    {day.monthDay}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Session History */}
      <div className="rounded-2xl border border-[#242B24] bg-[#111512] p-6 mb-8">
        <h2 className="text-base font-bold text-[#F5F7F2] mb-4">
          Session History
        </h2>

        {stats.history.length === 0 ? (
          <div className="py-12 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[#161B16] text-[#8B948A]">
              <Flame className="h-6 w-6" />
            </div>
            <p className="text-sm font-semibold text-[#F5F7F2]">
              Your record starts with one session.
            </p>
            <p className="text-xs text-[#8B948A] mt-1 mb-4">
              Finish your first session to initiate your streak and unlock your progress log.
            </p>
            <button
              onClick={() => onNavigate('focus')}
              className="inline-flex items-center gap-2 rounded-xl bg-[#B6FF00] px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#080A09]"
            >
              Start First Session
            </button>
          </div>
        ) : (
          <div className="divide-y divide-[#1C221C]">
            {stats.history.slice(0, 15).map((session) => {
              const sessionDate = new Date(session.completedAt);
              const timeString = sessionDate.toLocaleTimeString(undefined, {
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div key={session.id} className="py-3.5 flex items-center justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold text-[#F5F7F2] truncate">
                      {session.goal}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[#8B948A] mt-0.5">
                      <span>{session.date}</span>
                      <span aria-hidden="true">·</span>
                      <span>{timeString}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-mono-numbers text-sm font-bold text-[#B6FF00]">
                      +{session.durationMinutes}m
                    </span>
                    <span className="block text-[10px] uppercase font-bold text-[#556054]">
                      RESPECT +1
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Danger Zone: Reset Progress with confirmation */}
      <div className="rounded-2xl border border-[#3E2424]/60 bg-[#161111] p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-[#F5F7F2] flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-[#EF4444]" />
            Reset All Progress
          </h3>
          <p className="text-xs text-[#8B948A] mt-1">
            Permanently clear all streaks, completed sessions, and focus hours from this browser.
          </p>
        </div>

        <button
          onClick={() => setShowResetConfirm(true)}
          className="flex items-center gap-2 rounded-xl border border-[#EF4444]/40 bg-[#080A09] px-4 py-2.5 text-xs font-bold text-[#EF4444] hover:bg-[#EF4444] hover:text-white transition-colors min-h-[44px]"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Reset Progress</span>
        </button>
      </div>

      {/* Reset Confirmation Dialog */}
      {showResetConfirm && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-md rounded-2xl border border-[#3E2424] bg-[#111512] p-6 text-center shadow-2xl">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#1C1616] text-[#EF4444]">
              <ShieldAlert className="h-6 w-6" />
            </div>

            <h4 className="text-xl font-black text-[#F5F7F2] mb-2 uppercase">
              CONFIRM RESET?
            </h4>

            <p className="text-xs text-[#8B948A] leading-relaxed mb-6">
              This will permanently delete your {stats.currentStreak}-day streak, {stats.totalCompletedSessions} completed sessions, and {stats.totalFocusedMinutes} focus minutes. This action cannot be undone.
            </p>

            <div className="flex flex-col gap-2.5">
              <button
                onClick={() => {
                  onResetProgress();
                  setShowResetConfirm(false);
                }}
                className="w-full rounded-xl bg-[#EF4444] py-3 px-4 text-xs font-bold uppercase tracking-wider text-white hover:bg-red-600 transition-colors min-h-[44px]"
              >
                Yes, Reset All Data
              </button>

              <button
                onClick={() => setShowResetConfirm(false)}
                className="w-full rounded-xl border border-[#242B24] bg-[#080A09] py-3 px-4 text-xs font-semibold text-[#8B948A] hover:text-[#F5F7F2] transition-colors min-h-[44px]"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
