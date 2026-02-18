/**
 * @fileoverview State management — initial state, action types, and reducer.
 * Pure functions — no side effects, no DOM access.
 * @module state
 */

import { CONFIG } from './config.js';
import { DateUtils } from './dateUtils.js';

// ---------------------------------------------------------------------------
// Initial State
// ---------------------------------------------------------------------------

/**
 * @typedef {Object} AppState
 * @property {Object<string, Object>} habits
 * @property {string[]} habitOrder
 * @property {string} view
 * @property {string|null} selectedHabit
 * @property {boolean} isLoading
 * @property {Object} focusMode
 * @property {Array} studySessions
 * @property {Object} studyGoal
 * @property {Array} subjects
 * @property {Object|null} activeStudySession
 * @property {Object} flashcards
 * @property {Array} topics
 * @property {Array} assignments
 * @property {Array} expenses
 * @property {number} monthlyBudget
 * @property {string[]} expenseCategories
 * @property {Array} sleepLog
 * @property {Object<string, number>} waterLog
 * @property {Array} exerciseLog
 * @property {Object<string, Object>} moodLog
 * @property {number} waterGoal
 * @property {number} sleepGoal
 * @property {Array} goals
 * @property {string[]} goalCategories
 * @property {Array} timetable
 * @property {Array} journalEntries
 * @property {Array} researchLog
 * @property {Object<string, number>} skillXP
 * @property {Array} researchMilestones
 * @property {number} streakFreezes
 * @property {number} totalPoints
 * @property {number} xp
 * @property {number} level
 * @property {string[]} achievements
 * @property {Array} dailyChallenges
 * @property {Object} grades
 * @property {Object} grading
 * @property {Array} notifications
 * @property {Object} settings
 * @property {Array} undoStack
 * @property {Array} redoStack
 * @property {string|null} lastSyncedAt
 * @property {string} _version
 * @property {string} _lastSaved
 * @property {string} appVersion
 * @property {Object} wellnessInsights
 * @property {Object} routines
 * @property {Object} cycle
 */

/**
 * Create a fresh initial state object.
 * @returns {AppState}
 */
export const createInitialState = () => ({
    // Core data - Habits (existing)
    habits: {},
    habitOrder: [],
    
    // UI state
    view: 'dashboard',
    selectedHabit: null,
    isLoading: true,
    
    // Focus mode (enhanced - supports deep work)
    focusMode: {
        active: false,
        habitId: null,
        startTime: null,
        duration: 25 * 60, // 25 minutes default
        mode: 'off', // 'off' | 'deepWork' | 'studyOnly'
        endsAt: null,
        silenceNotifications: true,
        hideTabs: ['analytics', 'journal', 'expenses', 'settings']
    },
    
    // ===== NEW: Study Session Tracker =====
    studySessions: [], // { id, subject, startTime, endTime, duration, notes, date, type: 'regular'|'pomodoro' }
    studyGoal: { daily: 120, weekly: 600 }, // minutes
    subjects: [], // User-created subject list - SINGLE SOURCE OF TRUTH
    activeStudySession: null, // { subject, startTime, type, pomodoroCount, breakStartTime, topicId }
    
    // ===== Flashcards (Spaced Repetition) =====
    flashcards: {
        decks: [], // [{ id, subjectId, name, createdAt, settings: { newPerDay, reviewPerDay, learningStepsMins, easeFactorBase } }]
        cards: [], // [{ id, deckId, subjectId, front, back, tags, topicId, createdAt, updatedAt, suspended, state, dueAt, intervalDays, easeFactor, reps, lapses, lastReviewedAt }]
        reviews: [], // [{ id, cardId, deckId, subjectId, reviewedAt, grade, timeMs }]
        ui: { activeDeckId: null }
    },
    
    // ===== Topics (per-subject chapters/units) =====
    topics: [], // [{ id, subjectId, title, notes, order, plannedHours, progress, createdAt, updatedAt }]
    
    // ===== NEW: Assignments & Exams =====
    assignments: [], // { id, title, subject, dueDate, priority, status, grade, type: 'assignment'|'exam', prepProgress, topics, createdAt }
    
    // ===== NEW: Expenses =====
    expenses: [], // { id, amount, category, description, date }
    monthlyBudget: 5000,
    expenseCategories: ['Food', 'Transport', 'Books', 'Entertainment', 'Subscriptions', 'Health', 'Other'],
    
    // ===== NEW: Sleep & Wellness =====
    sleepLog: [], // { id, date, bedtime, wakeTime, hours, quality }
    waterLog: {}, // { [dateKey]: glasses }
    exerciseLog: [], // { id, date, type, duration, notes }
    moodLog: {}, // { [dateKey]: { mood, energy, note } }
    waterGoal: 8, // glasses per day
    sleepGoal: 8, // hours per night
    
    // ===== NEW: Goals with Milestones =====
    goals: [], // { id, title, description, category, targetDate, milestones: [{text, done}], createdAt }
    goalCategories: ['Academic', 'Health', 'Financial', 'Personal', 'Career'],
    
    // ===== NEW: Timetable =====
    timetable: [], // { id, subject, day, startTime, endTime, room, color, notes }
    
    // ===== NEW: Journal =====
    journalEntries: [], // { id, date, content, mood, energy, gratitude, tags, wordCount }
    
    // ===== Research Intelligence Layer =====
    researchLog: [], // { id, date, type: 'paper'|'experiment'|'model'|'deployment'|'insight'|'bugfix', title, notes, duration }
    
    // ===== Skill Trees =====
    skillXP: { ml: 0, robotics: 0, systems: 0, leadership: 0, research: 0, engineering: 0 },
    researchMilestones: [], // { id, title, domain, completedAt }
    
    // ===== Gamification (Enhanced) =====
    streakFreezes: 2,
    totalPoints: 0,
    xp: 0,
    level: 1,
    achievements: [], // earned achievement IDs
    dailyChallenges: [], // { id, text, type, target, progress, completed, date, xpReward }
    
    // ===== Grade Tracker =====
    grades: {
        semesters: [] // { id, name, courses: [{ id, name, creditHours, assessments: [{ id, name, type, componentWeight, weight, score, maxScore }] }] }
    },
    
    // ===== Grading Schemes & Templates =====
    grading: {
        activeSchemeId: 'default-india-10',
        schemes: [
            {
                id: 'default-india-10',
                name: 'India 10-point (default)',
                scaleMax: 10,
                rounding: { mode: 'fixed', decimals: 2 },
                boundaries: [
                    { minPercent: 90, gpa: 10, letter: 'O', label: 'Excellent' },
                    { minPercent: 80, gpa: 9,  letter: 'A+', label: 'Very Good' },
                    { minPercent: 70, gpa: 8,  letter: 'A',  label: 'Good' },
                    { minPercent: 60, gpa: 7,  letter: 'B+', label: 'Above Avg' },
                    { minPercent: 50, gpa: 6,  letter: 'B',  label: 'Avg' },
                    { minPercent: 40, gpa: 5,  letter: 'C',  label: 'Pass' },
                    { minPercent: 0,  gpa: 0,  letter: 'F',  label: 'Fail' }
                ]
            }
        ],
        templates: [
            {
                id: 'template-default',
                name: 'Default Components',
                components: [
                    { key: 'ct1', name: 'Class Test 1', type: 'Class Test', weight: 10 },
                    { key: 'ct2', name: 'Class Test 2', type: 'Class Test', weight: 10 },
                    { key: 'a1',  name: 'Assignment 1', type: 'Assignment', weight: 5 },
                    { key: 'a2',  name: 'Assignment 2', type: 'Assignment', weight: 5 },
                    { key: 'mid', name: 'Mid Semester', type: 'Mid Semester', weight: 30 },
                    { key: 'end', name: 'End Semester', type: 'End Semester', weight: 40 },
                    { key: 'att', name: 'Attendance',   type: 'Attendance', weight: 0 }
                ]
            }
        ]
    },
    
    // ===== Notifications =====
    notifications: [], // { id, type, title, message, read, createdAt, actionLink: { tab, subTab } }
    
    // Settings (Enhanced)
    settings: {
        theme: 'dark',
        soundEnabled: true,
        hapticEnabled: true,
        reminderTime: '21:00',
        weekStartsOn: 0, // 0 = Sunday
        currency: '₹',
        timeFormat: '12h',
        pomodoroStudy: 25,
        pomodoroShortBreak: 5,
        pomodoroLongBreak: 15,
        pomodoroCycles: 4,
        studyReminderEnabled: true,
        dailyStudyGoal: 120, // minutes
        weeklyStudyGoal: 600,
        monthlyBudget: 5000,
        waterGoal: 8,
        sleepGoal: 8,
        journalReminderEnabled: true
    },
    
    // Undo/Redo
    undoStack: [],
    redoStack: [],
    
    // Meta
    lastSyncedAt: null,
    _version: '3.0.0',
    _lastSaved: new Date().toISOString(),
    appVersion: '3.0.0',
    
    // ===== Wellness Insights =====
    wellnessInsights: {
        rulesEnabled: true,
        thresholds: {
            weeklySleepDebtHours: 5,
            burnoutRisingDelta: 0.12,
            studyLoadIncreasePct: 25,
            consecutiveLowMoodDays: 3
        },
        lastEvaluatedAt: null,
        dismissed: {}
    },
    
    // ===== Routines =====
    routines: {
        items: [],
        routineOrder: [],
        completions: {}
    },
    
    // ===== Cycle Tracking (optional) =====
    cycle: {
        enabled: false,
        settings: {
            averageCycleLength: 28,
            averagePeriodLength: 5,
            lutealLength: 14,
            remindersEnabled: false
        },
        periods: [],
        symptoms: {}
    }
});

/**
 * Frozen enum of all action type strings.
 * @readonly
 * @enum {string}
 */
export const ActionTypes = Object.freeze({
    // Habit actions (existing)
    ADD_HABIT: 'ADD_HABIT',
    UPDATE_HABIT: 'UPDATE_HABIT',
    DELETE_HABIT: 'DELETE_HABIT',
    TOGGLE_HABIT: 'TOGGLE_HABIT',
    REORDER_HABITS: 'REORDER_HABITS',
    
    // Focus mode (enhanced)
    START_FOCUS: 'START_FOCUS',
    END_FOCUS: 'END_FOCUS',
    START_DEEP_WORK: 'START_DEEP_WORK',
    END_DEEP_WORK: 'END_DEEP_WORK',
    
    // Flashcards
    ADD_DECK: 'ADD_DECK',
    UPDATE_DECK: 'UPDATE_DECK',
    DELETE_DECK: 'DELETE_DECK',
    ADD_CARD: 'ADD_CARD',
    UPDATE_CARD: 'UPDATE_CARD',
    DELETE_CARD: 'DELETE_CARD',
    TOGGLE_SUSPEND_CARD: 'TOGGLE_SUSPEND_CARD',
    REVIEW_CARD: 'REVIEW_CARD',
    SET_ACTIVE_DECK: 'SET_ACTIVE_DECK',
    
    // Topics
    ADD_TOPIC: 'ADD_TOPIC',
    UPDATE_TOPIC: 'UPDATE_TOPIC',
    DELETE_TOPIC: 'DELETE_TOPIC',
    REORDER_TOPIC: 'REORDER_TOPIC',
    
    // Study Session Tracker
    START_STUDY_SESSION: 'START_STUDY_SESSION',
    END_STUDY_SESSION: 'END_STUDY_SESSION',
    DELETE_STUDY_SESSION: 'DELETE_STUDY_SESSION',
    UPDATE_STUDY_GOAL: 'UPDATE_STUDY_GOAL',
    
    // Assignments & Exams
    ADD_ASSIGNMENT: 'ADD_ASSIGNMENT',
    UPDATE_ASSIGNMENT: 'UPDATE_ASSIGNMENT',
    DELETE_ASSIGNMENT: 'DELETE_ASSIGNMENT',
    
    // Expenses
    ADD_EXPENSE: 'ADD_EXPENSE',
    UPDATE_EXPENSE: 'UPDATE_EXPENSE',
    DELETE_EXPENSE: 'DELETE_EXPENSE',
    SET_MONTHLY_BUDGET: 'SET_MONTHLY_BUDGET',
    
    // Wellness
    LOG_SLEEP: 'LOG_SLEEP',
    DELETE_SLEEP_LOG: 'DELETE_SLEEP_LOG',
    LOG_WATER: 'LOG_WATER',
    LOG_EXERCISE: 'LOG_EXERCISE',
    DELETE_EXERCISE: 'DELETE_EXERCISE',
    LOG_MOOD: 'LOG_MOOD',
    
    // Goals
    ADD_GOAL: 'ADD_GOAL',
    UPDATE_GOAL: 'UPDATE_GOAL',
    DELETE_GOAL: 'DELETE_GOAL',
    TOGGLE_MILESTONE: 'TOGGLE_MILESTONE',
    
    // Timetable
    ADD_TIMETABLE_ENTRY: 'ADD_TIMETABLE_ENTRY',
    UPDATE_TIMETABLE_ENTRY: 'UPDATE_TIMETABLE_ENTRY',
    DELETE_TIMETABLE_ENTRY: 'DELETE_TIMETABLE_ENTRY',
    
    // Journal
    ADD_JOURNAL_ENTRY: 'ADD_JOURNAL_ENTRY',
    UPDATE_JOURNAL_ENTRY: 'UPDATE_JOURNAL_ENTRY',
    DELETE_JOURNAL_ENTRY: 'DELETE_JOURNAL_ENTRY',
    
    // Research Intelligence Layer
    ADD_RESEARCH_ENTRY: 'ADD_RESEARCH_ENTRY',
    DELETE_RESEARCH_ENTRY: 'DELETE_RESEARCH_ENTRY',
    
    // Skill Trees
    ADD_SKILL_XP: 'ADD_SKILL_XP',
    ADD_RESEARCH_MILESTONE: 'ADD_RESEARCH_MILESTONE',
    
    // Gamification (Enhanced)
    USE_STREAK_FREEZE: 'USE_STREAK_FREEZE',
    ADD_POINTS: 'ADD_POINTS',
    ADD_XP: 'ADD_XP',
    EARN_ACHIEVEMENT: 'EARN_ACHIEVEMENT',
    GENERATE_DAILY_CHALLENGES: 'GENERATE_DAILY_CHALLENGES',
    COMPLETE_CHALLENGE: 'COMPLETE_CHALLENGE',
    
    // Subjects
    ADD_SUBJECT: 'ADD_SUBJECT',
    UPDATE_SUBJECT: 'UPDATE_SUBJECT',
    DELETE_SUBJECT: 'DELETE_SUBJECT',
    
    // Grades
    ADD_SEMESTER: 'ADD_SEMESTER',
    DELETE_SEMESTER: 'DELETE_SEMESTER',
    ADD_COURSE: 'ADD_COURSE',
    UPDATE_COURSE: 'UPDATE_COURSE',
    DELETE_COURSE: 'DELETE_COURSE',
    ADD_ASSESSMENT: 'ADD_ASSESSMENT',
    UPDATE_ASSESSMENT: 'UPDATE_ASSESSMENT',
    DELETE_ASSESSMENT: 'DELETE_ASSESSMENT',
    
    // Grading Schemes & Templates
    SET_ACTIVE_GRADING_SCHEME: 'SET_ACTIVE_GRADING_SCHEME',
    ADD_GRADING_SCHEME: 'ADD_GRADING_SCHEME',
    UPDATE_GRADING_SCHEME: 'UPDATE_GRADING_SCHEME',
    DELETE_GRADING_SCHEME: 'DELETE_GRADING_SCHEME',
    ADD_GRADE_TEMPLATE: 'ADD_GRADE_TEMPLATE',
    UPDATE_GRADE_TEMPLATE: 'UPDATE_GRADE_TEMPLATE',
    DELETE_GRADE_TEMPLATE: 'DELETE_GRADE_TEMPLATE',
    
    // Notifications
    ADD_NOTIFICATION: 'ADD_NOTIFICATION',
    MARK_NOTIFICATION_READ: 'MARK_NOTIFICATION_READ',
    CLEAR_NOTIFICATIONS: 'CLEAR_NOTIFICATIONS',
    
    // Wellness Insights
    DISMISS_INSIGHT_ALERT: 'DISMISS_INSIGHT_ALERT',
    UPDATE_WELLNESS_INSIGHT_SETTINGS: 'UPDATE_WELLNESS_INSIGHT_SETTINGS',
    
    // Routines
    ADD_ROUTINE: 'ADD_ROUTINE',
    UPDATE_ROUTINE: 'UPDATE_ROUTINE',
    DELETE_ROUTINE: 'DELETE_ROUTINE',
    COMPLETE_ROUTINE_TODAY: 'COMPLETE_ROUTINE_TODAY',
    
    // Cycle Tracking
    UPDATE_CYCLE_SETTINGS: 'UPDATE_CYCLE_SETTINGS',
    LOG_PERIOD: 'LOG_PERIOD',
    UPDATE_PERIOD: 'UPDATE_PERIOD',
    DELETE_PERIOD: 'DELETE_PERIOD',
    LOG_CYCLE_SYMPTOMS: 'LOG_CYCLE_SYMPTOMS',
    
    // UI
    SET_VIEW: 'SET_VIEW',
    SET_SELECTED_HABIT: 'SET_SELECTED_HABIT',
    SET_LOADING: 'SET_LOADING',
    
    // Settings
    UPDATE_SETTINGS: 'UPDATE_SETTINGS',
    
    // Undo/Redo
    UNDO: 'UNDO',
    REDO: 'REDO',
    
    // Persistence
    LOAD_STATE: 'LOAD_STATE',
    RESET_STATE: 'RESET_STATE'
});

/**
 * Main application reducer (pure function).
 * @param {AppState} state  - Current state
 * @param {{ type: string, payload?: * }} action
 * @returns {AppState} New state
 */
export function appReducer(state, action) {
    const { type, payload } = action;
    
    // Helper to push to undo stack
    const withUndo = (newState) => ({
        ...newState,
        undoStack: [...state.undoStack.slice(-CONFIG.MAX_UNDO_STACK), {
            habits: state.habits,
            habitOrder: state.habitOrder
        }],
        redoStack: []
    });
    
    switch (type) {
        case ActionTypes.ADD_HABIT: {
            const id = crypto.randomUUID();
            const newHabit = {
                id,
                name: payload.name.trim(),
                color: payload.color || 'indigo',
                category: payload.category || 'General',
                quadrant: payload.quadrant || 'q2',
                archived: false,
                createdAt: new Date().toISOString(),
                data: {}
            };
            
            return withUndo({
                ...state,
                habits: { ...state.habits, [id]: newHabit },
                habitOrder: [...state.habitOrder, id]
            });
        }
        
        case ActionTypes.UPDATE_HABIT: {
            const { id, updates } = payload;
            if (!state.habits[id]) return state;
            
            return withUndo({
                ...state,
                habits: {
                    ...state.habits,
                    [id]: { ...state.habits[id], ...updates }
                }
            });
        }
        
        case ActionTypes.DELETE_HABIT: {
            const { id } = payload;
            const { [id]: deleted, ...remainingHabits } = state.habits;
            
            return withUndo({
                ...state,
                habits: remainingHabits,
                habitOrder: state.habitOrder.filter(hid => hid !== id)
            });
        }
        
        case ActionTypes.TOGGLE_HABIT: {
            const { id, date = DateUtils.toKey() } = payload;
            const habit = state.habits[id];
            if (!habit) return state;
            
            const wasCompleted = !!habit.data?.[date];
            const newData = { ...habit.data };
            
            if (wasCompleted) {
                delete newData[date];
            } else {
                newData[date] = true;
                
                // Celebration effect
                if (typeof confetti !== 'undefined') {
                    confetti({
                        particleCount: 50,
                        spread: 60,
                        origin: { y: 0.7 },
                        colors: [CONFIG.COLORS[habit.color]?.bg || '#6366f1', '#ffffff']
                    });
                }
            }
            
            return withUndo({
                ...state,
                habits: {
                    ...state.habits,
                    [id]: { ...habit, data: newData }
                },
                totalPoints: state.totalPoints + (wasCompleted ? -10 : 10)
            });
        }
        
        case ActionTypes.REORDER_HABITS: {
            return withUndo({
                ...state,
                habitOrder: payload.order
            });
        }
        
        case ActionTypes.START_FOCUS: {
            return {
                ...state,
                focusMode: {
                    ...state.focusMode,
                    active: true,
                    habitId: payload.habitId,
                    startTime: Date.now(),
                    duration: payload.duration || 25 * 60
                }
            };
        }
        
        case ActionTypes.END_FOCUS: {
            return {
                ...state,
                focusMode: {
                    ...state.focusMode,
                    active: false,
                    habitId: null,
                    startTime: null,
                    duration: 25 * 60,
                    mode: 'off',
                    endsAt: null
                }
            };
        }
        
        case ActionTypes.START_DEEP_WORK: {
            const durationMs = (payload.durationMinutes || 50) * 60 * 1000;
            return {
                ...state,
                focusMode: {
                    ...state.focusMode,
                    active: true,
                    mode: payload.mode || 'deepWork',
                    startTime: Date.now(),
                    endsAt: new Date(Date.now() + durationMs).toISOString(),
                    duration: (payload.durationMinutes || 50) * 60,
                    silenceNotifications: true,
                    hideTabs: payload.mode === 'studyOnly' ? ['analytics', 'journal', 'expenses', 'settings'] : ['analytics', 'journal', 'expenses', 'settings', 'matrix', 'command']
                }
            };
        }
        
        case ActionTypes.END_DEEP_WORK: {
            return {
                ...state,
                focusMode: {
                    active: false,
                    habitId: null,
                    startTime: null,
                    duration: 25 * 60,
                    mode: 'off',
                    endsAt: null,
                    silenceNotifications: true,
                    hideTabs: ['analytics', 'journal', 'expenses', 'settings']
                }
            };
        }
        
        // ===== FLASHCARDS =====
        case ActionTypes.ADD_DECK: {
            return { ...state, flashcards: { ...state.flashcards, decks: [...(state.flashcards?.decks || []), payload] } };
        }
        case ActionTypes.UPDATE_DECK: {
            return { ...state, flashcards: { ...state.flashcards, decks: (state.flashcards?.decks || []).map(d => d.id === payload.id ? { ...d, ...payload } : d) } };
        }
        case ActionTypes.DELETE_DECK: {
            return { ...state, flashcards: { ...state.flashcards, decks: (state.flashcards?.decks || []).filter(d => d.id !== payload), cards: (state.flashcards?.cards || []).filter(c => c.deckId !== payload), reviews: (state.flashcards?.reviews || []).filter(r => r.deckId !== payload) } };
        }
        case ActionTypes.ADD_CARD: {
            return { ...state, flashcards: { ...state.flashcards, cards: [...(state.flashcards?.cards || []), payload] } };
        }
        case ActionTypes.UPDATE_CARD: {
            return { ...state, flashcards: { ...state.flashcards, cards: (state.flashcards?.cards || []).map(c => c.id === payload.id ? { ...c, ...payload } : c) } };
        }
        case ActionTypes.DELETE_CARD: {
            return { ...state, flashcards: { ...state.flashcards, cards: (state.flashcards?.cards || []).filter(c => c.id !== payload) } };
        }
        case ActionTypes.TOGGLE_SUSPEND_CARD: {
            return { ...state, flashcards: { ...state.flashcards, cards: (state.flashcards?.cards || []).map(c => c.id === payload ? { ...c, suspended: !c.suspended } : c) } };
        }
        case ActionTypes.REVIEW_CARD: {
            // payload: { cardId, grade (0-3), timeMs }
            const { cardId, grade, timeMs } = payload;
            const cards = state.flashcards?.cards || [];
            const card = cards.find(c => c.id === cardId);
            if (!card) return state;
            
            const now = new Date();
            const deck = (state.flashcards?.decks || []).find(d => d.id === card.deckId);
            const learningSteps = deck?.settings?.learningStepsMins || [10, 1440]; // minutes
            let newCard = { ...card };
            
            if (card.state === 'new') {
                newCard.state = 'learning';
                newCard.reps = 0;
                newCard.dueAt = new Date(now.getTime() + learningSteps[0] * 60000).toISOString();
            } else if (card.state === 'learning') {
                if (grade <= 0) {
                    newCard.dueAt = new Date(now.getTime() + learningSteps[0] * 60000).toISOString();
                    newCard.lapses = (newCard.lapses || 0) + 1;
                } else {
                    const currentStep = learningSteps.findIndex(s => {
                        const stepDue = new Date(now.getTime() + s * 60000);
                        return card.dueAt && new Date(card.dueAt) <= stepDue;
                    });
                    const nextStep = Math.min((currentStep >= 0 ? currentStep : 0) + 1, learningSteps.length);
                    if (nextStep >= learningSteps.length || grade >= 3) {
                        newCard.state = 'review';
                        newCard.intervalDays = grade >= 3 ? 4 : 1;
                        newCard.dueAt = new Date(now.getTime() + newCard.intervalDays * 86400000).toISOString();
                    } else {
                        newCard.dueAt = new Date(now.getTime() + learningSteps[nextStep] * 60000).toISOString();
                    }
                }
            } else {
                // review state - SM-2 algorithm
                let ef = newCard.easeFactor || 2.5;
                let iv = newCard.intervalDays || 1;
                if (grade === 0) { ef = Math.max(1.3, ef - 0.2); iv = 1; newCard.lapses = (newCard.lapses || 0) + 1; }
                else if (grade === 1) { ef = Math.max(1.3, ef - 0.15); iv = Math.max(1, Math.round(iv * 1.2)); }
                else if (grade === 2) { iv = Math.max(1, Math.round(iv * ef)); }
                else { ef = ef + 0.15; iv = Math.max(1, Math.round(iv * ef * 1.3)); }
                newCard.easeFactor = ef;
                newCard.intervalDays = iv;
                newCard.dueAt = new Date(now.getTime() + iv * 86400000).toISOString();
            }
            
            newCard.reps = (newCard.reps || 0) + 1;
            newCard.lastReviewedAt = now.toISOString();
            newCard.updatedAt = now.toISOString();
            
            const review = {
                id: crypto.randomUUID(),
                cardId,
                deckId: card.deckId,
                subjectId: card.subjectId,
                reviewedAt: now.toISOString(),
                grade,
                timeMs: timeMs || 0
            };
            
            // XP: +1 per review, capped at 50/day
            const todayKey = DateUtils.toKey();
            const todayReviews = (state.flashcards?.reviews || []).filter(r => r.reviewedAt?.startsWith(todayKey)).length;
            const xpGain = todayReviews < 50 ? 1 : 0;
            
            return {
                ...state,
                flashcards: {
                    ...state.flashcards,
                    cards: cards.map(c => c.id === cardId ? newCard : c),
                    reviews: [...(state.flashcards?.reviews || []), review]
                },
                xp: (state.xp || 0) + xpGain
            };
        }
        case ActionTypes.SET_ACTIVE_DECK: {
            return { ...state, flashcards: { ...state.flashcards, ui: { ...(state.flashcards?.ui || {}), activeDeckId: payload } } };
        }
        
        // ===== TOPICS =====
        case ActionTypes.ADD_TOPIC: {
            return { ...state, topics: [...(state.topics || []), payload] };
        }
        case ActionTypes.UPDATE_TOPIC: {
            return { ...state, topics: (state.topics || []).map(t => t.id === payload.id ? { ...t, ...payload } : t) };
        }
        case ActionTypes.DELETE_TOPIC: {
            return { ...state, topics: (state.topics || []).filter(t => t.id !== payload) };
        }
        case ActionTypes.REORDER_TOPIC: {
            const { topicId: rtId, direction } = payload;
            const topicsList = [...(state.topics || [])];
            const idx = topicsList.findIndex(t => t.id === rtId);
            if (idx < 0) return state;
            const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
            if (swapIdx < 0 || swapIdx >= topicsList.length) return state;
            [topicsList[idx], topicsList[swapIdx]] = [topicsList[swapIdx], topicsList[idx]];
            return { ...state, topics: topicsList.map((t, i) => ({ ...t, order: i })) };
        }
        
        case ActionTypes.USE_STREAK_FREEZE: {
            if (state.streakFreezes <= 0) return state;
            return { ...state, streakFreezes: state.streakFreezes - 1 };
        }
        
        case ActionTypes.SET_VIEW: {
            return { ...state, view: payload };
        }
        
        case ActionTypes.SET_LOADING: {
            return { ...state, isLoading: payload };
        }
        
        case ActionTypes.UPDATE_SETTINGS: {
            return {
                ...state,
                settings: { ...state.settings, ...payload }
            };
        }
        
        case ActionTypes.UNDO: {
            if (state.undoStack.length === 0) return state;
            const previous = state.undoStack[state.undoStack.length - 1];
            
            return {
                ...state,
                habits: previous.habits,
                habitOrder: previous.habitOrder,
                undoStack: state.undoStack.slice(0, -1),
                redoStack: [{
                    habits: state.habits,
                    habitOrder: state.habitOrder
                }, ...state.redoStack]
            };
        }
        
        case ActionTypes.REDO: {
            if (state.redoStack.length === 0) return state;
            const next = state.redoStack[0];
            
            return {
                ...state,
                habits: next.habits,
                habitOrder: next.habitOrder,
                undoStack: [...state.undoStack, {
                    habits: state.habits,
                    habitOrder: state.habitOrder
                }],
                redoStack: state.redoStack.slice(1)
            };
        }
        
        // ===== STUDY SESSION ACTIONS =====
        case ActionTypes.START_STUDY_SESSION: {
            const { subject, type = 'regular' } = payload;
            return {
                ...state,
                activeStudySession: {
                    subject,
                    startTime: Date.now(),
                    type,
                    pomodoroCount: 0,
                    breakStartTime: null
                }
            };
        }
        
        case ActionTypes.END_STUDY_SESSION: {
            if (!state.activeStudySession) return state;
            
            const session = {
                id: crypto.randomUUID(),
                subject: state.activeStudySession.subject,
                startTime: state.activeStudySession.startTime,
                endTime: Date.now(),
                duration: Math.floor((Date.now() - state.activeStudySession.startTime) / 1000 / 60), // minutes
                notes: payload?.notes || '',
                date: DateUtils.toKey(),
                type: state.activeStudySession.type,
                pomodoroCount: state.activeStudySession.pomodoroCount || 0,
                topicId: state.activeStudySession.topicId || null
            };
            
            const xpEarned = Math.floor(session.duration / 5) * 2; // 2 XP per 5 minutes
            
            return {
                ...state,
                studySessions: [...state.studySessions, session],
                activeStudySession: null,
                xp: state.xp + xpEarned
            };
        }
        
        case ActionTypes.DELETE_STUDY_SESSION: {
            return {
                ...state,
                studySessions: state.studySessions.filter(s => s.id !== payload.id)
            };
        }
        
        case ActionTypes.UPDATE_STUDY_GOAL: {
            return {
                ...state,
                studyGoal: { ...state.studyGoal, ...payload }
            };
        }
        
        // ===== ASSIGNMENT ACTIONS =====
        case ActionTypes.ADD_ASSIGNMENT: {
            const assignment = {
                id: crypto.randomUUID(),
                ...payload,
                createdAt: new Date().toISOString()
            };
            return {
                ...state,
                assignments: [...state.assignments, assignment],
                xp: state.xp + 5 // XP for planning
            };
        }
        
        case ActionTypes.UPDATE_ASSIGNMENT: {
            const { id, updates } = payload;
            const updatedAssignments = state.assignments.map(a =>
                a.id === id ? { ...a, ...updates } : a
            );
            
            // Award XP for completing assignment
            const assignment = state.assignments.find(a => a.id === id);
            let xpGain = 0;
            if (assignment && updates.status === 'completed' && assignment.status !== 'completed') {
                xpGain = assignment.type === 'exam' ? 50 : 30;
            }
            
            return {
                ...state,
                assignments: updatedAssignments,
                xp: state.xp + xpGain
            };
        }
        
        case ActionTypes.DELETE_ASSIGNMENT: {
            return {
                ...state,
                assignments: state.assignments.filter(a => a.id !== payload.id)
            };
        }
        
        // ===== EXPENSE ACTIONS =====
        case ActionTypes.ADD_EXPENSE: {
            const expense = {
                id: crypto.randomUUID(),
                ...payload,
                date: payload.date || DateUtils.toKey()
            };
            return {
                ...state,
                expenses: [...state.expenses, expense],
                xp: state.xp + 2 // XP for tracking
            };
        }
        
        case ActionTypes.UPDATE_EXPENSE: {
            const { id, updates } = payload;
            return {
                ...state,
                expenses: state.expenses.map(e => e.id === id ? { ...e, ...updates } : e)
            };
        }
        
        case ActionTypes.DELETE_EXPENSE: {
            return {
                ...state,
                expenses: state.expenses.filter(e => e.id !== payload.id)
            };
        }
        
        case ActionTypes.SET_MONTHLY_BUDGET: {
            return {
                ...state,
                monthlyBudget: payload.budget,
                settings: { ...state.settings, monthlyBudget: payload.budget }
            };
        }
        
        // ===== WELLNESS ACTIONS =====
        case ActionTypes.LOG_SLEEP: {
            const sleepEntry = {
                id: crypto.randomUUID(),
                date: payload.date || DateUtils.toKey(),
                bedtime: payload.bedtime,
                wakeTime: payload.wakeTime,
                hours: payload.hours,
                quality: payload.quality
            };
            return {
                ...state,
                sleepLog: [...state.sleepLog, sleepEntry],
                xp: state.xp + 5
            };
        }
        
        case ActionTypes.DELETE_SLEEP_LOG: {
            return {
                ...state,
                sleepLog: state.sleepLog.filter(s => s.id !== payload.id)
            };
        }
        
        case ActionTypes.LOG_WATER: {
            const { date = DateUtils.toKey(), glasses } = payload;
            return {
                ...state,
                waterLog: { ...state.waterLog, [date]: glasses },
                xp: state.xp + 1
            };
        }
        
        case ActionTypes.LOG_EXERCISE: {
            const exercise = {
                id: crypto.randomUUID(),
                date: payload.date || DateUtils.toKey(),
                type: payload.type,
                duration: payload.duration,
                notes: payload.notes || ''
            };
            return {
                ...state,
                exerciseLog: [...state.exerciseLog, exercise],
                xp: state.xp + 10
            };
        }
        
        case ActionTypes.DELETE_EXERCISE: {
            return {
                ...state,
                exerciseLog: state.exerciseLog.filter(e => e.id !== payload.id)
            };
        }
        
        case ActionTypes.LOG_MOOD: {
            const { date = DateUtils.toKey(), mood, energy, note } = payload;
            return {
                ...state,
                moodLog: { ...state.moodLog, [date]: { mood, energy, note } },
                xp: state.xp + 3
            };
        }
        
        // ===== GOAL ACTIONS =====
        case ActionTypes.ADD_GOAL: {
            const goal = {
                id: crypto.randomUUID(),
                ...payload,
                milestones: payload.milestones || [],
                createdAt: new Date().toISOString()
            };
            return {
                ...state,
                goals: [...state.goals, goal],
                xp: state.xp + 15
            };
        }
        
        case ActionTypes.UPDATE_GOAL: {
            const { id, updates } = payload;
            return {
                ...state,
                goals: state.goals.map(g => g.id === id ? { ...g, ...updates } : g)
            };
        }
        
        case ActionTypes.DELETE_GOAL: {
            return {
                ...state,
                goals: state.goals.filter(g => g.id !== payload.id)
            };
        }
        
        case ActionTypes.TOGGLE_MILESTONE: {
            const { goalId, milestoneIndex } = payload;
            const updatedGoals = state.goals.map(goal => {
                if (goal.id === goalId) {
                    const newMilestones = [...goal.milestones];
                    newMilestones[milestoneIndex] = {
                        ...newMilestones[milestoneIndex],
                        done: !newMilestones[milestoneIndex].done
                    };
                    return { ...goal, milestones: newMilestones };
                }
                return goal;
            });
            return {
                ...state,
                goals: updatedGoals,
                xp: state.xp + 5
            };
        }
        
        // ===== TIMETABLE ACTIONS =====
        case ActionTypes.ADD_TIMETABLE_ENTRY: {
            const entry = {
                id: crypto.randomUUID(),
                ...payload
            };
            return {
                ...state,
                timetable: [...state.timetable, entry],
                xp: state.xp + 5
            };
        }
        
        case ActionTypes.UPDATE_TIMETABLE_ENTRY: {
            const { id, updates } = payload;
            return {
                ...state,
                timetable: state.timetable.map(t => t.id === id ? { ...t, ...updates } : t)
            };
        }
        
        case ActionTypes.DELETE_TIMETABLE_ENTRY: {
            return {
                ...state,
                timetable: state.timetable.filter(t => t.id !== payload.id)
            };
        }
        
        // ===== JOURNAL ACTIONS =====
        case ActionTypes.ADD_JOURNAL_ENTRY: {
            const entry = {
                id: crypto.randomUUID(),
                date: payload.date || DateUtils.toKey(),
                content: payload.content,
                mood: payload.mood,
                energy: payload.energy,
                gratitude: payload.gratitude || '',
                tags: payload.tags || [],
                wordCount: payload.content.trim().split(/\s+/).length
            };
            return {
                ...state,
                journalEntries: [...state.journalEntries, entry],
                xp: state.xp + 10
            };
        }
        
        case ActionTypes.UPDATE_JOURNAL_ENTRY: {
            const { id, updates } = payload;
            return {
                ...state,
                journalEntries: state.journalEntries.map(e =>
                    e.id === id ? { ...e, ...updates } : e
                )
            };
        }
        
        case ActionTypes.DELETE_JOURNAL_ENTRY: {
            return {
                ...state,
                journalEntries: state.journalEntries.filter(e => e.id !== payload.id)
            };
        }
        
        // ===== RESEARCH INTELLIGENCE ACTIONS =====
        case ActionTypes.ADD_RESEARCH_ENTRY: {
            const entry = {
                id: crypto.randomUUID(),
                date: payload.date || DateUtils.toKey(),
                type: payload.type, // paper, experiment, model, deployment, insight, bugfix
                title: payload.title,
                notes: payload.notes || '',
                duration: payload.duration || 0, // minutes
                domain: payload.domain || 'research' // skill domain
            };
            // XP rewards per research activity type (balances effort vs impact):
            // Paper reading (15), Experiment (25), Model training (35), Deployment (50), Insight (10), Bugfix (8)
            const RESEARCH_XP_REWARDS = { paper: 15, experiment: 25, model: 35, deployment: 50, insight: 10, bugfix: 8 };
            const xpGain = RESEARCH_XP_REWARDS[entry.type] || 10;
            const updatedSkillXP = { ...(state.skillXP || {}) };
            updatedSkillXP[entry.domain] = (updatedSkillXP[entry.domain] || 0) + xpGain;
            
            return {
                ...state,
                researchLog: [...(state.researchLog || []), entry],
                skillXP: updatedSkillXP,
                xp: state.xp + xpGain
            };
        }
        
        case ActionTypes.DELETE_RESEARCH_ENTRY: {
            return {
                ...state,
                researchLog: (state.researchLog || []).filter(r => r.id !== payload.id)
            };
        }
        
        case ActionTypes.ADD_SKILL_XP: {
            const { domain, amount } = payload;
            const updatedSkillXP = { ...(state.skillXP || {}) };
            updatedSkillXP[domain] = (updatedSkillXP[domain] || 0) + amount;
            return {
                ...state,
                skillXP: updatedSkillXP,
                xp: state.xp + amount
            };
        }
        
        case ActionTypes.ADD_RESEARCH_MILESTONE: {
            const milestone = {
                id: crypto.randomUUID(),
                title: payload.title,
                domain: payload.domain,
                completedAt: new Date().toISOString()
            };
            return {
                ...state,
                researchMilestones: [...(state.researchMilestones || []), milestone],
                xp: state.xp + 100
            };
        }
        
        // ===== GAMIFICATION ACTIONS =====
        case ActionTypes.ADD_XP: {
            const newXP = state.xp + payload.amount;
            const newLevel = Math.floor(Math.sqrt(newXP / 100)) + 1; // Level formula
            return {
                ...state,
                xp: newXP,
                level: Math.min(newLevel, 50) // Cap at level 50
            };
        }
        
        case ActionTypes.EARN_ACHIEVEMENT: {
            if (state.achievements.includes(payload.id)) return state;
            return {
                ...state,
                achievements: [...state.achievements, payload.id],
                xp: state.xp + (payload.xpReward || 50)
            };
        }
        
        case ActionTypes.GENERATE_DAILY_CHALLENGES: {
            // Clear old challenges if new day
            const today = DateUtils.toKey();
            const existingChallenges = state.dailyChallenges.filter(c => c.date === today);
            
            if (existingChallenges.length > 0) return state;
            
            // Deterministic selection based on day-of-year
            const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
            const poolSize = DAILY_CHALLENGE_POOL.length;
            const selected = [];
            for (let i = 0; i < 3; i++) {
                const idx = (dayOfYear * 7 + i * 13) % poolSize;
                const challenge = DAILY_CHALLENGE_POOL[idx];
                selected.push({
                    id: crypto.randomUUID(),
                    text: challenge.text,
                    type: challenge.type,
                    target: challenge.target,
                    progress: 0,
                    completed: false,
                    date: today,
                    xpReward: challenge.xp
                });
            }
            
            return {
                ...state,
                dailyChallenges: selected
            };
        }
        
        case ActionTypes.COMPLETE_CHALLENGE: {
            const { id } = payload;
            const challenge = state.dailyChallenges.find(c => c.id === id);
            if (!challenge || challenge.completed) return state;
            
            const updatedChallenges = state.dailyChallenges.map(c =>
                c.id === id ? { ...c, completed: true } : c
            );
            
            return {
                ...state,
                dailyChallenges: updatedChallenges,
                xp: state.xp + challenge.xpReward
            };
        }
        
        // ===== SUBJECT MANAGEMENT =====
        case ActionTypes.ADD_SUBJECT: {
            return {
                ...state,
                subjects: [...state.subjects, payload]
            };
        }
        
        case ActionTypes.UPDATE_SUBJECT: {
            return {
                ...state,
                subjects: state.subjects.map(s => s.id === payload.id ? { ...s, ...payload } : s)
            };
        }
        
        case ActionTypes.DELETE_SUBJECT: {
            return {
                ...state,
                subjects: state.subjects.filter(s => s.id !== payload.id)
            };
        }
        
        // ===== GRADE TRACKER =====
        case ActionTypes.ADD_SEMESTER: {
            return {
                ...state,
                grades: {
                    ...state.grades,
                    semesters: [...(state.grades?.semesters || []), payload]
                }
            };
        }
        
        case ActionTypes.DELETE_SEMESTER: {
            return {
                ...state,
                grades: {
                    ...state.grades,
                    semesters: (state.grades?.semesters || []).filter(sem => sem.id !== payload)
                }
            };
        }
        
        case ActionTypes.ADD_COURSE: {
            const { semesterId, course } = payload;
            return {
                ...state,
                grades: {
                    ...state.grades,
                    semesters: (state.grades?.semesters || []).map(sem =>
                        sem.id === semesterId
                            ? { ...sem, courses: [...(sem.courses || []), course] }
                            : sem
                    )
                }
            };
        }
        
        case ActionTypes.UPDATE_COURSE: {
            const { semesterId: uSemId, courseId: uCourseId, updates: courseUpdates } = payload;
            return {
                ...state,
                grades: {
                    ...state.grades,
                    semesters: (state.grades?.semesters || []).map(sem =>
                        sem.id === uSemId
                            ? {
                                ...sem,
                                courses: (sem.courses || []).map(c =>
                                    c.id === uCourseId ? { ...c, ...courseUpdates } : c
                                )
                            }
                            : sem
                    )
                }
            };
        }
        
        case ActionTypes.DELETE_COURSE: {
            const { semesterId: dcSemId, courseId: dcCourseId } = payload;
            return {
                ...state,
                grades: {
                    ...state.grades,
                    semesters: (state.grades?.semesters || []).map(sem =>
                        sem.id === dcSemId
                            ? { ...sem, courses: (sem.courses || []).filter(c => c.id !== dcCourseId) }
                            : sem
                    )
                }
            };
        }
        
        case ActionTypes.ADD_ASSESSMENT: {
            const { semesterId: semId, courseId, assessment } = payload;
            return {
                ...state,
                grades: {
                    ...state.grades,
                    semesters: (state.grades?.semesters || []).map(sem =>
                        sem.id === semId
                            ? {
                                ...sem,
                                courses: (sem.courses || []).map(c =>
                                    c.id === courseId
                                        ? { ...c, assessments: [...(c.assessments || []), assessment] }
                                        : c
                                )
                            }
                            : sem
                    )
                }
            };
        }
        
        case ActionTypes.UPDATE_ASSESSMENT: {
            const { semesterId: uaSemId, courseId: uaCourseId, assessmentId: uaAssId, updates: aUpdates } = payload;
            return {
                ...state,
                grades: {
                    ...state.grades,
                    semesters: (state.grades?.semesters || []).map(sem =>
                        sem.id === uaSemId
                            ? {
                                ...sem,
                                courses: (sem.courses || []).map(c =>
                                    c.id === uaCourseId
                                        ? { ...c, assessments: (c.assessments || []).map(a => a.id === uaAssId ? { ...a, ...aUpdates } : a) }
                                        : c
                                )
                            }
                            : sem
                    )
                }
            };
        }
        
        case ActionTypes.DELETE_ASSESSMENT: {
            const { semesterId: dSemId, courseId: dCourseId, assessmentId } = payload;
            return {
                ...state,
                grades: {
                    ...state.grades,
                    semesters: (state.grades?.semesters || []).map(sem =>
                        sem.id === dSemId
                            ? {
                                ...sem,
                                courses: (sem.courses || []).map(c =>
                                    c.id === dCourseId
                                        ? { ...c, assessments: (c.assessments || []).filter(a => a.id !== assessmentId) }
                                        : c
                                )
                            }
                            : sem
                    )
                }
            };
        }
        
        // ===== GRADING SCHEMES & TEMPLATES =====
        case ActionTypes.SET_ACTIVE_GRADING_SCHEME: {
            return { ...state, grading: { ...state.grading, activeSchemeId: payload } };
        }
        case ActionTypes.ADD_GRADING_SCHEME: {
            return { ...state, grading: { ...state.grading, schemes: [...(state.grading?.schemes || []), payload] } };
        }
        case ActionTypes.UPDATE_GRADING_SCHEME: {
            return { ...state, grading: { ...state.grading, schemes: (state.grading?.schemes || []).map(s => s.id === payload.id ? { ...s, ...payload } : s) } };
        }
        case ActionTypes.DELETE_GRADING_SCHEME: {
            return { ...state, grading: { ...state.grading, schemes: (state.grading?.schemes || []).filter(s => s.id !== payload) } };
        }
        case ActionTypes.ADD_GRADE_TEMPLATE: {
            return { ...state, grading: { ...state.grading, templates: [...(state.grading?.templates || []), payload] } };
        }
        case ActionTypes.UPDATE_GRADE_TEMPLATE: {
            return { ...state, grading: { ...state.grading, templates: (state.grading?.templates || []).map(t => t.id === payload.id ? { ...t, ...payload } : t) } };
        }
        case ActionTypes.DELETE_GRADE_TEMPLATE: {
            return { ...state, grading: { ...state.grading, templates: (state.grading?.templates || []).filter(t => t.id !== payload) } };
        }
        
        // ===== NOTIFICATIONS =====
        case ActionTypes.ADD_NOTIFICATION: {
            return {
                ...state,
                notifications: [payload, ...(state.notifications || [])].slice(0, 50)
            };
        }
        
        case ActionTypes.MARK_NOTIFICATION_READ: {
            return {
                ...state,
                notifications: (state.notifications || []).map(n =>
                    n.id === payload.id ? { ...n, read: true } : n
                )
            };
        }
        
        case ActionTypes.CLEAR_NOTIFICATIONS: {
            return {
                ...state,
                notifications: []
            };
        }
        
        // ===== Wellness Insights =====
        case ActionTypes.DISMISS_INSIGHT_ALERT: {
            return {
                ...state,
                wellnessInsights: {
                    ...state.wellnessInsights,
                    dismissed: {
                        ...(state.wellnessInsights?.dismissed || {}),
                        [payload.alertId]: new Date().toISOString()
                    }
                }
            };
        }
        
        case ActionTypes.UPDATE_WELLNESS_INSIGHT_SETTINGS: {
            return {
                ...state,
                wellnessInsights: {
                    ...state.wellnessInsights,
                    ...payload
                }
            };
        }
        
        // ===== Routines =====
        case ActionTypes.ADD_ROUTINE: {
            const newRoutine = {
                id: `routine-${Date.now()}`,
                name: payload.name || 'New Routine',
                icon: payload.icon || '☀️',
                habitIds: payload.habitIds || [],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            return {
                ...state,
                routines: {
                    ...state.routines,
                    items: [...(state.routines?.items || []), newRoutine],
                    routineOrder: [...(state.routines?.routineOrder || []), newRoutine.id]
                }
            };
        }
        
        case ActionTypes.UPDATE_ROUTINE: {
            return {
                ...state,
                routines: {
                    ...state.routines,
                    items: (state.routines?.items || []).map(r =>
                        r.id === payload.id ? { ...r, ...payload, updatedAt: new Date().toISOString() } : r
                    )
                }
            };
        }
        
        case ActionTypes.DELETE_ROUTINE: {
            return {
                ...state,
                routines: {
                    ...state.routines,
                    items: (state.routines?.items || []).filter(r => r.id !== payload.id),
                    routineOrder: (state.routines?.routineOrder || []).filter(id => id !== payload.id)
                }
            };
        }
        
        case ActionTypes.COMPLETE_ROUTINE_TODAY: {
            const todayKey = DateUtils.toKey();
            const routine = (state.routines?.items || []).find(r => r.id === payload.routineId);
            if (!routine) return state;
            
            // Mark all habits in routine as completed for today (atomically)
            const newHabits = { ...state.habits };
            const completedIds = [];
            let xpGain = 0;
            
            routine.habitIds.forEach(hid => {
                const habit = newHabits[hid];
                if (habit && !habit.data?.[todayKey]) {
                    newHabits[hid] = {
                        ...habit,
                        data: { ...habit.data, [todayKey]: true }
                    };
                    completedIds.push(hid);
                    xpGain += 10;
                }
            });
            
            const todayCompletions = state.routines?.completions?.[todayKey] || {};
            const existingCompletion = todayCompletions[payload.routineId];
            
            return withUndo({
                ...state,
                habits: newHabits,
                totalPoints: state.totalPoints + xpGain,
                routines: {
                    ...state.routines,
                    completions: {
                        ...(state.routines?.completions || {}),
                        [todayKey]: {
                            ...todayCompletions,
                            [payload.routineId]: {
                                completedAt: new Date().toISOString(),
                                habitIdsCompleted: [...new Set([
                                    ...(existingCompletion?.habitIdsCompleted || []),
                                    ...completedIds
                                ])]
                            }
                        }
                    }
                }
            });
        }
        
        // ===== Cycle Tracking =====
        case ActionTypes.UPDATE_CYCLE_SETTINGS: {
            return {
                ...state,
                cycle: {
                    ...state.cycle,
                    ...payload
                }
            };
        }
        
        case ActionTypes.LOG_PERIOD: {
            const newPeriod = {
                id: `period-${Date.now()}`,
                startDate: payload.startDate,
                endDate: payload.endDate || null,
                flow: payload.flow || null,
                notes: payload.notes || ''
            };
            return {
                ...state,
                cycle: {
                    ...state.cycle,
                    periods: [...(state.cycle?.periods || []), newPeriod]
                }
            };
        }
        
        case ActionTypes.UPDATE_PERIOD: {
            return {
                ...state,
                cycle: {
                    ...state.cycle,
                    periods: (state.cycle?.periods || []).map(p =>
                        p.id === payload.id ? { ...p, ...payload } : p
                    )
                }
            };
        }
        
        case ActionTypes.DELETE_PERIOD: {
            return {
                ...state,
                cycle: {
                    ...state.cycle,
                    periods: (state.cycle?.periods || []).filter(p => p.id !== payload.id)
                }
            };
        }
        
        case ActionTypes.LOG_CYCLE_SYMPTOMS: {
            const dateKey = payload.date || DateUtils.toKey();
            return {
                ...state,
                cycle: {
                    ...state.cycle,
                    symptoms: {
                        ...(state.cycle?.symptoms || {}),
                        [dateKey]: { ...(state.cycle?.symptoms?.[dateKey] || {}), ...payload.symptoms }
                    }
                }
            };
        }
        
        case ActionTypes.LOAD_STATE: {
            return {
                ...state,
                ...payload,
                isLoading: false
            };
        }
        
        case ActionTypes.RESET_STATE: {
            return createInitialState();
        }
        
        default:
            return state;
    }
}

