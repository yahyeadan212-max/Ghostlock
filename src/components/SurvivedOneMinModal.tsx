import React, { useState } from 'react';
import { Flame, ArrowRight, Lock, CheckCircle2, X, Sparkles } from 'lucide-react';

interface SurvivedOneMinModalProps {
  isOpen: boolean;
  onLock25Mins: () => void;
  onDismiss: () => void;
  goal: string;
}

export const SurvivedOneMinModal: React.FC<SurvivedOneMinModalProps> = ({
  isOpen,
  onLock25Mins,
  onDismiss,
  goal,
}) => {
  const [email, setEmail] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('ghostlock_user_email') || '';
    }
    return '';
  });
  const [emailSaved, setEmailSaved] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem('ghostlock_user_email');
    }
    return false;
  });
  const [emailError, setEmailError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSaveEmail = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || !trimmed.includes('@') || !trimmed.includes('.')) {
      setEmailError('Please enter a valid email address.');
      return;
    }
    setEmailError(null);
    try {
      localStorage.setItem('ghostlock_user_email', trimmed);
    } catch {}
    setEmailSaved(true);
  };

  const handleStart25 = () => {
    if (email.trim() && !emailSaved) {
      handleSaveEmail();
    }
    onLock25Mins();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-lg rounded-3xl border-2 border-[#B6FF00] bg-[#111512] p-6 sm:p-8 text-center shadow-2xl shadow-[#B6FF00]/20 overflow-hidden">
        
        {/* Neon top accent glow */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#B6FF00] animate-pulse" />

        {/* Close Button */}
        <button
          onClick={onDismiss}
          className="absolute top-4 right-4 p-2 text-[#8B948A] hover:text-[#F5F7F2] hover:bg-[#161B16] rounded-xl transition-colors cursor-pointer"
          aria-label="Dismiss popup"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Eyebrow Pill */}
        <div className="inline-flex items-center gap-2 rounded-full border border-[#242B24] bg-[#080A09] px-4 py-1.5 text-xs font-black tracking-widest text-[#B6FF00] uppercase mb-4">
          <Sparkles className="h-3.5 w-3.5" />
          <span>RESPECT +1 // 1 MIN SURVIVED</span>
        </div>

        {/* Exact Headline: "You survived 1 min 😳 Dare 25 mins?" */}
        <h2 className="text-3xl sm:text-4xl font-black text-[#F5F7F2] tracking-tight leading-tight mb-3">
          You survived 1 min 😳<br />
          <span className="text-[#B6FF00]">Dare 25 mins?</span>
        </h2>

        <p className="text-sm text-[#8B948A] max-w-md mx-auto mb-6">
          You conquered the 60-second jail. Most people quit in 10 seconds. Ready to lock in for the real deep work?
        </p>

        {/* Completed Goal Preview */}
        {goal && (
          <div className="mb-6 rounded-2xl border border-[#242B24] bg-[#080A09] px-4 py-3 text-xs text-[#8B948A] flex items-center justify-between">
            <span className="uppercase tracking-wider font-semibold">Goal:</span>
            <span className="font-bold text-[#F5F7F2] truncate max-w-[280px]">{goal}</span>
          </div>
        )}

        {/* Primary Action Button: [LOCK 25 MINS] */}
        <button
          onClick={handleStart25}
          className="w-full group flex items-center justify-center gap-3 rounded-2xl bg-[#B6FF00] py-4 px-8 text-base font-black uppercase tracking-wider text-[#080A09] hover:bg-[#c6ff24] active:scale-[0.98] transition-all glow-neon cursor-pointer min-h-[56px] mb-4"
        >
          <Lock className="h-5 w-5 fill-[#080A09]" />
          <span>LOCK 25 MINS</span>
          <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
        </button>

        {/* Email Capture: "+ input email to save streak" */}
        <div className="rounded-2xl border border-[#242B24] bg-[#161B16] p-4 text-left mb-4">
          <label htmlFor="streak-email" className="block text-xs font-bold uppercase tracking-wider text-[#F5F7F2] mb-1.5 flex items-center gap-1.5">
            <Flame className="h-3.5 w-3.5 text-[#B6FF00]" />
            <span>Save streak & never lose progress:</span>
          </label>

          {emailSaved ? (
            <div className="flex items-center gap-2 text-xs font-bold text-[#B6FF00] py-2">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>Streak locked to {email}! Next milestone: 25 mins.</span>
            </div>
          ) : (
            <form onSubmit={handleSaveEmail} className="flex gap-2 mt-2">
              <input
                id="streak-email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (emailError) setEmailError(null);
                }}
                placeholder="Enter email to save streak..."
                className="flex-1 rounded-xl border border-[#242B24] bg-[#080A09] px-3.5 py-2.5 text-xs font-medium text-[#F5F7F2] placeholder-[#556054] outline-none focus:border-[#B6FF00] transition-all"
              />
              <button
                type="submit"
                className="shrink-0 rounded-xl bg-[#242B24] hover:bg-[#B6FF00] hover:text-[#080A09] px-4 py-2.5 text-xs font-bold text-[#F5F7F2] transition-all cursor-pointer"
              >
                Save
              </button>
            </form>
          )}

          {emailError && (
            <p className="mt-1.5 text-[11px] font-semibold text-[#EF4444]">
              {emailError}
            </p>
          )}
        </div>

        {/* Secondary Dismiss */}
        <button
          onClick={onDismiss}
          className="text-xs font-semibold text-[#8B948A] hover:text-[#F5F7F2] underline underline-offset-4 transition-colors cursor-pointer py-1"
        >
          Check my stats & win card
        </button>
      </div>
    </div>
  );
};
