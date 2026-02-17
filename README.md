<div align="center">

# 🎓 StudentOS v3.0

### The Complete Student Life Management Platform

> A production-grade Progressive Web App for managing every aspect of student life — study sessions, grades, assignments, finances, wellness, goals, and more — all in a single offline-capable application.

[![Version](https://img.shields.io/badge/version-3.0.0-blue?style=for-the-badge)](https://github.com/rohi021/habit-tracker-pwa)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![PWA](https://img.shields.io/badge/PWA-enabled-5A0FC8?style=for-the-badge&logo=pwa&logoColor=white)](https://web.dev/progressive-web-apps/)
[![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)](LICENSE)
[![Lines of Code](https://img.shields.io/badge/Lines%20of%20Code-8900+-orange?style=for-the-badge)]()
[![No Backend](https://img.shields.io/badge/Backend-None%20Required-red?style=for-the-badge)]()

</div>

---

## 📖 Table of Contents

- [Overview](#-overview)
- [What's New in v3.0](#-whats-new-in-v30)
- [Features](#-features)
  - [Study Session Tracker](#-study-session-tracker)
  - [Assignment & Exam Manager](#-assignment--exam-manager)
  - [Grade Tracker & GPA](#-grade-tracker--gpa)
  - [Timetable & Scheduling](#-timetable--scheduling)
  - [Expense Tracker](#-expense-tracker)
  - [Sleep & Wellness Tracker](#-sleep--wellness-tracker)
  - [Daily Journal](#-daily-journal)
  - [Goals & Milestones](#-goals--milestones)
  - [Research Intelligence](#-research-intelligence)
  - [Gamification System](#-gamification-system)
  - [Analytics Engine](#-analytics-engine)
  - [Unified Dashboard](#-unified-dashboard)
  - [Habit Tracking](#-habit-tracking)
  - [Design & UX](#-design--ux)
  - [Data & PWA](#-data--pwa)
- [Getting Started](#-getting-started)
- [Navigation Guide](#-navigation-guide)
- [XP & Leveling System](#-xp--leveling-system)
- [Technical Architecture](#%EF%B8%8F-technical-architecture)
- [Privacy & Security](#-privacy--security)
- [Use Cases](#-use-cases)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [License](#-license)
- [Acknowledgments](#-acknowledgments)
- [Support](#-support)

---

## 🎓 Overview

**StudentOS** is an all-in-one student life management platform that brings together 10+ productivity modules into a single, cohesive Progressive Web App. Built with **React 18** and **Tailwind CSS**, it runs entirely in the browser with no backend, no accounts, and full offline support.

### Why StudentOS?

| Problem | StudentOS Solution |
|---------|-------------------|
| Juggling multiple productivity apps | Unified platform with 10+ integrated modules |
| Data scattered across services | Single localStorage-based data store on your device |
| Requires internet connection | Full offline support via Service Worker |
| Privacy concerns with cloud apps | 100% local — zero data leaves your device |
| Complex setup & accounts | Zero setup — open and start using immediately |
| Expensive subscription tools | Completely free and open source |

---

## 🆕 What's New in v3.0

StudentOS v3.0 is a major release with significant new modules and architectural improvements:

- 📈 **Grade Tracker** — Semester, course, and assessment management with weighted GPA on a 10-point scale
- 📅 **Timetable System** — Class scheduling with day/time/room management
- 🎯 **Goals & Milestones** — Long-term goal tracking with milestone progress across 5 categories
- 🔬 **Research Intelligence** — Track papers, experiments, models, and deployments with 6 skill domains and 7 mastery levels
- 🎲 **Daily Challenges** — Dynamic quest generation for engagement and XP rewards
- 🏅 **Achievement Badges** — 50 unlockable achievements with XP bonuses (25–100 XP each)
- 🔔 **Notification System** — In-app notifications for deadlines, reminders, and achievements
- 📊 **Advanced Analytics** — Correlation engine, contribution heatmap, trend analysis, cognitive performance metrics
- 🎨 **Subject Management** — Rich subject objects with colors, icons, and weekly hour goals
- 🧠 **Cognitive Performance Engine** — Cognitive Sharpness Index, Deep Work Capacity, Burnout Probability, Focus Stability, and more

---

## ✨ Features

### 📚 Study Session Tracker
- **Real-time study timer** with subject selection from your custom subject list
- **Pomodoro mode** — Configurable study/break cycles (default: 25min study / 5min break / 15min long break / 4 cycles)
- **Session history** — View all past study sessions with duration, subject, and type
- **Daily & weekly goals** — Configurable study time targets (default: 2h daily / 10h weekly) with visual progress
- **Subject-based analytics** — Monitor time spent per subject with color-coded breakdowns
- **In-line subject management** — Add and manage subjects directly from the timer view
- **XP rewards** — Earn +2 XP per 5 minutes of focused study

### 📝 Assignment & Exam Manager
- **Comprehensive entry form** — Title, subject, due date, priority, type (assignment/exam), and notes
- **Prep progress tracking** — Slider (0–100%) to track preparation progress on exams
- **Color-coded urgency indicators**:
  - 🔴 **Critical**: Less than 24 hours remaining
  - 🟡 **Warning**: Less than 3 days remaining
  - 🟢 **On Track**: 3+ days remaining
- **Priority levels** — High, medium, low with visual indicators
- **Status workflow** — Pending → In Progress → Completed
- **Inline subject manager** — Create subjects without leaving the assignment form
- **XP rewards** — +5 XP for planning, +30 XP for completing assignments, +50 XP for completing exams

### 📈 Grade Tracker & GPA
> *New in v3.0*

- **Semester management** — Create and organize multiple semesters
- **Course tracking** — Add courses with credit hours linked to your subjects
- **Component-based assessment** — Default components: Class Test (×2), Assignment (×2), Mid Semester, End Semester, Attendance
- **Weighted grade calculation** — Automatic GPA computation on a **10-point Indian scale**:
  - ≥90% → 10 (Excellent) · ≥80% → 9 (A) · ≥70% → 8 (B) · ≥60% → 7 (C) · ≥50% → 6 (D) · ≥40% → 5 (Pass) · <40% → 0 (Fail)
- **Multi-level GPA** — Per-course GPA, semester GPA (credit-weighted), and cumulative CGPA (displayed as X.XX/10)
- **Performance visualization** — Grade distributions and letter grades across courses

### 📅 Timetable & Scheduling
> *New in v3.0*

- **Weekly class schedule** — Organize classes by day, start/end time, and room
- **Subject integration** — Link timetable entries to your subjects with inherited colors
- **Room management** — Track classroom/building locations
- **Notes support** — Add notes to individual schedule entries
- **Inline subject manager** — Add subjects directly from the timetable modal
- **Visual schedule view** — Color-coded weekly overview
- **XP rewards** — +5 XP per timetable entry

### 💰 Expense Tracker
- **Detailed expense logging** — Amount, category, description, and date
- **Monthly budget management** — Configurable budget (default: ₹5,000) with visual progress bar
- **7 expense categories** — 🍔 Food, 🚗 Transport, 📚 Books, 🎮 Entertainment, 💳 Subscriptions, ⚕️ Health, 📦 Other
- **Spending analysis** — Category breakdown with chart visualizations
- **Time-based filters** — View expenses by day, week, or month
- **Budget alerts** — Visual warnings at 80% (caution) and 100% (exceeded)
- **Currency support** — Configurable currency (₹, $, €, £, ¥) in settings
- **XP rewards** — +2 XP per expense logged

### 😴 Sleep & Wellness Tracker
- **Sleep logging** — Track bedtime, wake time, hours slept, and quality rating (1–5 stars)
- **Configurable sleep goal** — Default 8 hours, adjustable in settings
- **Water intake tracker** — Log glasses of water with configurable daily goal (default: 8 glasses)
- **Exercise logging** — Record workout type, duration, and notes
- **Mood tracking** — Daily mood selection with emoji (😄 😊 😐 😔 😢) and energy level (1–5)
- **Wellness dashboard** — Quick-view cards for all wellness metrics
- **XP rewards** — Sleep +5, Water +1 per glass, Exercise +10, Mood +3

### 📓 Daily Journal
- **Rich journal entries** — Write about your day with unlimited text
- **Mood & energy tracking** — Choose from 5 emoji moods and rate energy on a 1–5 scale
- **Gratitude field** — Optional daily gratitude prompt
- **Automatic word count** — Real-time word counting for each entry
- **Journal streak** — Track consecutive days of journaling
- **Entry history** — Browse past entries with date navigation
- **Journal reminder** — Configurable reminder in settings
- **XP rewards** — +10 XP per journal entry

### 🎯 Goals & Milestones
> *New in v3.0*

- **Long-term goal creation** — Set goals with titles, descriptions, and deadlines
- **Milestone tracking** — Break goals into milestones and track completion
- **5 goal categories** — Academic, Health, Financial, Personal, Career
- **Progress visualization** — Visual progress bars for each goal
- **Active vs. completed views** — Separate sections for ongoing and finished goals
- **XP rewards** — +15 XP per goal created, +5 XP per milestone completed

### 🔬 Research Intelligence
> *New in v3.0*

- **Research activity tracking** — Log papers read, experiments run, models trained, deployments made, insights, and bugfixes
- **6 skill domains** with unique icons and colors:
  - 🧠 Machine Learning · 🤖 Robotics · ⚙️ Systems · 🎯 Leadership · 🔬 Research · 🛠️ Engineering
- **7 mastery levels** — Novice → Apprentice → Practitioner → Specialist → Expert → Master → Grandmaster
- **Domain-specific XP** — Papers: 15 XP · Experiments: 25 XP · Models: 35 XP · Deployments: 50 XP · Insights: 10 XP · Bugfixes: 8 XP
- **Research milestones** — Track and celebrate major research achievements (+100 XP)
- **Duration logging** — Record time spent on each research activity

### 🎮 Gamification System

#### XP & Leveling
- **XP points** for every productive action across all modules
- **50-level progression** — Level = floor(sqrt(XP / 100)) + 1
- **10 level titles**: Freshman → Sophomore → Scholar → Achiever → Expert → Master → Sage → Virtuoso → Legend → Valedictorian
- **XP progress bar** — Always visible in the header

#### 🏅 Achievements
> *New in v3.0*

- **50 unlockable achievement badges** — Earned through specific milestones across all modules
- **Achievement notifications** — In-app alerts when badges are unlocked
- **XP bonuses** — 25–100 XP per achievement unlocked
- **Examples**: First Steps (👣), Bookworm (📖), On Fire (🔥), Marathon (🏃), Budget Master (💰), Sleep Champion (😴), Dean's List (🎓), and many more

#### 🎲 Daily Challenges
> *New in v3.0*

- **Dynamic quest generation** — Fresh challenges generated based on your patterns and activity
- **7+ challenge types** — Complete all habits, study neglected subjects, study variety, focused sessions, review streaks, and more
- **Configurable targets** — Each challenge has specific completion criteria
- **XP rewards** — 10–25 XP per challenge completed

#### 🔔 Notifications
> *New in v3.0*

- **In-app notification center** — Centralized notifications for all modules
- **Notification types** — Deadline reminders, achievement unlocks, study reminders
- **Read/unread status** — Track which notifications you've seen
- **Action links** — Click notifications to navigate directly to relevant views

### 📊 Analytics Engine
> *Significantly enhanced in v3.0*

- **Contribution heatmap** — GitHub-style 365-day activity visualization
- **5 analytics engines**:
  - **Correlations** — Pearson correlation between habits, sleep, study, and performance
  - **Trends** — Weekly trend detection per habit over time
  - **Weekday patterns** — Best and worst days of the week for productivity
  - **Streaks** — Current and longest streak analysis
  - **Performance** — Weekly completion rate analysis
- **Cognitive performance metrics**:
  - Cognitive Sharpness Index (CSI)
  - Deep Work Capacity (DWC)
  - Burnout Probability prediction
  - Focus Stability Score
  - Decision Fatigue Risk
  - Skill Gap Detection
  - Predictive deadline risk assessment
- **Mathematical foundations** — Sigmoid functions, z-score normalization, statistical analysis

### 📋 Unified Dashboard
- **Quick-access widgets** for all major modules:
  - 📚 Study — Today's study time and active timer
  - 📝 Assignments — Next upcoming deadline with urgency color
  - 💧 Wellness — Water intake, sleep, and mood at a glance
  - 🏆 XP — Current level, title, total XP, and progress bar
  - 🎲 Challenges — Active daily challenges
- **Smart insights** — Data-driven suggestions based on your patterns
- **Stats overview** — Daily completion rate, streaks, and trends
- **Best streak display** — Highlight your longest active streaks

### ✅ Habit Tracking
- **Daily habit tracking** with completion checkboxes
- **8 habit categories** — Health, Productivity, Learning, Fitness, Mindfulness, Social, Finance, Creative
- **8 color options** — Indigo, Emerald, Amber, Rose, Purple, Cyan, Sky, Orange
- **Eisenhower Matrix** — Organize habits by urgency and importance (4-quadrant view):
  - Q1: Do First (Urgent & Important) · Q2: Schedule (Important) · Q3: Delegate (Urgent) · Q4: Eliminate
- **Streak tracking** — Monitor consecutive completion days with streak freezes (2 available)
- **Focus timer** — Built-in Pomodoro sessions for habits
- **Undo/Redo** — Full state rollback up to 30 actions
- **Confetti celebrations** — Canvas-confetti animations on habit completion
- **Export/Import** — JSON-based data backup and restore

### 🎨 Design & UX
- **Multiple themes** — Dark, Light, and AMOLED Black themes
- **Glassmorphism effects** — Modern translucent UI elements
- **Mobile-first responsive design** — Optimized for phones, tablets, and desktop
- **Bottom tab navigation** — Intuitive 5-tab navigation bar
- **Bottom-sheet modals** — Native-feeling modal interactions on mobile
- **Smooth animations** — CSS transitions and micro-interactions throughout
- **Haptic feedback** — Tactile response on actions (device-dependent)
- **WCAG 2.1 AA accessibility** — Proper ARIA labels, roles, and keyboard navigation

### 💾 Data & PWA
- **localStorage persistence** — All data saved automatically with 500ms debounced writes
- **Full offline support** — Works completely offline via Service Worker (cache-first strategy)
- **Installable** — Add to home screen on mobile and desktop via manifest
- **App shortcuts** — Quick-launch Study Timer, Add Assignment, Log Expense, or Journal from home screen
- **Optimized performance** — All components use `React.memo` with `useMemo` and `useCallback`
- **Export/Import** — Full JSON data backup and restore
- **No data loss** — Automatic saving on every state change
- **Error boundaries** — Graceful error handling prevents crashes

---

## 🚀 Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- No server, build tools, or accounts required

### Installation Options

#### Option 1: Use Online
1. Open the app URL in your browser
2. Start using immediately — no setup needed

#### Option 2: Install as PWA
1. Visit the app in your browser
2. Install the PWA:
   - **Chrome (Desktop)**: Click the install icon (⊕) in the address bar
   - **Chrome (Android)**: Tap the browser menu → "Add to Home Screen"
   - **Safari (iOS)**: Tap Share → "Add to Home Screen"
   - **Edge**: Click the install icon in the address bar
3. The app will appear on your home screen/desktop with its own window

#### Option 3: Self-Host
```bash
# Clone the repository
git clone https://github.com/rohi021/habit-tracker-pwa.git
cd habit-tracker-pwa

# Serve with any static file server
python3 -m http.server 8000
# or
npx serve .
# or
php -S localhost:8000
```
Then open `http://localhost:8000` in your browser.

### Quick Start Guide

1. **🏠 Dashboard** — Explore the overview widgets and smart insights
2. **📚 Study** — Start a study timer or add your first assignment
3. **📈 Grades** — Set up your semesters and courses for grade tracking
4. **📓 Journal** — Write your first entry and log wellness metrics
5. **💰 Expenses** — Set a monthly budget and log your first expense
6. **🎯 Goals** — Create a long-term goal with milestones
7. **⚙️ Settings** — Customize themes, study goals, and Pomodoro timers

---

## 📱 Navigation Guide

### Bottom Tab Bar (5 Tabs)

| Tab | Icon | Content |
|-----|------|---------|
| **Home** | 🏠 | Dashboard with widgets, habits, and daily overview |
| **Study** | 📚 | Study timer, assignments, timetable (sub-tabs) |
| **Stats** | 📊 | Analytics, insights, contribution heatmap, Eisenhower Matrix |
| **Journal** | 📓 | Daily journal entries and wellness tracking cards |
| **Settings** | ⚙️ | App settings, themes, data management, quick-access links |

### Sub-Navigation
- **Study Tab** → Toggle between **Timer**, **Assignments**, and **Timetable**
- **Settings** → Quick access to **Expense Tracker**, **Grade Tracker**, **Goals**, and **Eisenhower Matrix**

---

## 🎮 XP & Leveling System

Earn XP for every productive action across all modules:

| Action | XP Reward | Module |
|--------|-----------|--------|
| Study (per 5 min) | +2 XP | Study |
| Add Assignment | +5 XP | Assignments |
| Complete Assignment | +30 XP | Assignments |
| Complete Exam | +50 XP | Assignments |
| Add Timetable Entry | +5 XP | Timetable |
| Log Expense | +2 XP | Expenses |
| Log Sleep | +5 XP | Wellness |
| Log Water (per glass) | +1 XP | Wellness |
| Log Exercise | +10 XP | Wellness |
| Log Mood | +3 XP | Wellness |
| Write Journal Entry | +10 XP | Journal |
| Complete Habit | +10 XP | Habits |
| Add Goal | +15 XP | Goals |
| Complete Milestone | +5 XP | Goals |
| Log Paper Read | +15 XP | Research |
| Log Experiment | +25 XP | Research |
| Log Model Trained | +35 XP | Research |
| Log Deployment | +50 XP | Research |
| Research Milestone | +100 XP | Research |
| Complete Daily Challenge | 10–25 XP | Challenges |
| Unlock Achievement | 25–100 XP | Achievements |

### Level Progression

```
Level = floor(sqrt(XP / 100)) + 1       (Max: Level 50)
```

| Level Range | Title |
|-------------|-------|
| 1–5 | 🎒 Freshman |
| 6–10 | 📖 Sophomore |
| 11–15 | 🎓 Scholar |
| 16–20 | ⭐ Achiever |
| 21–25 | 💡 Expert |
| 26–30 | 🏅 Master |
| 31–35 | 🧙 Sage |
| 36–40 | 🎼 Virtuoso |
| 41–45 | 🏆 Legend |
| 46–50 | 👑 Valedictorian |

---

## 🏗️ Technical Architecture

### Technology Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| [React](https://react.dev) | 18 | UI framework (via CDN) |
| [Tailwind CSS](https://tailwindcss.com) | Latest | Utility-first styling (via CDN) |
| [Babel Standalone](https://babeljs.io) | Latest | Runtime JSX transpilation |
| [Chart.js](https://www.chartjs.org) | 4 | Data visualization and charts |
| [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti) | 1.6.0 | Celebration animations |
| [Google Fonts (Inter)](https://fonts.google.com/specimen/Inter) | Latest | Typography |
| localStorage | Native | Client-side data persistence |
| Service Worker | Native | Offline caching and PWA support |

### Architecture Highlights

```
┌─────────────────────────────────────────────────────────────┐
│                        index.html                           │
│                    (8,900+ lines)                            │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                   React 18 App                       │   │
│  │                                                      │   │
│  │  ┌────────────┐  ┌─────────────┐  ┌──────────────┐  │   │
│  │  │ useReducer │  │  ActionTypes │  │  appReducer  │  │   │
│  │  │   (State)  │──│  (52+ types) │──│  (Dispatch)  │  │   │
│  │  └────────────┘  └─────────────┘  └──────────────┘  │   │
│  │         │                                            │   │
│  │  ┌──────┴──────────────────────────────────────┐     │   │
│  │  │          Memoized Components                │     │   │
│  │  │  Dashboard │ Study │ Grades │ Journal │ ...  │     │   │
│  │  └─────────────────────────────────────────────┘     │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌───────────────┐  ┌──────────────┐  ┌────────────────┐   │
│  │  localStorage │  │ Service Worker│  │ manifest.json  │   │
│  │  (Persistence)│  │  (Offline)   │  │    (PWA)       │   │
│  └───────────────┘  └──────────────┘  └────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

#### Key Patterns
- ✅ **Single HTML file** — 8,900+ lines, zero build complexity, instant deployment
- ✅ **React Hooks only** — `useState`, `useReducer`, `useEffect`, `useMemo`, `useCallback`, `useRef`
- ✅ **Centralized state** — Single `useReducer` with 52+ action types via `ActionTypes` constants
- ✅ **Full memoization** — Every component wrapped in `React.memo` for optimal re-renders
- ✅ **Debounced persistence** — State saved to localStorage after 500ms of inactivity
- ✅ **Error boundaries** — Graceful error handling prevents full-app crashes
- ✅ **WCAG 2.1 AA** — Accessible with ARIA labels, roles, and keyboard navigation
- ✅ **Cache-first SW** — Service Worker with cache-first strategy and network fallback

### File Structure

```
habit-tracker-pwa/
├── index.html          # Main application (8,900+ lines of React/JSX)
├── manifest.json       # PWA manifest with shortcuts and categories
├── sw.js               # Service worker (cache: studentos-v3.0)
├── icons/              # PWA icons and favicons
│   ├── icon-192.png.png
│   ├── icon-512.png.png
│   ├── icon-maskable.png.png
│   ├── favicon.ico
│   ├── favicon-16x16.png
│   ├── favicon-32x32.png
│   ├── site.webmanifest
│   └── about.txt
└── README.md           # This documentation
```

### Data Model

The application maintains a comprehensive state object in localStorage, managed through React's `useReducer`:

```javascript
{
  // ── Habit Tracking ──────────────────────────
  habits: {},                    // { id: { name, category, color, streak, ... } }
  habitOrder: [],                // Ordered array of habit IDs

  // ── Study Module ────────────────────────────
  studySessions: [],             // [{ subject, duration, date, type }]
  studyGoal: { daily: 120, weekly: 600 },
  subjects: [],                  // [{ id, name, color, icon, weeklyGoalHours }]
  assignments: [],               // [{ title, subject, dueDate, priority, type, status, progress }]
  timetable: [],                 // [{ id, subject, day, startTime, endTime, room, notes }]
  activeStudySession: null,      // Currently running study session

  // ── Grade Tracking ──────────────────────────
  grades: {
    semesters: [{
      id, name,
      courses: [{
        id, subjectId, creditHours,
        assessments: [{ id, name, type, weight, score, maxScore, componentWeight }]
      }]
    }]
  },

  // ── Financial ───────────────────────────────
  expenses: [],                  // [{ amount, category, description, date }]
  monthlyBudget: 5000,
  expenseCategories: [...],      // Food, Transport, Books, Entertainment, Subscriptions, Health, Other

  // ── Wellness ────────────────────────────────
  sleepLog: [],                  // [{ date, hours, quality }]
  waterLog: {},                  // { "YYYY-MM-DD": glassCount }
  exerciseLog: [],               // [{ type, duration, date, notes }]
  moodLog: {},                   // { "YYYY-MM-DD": { mood, energy, note } }
  waterGoal: 8,
  sleepGoal: 8,

  // ── Goals ───────────────────────────────────
  goals: [],                     // [{ title, category, description, deadline, milestones: [{ text, done }] }]
  goalCategories: [...],         // Academic, Health, Financial, Personal, Career

  // ── Journal ─────────────────────────────────
  journalEntries: [],            // [{ date, content, mood, energy, gratitude, wordCount }]

  // ── Research Intelligence ───────────────────
  researchLog: [],               // [{ type, title, duration, domain }]
  skillXP: {                     // Domain-specific XP tracking
    ml: 0, robotics: 0, systems: 0,
    leadership: 0, research: 0, engineering: 0
  },
  researchMilestones: [],        // Major research achievements

  // ── Gamification ────────────────────────────
  xp: 0,
  level: 1,
  totalPoints: 0,
  achievements: [],              // Earned achievement IDs (50 possible)
  dailyChallenges: [],           // [{ text, type, target, xpReward }]
  streakFreezes: 2,

  // ── Notifications ───────────────────────────
  notifications: [],             // [{ id, type, title, message, read, createdAt, actionLink }]

  // ── Settings ────────────────────────────────
  settings: {
    theme,                       // 'dark' | 'light' | 'amoled'
    soundEnabled, hapticEnabled,
    reminderTime, weekStartsOn,
    currency,                    // Default: '₹' (supports ₹, $, €, £, ¥)
    timeFormat,                  // '12h' | '24h'
    pomodoroStudy: 25,           // Configurable Pomodoro durations (minutes)
    pomodoroShortBreak: 5,
    pomodoroLongBreak: 15,
    pomodoroCycles: 4,
    studyReminderEnabled,
    journalReminderEnabled,
    dailyStudyGoal: 120,
    weeklyStudyGoal: 600,
    monthlyBudget: 5000,
    waterGoal: 8,
    sleepGoal: 8
  },

  // ── UI State ────────────────────────────────
  view: 'dashboard',
  selectedHabit: null,
  isLoading: false,
  focusMode: null,
  undoStack: [],                 // Up to 30 undo states
  redoStack: []
}
```

---

## 🔒 Privacy & Security

StudentOS is designed with a **privacy-first architecture**:

| Aspect | Details |
|--------|---------|
| **Data Storage** | 100% local — all data in browser localStorage |
| **Server** | None — no backend, no API calls, no cloud |
| **Tracking** | Zero analytics, zero telemetry, zero third-party scripts |
| **Accounts** | No signup, no email, no passwords, no OAuth |
| **Data Ownership** | Full control — export everything as JSON anytime |
| **Source Code** | Fully open source — inspect every line |
| **Network** | Works completely offline after first load |

---

## 🎯 Use Cases

### 🎓 For Students
- **Track study time** across multiple subjects with Pomodoro timers
- **Never miss deadlines** with color-coded urgency on assignments and exams
- **Monitor grades** with semester/course/assessment tracking and 10-point GPA calculation
- **Manage your budget** with categorized expense tracking and alerts
- **Track wellness** — sleep, hydration, exercise, and mood in one place
- **Build consistency** with habit tracking, streaks, and streak freezes
- **Reflect daily** through journaling with mood and gratitude prompts
- **Stay motivated** with XP, levels, 50 achievements, and daily challenges
- **Analyze patterns** with correlation analytics and contribution heatmaps
- **Log research** activities with domain-specific skill tree progression

### 💼 For Professionals
- Use the **Eisenhower Matrix** for task prioritization
- Track daily habits and build productive routines
- Monitor wellness metrics for work-life balance
- Journal for reflection and personal growth

### 🌐 For Anyone
- **Zero-friction productivity** — no accounts, no subscriptions, no internet required
- **Complete data privacy** — nothing leaves your device
- **Cross-platform** — works on any device with a modern browser

---

## 📈 Roadmap

Potential future enhancements:

- 📅 **Calendar View** — Visual calendar for deadlines and schedule
- 🔗 **Cross-Module Correlations** — Sleep vs. study performance analysis
- 🏷️ **Journal Tags** — Filtering and searching entries by tags
- 📱 **Push Notifications** — Browser push notifications for deadlines
- 🌍 **i18n / Localization** — Multi-language support
- 🔄 **Cloud Sync** — Optional encrypted sync across devices
- 📊 **Advanced Charts** — Enhanced Canvas-based data visualizations

---

## 🤝 Contributing

Contributions are welcome! StudentOS is designed to be easily extensible.

### How the Architecture Works

1. **State** is managed by a single `useReducer` with `ActionTypes` constants
2. **Components** are memoized with `React.memo` for performance
3. **Views** are mapped in the `viewComponents` object for routing

### Adding a New Feature

```
1. Add state fields     → createInitialState()
2. Add action types     → ActionTypes constant
3. Add reducer cases    → appReducer()
4. Create component     → React.memo(function MyFeature() { ... })
5. Register view        → viewComponents mapping
6. Add navigation       → Tab bar or settings quick-access
```

### Development Setup

```bash
git clone https://github.com/rohi021/habit-tracker-pwa.git
cd habit-tracker-pwa
python3 -m http.server 8000
# Open http://localhost:8000 in your browser
```

> **Note**: There is no build step. Edit `index.html` directly, and refresh the browser to see changes. Babel transpiles JSX at runtime.

---

## 📄 License

MIT License — Feel free to use, modify, and distribute.

---

## 🙏 Acknowledgments

- Built with [React 18](https://react.dev) and [Tailwind CSS](https://tailwindcss.com)
- Charts powered by [Chart.js 4](https://www.chartjs.org)
- Celebrations powered by [Canvas Confetti](https://github.com/catdad/canvas-confetti)
- Inspired by productivity methodologies: **GTD**, **Eisenhower Matrix**, **Pomodoro Technique**
- Designed for students, by understanding real student needs

---

## 📞 Support

For issues, questions, or feature requests:

- 🐛 [Open an issue](https://github.com/rohi021/habit-tracker-pwa/issues) on GitHub
- 📖 Review this documentation
- 💻 Browse the source — it's all in `index.html`!

---

<div align="center">

**Made with 💙 for students everywhere**

*StudentOS v3.0.0 — The Complete Student Life Management Platform*

</div>
