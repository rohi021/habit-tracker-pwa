import { useEffect, lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAppStore } from './store/useAppStore';
import { hasV3Data, migrateFromV3 } from './db/migrations';
import { ErrorBoundary } from './components/ErrorBoundary';
import { LoadingSpinner } from './components/LoadingSpinner';
import { BottomNav } from './components/BottomNav';
import { Header } from './components/Header';

// Code-split route components
const DashboardPage = lazy(() => import('./routes/DashboardPage'));
const StudyPage = lazy(() => import('./routes/StudyPage'));
const AssignmentsPage = lazy(() => import('./routes/AssignmentsPage'));
const TimetablePage = lazy(() => import('./routes/TimetablePage'));
const GradesPage = lazy(() => import('./routes/GradesPage'));
const ExpensesPage = lazy(() => import('./routes/ExpensesPage'));
const WellnessPage = lazy(() => import('./routes/WellnessPage'));
const JournalPage = lazy(() => import('./routes/JournalPage'));
const GoalsPage = lazy(() => import('./routes/GoalsPage'));
const ResearchPage = lazy(() => import('./routes/ResearchPage'));
const AnalyticsPage = lazy(() => import('./routes/AnalyticsPage'));
const SettingsPage = lazy(() => import('./routes/SettingsPage'));

export default function App() {
  const { isLoading, loadAll, setMigrationLogs, settings } = useAppStore();

  useEffect(() => {
    const init = async () => {
      // Check for v3 data migration
      if (hasV3Data()) {
        const logs = await migrateFromV3();
        if (logs) setMigrationLogs(logs);
      }
      await loadAll();
    };
    init();
  }, [loadAll, setMigrationLogs]);

  // Apply theme
  useEffect(() => {
    const root = document.documentElement;
    if (settings.theme === 'dark' || (settings.theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [settings.theme]);

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-20">
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-4">
        <ErrorBoundary>
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/study" element={<StudyPage />} />
              <Route path="/assignments" element={<AssignmentsPage />} />
              <Route path="/timetable" element={<TimetablePage />} />
              <Route path="/grades" element={<GradesPage />} />
              <Route path="/expenses" element={<ExpensesPage />} />
              <Route path="/wellness" element={<WellnessPage />} />
              <Route path="/journal" element={<JournalPage />} />
              <Route path="/goals" element={<GoalsPage />} />
              <Route path="/research" element={<ResearchPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </main>
      <BottomNav />
    </div>
  );
}
