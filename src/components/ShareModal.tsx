import React, { useState } from 'react';
import { X, Download, Copy, Share2, Check, Lock, Sparkles } from 'lucide-react';
import { downloadShareCard, generateShareText } from '../utils/shareCard';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  goal: string;
  durationMinutes: number;
  totalCompletedSessions: number;
  currentStreak: number;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  goal,
  durationMinutes,
  totalCompletedSessions,
  currentStreak,
}) => {
  const [includeGoal, setIncludeGoal] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);
  const [downloading, setDownloading] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleCopy = async () => {
    const text = generateShareText({
      goal,
      durationMinutes,
      totalCompletedSessions,
      currentStreak,
      includeGoal,
    });
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback
    }
  };

  const handleNativeShare = async () => {
    const text = generateShareText({
      goal,
      durationMinutes,
      totalCompletedSessions,
      currentStreak,
      includeGoal,
    });

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'GhostLock — Locked In',
          text,
          url: window.location.origin,
        });
      } catch {
        // User cancelled or aborted
      }
    } else {
      handleCopy();
    }
  };

  const handleDownload = async () => {
    setDownloading(true);
    try {
      await downloadShareCard({
        goal,
        durationMinutes,
        totalCompletedSessions,
        currentStreak,
        includeGoal,
      });
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="share-win-title"
    >
      <div className="relative w-full max-w-lg rounded-3xl border border-[#242B24] bg-[#080A09] p-6 sm:p-8 text-left shadow-2xl overflow-y-auto max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#8B948A] hover:text-[#F5F7F2] p-2 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
          aria-label="Close share dialog"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="h-4 w-4 text-[#B6FF00]" />
          <span className="text-xs font-bold uppercase tracking-widest text-[#B6FF00]">
            SHOW UP FOR YOURSELF
          </span>
        </div>

        <h3 id="share-win-title" className="text-2xl font-black text-[#F5F7F2] mb-1">
          Share Your Win
        </h3>
        <p className="text-xs text-[#8B948A] mb-6">
          Proof of discipline. Export your session card or copy text to share.
        </p>

        {/* Live Card Preview */}
        <div className="relative rounded-2xl border-2 border-[#242B24] bg-[#111512] p-6 mb-6 overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#B6FF00]" />

          <div className="flex items-center justify-between pb-4 border-b border-[#1C221C]">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded bg-[#161B16] border border-[#242B24] text-[#B6FF00]">
                <Lock className="h-3 w-3" />
              </div>
              <span className="text-xs font-black tracking-wider text-[#F5F7F2]">GHOSTLOCK</span>
            </div>
            <span className="text-[10px] font-bold text-[#B6FF00] font-mono-numbers">RESPECT +1</span>
          </div>

          <div className="py-4">
            <div className="font-mono-numbers text-3xl font-extrabold text-[#F5F7F2]">
              {durationMinutes} MIN LOCKED IN
            </div>
            <div className="text-xs text-[#8B948A] mt-1 italic">
              "I showed up for myself."
            </div>

            {includeGoal && goal.trim() && (
              <div className="mt-3 p-3 rounded-lg bg-[#161B16] border border-[#242B24]">
                <div className="text-[10px] uppercase font-bold text-[#8B948A]">Target Completed</div>
                <div className="text-sm font-semibold text-[#F5F7F2] truncate">{goal}</div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[#1C221C]">
            <div className="bg-[#161B16] p-2.5 rounded-lg border border-[#242B24]">
              <div className="text-[10px] text-[#8B948A]">Total Sessions</div>
              <div className="text-lg font-bold font-mono-numbers text-[#F5F7F2]">{totalCompletedSessions}</div>
            </div>
            <div className="bg-[#161B16] p-2.5 rounded-lg border border-[#242B24]">
              <div className="text-[10px] text-[#8B948A]">Current Streak</div>
              <div className="text-lg font-bold font-mono-numbers text-[#B6FF00]">{currentStreak} Days</div>
            </div>
          </div>
        </div>

        {/* Goal Visibility Checkbox */}
        <label className="flex items-center gap-3 cursor-pointer select-none mb-6 p-3 rounded-xl border border-[#242B24] bg-[#111512] hover:border-[#8B948A]/40 transition-colors">
          <input
            type="checkbox"
            checked={includeGoal}
            onChange={(e) => setIncludeGoal(e.target.checked)}
            className="h-4 w-4 rounded accent-[#B6FF00] bg-[#161B16] border-[#242B24]"
          />
          <span className="text-xs font-medium text-[#F5F7F2]">
            Include my target goal on the share card
          </span>
        </label>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-[#B6FF00] py-3.5 px-4 text-xs font-black uppercase tracking-wider text-[#080A09] hover:bg-[#c6ff24] active:scale-[0.98] transition-all glow-neon-sm min-h-[48px]"
          >
            <Download className="h-4 w-4" />
            <span>{downloading ? 'Rendering Card...' : 'Download Image'}</span>
          </button>

          {typeof navigator !== 'undefined' && 'share' in navigator ? (
            <button
              onClick={handleNativeShare}
              className="flex items-center justify-center gap-2 rounded-xl border border-[#242B24] bg-[#111512] py-3.5 px-5 text-xs font-bold uppercase tracking-wider text-[#F5F7F2] hover:border-[#B6FF00] transition-colors min-h-[48px]"
            >
              <Share2 className="h-4 w-4" />
              <span>Share</span>
            </button>
          ) : null}

          <button
            onClick={handleCopy}
            className="flex items-center justify-center gap-2 rounded-xl border border-[#242B24] bg-[#111512] py-3.5 px-5 text-xs font-bold uppercase tracking-wider text-[#F5F7F2] hover:border-[#B6FF00] transition-colors min-h-[48px]"
          >
            {copied ? <Check className="h-4 w-4 text-[#B6FF00]" /> : <Copy className="h-4 w-4" />}
            <span>{copied ? 'Copied!' : 'Copy Text'}</span>
          </button>
        </div>

        <p className="mt-4 text-[11px] text-center text-[#556054]">
          Zero tracking cookies. Nothing is uploaded or shared to external servers.
        </p>
      </div>
    </div>
  );
};
