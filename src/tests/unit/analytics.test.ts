import { describe, it, expect } from 'vitest';
import {
  studyMinutesForDate,
  studyMinutesThisWeek,
  studyBySubject,
  studyPerDay,
} from '../../utils/analytics';
import type { StudySession } from '../../schemas/app.schema';

function makeSession(overrides: Partial<StudySession> = {}): StudySession {
  return {
    id: crypto.randomUUID(),
    subject: 'Math',
    startTime: '2025-03-15T10:00:00Z',
    endTime: '2025-03-15T11:00:00Z',
    duration: 60,
    notes: '',
    date: '2025-03-15',
    type: 'regular',
    ...overrides,
  };
}

describe('analytics', () => {
  it('studyMinutesForDate sums minutes for a date', () => {
    const sessions = [
      makeSession({ date: '2025-03-15', duration: 30 }),
      makeSession({ date: '2025-03-15', duration: 45 }),
      makeSession({ date: '2025-03-14', duration: 60 }),
    ];
    expect(studyMinutesForDate(sessions, '2025-03-15')).toBe(75);
    expect(studyMinutesForDate(sessions, '2025-03-14')).toBe(60);
    expect(studyMinutesForDate(sessions, '2025-03-16')).toBe(0);
  });

  it('studyBySubject groups by subject', () => {
    const sessions = [
      makeSession({ subject: 'Math', duration: 30 }),
      makeSession({ subject: 'Math', duration: 20 }),
      makeSession({ subject: 'Physics', duration: 45 }),
    ];
    const result = studyBySubject(sessions);
    expect(result['Math']).toBe(50);
    expect(result['Physics']).toBe(45);
  });

  it('studyPerDay returns entries for last N days', () => {
    const result = studyPerDay([], 7);
    expect(result).toHaveLength(7);
    expect(result.every((d) => d.minutes === 0)).toBe(true);
  });
});
