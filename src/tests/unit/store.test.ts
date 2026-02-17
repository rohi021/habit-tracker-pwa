import { describe, it, expect, beforeEach } from 'vitest';
import { useAppStore, type AppState } from '../../store/useAppStore';

// NOTE: The store uses IndexedDB (Dexie) which requires a real browser environment
// or fake-indexeddb. For now, these tests validate the initial state shape.

describe('useAppStore', () => {
  it('has correct initial state shape', () => {
    const state = useAppStore.getState();
    expect(state.subjects).toEqual([]);
    expect(state.studySessions).toEqual([]);
    expect(state.assignments).toEqual([]);
    expect(state.expenses).toEqual([]);
    expect(state.goals).toEqual([]);
    expect(state.timetable).toEqual([]);
    expect(state.journalEntries).toEqual([]);
    expect(state.researchLog).toEqual([]);
    expect(state.notifications).toEqual([]);
    expect(state.grades).toEqual({ semesters: [] });
    expect(state.gamification).toEqual({
      xp: 0,
      level: 1,
      achievements: [],
      streakFreezes: 2,
      totalPoints: 0,
    });
    expect(state.settings.theme).toBe('dark');
    expect(state.settings.currency).toBe('₹');
    expect(state.isLoading).toBe(true);
    expect(state.migrationLogs).toBe(null);
  });

  it('has all required action methods', () => {
    const state = useAppStore.getState();
    const requiredActions: Array<keyof AppState> = [
      'loadAll', 'setMigrationLogs',
      'addSubject', 'updateSubject', 'deleteSubject',
      'addStudySession', 'deleteStudySession',
      'addAssignment', 'updateAssignment', 'deleteAssignment',
      'addExpense', 'deleteExpense',
      'addTimetableEntry', 'updateTimetableEntry', 'deleteTimetableEntry',
      'addSleepLog', 'deleteSleepLog', 'logWater', 'logMood',
      'addExercise', 'deleteExercise',
      'addJournalEntry', 'updateJournalEntry', 'deleteJournalEntry',
      'addGoal', 'updateGoal', 'deleteGoal',
      'addResearchEntry', 'deleteResearchEntry',
      'addNotification', 'markNotificationRead', 'clearNotifications',
      'setGrades', 'addXP', 'updateSettings',
    ];
    for (const action of requiredActions) {
      expect(typeof state[action]).toBe('function');
    }
  });
});
