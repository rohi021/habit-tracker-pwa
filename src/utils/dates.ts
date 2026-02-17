/** Safe date key parsing: appends T12:00:00 to avoid timezone shift */
export function parseKey(dateKey: string): Date {
  return new Date(dateKey + 'T12:00:00');
}

/** Format a Date object to YYYY-MM-DD string */
export function dateToKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/** Get today's date key */
export function todayKey(): string {
  return dateToKey(new Date());
}

/** Format date for display */
export function formatDate(dateStr: string): string {
  const d = parseKey(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

/** Format time for display (12h/24h) */
export function formatTime(timeStr: string, format: '12h' | '24h' = '12h'): string {
  const [h, m] = timeStr.split(':').map(Number);
  if (format === '24h') return timeStr;
  const period = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 || 12;
  return `${hour12}:${String(m).padStart(2, '0')} ${period}`;
}

/** Get the start of the week (Sunday) for a given date */
export function getWeekStart(date: Date, weekStartsOn = 0): Date {
  const d = new Date(date);
  const diff = (d.getDay() - weekStartsOn + 7) % 7;
  d.setDate(d.getDate() - diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

/** Days between two dates */
export function daysBetween(a: string, b: string): number {
  const da = parseKey(a);
  const db = parseKey(b);
  return Math.round((db.getTime() - da.getTime()) / (1000 * 60 * 60 * 24));
}

/** Check if a date is overdue */
export function isOverdue(dueDate: string): boolean {
  return daysBetween(todayKey(), dueDate) < 0;
}

/** Format duration in minutes to human-readable */
export function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}
