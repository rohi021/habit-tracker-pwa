import { z } from 'zod';

// ─── Shared ───
export const IdSchema = z.string().min(1);
export const ISODateSchema = z.string().datetime({ offset: true }).or(z.string().min(10));

// ─── Subject ───
export const SubjectSchema = z.object({
  id: IdSchema,
  name: z.string().min(1),
  color: z.string().default('#6366f1'),
  icon: z.string().default('📘'),
  weeklyGoalHours: z.number().min(0).default(0),
});
export type Subject = z.infer<typeof SubjectSchema>;

// ─── Study Session ───
export const StudySessionSchema = z.object({
  id: IdSchema,
  subject: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  duration: z.number().min(0),
  notes: z.string().default(''),
  date: z.string(),
  type: z.enum(['regular', 'pomodoro']).default('regular'),
});
export type StudySession = z.infer<typeof StudySessionSchema>;

// ─── Assignment / Exam ───
export const AssignmentSchema = z.object({
  id: IdSchema,
  title: z.string().min(1),
  subject: z.string(),
  dueDate: z.string(),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
  status: z.enum(['pending', 'in-progress', 'completed', 'overdue']).default('pending'),
  grade: z.string().optional(),
  type: z.enum(['assignment', 'exam']).default('assignment'),
  prepProgress: z.number().min(0).max(100).default(0),
  progress: z.number().min(0).max(100).default(0),
  topics: z.array(z.object({ text: z.string(), done: z.boolean() })).default([]),
  notes: z.string().default(''),
  createdAt: z.string(),
});
export type Assignment = z.infer<typeof AssignmentSchema>;

// ─── Expense ───
export const ExpenseSchema = z.object({
  id: IdSchema,
  amount: z.number().min(0),
  category: z.string(),
  description: z.string().default(''),
  date: z.string(),
});
export type Expense = z.infer<typeof ExpenseSchema>;

// ─── Sleep Log ───
export const SleepLogSchema = z.object({
  id: IdSchema,
  date: z.string(),
  bedtime: z.string(),
  wakeTime: z.string(),
  hours: z.number().min(0).max(24),
  quality: z.number().min(1).max(5).default(3),
});
export type SleepLog = z.infer<typeof SleepLogSchema>;

// ─── Exercise Log ───
export const ExerciseLogSchema = z.object({
  id: IdSchema,
  date: z.string(),
  type: z.string(),
  duration: z.number().min(0),
  notes: z.string().default(''),
});
export type ExerciseLog = z.infer<typeof ExerciseLogSchema>;

// ─── Mood Log ───
export const MoodEntrySchema = z.object({
  mood: z.enum(['veryHappy', 'happy', 'neutral', 'sad', 'verySad']),
  energy: z.number().min(1).max(5).default(3),
  note: z.string().default(''),
});
export type MoodEntry = z.infer<typeof MoodEntrySchema>;

// ─── Goal ───
export const GoalSchema = z.object({
  id: IdSchema,
  title: z.string().min(1),
  description: z.string().default(''),
  category: z.string().default('Academic'),
  targetDate: z.string(),
  milestones: z.array(z.object({ text: z.string(), done: z.boolean() })).default([]),
  createdAt: z.string(),
});
export type Goal = z.infer<typeof GoalSchema>;

// ─── Timetable Entry ───
export const TimetableEntrySchema = z.object({
  id: IdSchema,
  subject: z.string(),
  day: z.number().min(0).max(6),
  startTime: z.string(),
  endTime: z.string(),
  room: z.string().default(''),
  color: z.string().default('#6366f1'),
  notes: z.string().default(''),
});
export type TimetableEntry = z.infer<typeof TimetableEntrySchema>;

// ─── Journal Entry ───
export const JournalEntrySchema = z.object({
  id: IdSchema,
  date: z.string(),
  content: z.string(),
  mood: z.string().default('neutral'),
  energy: z.number().min(1).max(5).default(3),
  gratitude: z.string().default(''),
  tags: z.array(z.string()).default([]),
  wordCount: z.number().min(0).default(0),
});
export type JournalEntry = z.infer<typeof JournalEntrySchema>;

// ─── Research Entry ───
export const ResearchEntrySchema = z.object({
  id: IdSchema,
  date: z.string(),
  type: z.enum(['paper', 'experiment', 'model', 'deployment', 'insight', 'bugfix']),
  title: z.string(),
  notes: z.string().default(''),
  duration: z.number().min(0).default(0),
  domain: z.string().default('research'),
});
export type ResearchEntry = z.infer<typeof ResearchEntrySchema>;

// ─── Habit ───
export const HabitSchema = z.object({
  id: IdSchema,
  name: z.string().min(1),
  emoji: z.string().default('✅'),
  category: z.string().default('Productivity'),
  frequency: z.enum(['daily', 'weekly']).default('daily'),
  completedDates: z.record(z.boolean()).default({}),
  streak: z.number().min(0).default(0),
  bestStreak: z.number().min(0).default(0),
  createdAt: z.string(),
  archived: z.boolean().default(false),
});
export type Habit = z.infer<typeof HabitSchema>;

// ─── Grade Assessment ───
export const AssessmentSchema = z.object({
  id: IdSchema,
  name: z.string(),
  type: z.string(),
  componentWeight: z.number(),
  weight: z.number().default(1),
  score: z.number().min(0),
  maxScore: z.number().min(1),
});
export type Assessment = z.infer<typeof AssessmentSchema>;

export const CourseSchema = z.object({
  id: IdSchema,
  name: z.string(),
  creditHours: z.number().min(0).default(3),
  assessments: z.array(AssessmentSchema).default([]),
});
export type Course = z.infer<typeof CourseSchema>;

export const SemesterSchema = z.object({
  id: IdSchema,
  name: z.string(),
  courses: z.array(CourseSchema).default([]),
});
export type Semester = z.infer<typeof SemesterSchema>;

// ─── Notification ───
export const NotificationSchema = z.object({
  id: IdSchema,
  type: z.string(),
  title: z.string(),
  message: z.string(),
  read: z.boolean().default(false),
  createdAt: z.string(),
});
export type AppNotification = z.infer<typeof NotificationSchema>;

// ─── Settings ───
export const SettingsSchema = z.object({
  theme: z.enum(['dark', 'light', 'system']).default('dark'),
  soundEnabled: z.boolean().default(true),
  hapticEnabled: z.boolean().default(true),
  reminderTime: z.string().default('21:00'),
  weekStartsOn: z.number().min(0).max(6).default(0),
  currency: z.string().default('₹'),
  timeFormat: z.enum(['12h', '24h']).default('12h'),
  pomodoroStudy: z.number().default(25),
  pomodoroShortBreak: z.number().default(5),
  pomodoroLongBreak: z.number().default(15),
  pomodoroCycles: z.number().default(4),
  studyReminderEnabled: z.boolean().default(true),
  dailyStudyGoal: z.number().default(120),
  weeklyStudyGoal: z.number().default(600),
  monthlyBudget: z.number().default(5000),
  waterGoal: z.number().default(8),
  sleepGoal: z.number().default(8),
  journalReminderEnabled: z.boolean().default(true),
  reducedMotion: z.boolean().default(false),
});
export type Settings = z.infer<typeof SettingsSchema>;

// ─── Full App State for export/import ───
export const AppDataSchema = z.object({
  subjects: z.array(SubjectSchema).default([]),
  studySessions: z.array(StudySessionSchema).default([]),
  assignments: z.array(AssignmentSchema).default([]),
  expenses: z.array(ExpenseSchema).default([]),
  sleepLog: z.array(SleepLogSchema).default([]),
  exerciseLog: z.array(ExerciseLogSchema).default([]),
  moodLog: z.record(MoodEntrySchema).default({}),
  waterLog: z.record(z.number()).default({}),
  goals: z.array(GoalSchema).default([]),
  timetable: z.array(TimetableEntrySchema).default([]),
  journalEntries: z.array(JournalEntrySchema).default([]),
  researchLog: z.array(ResearchEntrySchema).default([]),
  habits: z.record(HabitSchema).default({}),
  habitOrder: z.array(z.string()).default([]),
  grades: z.object({ semesters: z.array(SemesterSchema).default([]) }).default({ semesters: [] }),
  notifications: z.array(NotificationSchema).default([]),
  settings: SettingsSchema.default({}),
  gamification: z.object({
    xp: z.number().default(0),
    level: z.number().default(1),
    achievements: z.array(z.string()).default([]),
    streakFreezes: z.number().default(2),
    totalPoints: z.number().default(0),
  }).default({ xp: 0, level: 1, achievements: [], streakFreezes: 2, totalPoints: 0 }),
  _version: z.string().default('4.0.0'),
});
export type AppData = z.infer<typeof AppDataSchema>;
