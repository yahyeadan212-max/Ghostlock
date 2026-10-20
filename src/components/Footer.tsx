import React from 'react';
import { Lock, Shield } from 'lucide-react';
import { AppView } from '../types';

interface FooterProps {
  onNavigate: (view: AppView) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="border-t border-[#242B24] bg-[#080A09] pt-12 pb-24 md:pb-12 text-[#8B948A]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-[#1C221C]">
          <div className="flex items-center gap-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#111512] border border-[#242B24] text-[#B6FF00]">
              <Lock className="h-3.5 w-3.5" />
            </div>
            <span className="text-sm font-bold tracking-wider text-[#F5F7F2]">GHOSTLOCK</span>
            <span className="text-xs text-[#556054]">·</span>
            <span className="text-xs text-[#8B948A]">Free forever</span>
            <span className="text-xs text-[#556054]">·</span>
            <span className="text-xs text-[#8B948A]">Built for focus</span>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs">
            <button
              onClick={() => onNavigate('landing')}
              className="hover:text-[#F5F7F2] transition-colors"
            >
              How It Works
            </button>
            <button
              onClick={() => onNavigate('focus')}
              className="hover:text-[#F5F7F2] transition-colors"
            >
              Start Focusing
            </button>
            <button
              onClick={() => onNavigate('progress')}
              className="hover:text-[#F5F7F2] transition-colors"
            >
              Streaks & Progress
            </button>
            <button
              onClick={() => onNavigate('privacy')}
              className="hover:text-[#F5F7F2] transition-colors"
            >
              Privacy & Local Storage
            </button>
          </div>
        </div>

        <div className="pt-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs text-[#556054]">
          <p className="max-w-3xl leading-relaxed">
            <span className="font-semibold text-[#8B948A] inline-flex items-center gap-1.5 mr-1">
              <Shield className="h-3 w-3 text-[#B6FF00]" /> Disclaimer:
            </span>
            GhostLock helps users practice uninterrupted single-task focus and intentional work habits through structure and accountability. 
            It operates entirely in your browser and cannot physically block system-level applications or external websites.
          </p>
          <p className="shrink-0 text-xs text-[#556054]">
            © {new Date().getFullYear()} GhostLock. 100% private.
          </p>
        </div>
      </div>
    </footer>
  );
};
