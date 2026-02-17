import { db, setKV, getKV } from './db';
import type { AppData } from '../schemas/app.schema';

interface MigrationLog {
  step: string;
  status: 'success' | 'error';
  details?: string;
}

/**
 * Detect and migrate v3 localStorage data to v4 IndexedDB.
 * Returns migration logs or null if no v3 data found.
 */
export async function migrateFromV3(): Promise<MigrationLog[] | null> {
  const raw = localStorage.getItem('studentOS');
  if (!raw) return null;

  const logs: MigrationLog[] = [];

  try {
    const v3: Record<string, unknown> = JSON.parse(raw);
    logs.push({ step: 'Parse v3 data', status: 'success' });

    // Back up v3 data
    localStorage.setItem('studentOS_v3_backup', raw);
    logs.push({ step: 'Backup v3 data', status: 'success' });

    // Migrate subjects
    const subjects = Array.isArray(v3.subjects) ? v3.subjects : [];
    const normalizedSubjects = subjects.map((s: unknown) => {
      if (typeof s === 'string') return { id: crypto.randomUUID(), name: s, color: '#6366f1', icon: '📘', weeklyGoalHours: 0 };
      return s as Record<string, unknown>;
    });
    if (normalizedSubjects.length > 0) {
      await db.subjects.bulkPut(normalizedSubjects as never[]);
      logs.push({ step: `Migrate ${normalizedSubjects.length} subjects`, status: 'success' });
    }

    // Migrate study sessions
    const sessions = Array.isArray(v3.studySessions) ? v3.studySessions : [];
    if (sessions.length > 0) {
      await db.studySessions.bulkPut(sessions as never[]);
      logs.push({ step: `Migrate ${sessions.length} study sessions`, status: 'success' });
    }

    // Migrate assignments
    const assignments = Array.isArray(v3.assignments) ? v3.assignments : [];
    if (assignments.length > 0) {
      await db.assignments.bulkPut(assignments as never[]);
      logs.push({ step: `Migrate ${assignments.length} assignments`, status: 'success' });
    }

    // Migrate expenses
    const expenses = Array.isArray(v3.expenses) ? v3.expenses : [];
    if (expenses.length > 0) {
      await db.expenses.bulkPut(expenses as never[]);
      logs.push({ step: `Migrate ${expenses.length} expenses`, status: 'success' });
    }

    // Migrate timetable
    const timetable = Array.isArray(v3.timetable) ? v3.timetable : [];
    if (timetable.length > 0) {
      await db.timetable.bulkPut(timetable as never[]);
      logs.push({ step: `Migrate ${timetable.length} timetable entries`, status: 'success' });
    }

    // Migrate goals
    const goals = Array.isArray(v3.goals) ? v3.goals : [];
    if (goals.length > 0) {
      await db.goals.bulkPut(goals as never[]);
      logs.push({ step: `Migrate ${goals.length} goals`, status: 'success' });
    }

    // Migrate journal entries
    const journal = Array.isArray(v3.journalEntries) ? v3.journalEntries : [];
    if (journal.length > 0) {
      await db.journalEntries.bulkPut(journal as never[]);
      logs.push({ step: `Migrate ${journal.length} journal entries`, status: 'success' });
    }

    // Migrate sleep log
    const sleepLog = Array.isArray(v3.sleepLog) ? v3.sleepLog : [];
    if (sleepLog.length > 0) {
      await db.sleepLog.bulkPut(sleepLog as never[]);
      logs.push({ step: `Migrate ${sleepLog.length} sleep logs`, status: 'success' });
    }

    // Migrate exercise log
    const exerciseLog = Array.isArray(v3.exerciseLog) ? v3.exerciseLog : [];
    if (exerciseLog.length > 0) {
      await db.exerciseLog.bulkPut(exerciseLog as never[]);
      logs.push({ step: `Migrate ${exerciseLog.length} exercise logs`, status: 'success' });
    }

    // Migrate research log
    const researchLog = Array.isArray(v3.researchLog) ? v3.researchLog : [];
    if (researchLog.length > 0) {
      await db.researchLog.bulkPut(researchLog as never[]);
      logs.push({ step: `Migrate ${researchLog.length} research entries`, status: 'success' });
    }

    // Migrate habits (object → records)
    const habits = v3.habits as Record<string, unknown> | undefined;
    if (habits && typeof habits === 'object' && !Array.isArray(habits)) {
      const habitRecords = Object.values(habits);
      if (habitRecords.length > 0) {
        await db.habits.bulkPut(habitRecords as never[]);
        logs.push({ step: `Migrate ${habitRecords.length} habits`, status: 'success' });
      }
    }

    // Migrate settings, grades, gamification as KV
    if (v3.settings) {
      await setKV('settings', v3.settings);
      logs.push({ step: 'Migrate settings', status: 'success' });
    }
    if (v3.grades) {
      await setKV('grades', v3.grades);
      logs.push({ step: 'Migrate grades', status: 'success' });
    }

    // Gamification
    await setKV('gamification', {
      xp: v3.xp ?? 0,
      level: v3.level ?? 1,
      achievements: v3.achievements ?? [],
      streakFreezes: v3.streakFreezes ?? 2,
      totalPoints: v3.totalPoints ?? 0,
    });
    logs.push({ step: 'Migrate gamification data', status: 'success' });

    // KV for mood/water logs
    if (v3.moodLog) await setKV('moodLog', v3.moodLog);
    if (v3.waterLog) await setKV('waterLog', v3.waterLog);

    // Mark migration complete
    await setKV('migrationComplete', { from: 'v3', at: new Date().toISOString() });
    logs.push({ step: 'Migration complete', status: 'success' });
  } catch (err) {
    logs.push({ step: 'Migration error', status: 'error', details: String(err) });
  }

  return logs;
}

/** Check if v3 data exists */
export function hasV3Data(): boolean {
  return localStorage.getItem('studentOS') !== null;
}

/** Export all data from IndexedDB */
export async function exportAllData(): Promise<AppData> {
  const [
    subjects,
    studySessions,
    assignments,
    expenses,
    sleepLog,
    exerciseLog,
    goals,
    timetable,
    journalEntries,
    researchLog,
    habitRecords,
    notifications,
  ] = await Promise.all([
    db.subjects.toArray(),
    db.studySessions.toArray(),
    db.assignments.toArray(),
    db.expenses.toArray(),
    db.sleepLog.toArray(),
    db.exerciseLog.toArray(),
    db.goals.toArray(),
    db.timetable.toArray(),
    db.journalEntries.toArray(),
    db.researchLog.toArray(),
    db.habits.toArray(),
    db.notifications.toArray(),
  ]);

  const settings = (await getKV('settings')) ?? {};
  const grades = (await getKV('grades')) ?? { semesters: [] };
  const gamification = (await getKV('gamification')) ?? {
    xp: 0, level: 1, achievements: [], streakFreezes: 2, totalPoints: 0,
  };
  const moodLog = (await getKV('moodLog')) ?? {};
  const waterLog = (await getKV('waterLog')) ?? {};

  const habits: Record<string, unknown> = {};
  for (const h of habitRecords) habits[h.id] = h;

  return {
    subjects,
    studySessions,
    assignments,
    expenses,
    sleepLog,
    exerciseLog,
    moodLog: moodLog as AppData['moodLog'],
    waterLog: waterLog as AppData['waterLog'],
    goals,
    timetable,
    journalEntries,
    researchLog,
    habits: habits as AppData['habits'],
    habitOrder: habitRecords.map((h) => h.id),
    grades: grades as AppData['grades'],
    notifications,
    settings: settings as AppData['settings'],
    gamification: gamification as AppData['gamification'],
    _version: '4.0.0',
  };
}
