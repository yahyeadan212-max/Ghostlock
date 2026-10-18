import React from 'react';
import { ShieldCheck, HardDrive, AlertTriangle, EyeOff, Lock, ArrowRight } from 'lucide-react';
import { AppView } from '../types';

interface PrivacyViewProps {
  onNavigate: (view: AppView) => void;
}

export const PrivacyView: React.FC<PrivacyViewProps> = ({ onNavigate }) => {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:py-14 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="mb-8">
        <span className="text-xs font-bold uppercase tracking-widest text-[#B6FF00]">
          LOCAL FIRST & TRANSPARENT
        </span>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-[#F5F7F2] mt-1">
          Privacy & Data Policy
        </h1>
        <p className="text-sm text-[#8B948A] mt-2">
          Your attention is your life. Your data belongs only to you.
        </p>
      </div>

      <div className="space-y-6 text-sm text-[#8B948A] leading-relaxed">
        
        {/* Core Architecture */}
        <div className="rounded-2xl border border-[#242B24] bg-[#111512] p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#161B16] text-[#B6FF00]">
              <HardDrive className="h-4 w-4" />
            </div>
            <h2 className="text-base font-bold text-[#F5F7F2]">100% Local Device Storage</h2>
          </div>
          <p>
            GhostLock operates without cloud databases, user registration, or remote tracking servers. 
            All your data — including your active timer timestamps, streak counters, completed session history, 
            and personal preferences — is stored directly in your browser's <code className="text-[#B6FF00] font-mono">localStorage</code>.
          </p>
        </div>

        {/* Clear Limitations & Browser Clearing Warning */}
        <div className="rounded-2xl border border-[#3E2424]/60 bg-[#161111] p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1C1616] text-[#EF4444]">
              <AlertTriangle className="h-4 w-4" />
            </div>
            <h2 className="text-base font-bold text-[#F5F7F2]">Important Storage Limitations</h2>
          </div>
          <ul className="space-y-2 list-disc list-inside">
            <li>
              <strong>Clearing browser cache or website data</strong> will permanently erase your streak and session history.
            </li>
            <li>
              <strong>Switching devices or browsers</strong> (e.g., from your phone's Safari to your laptop's Chrome) will not sync your streak, as data is locked strictly to that specific browser instance.
            </li>
            <li>
              <strong>No military-grade claims:</strong> Browser local storage is standard web storage and is not cryptographically encrypted. Avoid writing highly confidential secrets or sensitive personal identification into your focus goals.
            </li>
          </ul>
        </div>

        {/* Zero Personal Data Collection */}
        <div className="rounded-2xl border border-[#242B24] bg-[#111512] p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#161B16] text-[#B6FF00]">
              <EyeOff className="h-4 w-4" />
            </div>
            <h2 className="text-base font-bold text-[#F5F7F2]">Zero Tracking & Zero Monetization</h2>
          </div>
          <p className="mb-3">
            We do not collect names, email addresses, payment information, or IP addresses. We do not sell ad space, 
            we do not run third-party tracking pixels, and we do not monitor what you do on other tabs or websites.
          </p>
          <p>
            Our tab distraction feature relies exclusively on the standard browser <code className="text-[#F5F7F2] font-mono">visibilitychange</code> event 
            to detect when the GhostLock tab is hidden or shown. It cannot and does not monitor any external applications or phone activities.
          </p>
        </div>

        {/* Quick Action */}
        <div className="pt-4 flex items-center justify-between">
          <button
            onClick={() => onNavigate('focus')}
            className="flex items-center gap-2 rounded-xl bg-[#B6FF00] px-6 py-3 text-xs font-black uppercase tracking-wider text-[#080A09] hover:bg-[#c6ff24] transition-all glow-neon-sm min-h-[44px]"
          >
            <span>Return to Focus</span>
            <ArrowRight className="h-4 w-4" />
          </button>

          <span className="text-xs text-[#556054]">
            GhostLock Architecture v1.0
          </span>
        </div>

      </div>

    </div>
  );
};
