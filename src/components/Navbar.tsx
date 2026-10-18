import React from 'react';
import { Lock, Zap, BarChart3, Settings, ShieldCheck } from 'lucide-react';
import { AppView } from '../types';

interface NavbarProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  isSessionActive: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  isSessionActive,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#242B24] bg-[#080A09]/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-8 px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Brand Wordmark (Single text element with minimal lock icon) */}
        <button
          onClick={() => onNavigate('landing')}
          className="group flex items-center gap-2.5 text-left text-lg font-extrabold tracking-tight text-[#F5F7F2] transition-colors hover:text-[#B6FF00] whitespace-nowrap shrink-0"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#111512] border border-[#242B24] text-[#B6FF00] transition-transform group-hover:scale-105">
            <Lock className="h-4 w-4 stroke-[2.5]" />
          </div>
          <span className="tracking-wider">GHOSTLOCK</span>
        </button>

        {/* Zone 2: Navigation Links (single-line, clean typography) */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#8B948A]">
          <button
            onClick={() => onNavigate('focus')}
            className={`whitespace-nowrap transition-colors hover:text-[#F5F7F2] ${
              currentView === 'focus' ? 'text-[#B6FF00] font-semibold' : ''
            }`}
          >
            Focus
          </button>
          <button
            onClick={() => onNavigate('progress')}
            className={`whitespace-nowrap transition-colors hover:text-[#F5F7F2] ${
              currentView === 'progress' ? 'text-[#B6FF00] font-semibold' : ''
            }`}
          >
            Progress
          </button>
          <button
            onClick={() => onNavigate('landing')}
            className={`whitespace-nowrap transition-colors hover:text-[#F5F7F2] ${
              currentView === 'landing' ? 'text-[#F5F7F2]' : ''
            }`}
          >
            How It Works
          </button>
          <button
            onClick={() => onNavigate('settings')}
            className={`whitespace-nowrap transition-colors hover:text-[#F5F7F2] ${
              currentView === 'settings' ? 'text-[#B6FF00] font-semibold' : ''
            }`}
          >
            Settings
          </button>
          <button
            onClick={() => onNavigate('privacy')}
            className={`whitespace-nowrap transition-colors hover:text-[#F5F7F2] ${
              currentView === 'privacy' ? 'text-[#B6FF00] font-semibold' : ''
            }`}
          >
            Privacy
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onNavigate('focus')}
            className="flex items-center gap-2 rounded-lg bg-[#B6FF00] px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#080A09] transition-all hover:bg-[#c6ff24] active:scale-[0.98] glow-neon-sm whitespace-nowrap shrink-0 min-h-[44px]"
          >
            <Zap className="h-3.5 w-3.5 fill-[#080A09]" />
            <span>{isSessionActive ? 'Active Lock' : 'Lock In'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export const MobileTabBar: React.FC<{
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  isSessionActive: boolean;
}> = ({ currentView, onNavigate, isSessionActive }) => {
  return (
    <nav
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-[#242B24] bg-[#080A09]/95 backdrop-blur-lg pb-safe"
    >
      <div className="grid grid-cols-4 items-center h-16 max-w-lg mx-auto px-2">
        <button
          onClick={() => onNavigate('focus')}
          className={`flex flex-col items-center justify-center min-h-[44px] py-1 transition-colors ${
            currentView === 'focus' ? 'text-[#B6FF00]' : 'text-[#8B948A] hover:text-[#F5F7F2]'
          }`}
        >
          <div className="relative">
            <Lock className="h-5 w-5" />
            {isSessionActive && (
              <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-[#B6FF00] animate-ping" />
            )}
          </div>
          <span className="text-[10px] font-semibold tracking-tight mt-1">Focus</span>
        </button>

        <button
          onClick={() => onNavigate('progress')}
          className={`flex flex-col items-center justify-center min-h-[44px] py-1 transition-colors ${
            currentView === 'progress' ? 'text-[#B6FF00]' : 'text-[#8B948A] hover:text-[#F5F7F2]'
          }`}
        >
          <BarChart3 className="h-5 w-5" />
          <span className="text-[10px] font-semibold tracking-tight mt-1">Progress</span>
        </button>

        <button
          onClick={() => onNavigate('settings')}
          className={`flex flex-col items-center justify-center min-h-[44px] py-1 transition-colors ${
            currentView === 'settings' ? 'text-[#B6FF00]' : 'text-[#8B948A] hover:text-[#F5F7F2]'
          }`}
        >
          <Settings className="h-5 w-5" />
          <span className="text-[10px] font-semibold tracking-tight mt-1">Settings</span>
        </button>

        <button
          onClick={() => onNavigate('privacy')}
          className={`flex flex-col items-center justify-center min-h-[44px] py-1 transition-colors ${
            currentView === 'privacy' ? 'text-[#B6FF00]' : 'text-[#8B948A] hover:text-[#F5F7F2]'
          }`}
        >
          <ShieldCheck className="h-5 w-5" />
          <span className="text-[10px] font-semibold tracking-tight mt-1">Privacy</span>
        </button>
      </div>
    </nav>
  );
};
