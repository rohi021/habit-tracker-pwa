# StudentOS - Complete Student Life Management Platform

> **Transformed from HabitOS** - A comprehensive, production-grade PWA for managing every aspect of student life.

![Version](https://img.shields.io/badge/version-2.0.0-blue)
![React](https://img.shields.io/badge/React-18-blue)
![PWA](https://img.shields.io/badge/PWA-enabled-green)
![License](https://img.shields.io/badge/license-MIT-green)

## 🎓 Overview

StudentOS is a comprehensive student life management platform that combines habit tracking, study session management, assignment tracking, expense management, wellness monitoring, and daily journaling into a single, cohesive application. Built as a Progressive Web App (PWA) with React 18, it works offline and can be installed on any device.

## ✨ Features

### 📚 Study Session Tracker
- **Real-time study timer** with subject selection
- **Pomodoro mode** support (25min study / 5min break cycles)
- **Session history** - View all past study sessions with duration and subject
- **Daily/weekly goals** - Track progress toward study time targets
- **Subject tracking** - Monitor time spent per subject
- **XP rewards** - Earn 2 XP per 5 minutes of study

### 📝 Assignment & Exam Manager
- **Add assignments and exams** with title, subject, due date, priority, and type
- **Color-coded urgency indicators**:
  - 🔴 Red: Less than 24 hours remaining
  - 🟡 Amber: Less than 3 days remaining
  - 🟢 Green: 3+ days remaining
- **Priority levels** - High, medium, low
- **Status tracking** - Pending, in-progress, completed
- **XP rewards** - +5 XP for planning, +30 XP for completion

### 💰 Expense Tracker
- **Log expenses** with amount, category, description, and date
- **Monthly budget management** with visual progress bar
- **7 expense categories**: Food, Transport, Books, Entertainment, Subscriptions, Health, Other
- **Category breakdown** - See spending distribution with charts
- **Time filters** - View expenses by day, week, or month
- **Budget alerts** - Visual warnings at 80% and 100% of budget
- **XP rewards** - +2 XP per expense logged

### 😴 Sleep & Wellness Tracker
- **Sleep logging** - Track bedtime, wake time, hours slept, and quality rating (1-5 stars)
- **Water intake tracker** - Log glasses of water with 8-glass daily goal
- **Exercise logging** - Record workout type, duration, and notes
- **Mood tracking** - Select daily mood with emoji and energy level (1-5)
- **Wellness dashboard** - Quick view of all wellness metrics on Journal tab
- **XP rewards** - Sleep +5, Water +1, Exercise +10, Mood +3

### 📓 Daily Journal
- **Rich journal entries** - Write about your day with unlimited text
- **Mood selection** - Choose from 5 emoji moods (😄 😊 😐 😔 😢)
- **Energy level** - Track daily energy on a 1-5 scale
- **Gratitude field** - Optional field for daily gratitude
- **Word count** - Automatic word counting for each entry
- **Journal streak** - Track consecutive days of journaling
- **Entry history** - Browse past entries with date navigation
- **XP rewards** - +10 XP per journal entry

### 🏆 Enhanced Gamification System
- **XP points** for every action across all modules
- **50-level progression system** - Level = sqrt(XP / 100) + 1
- **Level titles**: Freshman → Student → Scholar → Achiever → Expert → Master → Sage → Virtuoso → Legend → Valedictorian
- **XP progress bar** in header showing progress to next level
- **Best streak display** on dashboard

### 📊 Unified Dashboard
- **Quick-access widgets** for all major modules:
  - 📚 Study widget - Today's study time
  - 📝 Assignment widget - Next upcoming deadline
  - 💧 Wellness widget - Water intake progress
  - 🏆 XP widget - Current level and total XP
- **AI-powered insights** - Smart suggestions based on your data
- **Stats overview** - Daily completion rate and streaks
- **Best habit streak** - Highlight your longest current streak

### ✅ Original Habit Tracking (Preserved)
- **Daily habit tracking** with completion checkboxes
- **Habit categories** - Health, Productivity, Learning, Fitness, Mindfulness, Social, Finance, Creative
- **Color coding** - 8 color options for visual organization
- **Eisenhower Matrix** - Organize habits by urgency and importance
- **Streak tracking** - Monitor consecutive completion days
- **Focus timer** - 25-minute Pomodoro sessions for habits
- **Undo/Redo** - Rollback up to 30 actions
- **Confetti celebrations** - Visual feedback on completion
- **Analytics** - Detailed insights and correlations
- **Export/Import** - Backup and restore your data

### 🎨 Design & UX
- **Dark theme** with glassmorphism effects
- **Mobile-first responsive design**
- **5-tab bottom navigation** - Home, Study, Stats, Journal, Settings
- **Bottom-sheet modals** on mobile for natural interaction
- **Smooth animations** and transitions throughout
- **Haptic feedback** on actions (if supported)
- **WCAG 2.1 AA accessibility** - Proper ARIA labels and keyboard navigation

### 💾 Data & PWA
- **localStorage persistence** - All data saved automatically with 500ms debounced writes
- **Offline support** - Works completely offline via service worker
- **Installable** - Add to home screen on mobile and desktop
- **Fast loading** - Optimized performance with React.memo
- **Export/Import** - JSON-based data backup and restore
- **No data loss** - Automatic saving on every change

## 🚀 Getting Started

### Installation

1. **Visit the app** in your web browser
2. **Install as PWA** (optional):
   - **Mobile**: Tap "Add to Home Screen" in browser menu
   - **Desktop**: Click install icon in address bar
3. **Start using** - No signup or account required!

### Quick Start Guide

1. **Dashboard** - Start by exploring the quick-access widgets
2. **Study** - Navigate to Study tab to log study sessions or add assignments
3. **Journal** - Click wellness cards to log sleep, water, exercise, or mood
4. **Expenses** - Access from Settings > Quick Access > Expense Tracker
5. **Settings** - Customize app, export data, or reset if needed

## 📱 Navigation

### Bottom Tab Bar
- **📋 Home** - Dashboard with widgets and today's habits
- **📚 Study** - Study timer, assignments, and timetable
- **📊 Stats** - Analytics and insights (includes Matrix view)
- **📓 Journal** - Daily journal entries and wellness tracking
- **⚙️ Settings** - App settings, data management, and quick access

### Sub-Navigation
- **Study tab** - Toggle between Timer, Assignments, and Timetable
- **Settings** - Quick access to Expense Tracker and Eisenhower Matrix

## 🎮 XP & Leveling System

Earn XP for every productive action:

| Action | XP Reward |
|--------|-----------|
| Study (per 5 min) | +2 XP |
| Add Assignment | +5 XP |
| Complete Assignment | +30 XP |
| Log Expense | +2 XP |
| Log Sleep | +5 XP |
| Log Water | +1 XP |
| Log Exercise | +10 XP |
| Log Mood | +3 XP |
| Write Journal Entry | +10 XP |
| Complete Habit | +10 XP |

**Level Formula**: Level = floor(sqrt(XP / 100)) + 1 (Max level: 50)

## 🏗️ Technical Architecture

### Technology Stack
- **React 18** - via CDN (no build tools)
- **Tailwind CSS** - via CDN for styling
- **Babel Standalone** - for JSX transpilation
- **localStorage** - for data persistence
- **Service Worker** - for offline support and caching
- **Canvas Confetti** - for celebration animations

### Architecture Highlights
- ✅ **Single HTML file** - 5,300+ lines, zero build complexity
- ✅ **React Hooks** - useState, useReducer, useEffect, useMemo, useCallback
- ✅ **Reducer pattern** - Centralized state management with 50+ action types
- ✅ **Memoization** - All components use React.memo for performance
- ✅ **Debounced persistence** - Saves to localStorage after 500ms of inactivity
- ✅ **Error boundaries** - Graceful error handling throughout
- ✅ **Accessibility** - WCAG 2.1 AA compliant with proper ARIA labels

### File Structure
```
habit-tracker-pwa/
├── index.html          # Main application (5,323 lines)
├── manifest.json       # PWA manifest
├── sw.js              # Service worker
├── icons/             # App icons
└── README.md          # This file
```

### Data Model

The app uses a comprehensive state object stored in localStorage:

```javascript
{
  // Original habit tracking
  habits: {},
  habitOrder: [],
  
  // New: Study tracking
  studySessions: [],
  studyGoal: { daily: 120, weekly: 600 },
  subjects: [...],
  
  // New: Assignments
  assignments: [],
  
  // New: Expenses
  expenses: [],
  monthlyBudget: 5000,
  expenseCategories: [...],
  
  // New: Wellness
  sleepLog: [],
  waterLog: {},
  exerciseLog: [],
  moodLog: {},
  
  // New: Journal
  journalEntries: [],
  
  // New: Goals (future)
  goals: [],
  
  // New: Timetable (future)
  timetable: [],
  
  // Gamification
  xp: 0,
  level: 1,
  achievements: [],
  
  // Settings
  settings: {...},
  
  // Undo/Redo
  undoStack: [],
  redoStack: []
}
```

## 🔒 Privacy & Security

- **No server** - All data stays on your device
- **No tracking** - Zero analytics or third-party scripts
- **No account** - No signup, no email, no passwords
- **Full control** - Export your data anytime as JSON
- **Open source** - Inspect the code yourself

## 🎯 Use Cases

### For Students
- Track study time across multiple subjects
- Never miss an assignment deadline
- Stay within monthly budget
- Monitor wellness and mood patterns
- Build consistent habits
- Reflect through daily journaling
- Gamify productivity with XP and levels

### For Anyone
- Break bad habits and build good ones
- Track any recurring activity
- Use Eisenhower Matrix for prioritization
- Export data for personal analytics
- Work completely offline
- No distractions or social features

## 📈 Coming Soon (Optional Enhancements)

These features can be added in future updates:

- 🎯 **Goal System** with milestones and progress tracking
- 📅 **Visual Timetable Grid** for class scheduling
- 📊 **Canvas-based Charts** for visualizations
- 🏆 **Achievement Badges** for major milestones
- 🎲 **Daily Challenges** for extra engagement
- 🔗 **Correlation Analytics** (sleep vs study performance, etc.)
- 📅 **Calendar View** for deadlines
- 📈 **Grade Tracking** with GPA calculation
- 🏷️ **Journal Tags** for filtering entries

## 🤝 Contributing

Contributions are welcome! The app is designed to be easily extensible:

1. All components follow React Hooks patterns
2. State management uses a reducer pattern
3. New features can be added by:
   - Adding state fields to `createInitialState()`
   - Adding action types to `ActionTypes`
   - Adding reducer cases to `appReducer()`
   - Creating new memoized components
   - Adding to `viewComponents` mapping

## 📄 License

MIT License - Feel free to use, modify, and distribute.

## 🙏 Acknowledgments

- Built with React 18 and Tailwind CSS
- Inspired by productivity methodologies: GTD, Eisenhower Matrix, Pomodoro
- Designed for students by understanding student needs

## 📞 Support

For issues, questions, or feature requests:
- Open an issue on GitHub
- Check existing documentation
- Review the code - it's all in one file!

---

**Made with 💙 for students everywhere**

*Version 2.0.0 - StudentOS*
