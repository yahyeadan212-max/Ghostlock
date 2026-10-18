interface ShareCardOptions {
  goal: string;
  durationMinutes: number;
  totalCompletedSessions: number;
  currentStreak: number;
  includeGoal: boolean;
}

/**
 * Generates a high-resolution dark-mode canvas share card (1080x1080 square).
 */
export async function generateShareCardBlob(options: ShareCardOptions): Promise<Blob | null> {
  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1080;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  // Background
  ctx.fillStyle = '#080A09';
  ctx.fillRect(0, 0, 1080, 1080);

  // Subtle gradient glow in the top-right
  const glow = ctx.createRadialGradient(880, 200, 10, 880, 200, 480);
  glow.addColorStop(0, 'rgba(182, 255, 0, 0.12)');
  glow.addColorStop(1, 'rgba(8, 10, 9, 0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, 1080, 1080);

  // Card Outer Border
  ctx.strokeStyle = '#242B24';
  ctx.lineWidth = 4;
  ctx.strokeRect(60, 60, 960, 960);

  // Inner container
  ctx.fillStyle = '#111512';
  ctx.fillRect(80, 80, 920, 920);

  // Neon accent bar at top of inner box
  ctx.fillStyle = '#B6FF00';
  ctx.fillRect(80, 80, 920, 8);

  // Brand Header
  ctx.fillStyle = '#F5F7F2';
  ctx.font = '800 38px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('GHOSTLOCK', 140, 180);

  // Small subtitle
  ctx.fillStyle = '#8B948A';
  ctx.font = '600 20px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('DISAPPEAR FROM DISTRACTIONS', 140, 215);

  // Tag / Achievement
  ctx.fillStyle = '#B6FF00';
  ctx.font = '700 26px "JetBrains Mono", monospace';
  ctx.fillText('RESPECT +1', 140, 310);

  // Big Duration Headline
  ctx.fillStyle = '#F5F7F2';
  ctx.font = '800 76px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(`${options.durationMinutes} MIN LOCKED IN`, 140, 410);

  // Core quote
  ctx.fillStyle = '#8B948A';
  ctx.font = '600 32px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('"I showed up for myself."', 140, 480);

  // Goal (if user permitted)
  let yOffset = 570;
  if (options.includeGoal && options.goal.trim()) {
    ctx.fillStyle = '#1C241D';
    ctx.fillRect(140, yOffset, 800, 110);
    ctx.strokeStyle = '#2E3B2E';
    ctx.lineWidth = 2;
    ctx.strokeRect(140, yOffset, 800, 110);

    ctx.fillStyle = '#8B948A';
    ctx.font = '600 18px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('TARGET COMPLETED', 170, yOffset + 38);

    ctx.fillStyle = '#F5F7F2';
    ctx.font = '700 28px "Plus Jakarta Sans", sans-serif';
    const truncatedGoal = options.goal.length > 42 ? options.goal.slice(0, 40) + '...' : options.goal;
    ctx.fillText(truncatedGoal, 170, yOffset + 78);

    yOffset += 160;
  } else {
    yOffset += 60;
  }

  // Stats Grid in Card
  // Metric 1: Total Completed Sessions
  ctx.fillStyle = '#161B16';
  ctx.fillRect(140, yOffset, 380, 130);
  ctx.strokeStyle = '#242B24';
  ctx.lineWidth = 2;
  ctx.strokeRect(140, yOffset, 380, 130);

  ctx.fillStyle = '#8B948A';
  ctx.font = '500 18px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('TOTAL SESSIONS', 170, yOffset + 42);

  ctx.fillStyle = '#F5F7F2';
  ctx.font = '800 44px "JetBrains Mono", monospace';
  ctx.fillText(String(options.totalCompletedSessions), 170, yOffset + 96);

  // Metric 2: Current Streak
  ctx.fillStyle = '#161B16';
  ctx.fillRect(560, yOffset, 380, 130);
  ctx.strokeStyle = '#242B24';
  ctx.lineWidth = 2;
  ctx.strokeRect(560, yOffset, 380, 130);

  ctx.fillStyle = '#8B948A';
  ctx.font = '500 18px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('CURRENT STREAK', 590, yOffset + 42);

  ctx.fillStyle = '#B6FF00';
  ctx.font = '800 44px "JetBrains Mono", monospace';
  ctx.fillText(`${options.currentStreak} DAYS`, 590, yOffset + 96);

  // Footer branding
  ctx.fillStyle = '#556054';
  ctx.font = '600 20px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('ghostlock.app · 100% Free Focus Tool · Zero Distractions', 140, 940);

  return new Promise<Blob | null>((resolve) => {
    canvas.toBlob((blob) => resolve(blob), 'image/png');
  });
}

export async function downloadShareCard(options: ShareCardOptions): Promise<void> {
  const blob = await generateShareCardBlob(options);
  if (!blob) return;

  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `ghostlock-win-${Date.now()}.png`;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

export function generateShareText(options: ShareCardOptions): string {
  const goalLine = options.includeGoal && options.goal.trim() ? `Target: "${options.goal}"\n` : '';
  return `Locked in for ${options.durationMinutes} minutes with GhostLock.\n${goalLine}Respect +1. Streak: ${options.currentStreak} days.\n"I showed up for myself."\nhttps://ghostlock.app`;
}
