import React from 'react';
import { AlertTriangle, ArrowRight, X } from 'lucide-react';

interface BreakLockModalProps {
  isOpen: boolean;
  onResume: () => void;
  onConfirmEnd: () => void;
}

export const BreakLockModal: React.FC<BreakLockModalProps> = ({
  isOpen,
  onResume,
  onConfirmEnd,
}) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="break-lock-title"
    >
      <div className="relative w-full max-w-md rounded-2xl border border-[#242B24] bg-[#111512] p-6 sm:p-8 text-center shadow-2xl">
        <button
          onClick={onResume}
          className="absolute top-4 right-4 text-[#8B948A] hover:text-[#F5F7F2] p-2 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
          aria-label="Close dialog and resume"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#1C1616] border border-[#3E2424] text-[#EF4444]">
          <AlertTriangle className="h-6 w-6 stroke-[2]" />
        </div>

        <h3 id="break-lock-title" className="text-2xl font-black tracking-tight text-[#F5F7F2] mb-2 uppercase">
          BREAKING YOUR LOCK?
        </h3>

        <p className="text-sm text-[#8B948A] leading-relaxed mb-6">
          If you end now, this session will not count toward your daily streak or total focus hours. You came here to finish.
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={onResume}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#B6FF00] py-3.5 px-4 text-xs font-black uppercase tracking-wider text-[#080A09] hover:bg-[#c6ff24] active:scale-[0.98] transition-all glow-neon-sm min-h-[48px]"
          >
            <span>Resume Session</span>
            <ArrowRight className="h-4 w-4" />
          </button>

          <button
            onClick={onConfirmEnd}
            className="w-full flex items-center justify-center rounded-xl border border-[#242B24] bg-[#080A09] py-3 px-4 text-xs font-semibold text-[#8B948A] hover:border-[#EF4444]/60 hover:text-[#EF4444] transition-colors min-h-[44px]"
          >
            End Session
          </button>
        </div>
      </div>
    </div>
  );
};
