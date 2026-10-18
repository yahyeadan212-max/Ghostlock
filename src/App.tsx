/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { AppView, UserStats, UserSettings, ActiveSessionState } from './types';
import { 
  loadStats, saveStats, recordCompletedSession, resetAllStats, 
  loadSettings, saveSettings, loadActiveSession, saveActiveSession 
} from './utils/storage';
import { Navbar, MobileTabBar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LandingPage } from './components/LandingPage';
import { FocusView } from './components/FocusView';
import { ProgressView } from './components/ProgressView';
import { SettingsView } from './components/SettingsView';
import { PrivacyView } from './components/PrivacyView';
import { AdminView } from './components/AdminView';
import { trackAnalyticsEvent, recordGoalForAdmin, markGoalCompletedInAdmin } from './utils/analytics';

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.toLowerCase();
      // Directly typing /admin opens the admin view (protected by password prompt)
      if (path === '/admin' || path.startsWith('/admin')) {
        return 'admin';
      }
    }
    // If there is an active session in progress, take the user right to the focus screen
    const existing = loadActiveSession();
    return existing ? 'focus' : 'landing';
  });

  const [stats, setStats] = useState<UserStats>(() => loadStats());
  const [settings, setSettings] = useState<UserSettings>(() => loadSettings());
  const [activeSession, setActiveSession] = useState<ActiveSessionState | null>(() => loadActiveSession());
  const [presetGoal, setPresetGoal] = useState<string>('');

  // Track page visit once per session
  useEffect(() => {
    const hasTracked = sessionStorage.getItem('ghostlock_visit_tracked_v1');
    if (!hasTracked) {
      trackAnalyticsEvent('page_visit');
      sessionStorage.setItem('ghostlock_visit_tracked_v1', 'true');
    }
  }, []);

  // Listen to popstate when user types /admin in address bar or clicks back/forward
  useEffect(() => {
    const handleUrlChange = () => {
      const path = window.location.pathname.toLowerCase();
      if (path === '/admin' || path.startsWith('/admin')) {
        setCurrentView('admin');
      } else if (currentView === 'admin') {
        setCurrentView(loadActiveSession() ? 'focus' : 'landing');
      }
    };
    window.addEventListener('popstate', handleUrlChange);
    return () => window.removeEventListener('popstate', handleUrlChange);
  }, [currentView]);

  // Sync activeSession to localStorage whenever it changes
  useEffect(() => {
    saveActiveSession(activeSession);
  }, [activeSession]);

  // Handler to start a new focus session
  const handleStartSession = (goal: string, durationMinutes: number) => {
    // Track Event 2: LOCK IN click & log goal for admin dashboard
    trackAnalyticsEvent('lock_in_click');
    recordGoalForAdmin(goal, durationMinutes);

    const totalSeconds = durationMinutes * 60;
    const now = Date.now();
    const newSession: ActiveSessionState = {
      id: `gl_active_${now}`,
      goal,
      durationMinutes,
      totalSeconds,
      startTimestamp: now,
      targetEndTimestamp: now + totalSeconds * 1000,
      isPaused: false,
      remainingSecondsWhenPaused: totalSeconds,
      startedAt: new Date(now).toISOString(),
    };
    setActiveSession(newSession);
    setCurrentView('focus');
  };

  // Handler to pause or resume an active session
  const handlePauseResumeSession = (isPaused: boolean, remainingSeconds: number) => {
    if (!activeSession) return;
    const now = Date.now();

    if (isPaused) {
      setActiveSession({
        ...activeSession,
        isPaused: true,
        remainingSecondsWhenPaused: remainingSeconds,
      });
    } else {
      setActiveSession({
        ...activeSession,
        isPaused: false,
        startTimestamp: now,
        targetEndTimestamp: now + remainingSeconds * 1000,
      });
    }
  };

  // Handler to end session early (breaking lock)
  const handleEndSessionEarly = () => {
    setActiveSession(null);
  };

  // Handler when session naturally reaches zero
  const handleSessionComplete = useCallback((goal: string, durationMinutes: number) => {
    // Track Event 3: session completed & mark goal completed for admin dashboard
    trackAnalyticsEvent('session_completed');
    markGoalCompletedInAdmin(goal);

    const updatedStats = recordCompletedSession(goal, durationMinutes);
    setStats(updatedStats);
    setActiveSession(null);
  }, []);

  // Reset all stats
  const handleResetProgress = () => {
    resetAllStats();
    setStats(loadStats());
    setActiveSession(null);
  };

  // Update user settings
  const handleUpdateSettings = (newSettings: UserSettings) => {
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  // Quick navigation from landing page CTA or preset
  const handleLaunchFromLanding = (selectedPreset?: string) => {
    if (selectedPreset) {
      setPresetGoal(selectedPreset);
    }
    setCurrentView('focus');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAdminLogout = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('ghostlock_admin_auth_v2');
      window.history.replaceState(null, '', '/');
    }
    setCurrentView(loadActiveSession() ? 'focus' : 'landing');
  };

  const handleNavigate = (view: AppView) => {
    setCurrentView(view);
    if (typeof window !== 'undefined') {
      if (view === 'admin') {
        window.history.pushState(null, '', '/admin');
      } else if (window.location.pathname.toLowerCase().startsWith('/admin')) {
        window.history.pushState(null, '', '/');
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#080A09] text-[#F5F7F2]">
      {/* Top Bar Contract (Wordmark - Links - Primary CTA) */}
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        isSessionActive={!!activeSession}
      />

      {/* Main View Router */}
      <main className="flex-1 pb-16 md:pb-0">
        {currentView === 'landing' && (
          <LandingPage
            onStartFocus={handleLaunchFromLanding}
            onNavigate={handleNavigate}
            currentStreak={stats.currentStreak}
          />
        )}

        {currentView === 'focus' && (
          <FocusView
            stats={stats}
            settings={settings}
            activeSession={activeSession}
            onStartSession={handleStartSession}
            onPauseResumeSession={handlePauseResumeSession}
            onEndSessionEarly={handleEndSessionEarly}
            onSessionComplete={handleSessionComplete}
            onNavigate={handleNavigate}
            initialPresetGoal={presetGoal}
          />
        )}

        {currentView === 'progress' && (
          <ProgressView
            stats={stats}
            onResetProgress={handleResetProgress}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'settings' && (
          <SettingsView
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
            onResetProgress={handleResetProgress}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'privacy' && (
          <PrivacyView onNavigate={handleNavigate} />
        )}

        {currentView === 'admin' && (
          <AdminView onNavigate={handleNavigate} onLogout={handleAdminLogout} />
        )}
      </main>

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Mobile-First Persistent Bottom Tab Bar */}
      <MobileTabBar
        currentView={currentView}
        onNavigate={handleNavigate}
        isSessionActive={!!activeSession}
      />
    </div>
  );
}
