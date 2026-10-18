import React, { useState, useEffect } from 'react';
import { 
  RefreshCw, Users, ArrowLeft, Zap, Shield, 
  CheckCircle2, TrendingUp, RotateCcw, Lock, Target, Clock, AlertCircle, Eye, EyeOff 
} from 'lucide-react';
import { AnalyticsStats, AppView } from '../types';
import { 
  fetchAnalyticsStats, resetLocalCounters, getRecentGoals, 
  LoggedGoal, COUNTAPI_NAMESPACE 
} from '../utils/analytics';

interface AdminViewProps {
  onNavigate: (view: AppView) => void;
  onLogout?: () => void;
}

const REQUIRED_ADMIN_PASSWORD = 'ghostpaulo2026';
const AUTH_STORAGE_KEY = 'ghostlock_admin_auth_v2';

export const AdminView: React.FC<AdminViewProps> = ({ onNavigate, onLogout }) => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return sessionStorage.getItem(AUTH_STORAGE_KEY) === REQUIRED_ADMIN_PASSWORD;
  });

  const [passwordInput, setPasswordInput] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Dashboard Data State
  const [stats, setStats] = useState<AnalyticsStats | null>(null);
  const [recentGoals, setRecentGoals] = useState<LoggedGoal[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);

  const loadData = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    try {
      const data = await fetchAnalyticsStats();
      setStats(data);
      setRecentGoals(getRecentGoals());
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  // Handle password submission
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === REQUIRED_ADMIN_PASSWORD) {
      sessionStorage.setItem(AUTH_STORAGE_KEY, REQUIRED_ADMIN_PASSWORD);
      setIsAuthenticated(true);
      setAuthError(null);
    } else {
      // User requirement: "if wrong, redirect to home."
      setAuthError('Incorrect password. Redirecting to home...');
      setTimeout(() => {
        if (typeof window !== 'undefined') {
          window.history.replaceState(null, '', '/');
        }
        onNavigate('landing');
      }, 700);
    }
  };

  const handleLockSession = () => {
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
    setIsAuthenticated(false);
    if (onLogout) {
      onLogout();
    } else {
      if (typeof window !== 'undefined') {
        window.history.replaceState(null, '', '/');
      }
      onNavigate('landing');
    }
  };

  const handleResetCounters = async () => {
    resetLocalCounters();
    setShowResetConfirm(false);
    await loadData(true);
  };

  // -------------------------------------------------------------
  // VIEW A: PASSWORD CHALLENGE (If not authenticated)
  // -------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-16 animate-in fade-in duration-200">
        <div className="w-full max-w-md rounded-3xl border border-[#242B24] bg-[#111512] p-8 text-center shadow-2xl">
          
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#161B16] border border-[#242B24] text-[#B6FF00] glow-neon-sm">
            <Lock className="h-7 w-7 stroke-[2.5]" />
          </div>

          <div className="inline-flex items-center gap-2 rounded-full border border-[#242B24] bg-[#080A09] px-3 py-1 text-xs font-bold uppercase tracking-widest text-[#B6FF00] mb-3">
            <Shield className="h-3.5 w-3.5" />
            <span>AUTHENTICATION REQUIRED</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-[#F5F7F2] tracking-tight mb-2">
            GhostLock Admin
          </h2>
          <p className="text-xs text-[#8B948A] mb-6">
            Enter the admin password to view system telemetry, focus goals, and global analytics.
          </p>

          <form onSubmit={handlePasswordSubmit} className="space-y-4 text-left">
            <div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Enter admin password..."
                  autoFocus
                  required
                  className="w-full rounded-xl border border-[#242B24] bg-[#080A09] px-4 py-3.5 pr-11 text-sm font-medium text-[#F5F7F2] placeholder-[#556054] outline-none focus:border-[#B6FF00] focus:ring-1 focus:ring-[#B6FF00] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8B948A] hover:text-[#F5F7F2] p-1 transition-colors"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              {authError && (
                <div className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-[#EF4444] animate-in fade-in">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  <span>{authError}</span>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#B6FF00] py-3.5 px-4 text-xs font-black uppercase tracking-wider text-[#080A09] hover:bg-[#c6ff24] active:scale-[0.98] transition-all glow-neon-sm min-h-[48px]"
            >
              <Lock className="h-4 w-4" />
              <span>Unlock Dashboard</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (typeof window !== 'undefined') {
                  window.history.replaceState(null, '', '/');
                }
                onNavigate('landing');
              }}
              className="w-full text-center text-xs text-[#8B948A] hover:text-[#F5F7F2] py-2 transition-colors"
            >
              Cancel & Return Home
            </button>
          </form>

        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW B: RECREATED ADMIN DASHBOARD
  // -------------------------------------------------------------
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:py-14 animate-in fade-in duration-200">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-[#242B24] bg-[#111512] px-3 py-1 text-xs font-bold uppercase tracking-widest text-[#B6FF00] mb-2">
            <Shield className="h-3.5 w-3.5" />
            <span>PROTECTED /ADMIN CONSOLE</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[#F5F7F2]">
            System Dashboard
          </h1>
          <p className="text-sm text-[#8B948A] mt-1">
            Tracking users, focus sessions, live goals, and retention metrics.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => loadData(true)}
            disabled={refreshing}
            className="flex items-center gap-2 rounded-xl border border-[#242B24] bg-[#111512] px-4 py-2.5 text-xs font-bold text-[#F5F7F2] hover:border-[#B6FF00] transition-colors min-h-[44px]"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin text-[#B6FF00]' : ''}`} />
            <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
          </button>

          <button
            onClick={handleLockSession}
            className="flex items-center gap-2 rounded-xl border border-[#242B24] bg-[#111512] px-4 py-2.5 text-xs font-bold text-[#8B948A] hover:text-[#EF4444] hover:border-[#EF4444]/60 transition-colors min-h-[44px]"
            title="Lock session and return home"
          >
            <Lock className="h-3.5 w-3.5" />
            <span>Lock</span>
          </button>

          <button
            onClick={() => {
              if (typeof window !== 'undefined') {
                window.history.replaceState(null, '', '/');
              }
              onNavigate('landing');
            }}
            className="flex items-center gap-2 rounded-xl bg-[#B6FF00] px-4 py-2.5 text-xs font-black uppercase tracking-wider text-[#080A09] hover:bg-[#c6ff24] transition-all glow-neon-sm min-h-[44px]"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>App</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-24 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#111512] border border-[#242B24] text-[#B6FF00] animate-pulse">
            <RefreshCw className="h-6 w-6 animate-spin" />
          </div>
          <div className="text-sm font-bold text-[#F5F7F2]">Loading telemetry & goals...</div>
        </div>
      ) : stats ? (
        <div className="space-y-8">
          
          {/* BIG NEON METRIC CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            
            {/* Card 1: Total Users */}
            <div className="relative overflow-hidden rounded-3xl border-2 border-[#242B24] bg-[#111512] p-6 hover:border-[#B6FF00]/50 transition-all glow-neon-sm">
              <div className="flex items-center justify-between text-[#8B948A] mb-3">
                <span className="text-xs font-bold uppercase tracking-widest">
                  Total Users
                </span>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#161B16] border border-[#242B24] text-[#B6FF00]">
                  <Users className="h-4 w-4" />
                </div>
              </div>
              
              <div className="font-mono-numbers text-4xl sm:text-5xl font-black text-[#F5F7F2] tracking-tight text-glow-neon">
                {stats.totalVisits.toLocaleString()}
              </div>

              <div className="mt-4 pt-3 border-t border-[#1C221C] text-xs text-[#8B948A]">
                Global site visits recorded
              </div>
            </div>

            {/* Card 2: Total Focus Sessions */}
            <div className="relative overflow-hidden rounded-3xl border-2 border-[#242B24] bg-[#111512] p-6 hover:border-[#B6FF00]/50 transition-all glow-neon-sm">
              <div className="flex items-center justify-between text-[#8B948A] mb-3">
                <span className="text-xs font-bold uppercase tracking-widest">
                  Focus Sessions
                </span>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#161B16] border border-[#242B24] text-[#B6FF00]">
                  <Zap className="h-4 w-4 fill-[#B6FF00]" />
                </div>
              </div>

              <div className="font-mono-numbers text-4xl sm:text-5xl font-black text-[#B6FF00] tracking-tight text-glow-neon">
                {stats.totalLockIns.toLocaleString()}
              </div>

              <div className="mt-4 pt-3 border-t border-[#1C221C] text-xs text-[#8B948A]">
                Sessions started with target
              </div>
            </div>

            {/* Card 3: Completed Sessions */}
            <div className="relative overflow-hidden rounded-3xl border-2 border-[#242B24] bg-[#111512] p-6 hover:border-[#B6FF00]/50 transition-all glow-neon-sm">
              <div className="flex items-center justify-between text-[#8B948A] mb-3">
                <span className="text-xs font-bold uppercase tracking-widest">
                  Completions
                </span>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#161B16] border border-[#242B24] text-[#B6FF00]">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
              </div>

              <div className="font-mono-numbers text-4xl sm:text-5xl font-black text-[#F5F7F2] tracking-tight">
                {stats.totalCompletions.toLocaleString()}
              </div>

              <div className="mt-4 pt-3 border-t border-[#1C221C] text-xs text-[#8B948A]">
                Finished down to 00:00
              </div>
            </div>

            {/* Card 4: Completion Rate % */}
            <div className="relative overflow-hidden rounded-3xl border-2 border-[#242B24] bg-[#111512] p-6 hover:border-[#B6FF00]/50 transition-all glow-neon">
              <div className="flex items-center justify-between text-[#8B948A] mb-3">
                <span className="text-xs font-bold uppercase tracking-widest text-[#B6FF00]">
                  Completion Rate
                </span>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#161B16] border border-[#242B24] text-[#B6FF00]">
                  <TrendingUp className="h-4 w-4" />
                </div>
              </div>

              <div className="font-mono-numbers text-4xl sm:text-5xl font-black text-[#B6FF00] tracking-tight text-glow-neon">
                {stats.completionRatePercent}%
              </div>

              <div className="mt-4 pt-3 border-t border-[#1C221C] text-xs text-[#8B948A]">
                Completed / Started ratio
              </div>
            </div>

          </div>

          {/* SECTION 2: RECENT FOCUS GOALS */}
          <div className="rounded-3xl border border-[#242B24] bg-[#111512] p-6 sm:p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#161B16] text-[#B6FF00]">
                  <Target className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-[#F5F7F2]">Target Goals Log</h2>
                  <p className="text-xs text-[#8B948A]">Objectives users locked in for</p>
                </div>
              </div>
              <span className="text-xs font-mono-numbers text-[#8B948A]">
                {recentGoals.length} recorded
              </span>
            </div>

            {recentGoals.length === 0 ? (
              <div className="py-12 text-center border border-dashed border-[#242B24] rounded-2xl">
                <Target className="mx-auto h-8 w-8 text-[#556054] mb-2" />
                <p className="text-sm font-semibold text-[#8B948A]">No goals logged yet.</p>
                <p className="text-xs text-[#556054] mt-1">Goals will stream here live as focus sessions start.</p>
              </div>
            ) : (
              <div className="divide-y divide-[#1C221C] max-h-96 overflow-y-auto pr-2">
                {recentGoals.map((g) => (
                  <div key={g.id} className="py-3.5 flex items-center justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-semibold text-[#F5F7F2] truncate">
                        "{g.goal}"
                      </div>
                      <div className="flex items-center gap-2 text-xs text-[#8B948A] mt-0.5">
                        <Clock className="h-3 w-3 text-[#556054]" />
                        <span>{new Date(g.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        <span>·</span>
                        <span>{new Date(g.timestamp).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0 flex items-center gap-2">
                      <span className="font-mono-numbers text-xs font-bold text-[#F5F7F2] bg-[#161B16] px-2.5 py-1 rounded-md border border-[#242B24]">
                        {g.durationMinutes}m
                      </span>
                      {g.completed ? (
                        <span className="text-[10px] font-bold text-[#B6FF00] bg-[#161B16] px-2 py-0.5 rounded border border-[#B6FF00]/40">
                          COMPLETED
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-[#8B948A] bg-[#080A09] px-2 py-0.5 rounded border border-[#242B24]">
                          STARTED
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SECTION 3: SYSTEM TELEMETRY & STATS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            
            <div className="p-5 rounded-2xl bg-[#111512] border border-[#242B24]">
              <div className="text-xs font-bold uppercase tracking-wider text-[#8B948A] mb-1">
                Conversion Rate
              </div>
              <div className="font-mono-numbers text-3xl font-black text-[#F5F7F2]">
                {stats.totalVisits > 0 ? ((stats.totalLockIns / stats.totalVisits) * 100).toFixed(1) : '0.0'}%
              </div>
              <p className="text-xs text-[#556054] mt-2">
                Ratio of visitors who actually lock in for a target goal.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#111512] border border-[#242B24]">
              <div className="text-xs font-bold uppercase tracking-wider text-[#8B948A] mb-1">
                CountAPI Namespace
              </div>
              <div className="font-mono-numbers text-xl font-bold text-[#B6FF00] truncate">
                {COUNTAPI_NAMESPACE}
              </div>
              <p className="text-xs text-[#556054] mt-2">
                Active telemetry namespace keys: visits, lock-ins, completions.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#111512] border border-[#242B24] flex flex-col justify-between">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-[#8B948A] mb-1">
                  Telemetry Management
                </div>
                <p className="text-xs text-[#556054]">
                  Reset local count mirrors back to zero if needed.
                </p>
              </div>

              <button
                onClick={() => setShowResetConfirm(true)}
                className="mt-4 flex items-center justify-center gap-2 rounded-xl border border-[#EF4444]/40 bg-[#161111] py-2 px-3 text-xs font-bold text-[#EF4444] hover:bg-[#EF4444] hover:text-white transition-colors min-h-[40px]"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Reset Counts to 0</span>
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
                <h4 className="text-xl font-black text-[#F5F7F2] mb-2 uppercase">
                  RESET DASHBOARD COUNTS?
                </h4>
                <p className="text-xs text-[#8B948A] leading-relaxed mb-6">
                  This will reset your local telemetry counters back to 0.
                </p>
                <div className="flex flex-col gap-2.5">
                  <button
                    onClick={handleResetCounters}
                    className="w-full rounded-xl bg-[#EF4444] py-3 px-4 text-xs font-bold uppercase tracking-wider text-white hover:bg-red-600 transition-colors min-h-[44px]"
                  >
                    Yes, Reset to 0
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
      ) : null}

    </div>
  );
};
