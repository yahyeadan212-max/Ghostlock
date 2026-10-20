import { FocusSession, UserStats, UserSettings, ActiveSessionState } from '../types';

const STORAGE_KEYS = {
  STATS: 'ghostlock_user_stats_v1',
  SETTINGS: 'ghostlock_user_settings_v1',
  ACTIVE_SESSION: 'ghostlock_active_session_v1',
};

export function getLocalDateString(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getDefaultSettings(): UserSettings {
  return {
    defaultDurationMinutes: 1, // 1 min dare default for first-time visitors
    soundEnabled: true,
    motivationalPromptsEnabled: true,
    ambientSound: 'none',
  };
}

export function loadSettings(): UserSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!raw) return getDefaultSettings();
    return { ...getDefaultSettings(), ...JSON.parse(raw) };
  } catch {
    return getDefaultSettings();
  }
}

export function saveSettings(settings: UserSettings): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings to localStorage', e);
  }
}

export function getDefaultStats(): UserStats {
  return {
    currentStreak: 0,
    longestStreak: 0,
    totalCompletedSessions: 0,
    totalFocusedMinutes: 0,
    lastActiveDate: null,
    history: [],
  };
}

/**
 * Calculates current streak and longest streak from completed sessions.
 */
export function calculateStreaks(history: FocusSession[]): { currentStreak: number; longestStreak: number } {
  if (!history || history.length === 0) {
    return { currentStreak: 0, longestStreak: 0 };
  }

  // Get unique sorted dates in ascending order
  const uniqueDates = Array.from(new Set(history.map(s => s.date))).sort();
  if (uniqueDates.length === 0) {
    return { currentStreak: 0, longestStreak: 0 };
  }

  // Helper to parse date string YYYY-MM-DD into UTC epoch day
  const toEpochDay = (dateStr: string): number => {
    const [y, m, d] = dateStr.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    return Math.floor(date.getTime() / (1000 * 60 * 60 * 24));
  };

  // 1. Calculate longest streak across history
  let maxRun = 1;
  let currentRun = 1;

  for (let i = 1; i < uniqueDates.length; i++) {
    const prevDay = toEpochDay(uniqueDates[i - 1]);
    const currDay = toEpochDay(uniqueDates[i]);

    if (currDay === prevDay + 1) {
      currentRun++;
      if (currentRun > maxRun) maxRun = currentRun;
    } else if (currDay > prevDay + 1) {
      currentRun = 1;
    }
  }

  // 2. Calculate current streak (relative to today/yesterday)
  const todayStr = getLocalDateString(new Date());
  const todayEpoch = toEpochDay(todayStr);
  const yesterdayEpoch = todayEpoch - 1;

  const dateSet = new Set(uniqueDates);
  let liveStreak = 0;

  // If user completed a session today, streak includes today and walks back
  if (dateSet.has(todayStr)) {
    liveStreak = 1;
    let checkEpoch = todayEpoch - 1;
    while (true) {
      const checkDate = new Date(checkEpoch * 86400000 + 43200000); // midday to avoid DST jump
      const checkStr = getLocalDateString(checkDate);
      if (dateSet.has(checkStr)) {
        liveStreak++;
        checkEpoch--;
      } else {
        break;
      }
    }
  } else {
    // If not completed today, check if completed yesterday (streak is still alive, waiting for today)
    const yesterdayDate = new Date(yesterdayEpoch * 86400000 + 43200000);
    const yesterdayStr = getLocalDateString(yesterdayDate);
    if (dateSet.has(yesterdayStr)) {
      liveStreak = 1;
      let checkEpoch = yesterdayEpoch - 1;
      while (true) {
        const checkDate = new Date(checkEpoch * 86400000 + 43200000);
        const checkStr = getLocalDateString(checkDate);
        if (dateSet.has(checkStr)) {
          liveStreak++;
          checkEpoch--;
        } else {
          break;
        }
      }
    } else {
      liveStreak = 0;
    }
  }

  return {
    currentStreak: liveStreak,
    longestStreak: Math.max(maxRun, liveStreak),
  };
}

export function loadStats(): UserStats {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.STATS);
    if (!raw) return getDefaultStats();
    const parsed: UserStats = JSON.parse(raw);

    // Re-verify streak calculation dynamically to account for day rollover
    const { currentStreak, longestStreak } = calculateStreaks(parsed.history || []);
    return {
      ...parsed,
      currentStreak,
      longestStreak: Math.max(parsed.longestStreak || 0, longestStreak),
    };
  } catch {
    return getDefaultStats();
  }
}

export function saveStats(stats: UserStats): void {
  try {
    localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
  } catch (e) {
    console.error('Failed to save stats to localStorage', e);
  }
}

export function recordCompletedSession(goal: string, durationMinutes: number): UserStats {
  const currentStats = loadStats();
  const now = new Date();
  const dateStr = getLocalDateString(now);

  const newSession: FocusSession = {
    id: `gl_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    goal: goal.trim() || 'Focus Session',
    durationMinutes,
    completedAt: now.toISOString(),
    date: dateStr,
  };

  const updatedHistory = [newSession, ...(currentStats.history || [])];
  const { currentStreak, longestStreak } = calculateStreaks(updatedHistory);

  const totalCompletedSessions = (currentStats.totalCompletedSessions || 0) + 1;
  const totalFocusedMinutes = (currentStats.totalFocusedMinutes || 0) + durationMinutes;

  const updatedStats: UserStats = {
    currentStreak,
    longestStreak: Math.max(currentStats.longestStreak || 0, longestStreak),
    totalCompletedSessions,
    totalFocusedMinutes,
    lastActiveDate: dateStr,
    history: updatedHistory,
  };

  saveStats(updatedStats);
  return updatedStats;
}

export function resetAllStats(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.STATS);
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_SESSION);
  } catch (e) {
    console.error('Failed to reset stats', e);
  }
}

// Active session storage for page refreshes
export function loadActiveSession(): ActiveSessionState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ACTIVE_SESSION);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveActiveSession(session: ActiveSessionState | null): void {
  try {
    if (session) {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_SESSION, JSON.stringify(session));
    } else {
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_SESSION);
    }
  } catch (e) {
    console.error('Failed to update active session in storage', e);
  }
}
