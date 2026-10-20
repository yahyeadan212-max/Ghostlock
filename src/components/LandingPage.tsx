import React, { useState, useEffect } from 'react';
import { 
  Lock, ArrowRight, Play, CheckCircle2, Shield, Eye, Flame, 
  Award, Clock, ShieldAlert, Sparkles, AlertTriangle 
} from 'lucide-react';
import { AppView } from '../types';
import { fetchAnalyticsStats } from '../utils/analytics';
import { DemoModal } from './DemoModal';

interface LandingPageProps {
  onStartFocus: (presetGoal?: string, durationMinutes?: number) => void;
  onNavigate: (view: AppView) => void;
  currentStreak: number;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartFocus,
  onNavigate,
  currentStreak,
}) => {
  const [heroGoal, setHeroGoal] = useState<string>('');
  const [isDemoOpen, setIsDemoOpen] = useState<boolean>(false);
  const [statsDisplay, setStatsDisplay] = useState<{ lockIns: number; completions: number }>({
    lockIns: 10,
    completions: 0,
  });

  // Fetch real stats from dashboard
  useEffect(() => {
    let isMounted = true;
    fetchAnalyticsStats()
      .then((data) => {
        if (isMounted) {
          setStatsDisplay({
            lockIns: Math.max(data.totalLockIns || 0, 10),
            completions: data.totalCompletions || 0,
          });
        }
      })
      .catch(() => {});
    return () => {
      isMounted = false;
    };
  }, []);

  const handleStart1MinJail = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const goal = heroGoal.trim() || 'Survive 1 Min Jail';
    try {
      localStorage.setItem('currentGoal', goal);
      localStorage.setItem('focusDuration', '1');
    } catch {}
    onStartFocus(goal, 1);
  };

  const handleStart25MinFocus = (presetGoalText?: string) => {
    const goal = presetGoalText || heroGoal.trim() || '25-Min Deep Focus';
    try {
      localStorage.setItem('currentGoal', goal);
      localStorage.setItem('focusDuration', '25');
    } catch {}
    onStartFocus(goal, 25);
  };

  return (
    <div className="flex flex-col">
      {/* 7-Second Demo Modal */}
      <DemoModal
        isOpen={isDemoOpen}
        onClose={() => setIsDemoOpen(false)}
        onStart1MinJail={handleStart1MinJail}
      />

      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-10 pb-16 md:pt-18 md:pb-24">
        {/* Neon green atmosphere glow */}
        <div 
          aria-hidden="true" 
          className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[620px] h-[360px] bg-[#B6FF00]/8 blur-[130px] rounded-full"
        />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
            
            {/* Left Column: Copy & CTAs */}
            <div className="lg:col-span-7 flex flex-col items-start text-left">
              
              {/* Fun Dare Eyebrow */}
              <div className="inline-flex items-center gap-2 mb-4 px-3.5 py-1 rounded-full border border-[#242B24] bg-[#111512]">
                <Flame className="h-4 w-4 text-[#B6FF00]" />
                <span className="text-xs font-black uppercase tracking-widest text-[#B6FF00]">
                  THE 60-SECOND WILLPOWER DARE
                </span>
              </div>

              {/* Exact Headline: "A TIMER YOU CAN'T QUIT." */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#F5F7F2] leading-[1.05] max-w-2xl mb-4">
                A TIMER YOU <br />
                <span className="text-[#B6FF00] drop-shadow-[0_0_25px_rgba(182,255,0,0.4)]">
                  CAN'T QUIT.
                </span>
              </h1>

              {/* Exact Subheadline: "No X button. No ESC. No minimizing. Set 25 mins. Your screen is JAILED. Quit = You FAIL." */}
              <p className="text-base sm:text-lg lg:text-xl font-bold text-[#F5F7F2] leading-snug max-w-xl mb-6">
                No X button. No ESC. No minimizing. Set 25 mins. Your screen is JAILED. Quit = You FAIL.
              </p>

              {/* Quick Target Input */}
              <div className="w-full max-w-lg mb-4">
                <input
                  type="text"
                  value={heroGoal}
                  onChange={(e) => setHeroGoal(e.target.value)}
                  placeholder="e.g. Finish math homework, write essay..."
                  className="w-full rounded-2xl border border-[#242B24] bg-[#111512] px-5 py-4 text-base font-semibold text-[#F5F7F2] placeholder-[#556054] outline-none focus:border-[#B6FF00] focus:ring-1 focus:ring-[#B6FF00] transition-all"
                />
              </div>

              {/* Two Buttons: Primary = "🔥 I DARE YOU - Try 1 Min Jail", Secondary = "Watch 7s demo" */}
              <div className="w-full max-w-lg flex flex-col sm:flex-row gap-3.5 mb-4">
                {/* Primary Button */}
                <button
                  type="button"
                  onClick={() => handleStart1MinJail()}
                  className="flex-1 group flex items-center justify-center gap-2.5 rounded-2xl bg-[#B6FF00] px-6 py-4 text-sm sm:text-base font-black uppercase tracking-wider text-[#080A09] transition-all hover:bg-[#c6ff24] active:scale-[0.98] glow-neon cursor-pointer min-h-[56px]"
                >
                  <Flame className="h-5 w-5 fill-[#080A09]" />
                  <span>🔥 I DARE YOU - Try 1 Min Jail</span>
                </button>

                {/* Secondary Button */}
                <button
                  type="button"
                  onClick={() => setIsDemoOpen(true)}
                  className="flex items-center justify-center gap-2 rounded-2xl border-2 border-[#242B24] bg-[#111512] px-6 py-4 text-sm font-bold uppercase tracking-wider text-[#F5F7F2] hover:border-[#B6FF00] hover:text-[#B6FF00] transition-all active:scale-[0.98] cursor-pointer min-h-[56px]"
                >
                  <Play className="h-4 w-4 fill-current" />
                  <span>Watch 7s demo</span>
                </button>
              </div>

              {/* Micro dare reminder / Social Proof Quick Pill */}
              <div className="flex flex-wrap items-center gap-3 text-xs text-[#8B948A] mb-4">
                <span className="flex items-center gap-1.5 font-bold text-[#B6FF00]">
                  <span className="h-2 w-2 rounded-full bg-[#B6FF00] animate-ping" />
                  {statsDisplay.lockIns} tried · {statsDisplay.completions} beat it
                </span>
                <span>•</span>
                <span>No signup needed</span>
                <span>•</span>
                <span>Starts in 1 tap</span>
              </div>

              {currentStreak > 0 && (
                <div className="mt-2 flex items-center gap-2.5 rounded-lg border border-[#242B24] bg-[#111512] px-3.5 py-2 text-xs">
                  <Flame className="h-4 w-4 text-[#B6FF00]" />
                  <span className="text-[#8B948A]">Your active streak:</span>
                  <span className="font-bold text-[#F5F7F2] font-mono-numbers">{currentStreak} {currentStreak === 1 ? 'day' : 'days'}</span>
                </div>
              )}
            </div>

            {/* Right Column: Prominent Visual Preview of the Jail Focus Timer */}
            <div className="lg:col-span-5 w-full flex justify-center">
              <div 
                onClick={() => handleStart1MinJail()}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter') handleStart1MinJail(); }}
                className="group relative w-full max-w-sm rounded-3xl border-2 border-[#242B24] bg-[#111512] p-6 sm:p-8 transition-all hover:border-[#B6FF00] hover:shadow-2xl hover:shadow-[#B6FF00]/15 cursor-pointer text-center"
              >
                {/* Active Indicator Top Strip */}
                <div className="flex items-center justify-between pb-5 border-b border-[#1C221C]">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[#B6FF00] animate-pulse" />
                    <span className="text-xs font-black tracking-wider uppercase text-[#B6FF00]">
                      SCREEN JAILED // NO ESC
                    </span>
                  </div>
                  <span className="text-xs text-[#EF4444] font-black uppercase tracking-wider">
                    QUIT = L
                  </span>
                </div>

                {/* Target Goal preview */}
                <div className="my-5">
                  <div className="text-[11px] uppercase tracking-widest text-[#8B948A] mb-1 font-semibold">
                    Target Objective
                  </div>
                  <div className="text-base sm:text-lg font-bold text-[#F5F7F2] line-clamp-1">
                    {heroGoal.trim() || 'Survive 1 Min Jail Dare'}
                  </div>
                </div>

                {/* Circular Timer Visual Mockup */}
                <div className="relative mx-auto my-3 flex items-center justify-center w-48 h-48 sm:w-52 sm:h-52">
                  <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
                    {/* Background track circle */}
                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      fill="transparent"
                      stroke="#1C221C"
                      strokeWidth="6"
                    />
                    {/* Glowing progress stroke */}
                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      fill="transparent"
                      stroke="#B6FF00"
                      strokeWidth="6"
                      strokeDasharray="264"
                      strokeDashoffset="66"
                      strokeLinecap="round"
                    />
                  </svg>
                  
                  {/* Central Numerals */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="font-mono-numbers text-4xl sm:text-5xl font-black tracking-tight text-[#F5F7F2] drop-shadow-[0_0_12px_rgba(182,255,0,0.3)]">
                      01:00
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#B6FF00] mt-1">
                      60-SEC WILLPOWER DARE
                    </span>
                  </div>
                </div>

                {/* Controls preview button */}
                <div className="pt-3 flex items-center justify-center">
                  <div className="flex items-center justify-center gap-2 rounded-xl bg-[#B6FF00] px-5 py-2.5 text-xs font-black uppercase text-[#080A09] group-hover:scale-105 transition-transform w-full">
                    <Flame className="h-3.5 w-3.5 fill-[#080A09]" />
                    <span>🔥 TRY 1 MIN JAIL</span>
                  </div>
                </div>

                <div className="mt-4 text-[11px] text-[#556054]">
                  Tap to launch fullscreen lock · Fail if you leave
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* QUICK VALUE BAR */}
      <section className="border-y border-[#242B24] bg-[#111512] py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            
            <div className="flex flex-col items-center justify-center p-2">
              <span className="text-base sm:text-lg font-black text-[#F5F7F2] tracking-tight">
                No Sign-Up
              </span>
              <span className="text-xs text-[#8B948A] mt-0.5">
                Start in 3 seconds flat
              </span>
            </div>

            <div className="flex flex-col items-center justify-center p-2">
              <span className="text-base sm:text-lg font-black text-[#F5F7F2] tracking-tight">
                100% Free
              </span>
              <span className="text-xs text-[#8B948A] mt-0.5">
                Zero paywalls forever
              </span>
            </div>

            <div className="flex flex-col items-center justify-center p-2">
              <span className="text-base sm:text-lg font-black text-[#F5F7F2] tracking-tight">
                Full Screen Jail
              </span>
              <span className="text-xs text-[#8B948A] mt-0.5">
                No tabs, no doomscrolling
              </span>
            </div>

            <div className="flex flex-col items-center justify-center p-2">
              <span className="text-base sm:text-lg font-black text-[#F5F7F2] tracking-tight">
                Survive or Take L
              </span>
              <span className="text-xs text-[#8B948A] mt-0.5">
                Earn real respect
              </span>
            </div>

          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION (Gen Z Language: 3 Steps) */}
      {/* Requirement 3: 3 steps: "1. Set goal 2. Get locked - full screen jail 3. Survive or take L" */}
      <section id="how-it-works" className="py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-2xl text-left mb-16">
            <span className="text-xs font-black uppercase tracking-widest text-[#B6FF00]">
              THE 3 RULES OF THE DARE
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#F5F7F2] tracking-tight mt-2">
              How GhostLock Works
            </h2>
            <p className="text-base text-[#8B948A] mt-2">
              No complicated productivity fluff. Just you versus your urge to scroll.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Step 1: 1. Set goal */}
            <div className="rounded-3xl border-2 border-[#242B24] bg-[#111512] p-8 flex flex-col justify-between transition-all hover:border-[#B6FF00]/50">
              <div>
                <span className="font-mono-numbers text-3xl font-black text-[#B6FF00]">
                  01
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-[#F5F7F2] mt-4 mb-3">
                  1. Set goal
                </h3>
                <p className="text-sm text-[#8B948A] leading-relaxed">
                  Type what you gotta finish before you scroll again. Homework, essay, coding, gym split. No fake to-do lists, just one target.
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-[#1C221C] text-xs font-semibold text-[#556054]">
                Target locking prevents fake work
              </div>
            </div>

            {/* Step 2: 2. Get locked - full screen jail */}
            <div className="rounded-3xl border-2 border-[#242B24] bg-[#111512] p-8 flex flex-col justify-between transition-all hover:border-[#B6FF00]/50">
              <div>
                <span className="font-mono-numbers text-3xl font-black text-[#B6FF00]">
                  02
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-[#F5F7F2] mt-4 mb-3">
                  2. Get locked - full screen jail
                </h3>
                <p className="text-sm text-[#8B948A] leading-relaxed">
                  Once you tap in, your screen is cooked. Full-screen jail. No X button. No tab switching, no doomscrolling. Stay locked or suffer the shame.
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-[#1C221C] text-xs font-semibold text-[#556054]">
                Tab guard alarms sound if you wander off
              </div>
            </div>

            {/* Step 3: 3. Survive or take L */}
            <div className="rounded-3xl border-2 border-[#242B24] bg-[#111512] p-8 flex flex-col justify-between transition-all hover:border-[#B6FF00]/50">
              <div>
                <span className="font-mono-numbers text-3xl font-black text-[#B6FF00]">
                  03
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-[#F5F7F2] mt-4 mb-3">
                  3. Survive or take L
                </h3>
                <p className="text-sm text-[#8B948A] leading-relaxed">
                  Make it to 0:00 and claim your W (+1 Respect). Tap quit or give up, and you hold the biggest L. Don't fold under pressure.
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-[#1C221C] text-xs font-semibold text-[#556054]">
                Respect +1 awarded only upon zero-quit completion
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* WHY GHOSTLOCK SECTION */}
      <section className="border-t border-[#242B24] bg-[#111512]/60 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-[#B6FF00]">
                TIRED OF DOOMSCROLLING?
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-[#F5F7F2] tracking-tight mt-2 mb-6">
                Why Gen Z Loves The GhostLock Dare
              </h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#161B16] border border-[#242B24] text-[#B6FF00]">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-[#F5F7F2]">The 1-Minute Micro-Dare</h4>
                    <p className="text-sm text-[#8B948A] mt-1 leading-relaxed">
                      Terrified of starting? Start with 1 minute. Everyone can survive 60 seconds. Once momentum kicks in, the 25-minute deep work is effortless.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#161B16] border border-[#242B24] text-[#B6FF00]">
                    <Award className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-[#F5F7F2]">No Fake Streaks or Gem Stores</h4>
                    <p className="text-sm text-[#8B948A] mt-1 leading-relaxed">
                      No paying for "streak freezes." You either showed up today or you broke your streak. Pure honest discipline.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#161B16] border border-[#242B24] text-[#B6FF00]">
                    <Shield className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-[#F5F7F2]">100% Free & Private</h4>
                    <p className="text-sm text-[#8B948A] mt-1 leading-relaxed">
                      No corporate trackers. No email required to start. Your focus stats stay right on your device.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Lock-In Preset Cards */}
            <div className="rounded-3xl border-2 border-[#242B24] bg-[#080A09] p-6 sm:p-8">
              <h3 className="text-lg font-black text-[#F5F7F2] mb-1">
                Quick Dares & Goals
              </h3>
              <p className="text-xs text-[#8B948A] mb-5">
                Tap any challenge to instantly lock your browser:
              </p>

              <div className="space-y-3">
                {[
                  { label: '🔥 1-Min Jail: Survive 60s without touching phone', mins: 1 },
                  { label: 'Finish math assignment before midnight', mins: 25 },
                  { label: 'Write 500 words of essay with zero tabs', mins: 25 },
                  { label: 'Deep code sprint without Instagram breaks', mins: 25 },
                  { label: 'Study lecture notes for tomorrow\'s quiz', mins: 25 },
                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={() => {
                      if (item.mins === 1) {
                        try {
                          localStorage.setItem('currentGoal', item.label);
                          localStorage.setItem('focusDuration', '1');
                        } catch {}
                        onStartFocus(item.label, 1);
                      } else {
                        handleStart25MinFocus(item.label);
                      }
                    }}
                    className="w-full flex items-center justify-between p-3.5 rounded-xl border border-[#242B24] bg-[#111512] hover:border-[#B6FF00] hover:bg-[#161B16] transition-all text-left group min-h-[46px] cursor-pointer"
                  >
                    <span className="text-xs sm:text-sm font-semibold text-[#F5F7F2] group-hover:text-[#B6FF00] transition-colors truncate mr-2">
                      {item.label}
                    </span>
                    <span className="shrink-0 flex items-center gap-1 text-[11px] font-mono-numbers font-bold text-[#8B948A] group-hover:text-[#B6FF00]">
                      <span>{item.mins}m</span>
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CLOSING CTA SECTION WITH DASHBOARD SOCIAL PROOF */}
      {/* Requirement 4: Show real stats from dashboard: "10 people tried. 0 completed. Be first to beat it." under final CTA. */}
      <section className="py-20 md:py-28 text-center relative overflow-hidden border-t border-[#1C221C]">
        <div 
          aria-hidden="true" 
          className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-[#B6FF00]/5 blur-[120px] rounded-full"
        />

        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#242B24] bg-[#111512] px-4 py-1 text-xs font-black uppercase tracking-widest text-[#B6FF00] mb-4">
            <Sparkles className="h-3.5 w-3.5" />
            <span>FINAL CALL</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-[#F5F7F2] mb-3">
            Can you survive 60 seconds?
          </h2>
          <p className="text-base sm:text-lg text-[#8B948A] mb-8 max-w-xl mx-auto">
            Stop negotiating with your notifications. Take the dare and prove you own your attention.
          </p>

          <button
            onClick={() => handleStart1MinJail()}
            className="inline-flex items-center justify-center gap-3 rounded-2xl bg-[#B6FF00] px-10 py-5 text-sm sm:text-base font-black uppercase tracking-wider text-[#080A09] transition-all hover:bg-[#c6ff24] active:scale-[0.98] glow-neon cursor-pointer min-h-[56px]"
          >
            <Flame className="h-5 w-5 fill-[#080A09]" />
            <span>🔥 I DARE YOU - Try 1 Min Jail</span>
          </button>

          {/* Social Proof: Under final CTA */}
          <div className="mt-8 flex flex-col items-center justify-center gap-2">
            <div className="inline-flex items-center gap-2 rounded-2xl border border-[#B6FF00]/40 bg-[#111512] px-5 py-2.5 text-sm sm:text-base font-black text-[#B6FF00] tracking-wide shadow-lg shadow-[#B6FF00]/10">
              <Flame className="h-4 w-4 fill-[#B6FF00]" />
              <span>{statsDisplay.lockIns} people tried. {statsDisplay.completions} completed. Be first to beat it.</span>
            </div>
            <p className="text-xs text-[#8B948A]">
              Live global counter · Real-time accountability
            </p>
          </div>

        </div>
      </section>
    </div>
  );
};
