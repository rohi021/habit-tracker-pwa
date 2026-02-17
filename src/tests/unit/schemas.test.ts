import { describe, it, expect } from 'vitest';
import { AppDataSchema, SubjectSchema, AssignmentSchema, SettingsSchema } from '../../schemas/app.schema';

describe('Zod schemas', () => {
  it('SubjectSchema validates correctly', () => {
    const result = SubjectSchema.safeParse({
      id: '123',
      name: 'Math',
      color: '#ff0000',
      icon: '📐',
      weeklyGoalHours: 5,
    });
    expect(result.success).toBe(true);
  });

  it('SubjectSchema rejects empty name', () => {
    const result = SubjectSchema.safeParse({ id: '123', name: '' });
    expect(result.success).toBe(false);
  });

  it('AssignmentSchema applies defaults', () => {
    const result = AssignmentSchema.parse({
      id: '1',
      title: 'Homework 1',
      subject: 'Math',
      dueDate: '2025-04-01',
      createdAt: '2025-03-01T00:00:00Z',
    });
    expect(result.priority).toBe('medium');
    expect(result.status).toBe('pending');
    expect(result.prepProgress).toBe(0);
    expect(result.topics).toEqual([]);
  });

  it('SettingsSchema applies all defaults', () => {
    const result = SettingsSchema.parse({});
    expect(result.theme).toBe('dark');
    expect(result.currency).toBe('₹');
    expect(result.dailyStudyGoal).toBe(120);
    expect(result.waterGoal).toBe(8);
    expect(result.reducedMotion).toBe(false);
  });

  it('AppDataSchema provides complete default state', () => {
    const result = AppDataSchema.parse({});
    expect(result.subjects).toEqual([]);
    expect(result.assignments).toEqual([]);
    expect(result._version).toBe('4.0.0');
    expect(result.gamification.xp).toBe(0);
    expect(result.settings.theme).toBe('dark');
  });
});
