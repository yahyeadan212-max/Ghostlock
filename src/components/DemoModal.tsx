import React, { useState, useEffect } from 'react';
import { X, Play, Flame, ShieldAlert, Lock, CheckCircle2 } from 'lucide-react';

interface DemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStart1MinJail: () => void;
}

export const DemoModal: React.FC<DemoModalProps> = ({
  isOpen,
  onClose,
  onStart1MinJail,
}) => {
  const [secondsLeft, setSecondsLeft] = useState<number>(7);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  useEffect(() => {
    if (!isOpen) {
      setSecondsLeft(7);
      setIsFinished(false);
      return;
    }

    setSecondsLeft(7);
    setIsFinished(false);

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsFinished(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const messages: Record<number, string> = {
    7: '🔒 LOCKING BROWSER... JAIL MODE ARMED',
    6: '⚠️ NO X BUTTON. NO ESC. FULL SCREEN JAIL.',
    5: '👀 DON\'T YOU DARE SWITCH TABS.',
    4: '⚡ FEEL THE PRESSURE? THIS IS REAL FOCUS.',
    3: '🔥 YOUR BRAIN ON ZERO DISTRACTION.',
    2: '⏳ ALMOST SURVIVED THE DEMO...',
    1: '💀 FINAL SECOND... DON\'T FOLD.',
    0: '🏆 7s DEMO SURVIVED! NOW DO IT FOR REAL.',
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-lg rounded-3xl border-2 border-[#B6FF00] bg-[#111512] p-6 sm:p-8 text-center shadow-2xl shadow-[#B6FF00]/15 overflow-hidden">
        
        {/* Animated Jail Bars effect at top and bottom */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#B6FF00] via-[#F5F7F2] to-[#B6FF00] animate-pulse" />
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#8B948A] hover:text-[#F5F7F2] hover:bg-[#161B16] rounded-xl transition-colors cursor-pointer"
          aria-label="Close demo"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-[#242B24] bg-[#080A09] px-3.5 py-1 text-xs font-black tracking-widest text-[#B6FF00] uppercase mb-4">
          <ShieldAlert className="h-3.5 w-3.5" />
          <span>7-SECOND JAIL SIMULATION</span>
        </div>

        {/* Timer Numeral */}
        <div className="my-4">
          <div className="relative mx-auto flex h-36 w-36 items-center justify-center rounded-3xl bg-[#080A09] border border-[#242B24] glow-neon">
            <span className="font-mono-numbers text-6xl font-black text-[#B6FF00]">
              0:0{secondsLeft}
            </span>
          </div>
        </div>

        {/* Dynamic Gen Z intensity message */}
        <div className="min-h-[48px] flex items-center justify-center px-2 mb-6">
          <p className="text-sm sm:text-base font-extrabold text-[#F5F7F2] tracking-tight">
            {messages[secondsLeft] || messages[0]}
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={() => {
              onClose();
              onStart1MinJail();
            }}
            className="w-full flex items-center justify-center gap-2.5 rounded-2xl bg-[#B6FF00] py-4 px-6 text-sm sm:text-base font-black uppercase tracking-wider text-[#080A09] hover:bg-[#c6ff24] active:scale-[0.98] transition-all glow-neon cursor-pointer min-h-[52px]"
          >
            <Flame className="h-5 w-5 fill-[#080A09]" />
            <span>🔥 I DARE YOU - Try 1 Min Jail</span>
          </button>

          <button
            onClick={onClose}
            className="w-full text-xs font-semibold text-[#8B948A] hover:text-[#F5F7F2] py-2 transition-colors cursor-pointer"
          >
            Exit preview
          </button>
        </div>

        {/* Micro note */}
        <div className="mt-4 pt-4 border-t border-[#1C221C] text-[11px] text-[#556054]">
          Real sessions run full screen · Tab switches trigger distraction alert
        </div>
      </div>
    </div>
  );
};
