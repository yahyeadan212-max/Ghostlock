export interface FocusSession {
  id: string;
  goal: string;
  durationMinutes: number;
  completedAt: string; // ISO string
  date: string; // YYYY-MM-DD in local time
}

export interface UserStats {
  currentStreak: number;
  longestStreak: number;
  totalCompletedSessions: number;
  totalFocusedMinutes: number;
  lastActiveDate: string | null; // YYYY-MM-DD
  history: FocusSession[];
}

export interface UserSettings {
  defaultDurationMinutes: number; // 15, 25, or 50
  soundEnabled: boolean;
  motivationalPromptsEnabled: boolean;
  ambientSound: 'none' | 'whitenoise' | 'rain' | 'binaural';
}

export interface ActiveSessionState {
  id: string;
  goal: string;
  durationMinutes: number;
  totalSeconds: number;
  startTimestamp: number; // Date.now() when started/resumed
  targetEndTimestamp: number; // Date.now() + remainingMs
  isPaused: boolean;
  remainingSecondsWhenPaused: number;
  startedAt: string; // ISO string
}

export type AppView = 'landing' | 'focus' | 'progress' | 'settings' | 'privacy' | 'admin';

export interface AnalyticsStats {
  totalVisits: number;
  totalLockIns: number;
  totalCompletions: number;
  completionRatePercent: number;
  lastUpdated: string;
}
