import { create } from 'zustand';
import { db, setKV, getKV } from '../db/db';
import type {
  Subject,
  StudySession,
  Assignment,
  Expense,
  SleepLog,
  ExerciseLog,
  MoodEntry,
  Goal,
  TimetableEntry,
  JournalEntry,
  ResearchEntry,
  Settings,
  AppNotification,
} from '../schemas/app.schema';
import { SettingsSchema } from '../schemas/app.schema';

// ─── Gamification state ───
interface Gamification {
  xp: number;
  level: number;
  achievements: string[];
  streakFreezes: number;
  totalPoints: number;
}

// ─── Grades state ───
interface GradesState {
  semesters: Array<{
    id: string;
    name: string;
    courses: Array<{
      id: string;
      name: string;
      creditHours: number;
      assessments: Array<{
        id: string;
        name: string;
        type: string;
        componentWeight: number;
        weight: number;
        score: number;
        maxScore: number;
      }>;
    }>;
  }>;
}

export interface AppState {
  // ─── Data ───
  subjects: Subject[];
  studySessions: StudySession[];
  assignments: Assignment[];
  expenses: Expense[];
  sleepLog: SleepLog[];
  exerciseLog: ExerciseLog[];
  moodLog: Record<string, MoodEntry>;
  waterLog: Record<string, number>;
  goals: Goal[];
  timetable: TimetableEntry[];
  journalEntries: JournalEntry[];
  researchLog: ResearchEntry[];
  notifications: AppNotification[];
  grades: GradesState;
  gamification: Gamification;
  settings: Settings;

  // ─── UI ───
  isLoading: boolean;
  migrationLogs: Array<{ step: string; status: string; details?: string }> | null;

  // ─── Actions ───
  loadAll: () => Promise<void>;
  setMigrationLogs: (logs: Array<{ step: string; status: string; details?: string }> | null) => void;

  // Subjects
  addSubject: (subject: Subject) => Promise<void>;
  updateSubject: (subject: Subject) => Promise<void>;
  deleteSubject: (id: string) => Promise<void>;

  // Study
  addStudySession: (session: StudySession) => Promise<void>;
  deleteStudySession: (id: string) => Promise<void>;

  // Assignments
  addAssignment: (assignment: Assignment) => Promise<void>;
  updateAssignment: (assignment: Assignment) => Promise<void>;
  deleteAssignment: (id: string) => Promise<void>;

  // Expenses
  addExpense: (expense: Expense) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;

  // Timetable
  addTimetableEntry: (entry: TimetableEntry) => Promise<void>;
  updateTimetableEntry: (entry: TimetableEntry) => Promise<void>;
  deleteTimetableEntry: (id: string) => Promise<void>;

  // Wellness
  addSleepLog: (log: SleepLog) => Promise<void>;
  deleteSleepLog: (id: string) => Promise<void>;
  logWater: (dateKey: string, glasses: number) => Promise<void>;
  logMood: (dateKey: string, entry: MoodEntry) => Promise<void>;
  addExercise: (log: ExerciseLog) => Promise<void>;
  deleteExercise: (id: string) => Promise<void>;

  // Journal
  addJournalEntry: (entry: JournalEntry) => Promise<void>;
  updateJournalEntry: (entry: JournalEntry) => Promise<void>;
  deleteJournalEntry: (id: string) => Promise<void>;

  // Goals
  addGoal: (goal: Goal) => Promise<void>;
  updateGoal: (goal: Goal) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;

  // Research
  addResearchEntry: (entry: ResearchEntry) => Promise<void>;
  deleteResearchEntry: (id: string) => Promise<void>;

  // Notifications
  addNotification: (n: AppNotification) => Promise<void>;
  markNotificationRead: (id: string) => Promise<void>;
  clearNotifications: () => Promise<void>;

  // Grades
  setGrades: (grades: GradesState) => Promise<void>;

  // Gamification
  addXP: (amount: number) => Promise<void>;

  // Settings
  updateSettings: (partial: Partial<Settings>) => Promise<void>;
}

export const useAppStore = create<AppState>((set, get) => ({
  // ─── Initial data ───
  subjects: [],
  studySessions: [],
  assignments: [],
  expenses: [],
  sleepLog: [],
  exerciseLog: [],
  moodLog: {},
  waterLog: {},
  goals: [],
  timetable: [],
  journalEntries: [],
  researchLog: [],
  notifications: [],
  grades: { semesters: [] },
  gamification: { xp: 0, level: 1, achievements: [], streakFreezes: 2, totalPoints: 0 },
  settings: SettingsSchema.parse({}),
  isLoading: true,
  migrationLogs: null,

  // ─── Load all data from IndexedDB ───
  loadAll: async () => {
    try {
      const [
        subjects, studySessions, assignments, expenses, sleepLog, exerciseLog,
        goals, timetable, journalEntries, researchLog, notifications,
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
        db.notifications.toArray(),
      ]);

      const settings = await getKV<Settings>('settings');
      const grades = await getKV<GradesState>('grades');
      const gamification = await getKV<Gamification>('gamification');
      const moodLog = await getKV<Record<string, MoodEntry>>('moodLog');
      const waterLog = await getKV<Record<string, number>>('waterLog');

      set({
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
        notifications,
        settings: settings ? SettingsSchema.parse(settings) : SettingsSchema.parse({}),
        grades: grades ?? { semesters: [] },
        gamification: gamification ?? { xp: 0, level: 1, achievements: [], streakFreezes: 2, totalPoints: 0 },
        moodLog: moodLog ?? {},
        waterLog: waterLog ?? {},
        isLoading: false,
      });
    } catch {
      set({ isLoading: false });
    }
  },

  setMigrationLogs: (logs) => set({ migrationLogs: logs }),

  // ─── Subjects ───
  addSubject: async (subject) => {
    await db.subjects.put(subject);
    set((s) => ({ subjects: [...s.subjects, subject] }));
  },
  updateSubject: async (subject) => {
    await db.subjects.put(subject);
    set((s) => ({ subjects: s.subjects.map((sub) => (sub.id === subject.id ? subject : sub)) }));
  },
  deleteSubject: async (id) => {
    await db.subjects.delete(id);
    set((s) => ({ subjects: s.subjects.filter((sub) => sub.id !== id) }));
  },

  // ─── Study Sessions ───
  addStudySession: async (session) => {
    await db.studySessions.put(session);
    set((s) => ({ studySessions: [...s.studySessions, session] }));
  },
  deleteStudySession: async (id) => {
    await db.studySessions.delete(id);
    set((s) => ({ studySessions: s.studySessions.filter((ss) => ss.id !== id) }));
  },

  // ─── Assignments ───
  addAssignment: async (assignment) => {
    await db.assignments.put(assignment);
    set((s) => ({ assignments: [...s.assignments, assignment] }));
  },
  updateAssignment: async (assignment) => {
    await db.assignments.put(assignment);
    set((s) => ({ assignments: s.assignments.map((a) => (a.id === assignment.id ? assignment : a)) }));
  },
  deleteAssignment: async (id) => {
    await db.assignments.delete(id);
    set((s) => ({ assignments: s.assignments.filter((a) => a.id !== id) }));
  },

  // ─── Expenses ───
  addExpense: async (expense) => {
    await db.expenses.put(expense);
    set((s) => ({ expenses: [...s.expenses, expense] }));
  },
  deleteExpense: async (id) => {
    await db.expenses.delete(id);
    set((s) => ({ expenses: s.expenses.filter((e) => e.id !== id) }));
  },

  // ─── Timetable ───
  addTimetableEntry: async (entry) => {
    await db.timetable.put(entry);
    set((s) => ({ timetable: [...s.timetable, entry] }));
  },
  updateTimetableEntry: async (entry) => {
    await db.timetable.put(entry);
    set((s) => ({ timetable: s.timetable.map((t) => (t.id === entry.id ? entry : t)) }));
  },
  deleteTimetableEntry: async (id) => {
    await db.timetable.delete(id);
    set((s) => ({ timetable: s.timetable.filter((t) => t.id !== id) }));
  },

  // ─── Wellness ───
  addSleepLog: async (log) => {
    await db.sleepLog.put(log);
    set((s) => ({ sleepLog: [...s.sleepLog, log] }));
  },
  deleteSleepLog: async (id) => {
    await db.sleepLog.delete(id);
    set((s) => ({ sleepLog: s.sleepLog.filter((l) => l.id !== id) }));
  },
  logWater: async (dateKey, glasses) => {
    const waterLog = { ...get().waterLog, [dateKey]: glasses };
    await setKV('waterLog', waterLog);
    set({ waterLog });
  },
  logMood: async (dateKey, entry) => {
    const moodLog = { ...get().moodLog, [dateKey]: entry };
    await setKV('moodLog', moodLog);
    set({ moodLog });
  },
  addExercise: async (log) => {
    await db.exerciseLog.put(log);
    set((s) => ({ exerciseLog: [...s.exerciseLog, log] }));
  },
  deleteExercise: async (id) => {
    await db.exerciseLog.delete(id);
    set((s) => ({ exerciseLog: s.exerciseLog.filter((e) => e.id !== id) }));
  },

  // ─── Journal ───
  addJournalEntry: async (entry) => {
    await db.journalEntries.put(entry);
    set((s) => ({ journalEntries: [...s.journalEntries, entry] }));
  },
  updateJournalEntry: async (entry) => {
    await db.journalEntries.put(entry);
    set((s) => ({ journalEntries: s.journalEntries.map((j) => (j.id === entry.id ? entry : j)) }));
  },
  deleteJournalEntry: async (id) => {
    await db.journalEntries.delete(id);
    set((s) => ({ journalEntries: s.journalEntries.filter((j) => j.id !== id) }));
  },

  // ─── Goals ───
  addGoal: async (goal) => {
    await db.goals.put(goal);
    set((s) => ({ goals: [...s.goals, goal] }));
  },
  updateGoal: async (goal) => {
    await db.goals.put(goal);
    set((s) => ({ goals: s.goals.map((g) => (g.id === goal.id ? goal : g)) }));
  },
  deleteGoal: async (id) => {
    await db.goals.delete(id);
    set((s) => ({ goals: s.goals.filter((g) => g.id !== id) }));
  },

  // ─── Research ───
  addResearchEntry: async (entry) => {
    await db.researchLog.put(entry);
    set((s) => ({ researchLog: [...s.researchLog, entry] }));
  },
  deleteResearchEntry: async (id) => {
    await db.researchLog.delete(id);
    set((s) => ({ researchLog: s.researchLog.filter((r) => r.id !== id) }));
  },

  // ─── Notifications ───
  addNotification: async (n) => {
    await db.notifications.put(n);
    set((s) => ({ notifications: [...s.notifications, n] }));
  },
  markNotificationRead: async (id) => {
    const n = await db.notifications.get(id);
    if (n) {
      const updated = { ...n, read: true };
      await db.notifications.put(updated);
      set((s) => ({ notifications: s.notifications.map((x) => (x.id === id ? { ...x, read: true } : x)) }));
    }
  },
  clearNotifications: async () => {
    await db.notifications.clear();
    set({ notifications: [] });
  },

  // ─── Grades ───
  setGrades: async (grades) => {
    await setKV('grades', grades);
    set({ grades });
  },

  // ─── Gamification ───
  addXP: async (amount) => {
    const g = get().gamification;
    const newXP = g.xp + amount;
    const newLevel = Math.min(50, Math.floor(Math.sqrt(newXP / 100)) + 1);
    const updated = { ...g, xp: newXP, level: newLevel, totalPoints: g.totalPoints + amount };
    await setKV('gamification', updated);
    set({ gamification: updated });
  },

  // ─── Settings ───
  updateSettings: async (partial) => {
    const current = get().settings;
    const updated = SettingsSchema.parse({ ...current, ...partial });
    await setKV('settings', updated);
    set({ settings: updated });
  },
}));
