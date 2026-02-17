import { describe, it, expect } from 'vitest';
import {
  parseKey,
  dateToKey,
  todayKey,
  formatDate,
  formatTime,
  daysBetween,
  isOverdue,
  formatDuration,
  getWeekStart,
} from '../../utils/dates';

describe('dates utility', () => {
  it('dateToKey formats date as YYYY-MM-DD', () => {
    const d = new Date('2025-03-15T10:00:00Z');
    expect(dateToKey(d)).toBe('2025-03-15');
  });

  it('parseKey creates a Date from YYYY-MM-DD key', () => {
    const d = parseKey('2025-03-15');
    expect(d.getFullYear()).toBe(2025);
    expect(d.getMonth()).toBe(2); // 0-indexed
    expect(d.getDate()).toBe(15);
  });

  it('todayKey returns today as YYYY-MM-DD', () => {
    const key = todayKey();
    expect(key).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('formatDate formats for display', () => {
    const result = formatDate('2025-03-15');
    expect(result).toContain('Mar');
    expect(result).toContain('15');
    expect(result).toContain('2025');
  });

  it('formatTime in 12h format', () => {
    expect(formatTime('14:30', '12h')).toBe('2:30 PM');
    expect(formatTime('09:05', '12h')).toBe('9:05 AM');
    expect(formatTime('00:00', '12h')).toBe('12:00 AM');
  });

  it('formatTime in 24h format', () => {
    expect(formatTime('14:30', '24h')).toBe('14:30');
  });

  it('daysBetween calculates correctly', () => {
    expect(daysBetween('2025-03-01', '2025-03-10')).toBe(9);
    expect(daysBetween('2025-03-10', '2025-03-01')).toBe(-9);
  });

  it('isOverdue detects past dates', () => {
    expect(isOverdue('2020-01-01')).toBe(true);
    expect(isOverdue('2099-01-01')).toBe(false);
  });

  it('formatDuration handles hours and minutes', () => {
    expect(formatDuration(0)).toBe('0m');
    expect(formatDuration(30)).toBe('30m');
    expect(formatDuration(60)).toBe('1h');
    expect(formatDuration(90)).toBe('1h 30m');
  });

  it('getWeekStart returns the start of week', () => {
    // Wednesday March 5, 2025
    const wed = new Date(2025, 2, 5, 12, 0, 0);
    const start = getWeekStart(wed, 0); // Sunday start
    expect(start.getDay()).toBe(0); // Sunday
    expect(start.getDate()).toBe(2); // March 2
  });
});
