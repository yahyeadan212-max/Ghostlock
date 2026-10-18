import { AnalyticsStats } from '../types';

export const COUNTAPI_NAMESPACE = 'ghostlock2026';

export type AnalyticsEvent = 'page_visit' | 'lock_in_click' | 'session_completed';

const LOCAL_ANALYTICS_KEY = 'ghostlock_analytics_cache_ghostlock2026';
const RECENT_GOALS_KEY = 'ghostlock_recent_goals_log_v1';

export interface LoggedGoal {
  id: string;
  goal: string;
  durationMinutes: number;
  timestamp: string;
  completed?: boolean;
}

interface AnalyticsStorage {
  page_visit: number;
  lock_in_click: number;
  session_completed: number;
  lastUpdated: string;
}

export function getLocalCounters(): AnalyticsStorage {
  try {
    const raw = localStorage.getItem(LOCAL_ANALYTICS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed reading analytics cache', e);
  }

  // Starts from 0 strictly for ghostlock2026
  const initial: AnalyticsStorage = {
    page_visit: 0,
    lock_in_click: 0,
    session_completed: 0,
    lastUpdated: new Date().toISOString(),
  };

  try {
    localStorage.setItem(LOCAL_ANALYTICS_KEY, JSON.stringify(initial));
  } catch {}

  return initial;
}

function incrementLocalCounter(event: AnalyticsEvent): AnalyticsStorage {
  const current = getLocalCounters();
  current[event] = (current[event] || 0) + 1;
  current.lastUpdated = new Date().toISOString();
  try {
    localStorage.setItem(LOCAL_ANALYTICS_KEY, JSON.stringify(current));
  } catch {}
  return current;
}

/**
 * Log goals entered by users for the admin dashboard
 */
export function recordGoalForAdmin(goal: string, durationMinutes: number): void {
  try {
    const raw = localStorage.getItem(RECENT_GOALS_KEY);
    const list: LoggedGoal[] = raw ? JSON.parse(raw) : [];
    const item: LoggedGoal = {
      id: `goal_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      goal: goal.trim(),
      durationMinutes,
      timestamp: new Date().toISOString(),
      completed: false,
    };
    const updated = [item, ...list].slice(0, 50);
    localStorage.setItem(RECENT_GOALS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to log goal', e);
  }
}

export function markGoalCompletedInAdmin(goal: string): void {
  try {
    const raw = localStorage.getItem(RECENT_GOALS_KEY);
    if (!raw) return;
    const list: LoggedGoal[] = JSON.parse(raw);
    const target = list.find((g) => g.goal.trim() === goal.trim() && !g.completed);
    if (target) {
      target.completed = true;
      localStorage.setItem(RECENT_GOALS_KEY, JSON.stringify(list));
    }
  } catch {}
}

export function getRecentGoals(): LoggedGoal[] {
  try {
    const raw = localStorage.getItem(RECENT_GOALS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

/**
 * Reset local mirror counters back to 0
 */
export function resetLocalCounters(): AnalyticsStorage {
  const reset: AnalyticsStorage = {
    page_visit: 0,
    lock_in_click: 0,
    session_completed: 0,
    lastUpdated: new Date().toISOString(),
  };
  try {
    localStorage.setItem(LOCAL_ANALYTICS_KEY, JSON.stringify(reset));
  } catch {}
  return reset;
}

/**
 * Tracks an event using CountAPI (https://api.countapi.xyz) under
 * namespace 'ghostlock2026' with resilient fallback.
 */
export async function trackAnalyticsEvent(event: AnalyticsEvent): Promise<number> {
  const local = incrementLocalCounter(event);

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);

    // CountAPI hit endpoint: https://api.countapi.xyz/hit/{namespace}/{key}
    const res = await fetch(`https://api.countapi.xyz/hit/${COUNTAPI_NAMESPACE}/${event}`, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
      },
    });

    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (typeof data.value === 'number') {
        local[event] = Math.max(local[event], data.value);
        try {
          localStorage.setItem(LOCAL_ANALYTICS_KEY, JSON.stringify(local));
        } catch {}
        return data.value;
      }
    }
  } catch {
    // Graceful offline fallback
  }

  return local[event];
}

/**
 * Fetches analytics stats for the /admin dashboard under 'ghostlock2026'.
 */
export async function fetchAnalyticsStats(): Promise<AnalyticsStats> {
  const local = getLocalCounters();
  let visits = local.page_visit;
  let lockIns = local.lock_in_click;
  let completions = local.session_completed;

  // Try fetching current counts from CountAPI: https://api.countapi.xyz/get/{namespace}/{key}
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);

    const [vRes, lRes, cRes] = await Promise.allSettled([
      fetch(`https://api.countapi.xyz/get/${COUNTAPI_NAMESPACE}/page_visit`, { signal: controller.signal }),
      fetch(`https://api.countapi.xyz/get/${COUNTAPI_NAMESPACE}/lock_in_click`, { signal: controller.signal }),
      fetch(`https://api.countapi.xyz/get/${COUNTAPI_NAMESPACE}/session_completed`, { signal: controller.signal }),
    ]);

    clearTimeout(timeoutId);

    if (vRes.status === 'fulfilled' && vRes.value.ok) {
      const data = await vRes.value.json();
      if (typeof data.value === 'number') visits = data.value;
    }
    if (lRes.status === 'fulfilled' && lRes.value.ok) {
      const data = await lRes.value.json();
      if (typeof data.value === 'number') lockIns = data.value;
    }
    if (cRes.status === 'fulfilled' && cRes.value.ok) {
      const data = await cRes.value.json();
      if (typeof data.value === 'number') completions = data.value;
    }
  } catch {}

  const completionRatePercent = lockIns > 0 ? (completions / lockIns) * 100 : 0;

  return {
    totalVisits: visits,
    totalLockIns: lockIns,
    totalCompletions: completions,
    completionRatePercent: Number(completionRatePercent.toFixed(1)),
    lastUpdated: new Date().toISOString(),
  };
}
