import React, { useState } from 'react';
import { Volume2, VolumeX, Bell, BellOff, Clock, ShieldAlert, Check, RotateCcw } from 'lucide-react';
import { UserSettings, AppView } from '../types';

interface SettingsViewProps {
  settings: UserSettings;
  onUpdateSettings: (newSettings: UserSettings) => void;
  onResetProgress: () => void;
  onNavigate: (view: AppView) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onUpdateSettings,
  onResetProgress,
  onNavigate,
}) => {
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);
  const [saveBanner, setSaveBanner] = useState<boolean>(false);

  const handleDurationChange = (duration: number) => {
    const updated = { ...settings, defaultDurationMinutes: duration };
    onUpdateSettings(updated);
    triggerSaveFeedback();
  };

  const handleToggleSound = () => {
    const updated = { ...settings, soundEnabled: !settings.soundEnabled };
    onUpdateSettings(updated);
    triggerSaveFeedback();
  };

  const handleTogglePrompts = () => {
    const updated = { ...settings, motivationalPromptsEnabled: !settings.motivationalPromptsEnabled };
    onUpdateSettings(updated);
    triggerSaveFeedback();
  };

  const triggerSaveFeedback = () => {
    setSaveBanner(true);
    setTimeout(() => setSaveBanner(false), 2000);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:py-14 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="mb-8">
        <span className="text-xs font-bold uppercase tracking-widest text-[#B6FF00]">
          PREFERENCES
        </span>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-[#F5F7F2] mt-1">
          App Settings
        </h1>
        <p className="text-sm text-[#8B948A] mt-2">
          Configure how GhostLock runs in your browser. All preferences are preserved locally.
        </p>
      </div>

      {saveBanner && (
        <div className="mb-6 flex items-center gap-2 rounded-xl border border-[#B6FF00]/40 bg-[#161B16] px-4 py-2.5 text-xs font-semibold text-[#B6FF00]">
          <Check className="h-4 w-4" />
          <span>Settings saved locally.</span>
        </div>
      )}

      <div className="space-y-6">
        
        {/* Default Duration Setting */}
        <div className="rounded-2xl border border-[#242B24] bg-[#111512] p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#161B16] text-[#B6FF00]">
              <Clock className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#F5F7F2]">Default Focus Duration</h2>
              <p className="text-xs text-[#8B948A]">
                The standard duration pre-selected when you open GhostLock.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mt-5">
            {[15, 25, 50].map((mins) => (
              <button
                key={mins}
                type="button"
                onClick={() => handleDurationChange(mins)}
                className={`py-3 px-4 rounded-xl border text-center font-mono-numbers text-sm font-bold transition-all min-h-[44px] ${
                  settings.defaultDurationMinutes === mins
                    ? 'border-[#B6FF00] bg-[#161B16] text-[#B6FF00] glow-neon-sm'
                    : 'border-[#242B24] bg-[#080A09] text-[#8B948A] hover:border-[#8B948A]'
                }`}
              >
                {mins} Minutes
              </button>
            ))}
          </div>
        </div>

        {/* Audio Alerts Setting */}
        <div className="rounded-2xl border border-[#242B24] bg-[#111512] p-6 flex items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#161B16] text-[#B6FF00]">
              {settings.soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4 text-[#8B948A]" />}
            </div>
            <div>
              <h2 className="text-base font-bold text-[#F5F7F2]">Audio Feedback</h2>
              <p className="text-xs text-[#8B948A] mt-0.5">
                Crisp synthesized tones on session lock-in and completion.
              </p>
            </div>
          </div>

          <button
            onClick={handleToggleSound}
            role="switch"
            aria-checked={settings.soundEnabled}
            className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none min-h-[44px] min-w-[44px] items-center ${
              settings.soundEnabled ? 'bg-[#B6FF00]' : 'bg-[#242B24]'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-[#080A09] shadow-lg ring-0 transition duration-200 ease-in-out ${
                settings.soundEnabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* Motivational / Tab Distraction Alerts Setting */}
        <div className="rounded-2xl border border-[#242B24] bg-[#111512] p-6 flex items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#161B16] text-[#B6FF00]">
              {settings.motivationalPromptsEnabled ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4 text-[#8B948A]" />}
            </div>
            <div>
              <h2 className="text-base font-bold text-[#F5F7F2]">Tab Distraction Prompts</h2>
              <p className="text-xs text-[#8B948A] mt-0.5">
                Show non-blocking "Distraction detected. Back to work." reminders when returning from other tabs.
              </p>
            </div>
          </div>

          <button
            onClick={handleTogglePrompts}
            role="switch"
            aria-checked={settings.motivationalPromptsEnabled}
            className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none min-h-[44px] min-w-[44px] items-center ${
              settings.motivationalPromptsEnabled ? 'bg-[#B6FF00]' : 'bg-[#242B24]'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-[#080A09] shadow-lg ring-0 transition duration-200 ease-in-out ${
                settings.motivationalPromptsEnabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* Reset Progress Section */}
        <div className="rounded-2xl border border-[#3E2424]/60 bg-[#161111] p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-[#F5F7F2] flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-[#EF4444]" />
              Reset All Progress
            </h2>
            <p className="text-xs text-[#8B948A] mt-1">
              Clears your focus streak and completed session counter.
            </p>
          </div>

          <button
            onClick={() => setShowResetConfirm(true)}
            className="flex items-center gap-2 rounded-xl border border-[#EF4444]/40 bg-[#080A09] px-4 py-2.5 text-xs font-bold text-[#EF4444] hover:bg-[#EF4444] hover:text-white transition-colors min-h-[44px]"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset Data</span>
          </button>
        </div>

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
              This will permanently delete your streak, session logs, and focus minutes from this browser. This action cannot be reversed.
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
