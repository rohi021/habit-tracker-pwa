import type { StudySession } from '../schemas/app.schema';
import { dateToKey, getWeekStart, parseKey } from './dates';

/** Calculate total study minutes for a given date key */
export function studyMinutesForDate(sessions: StudySession[], dateKey: string): number {
  return sessions
    .filter((s) => s.date === dateKey)
    .reduce((sum, s) => sum + s.duration, 0);
}

/** Calculate total study minutes for the current week */
export function studyMinutesThisWeek(sessions: StudySession[], weekStartsOn = 0): number {
  const weekStart = getWeekStart(new Date(), weekStartsOn);
  return sessions
    .filter((s) => {
      const d = parseKey(s.date);
      return d >= weekStart;
    })
    .reduce((sum, s) => sum + s.duration, 0);
}

/** Get study hours by subject */
export function studyBySubject(sessions: StudySession[]): Record<string, number> {
  const result: Record<string, number> = {};
  for (const s of sessions) {
    result[s.subject] = (result[s.subject] ?? 0) + s.duration;
  }
  return result;
}

/** Get study hours per day for the last N days */
export function studyPerDay(sessions: StudySession[], days = 7): Array<{ date: string; minutes: number }> {
  const result: Array<{ date: string; minutes: number }> = [];
  const today = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = dateToKey(d);
    result.push({ date: key, minutes: studyMinutesForDate(sessions, key) });
  }
  return result;
}
