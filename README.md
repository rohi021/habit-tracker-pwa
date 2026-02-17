<div align="center">

# 🎓 StudentOS v4.0

### The Complete Student Life Management Platform

> A production-grade, modular Progressive Web App for managing every aspect of student life — study sessions, grades, assignments, finances, wellness, goals, and more. Fully offline-capable, privacy-first, no backend required.

[![Version](https://img.shields.io/badge/version-4.0.0-blue?style=for-the-badge)](https://github.com/rohi021/habit-tracker-pwa)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![PWA](https://img.shields.io/badge/PWA-enabled-5A0FC8?style=for-the-badge&logo=pwa&logoColor=white)](https://web.dev/progressive-web-apps/)
[![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)](LICENSE)
[![No Backend](https://img.shields.io/badge/Backend-None%20Required-red?style=for-the-badge)]()

</div>

---

## 📖 Table of Contents

- [Overview](#-overview)
- [What's New in v4.0](#-whats-new-in-v40)
- [Features](#-features)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Architecture](#%EF%B8%8F-architecture)
- [Data & Privacy](#-data--privacy)
- [Migration from v3](#-migration-from-v3)
- [Testing](#-testing)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎓 Overview

**StudentOS** is an all-in-one student life management platform that brings together 10+ productivity modules into a single, cohesive Progressive Web App. Built with **React 18**, **TypeScript**, **Vite**, and **Tailwind CSS**, it runs entirely in the browser with no backend, no accounts, and full offline support.

### Why StudentOS?

| Problem | StudentOS Solution |
|---------|-------------------|
| Juggling multiple productivity apps | Unified platform with 10+ integrated modules |
| Data scattered across services | IndexedDB-based persistence on your device |
| Requires internet connection | Full offline support via Service Worker (Workbox) |
| Privacy concerns with cloud apps | 100% local — zero data leaves your device |
| Complex setup & accounts | Zero setup — open and start using immediately |
| No data validation | Zod schemas validate all data at runtime |

---

## 🆕 What's New in v4.0

StudentOS v4.0 is a complete rewrite focusing on modularity, reliability, and developer experience:

- 🏗️ **Modular Architecture** — Migrated from single-file 8,900+ line app to modular Vite+React+TypeScript project
- 💾 **IndexedDB Persistence** — Moved from localStorage to IndexedDB via Dexie for scalable storage
- 🔐 **Encrypted Backups** — AES-256-GCM encrypted export/import with user passphrase (WebCrypto)
- 📋 **Zod Validation** — Runtime schema validation on all data (forms, import, migration)
- 🏪 **Zustand State Management** — Clean, typed state management replacing useReducer
- 🧭 **React Router** — Proper client-side routing with code splitting per route
- 🔄 **v3 → v4 Migration** — Automatic detection and migration of v3 localStorage data
- 🧪 **Test Suite** — Vitest unit tests + Playwright E2E smoke tests
- ♿ **Accessibility** — WCAG 2.1 AA baseline with ARIA labels, keyboard navigation
- ⚡ **Performance** — Code splitting, lazy loading, optimized bundle chunks
- 🔧 **PWA** — vite-plugin-pwa with Workbox for reliable offline caching

---

## ✨ Features

- **📖 Study Timer** — Real-time timer with subject selection, Pomodoro support, session history
- **📋 Assignments & Exams** — Track assignments/exams with priority, status, due dates
- **📅 Timetable** — Weekly class schedule with day/time/room management
- **📈 Grade Tracker** — Semester → Course → Assessment hierarchy with 10-point GPA scale
- **💰 Expense Tracker** — Budget tracking with category breakdowns, currency selection (₹, $, €, £, ¥)
- **😴 Wellness** — Sleep logging, water intake, mood tracking, exercise logging
- **📔 Journal** — Daily journaling with gratitude, mood, and word count
- **🎯 Goals** — Goal setting with milestones and category-based tracking
- **🔬 Research** — Track papers, experiments, models, deployments
- **📊 Analytics** — Study trends, subject breakdown, gamification summary
- **🎮 Gamification** — XP, levels, achievements for engagement
- **⚙️ Settings** — Theme, currency, study goals, data export/import

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and **npm** 9+

### Installation

```bash
# Clone the repository
git clone https://github.com/rohi021/habit-tracker-pwa.git
cd habit-tracker-pwa

# Install dependencies
npm install

# Start development server
npm run dev
```

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server (hot reload) |
| `npm run build` | TypeScript check + production build |
| `npm run preview` | Preview production build locally |
| `npm run test` | Run Vitest unit tests |
| `npm run test:e2e` | Run Playwright E2E tests |
| `npm run lint` | ESLint check |
| `npm run format` | Prettier format |

### Build for Production

```bash
npm run build    # outputs to dist/
npm run preview  # serve at localhost:4173
```

The production build includes a service worker for offline support.

---

## 📁 Project Structure

```
/
├── index.html              # Vite entry HTML
├── package.json
├── vite.config.ts           # Vite + PWA config
├── vitest.config.ts         # Test config
├── tsconfig.json
├── tailwind.config.js
├── postcss.config.js
├── playwright.config.ts     # E2E test config
├── public/
│   └── icons/               # PWA icons
├── src/
│   ├── main.tsx             # App entry point
│   ├── App.tsx              # Root component + routing
│   ├── components/          # Shared components
│   │   ├── BottomNav.tsx
│   │   ├── Header.tsx
│   │   ├── EmptyState.tsx
│   │   ├── ErrorBoundary.tsx
│   │   └── LoadingSpinner.tsx
│   ├── routes/              # Page components (code-split)
│   │   ├── DashboardPage.tsx
│   │   ├── StudyPage.tsx
│   │   ├── AssignmentsPage.tsx
│   │   ├── TimetablePage.tsx
│   │   ├── GradesPage.tsx
│   │   ├── ExpensesPage.tsx
│   │   ├── WellnessPage.tsx
│   │   ├── JournalPage.tsx
│   │   ├── GoalsPage.tsx
│   │   ├── ResearchPage.tsx
│   │   ├── AnalyticsPage.tsx
│   │   └── SettingsPage.tsx
│   ├── store/
│   │   └── useAppStore.ts   # Zustand store
│   ├── db/
│   │   ├── db.ts            # Dexie IndexedDB schema
│   │   └── migrations.ts    # v3 → v4 migration + export
│   ├── schemas/
│   │   └── app.schema.ts    # Zod schemas for all data types
│   ├── utils/
│   │   ├── dates.ts
│   │   ├── crypto.ts        # AES-GCM encryption
│   │   ├── exportImport.ts  # JSON + encrypted export/import
│   │   ├── notifications.ts # Browser notification API
│   │   └── analytics.ts     # Study analytics functions
│   ├── styles/
│   │   └── globals.css      # Tailwind + base styles
│   └── tests/
│       ├── setup.ts
│       ├── unit/             # Vitest unit tests
│       └── e2e/              # Playwright E2E tests
└── index.v3.html            # Original v3 single-file app (preserved)
```

---

## 🏗️ Architecture

### Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + TypeScript |
| Build | Vite 6 |
| Styling | Tailwind CSS 3 |
| State | Zustand 5 |
| Database | Dexie (IndexedDB wrapper) |
| Validation | Zod 3 |
| Routing | React Router 7 |
| PWA | vite-plugin-pwa (Workbox) |
| Unit Tests | Vitest + React Testing Library |
| E2E Tests | Playwright |

### Data Flow

```
User Action → Zustand Store → Dexie IndexedDB
                    ↓
              React Components (reactive)
```

### Routing

| Route | Module |
|-------|--------|
| `/dashboard` | Overview, stats, upcoming deadlines |
| `/study` | Study timer, session history |
| `/assignments` | Assignments & exams management |
| `/timetable` | Weekly class schedule |
| `/grades` | Semester, course, assessment tracking |
| `/expenses` | Budget & expense tracking |
| `/wellness` | Sleep, water, mood, exercise |
| `/journal` | Daily journaling |
| `/goals` | Goals with milestones |
| `/research` | Research log |
| `/analytics` | Study trends, insights |
| `/settings` | Preferences, subjects, data management |

---

## 🔒 Data & Privacy

- **100% local** — All data stays on your device in IndexedDB
- **Zero telemetry** — No analytics, no tracking, no data collection
- **No backend** — The app works entirely offline after first load
- **Encrypted exports** — Backup files can be encrypted with AES-256-GCM using a passphrase you choose (the passphrase is never stored)
- **Data validation** — All imported/migrated data is validated with Zod schemas
- **Privacy screen** — Settings page explains exactly what is stored and where

---

## 🔄 Migration from v3

If you have existing v3 data (stored in localStorage under `studentOS`):

1. The app **automatically detects** v3 data on first load
2. Data is **validated and migrated** to IndexedDB tables
3. A **migration report** is shown in Settings
4. Your v3 data is **backed up** to `studentOS_v3_backup` in localStorage
5. The original v3 data remains until you manually clear it

### What's migrated:
- Subjects, study sessions, assignments, expenses
- Timetable, goals, journal entries, research log
- Sleep/exercise/mood/water logs
- Grades, settings, gamification (XP, level, achievements)
- Habits and habit order

---

## 🧪 Testing

### Unit Tests (Vitest)

```bash
npm run test        # Run all unit tests
npm run test:watch  # Watch mode
```

Covers: date utilities, analytics functions, Zod schemas, store shape, export/import validation.

### E2E Tests (Playwright)

```bash
npm run build       # Build first
npm run test:e2e    # Run E2E tests
```

Smoke tests: app loading, navigation, page rendering.

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes and add tests
4. Run `npm run test && npm run build` to verify
5. Commit and push
6. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

<div align="center">

**Made with ❤️ for students everywhere**

*StudentOS v4.0 — Privacy-first, offline-first, student-first*

</div>
