import React from 'react';
import { Lock, ArrowRight, Play, CheckCircle2, Shield, Eye, Flame, Award, Clock } from 'lucide-react';
import { AppView } from '../types';

interface LandingPageProps {
  onStartFocus: (presetGoal?: string) => void;
  onNavigate: (view: AppView) => void;
  currentStreak: number;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartFocus,
  onNavigate,
  currentStreak,
}) => {
  return (
    <div className="flex flex-col">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28">
        {/* Subtle background glow effect (restrained) */}
        <div 
          aria-hidden="true" 
          className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[580px] h-[340px] bg-[#B6FF00]/5 blur-[120px] rounded-full"
        />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Copy & CTAs */}
            <div className="lg:col-span-7 flex flex-col items-start text-left">
              {/* Eyebrow */}
              <div className="inline-flex items-center gap-2 mb-4">
                <span className="text-xs font-bold uppercase tracking-widest text-[#B6FF00]">
                  YOUR ATTENTION IS YOUR LIFE.
                </span>
              </div>

              {/* Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#F5F7F2] leading-[1.08] max-w-2xl mb-6">
                Your phone is stealing your life. <span className="text-[#B6FF00]">Lock in.</span>
              </h1>

              {/* Supporting Text */}
              <p className="text-lg sm:text-xl font-medium text-[#F5F7F2] mb-3">
                25 minutes. One goal. Zero excuses.
              </p>
              
              <p className="text-base text-[#8B948A] leading-relaxed max-w-xl mb-8">
                GhostLock helps you build focus, one session at a time. No subscriptions. No paywalls. Just you versus distraction.
              </p>

              {/* Primary CTA button */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto mb-4">
                <button
                  onClick={() => onStartFocus()}
                  className="group flex items-center justify-center gap-3 rounded-xl bg-[#B6FF00] px-8 py-4 text-sm font-black uppercase tracking-wider text-[#080A09] transition-all hover:bg-[#c6ff24] active:scale-[0.98] glow-neon min-h-[52px]"
                >
                  <span>START FREE — NO SIGNUP</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>

                <button
                  onClick={() => {
                    const el = document.getElementById('how-it-works');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="flex items-center justify-center gap-2 rounded-xl border border-[#242B24] bg-[#111512] px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#F5F7F2] transition-colors hover:border-[#8B948A] hover:bg-[#161B16] min-h-[52px]"
                >
                  <span>HOW IT WORKS</span>
                </button>
              </div>

              {/* Secondary reassurance text */}
              <p className="text-xs font-medium text-[#8B948A] flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#B6FF00]" />
                100% free. No credit card. No account required.
              </p>

              {currentStreak > 0 && (
                <div className="mt-6 flex items-center gap-2.5 rounded-lg border border-[#242B24] bg-[#111512] px-3.5 py-2 text-xs">
                  <Flame className="h-4 w-4 text-[#B6FF00]" />
                  <span className="text-[#8B948A]">Your active streak:</span>
                  <span className="font-bold text-[#F5F7F2] font-mono-numbers">{currentStreak} {currentStreak === 1 ? 'day' : 'days'}</span>
                </div>
              )}
            </div>

            {/* Right Column: Prominent Visual Preview of the Actual Focus Timer */}
            <div className="lg:col-span-5 w-full flex justify-center">
              <div 
                onClick={() => onStartFocus()}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter') onStartFocus(); }}
                className="group relative w-full max-w-sm rounded-3xl border border-[#242B24] bg-[#111512] p-6 sm:p-8 transition-all hover:border-[#B6FF00]/50 hover:shadow-2xl hover:shadow-[#B6FF00]/10 cursor-pointer text-center"
              >
                {/* Active Indicator Top Strip */}
                <div className="flex items-center justify-between pb-6 border-b border-[#1C221C]">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[#B6FF00]" />
                    <span className="text-xs font-bold tracking-wider uppercase text-[#B6FF00]">
                      LOCK IN SESSION
                    </span>
                  </div>
                  <span className="text-xs text-[#8B948A] font-mono-numbers">
                    25:00 TARGET
                  </span>
                </div>

                {/* Target Goal preview */}
                <div className="my-6">
                  <div className="text-xs uppercase tracking-widest text-[#8B948A] mb-1">
                    Current Objective
                  </div>
                  <div className="text-lg font-bold text-[#F5F7F2] line-clamp-1">
                    Complete assignment thesis
                  </div>
                </div>

                {/* Circular Timer Visual Mockup */}
                <div className="relative mx-auto my-4 flex items-center justify-center w-52 h-52">
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
                    <span className="font-mono-numbers text-4xl sm:text-5xl font-extrabold tracking-tight text-[#F5F7F2]">
                      19:42
                    </span>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-[#8B948A] mt-1">
                      78% Remaining
                    </span>
                  </div>
                </div>

                {/* Controls preview */}
                <div className="pt-4 flex items-center justify-center gap-3">
                  <div className="flex items-center justify-center gap-2 rounded-xl bg-[#B6FF00] px-5 py-2.5 text-xs font-black uppercase text-[#080A09] group-hover:scale-105 transition-transform">
                    <Play className="h-3.5 w-3.5 fill-[#080A09]" />
                    <span>Click to Launch</span>
                  </div>
                </div>

                <div className="mt-4 text-[11px] text-[#556054]">
                  Interactive browser session · Resumes on refresh
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* HONEST SOCIAL PROOF & PRINCIPLES (No fake counts or testimonials) */}
      <section className="border-y border-[#242B24] bg-[#111512] py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            
            <div className="flex flex-col items-center justify-center p-3">
              <span className="text-lg sm:text-xl font-extrabold text-[#F5F7F2] tracking-tight">
                No Subscriptions
              </span>
              <span className="text-xs text-[#8B948A] mt-1">
                Zero fees today or ever
              </span>
            </div>

            <div className="flex flex-col items-center justify-center p-3">
              <span className="text-lg sm:text-xl font-extrabold text-[#F5F7F2] tracking-tight">
                No Account Required
              </span>
              <span className="text-xs text-[#8B948A] mt-1">
                Zero emails or passwords
              </span>
            </div>

            <div className="flex flex-col items-center justify-center p-3">
              <span className="text-lg sm:text-xl font-extrabold text-[#F5F7F2] tracking-tight">
                Your Focus, Your Rules
              </span>
              <span className="text-xs text-[#8B948A] mt-1">
                All data stored on your device
              </span>
            </div>

            <div className="flex flex-col items-center justify-center p-3">
              <span className="text-lg sm:text-xl font-extrabold text-[#F5F7F2] tracking-tight">
                Start in Seconds
              </span>
              <span className="text-xs text-[#8B948A] mt-1">
                Pick a goal and press start
              </span>
            </div>

          </div>
        </div>
      </section>

      {/* HOW IT WORKS (3 Simple Steps) */}
      <section id="how-it-works" className="py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-2xl text-left mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-[#B6FF00]">
              THE PROTOCOL
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#F5F7F2] tracking-tight mt-2">
              How GhostLock Works
            </h2>
            <p className="text-base text-[#8B948A] mt-3">
              Discipline doesn't need to be complicated. Three steps to protect your mind.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Step 01 */}
            <div className="rounded-2xl border border-[#242B24] bg-[#111512] p-8 flex flex-col justify-between transition-all hover:border-[#8B948A]/40">
              <div>
                <span className="font-mono-numbers text-3xl font-extrabold text-[#B6FF00]">
                  01
                </span>
                <h3 className="text-xl font-bold text-[#F5F7F2] mt-4 mb-2">
                  Choose your target
                </h3>
                <p className="text-sm text-[#8B948A] leading-relaxed">
                  Write down the one thing you need to finish. No multi-tasking, no sprawling to-do lists. One objective.
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-[#1C221C] text-xs text-[#556054]">
                Target validation prevents empty sessions
              </div>
            </div>

            {/* Step 02 */}
            <div className="rounded-2xl border border-[#242B24] bg-[#111512] p-8 flex flex-col justify-between transition-all hover:border-[#8B948A]/40">
              <div>
                <span className="font-mono-numbers text-3xl font-extrabold text-[#B6FF00]">
                  02
                </span>
                <h3 className="text-xl font-bold text-[#F5F7F2] mt-4 mb-2">
                  Lock in
                </h3>
                <p className="text-sm text-[#8B948A] leading-relaxed">
                  Start your focus session and stop switching tasks. If you wander away from your tab, GhostLock holds you accountable.
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-[#1C221C] text-xs text-[#556054]">
                Accurate timestamp persistence across refreshes
              </div>
            </div>

            {/* Step 03 */}
            <div className="rounded-2xl border border-[#242B24] bg-[#111512] p-8 flex flex-col justify-between transition-all hover:border-[#8B948A]/40">
              <div>
                <span className="font-mono-numbers text-3xl font-extrabold text-[#B6FF00]">
                  03
                </span>
                <h3 className="text-xl font-bold text-[#F5F7F2] mt-4 mb-2">
                  Earn your respect
                </h3>
                <p className="text-sm text-[#8B948A] leading-relaxed">
                  Complete the session, build your streak, and return tomorrow. Respect is earned through consistency, not talk.
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-[#1C221C] text-xs text-[#556054]">
                RESPECT +1 awarded only upon full completion
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
              <span className="text-xs font-bold uppercase tracking-widest text-[#B6FF00]">
                BUILT FOR GEN Z
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#F5F7F2] tracking-tight mt-2 mb-6">
                Why GhostLock?
              </h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#161B16] border border-[#242B24] text-[#B6FF00]">
                    <Clock className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-[#F5F7F2]">Anti-dopamine trap</h4>
                    <p className="text-sm text-[#8B948A] mt-1 leading-relaxed">
                      Social feeds and short-form algorithms are engineered to fraction your attention. GhostLock strips away every bell and whistle to give you back clarity.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#161B16] border border-[#242B24] text-[#B6FF00]">
                    <Award className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-[#F5F7F2]">Real streaks, zero gimmicks</h4>
                    <p className="text-sm text-[#8B948A] mt-1 leading-relaxed">
                      No streak freezes you buy with gems. No artificial inflation. You either show up today or you break the streak. Real discipline.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#161B16] border border-[#242B24] text-[#B6FF00]">
                    <Shield className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-[#F5F7F2]">100% Free & Private</h4>
                    <p className="text-sm text-[#8B948A] mt-1 leading-relaxed">
                      No corporate monetization. No locked features after 3 days. Your history stays in your browser's local storage.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Lock-In Preset Cards */}
            <div className="rounded-3xl border border-[#242B24] bg-[#080A09] p-6 sm:p-8">
              <h3 className="text-lg font-bold text-[#F5F7F2] mb-2">
                Popular Target Presets
              </h3>
              <p className="text-xs text-[#8B948A] mb-6">
                Tap any common objective to jump right into a 25-minute lock:
              </p>

              <div className="space-y-3">
                {[
                  'Finish coursework essay draft',
                  'Clear critical inbox & replies',
                  'Deep code refactor session',
                  'Study lecture notes for exam',
                  'Edit next YouTube / TikTok video',
                ].map((target) => (
                  <button
                    key={target}
                    onClick={() => onStartFocus(target)}
                    className="w-full flex items-center justify-between p-3.5 rounded-xl border border-[#242B24] bg-[#111512] hover:border-[#B6FF00] hover:bg-[#161B16] transition-all text-left group min-h-[44px]"
                  >
                    <span className="text-sm font-medium text-[#F5F7F2] group-hover:text-[#B6FF00] transition-colors">
                      {target}
                    </span>
                    <ArrowRight className="h-4 w-4 text-[#8B948A] group-hover:text-[#B6FF00] transition-colors shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CLOSING CTA */}
      <section className="py-20 md:py-28 text-center relative overflow-hidden">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#F5F7F2] mb-4">
            Stop negotiating with your distractions.
          </h2>
          <p className="text-base sm:text-lg text-[#8B948A] mb-8">
            One session is all it takes to start.
          </p>

          <button
            onClick={() => onStartFocus()}
            className="inline-flex items-center justify-center gap-3 rounded-xl bg-[#B6FF00] px-10 py-5 text-sm font-black uppercase tracking-wider text-[#080A09] transition-all hover:bg-[#c6ff24] active:scale-[0.98] glow-neon min-h-[52px]"
          >
            <span>LOCK IN NOW</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>
    </div>
  );
};
