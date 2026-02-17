import Dexie, { type EntityTable } from 'dexie';
import type {
  Subject,
  StudySession,
  Assignment,
  Expense,
  SleepLog,
  ExerciseLog,
  Goal,
  TimetableEntry,
  JournalEntry,
  ResearchEntry,
  AppNotification,
} from '../schemas/app.schema';

export interface HabitRecord {
  id: string;
  name: string;
  emoji: string;
  category: string;
  frequency: 'daily' | 'weekly';
  completedDates: Record<string, boolean>;
  streak: number;
  bestStreak: number;
  createdAt: string;
  archived: boolean;
}

export interface GradesRecord {
  id: string;
  data: string; // JSON-serialized grades object
}

export interface KVRecord {
  key: string;
  value: string; // JSON string
}

class StudentOSDB extends Dexie {
  subjects!: EntityTable<Subject, 'id'>;
  studySessions!: EntityTable<StudySession, 'id'>;
  assignments!: EntityTable<Assignment, 'id'>;
  expenses!: EntityTable<Expense, 'id'>;
  sleepLog!: EntityTable<SleepLog, 'id'>;
  exerciseLog!: EntityTable<ExerciseLog, 'id'>;
  goals!: EntityTable<Goal, 'id'>;
  timetable!: EntityTable<TimetableEntry, 'id'>;
  journalEntries!: EntityTable<JournalEntry, 'id'>;
  researchLog!: EntityTable<ResearchEntry, 'id'>;
  habits!: EntityTable<HabitRecord, 'id'>;
  notifications!: EntityTable<AppNotification, 'id'>;
  kv!: EntityTable<KVRecord, 'key'>;

  constructor() {
    super('StudentOS');

    this.version(1).stores({
      subjects: 'id, name',
      studySessions: 'id, subject, date',
      assignments: 'id, subject, dueDate, status, type',
      expenses: 'id, category, date',
      sleepLog: 'id, date',
      exerciseLog: 'id, date',
      goals: 'id, category',
      timetable: 'id, subject, day',
      journalEntries: 'id, date',
      researchLog: 'id, date, type',
      habits: 'id',
      notifications: 'id, read',
      kv: 'key',
    });
  }
}

export const db = new StudentOSDB();

/** Persist a key-value pair (for settings, grades, gamification, etc.) */
export async function setKV(key: string, value: unknown): Promise<void> {
  await db.kv.put({ key, value: JSON.stringify(value) });
}

/** Retrieve a key-value pair */
export async function getKV<T>(key: string): Promise<T | undefined> {
  const record = await db.kv.get(key);
  if (!record) return undefined;
  return JSON.parse(record.value) as T;
}
