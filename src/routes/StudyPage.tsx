import { useState, useRef, useEffect, useCallback } from 'react';
import { useAppStore } from '../store/useAppStore';
import { todayKey, dateToKey, formatDuration } from '../utils/dates';
import { studyMinutesForDate } from '../utils/analytics';
import { EmptyState } from '../components/EmptyState';
import type { StudySession } from '../schemas/app.schema';

export default function StudyPage() {
  const { studySessions, subjects, settings, addStudySession, deleteStudySession, addXP } = useAppStore();
  const [isRunning, setIsRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [sessionType, setSessionType] = useState<'regular' | 'pomodoro'>('regular');
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<Date | null>(null);

  const today = todayKey();
  const todayMinutes = studyMinutesForDate(studySessions, today);
  const subjectNames = subjects.map((s) => s.name);

  useEffect(() => {
    if (subjectNames.length > 0 && !selectedSubject) {
      setSelectedSubject(subjectNames[0]);
    }
  }, [subjectNames, selectedSubject]);

  const startTimer = useCallback(() => {
    if (!selectedSubject) return;
    startTimeRef.current = new Date();
    setIsRunning(true);
    setElapsed(0);
    intervalRef.current = setInterval(() => {
      setElapsed((prev) => prev + 1);
    }, 1000);
  }, [selectedSubject]);

  const stopTimer = useCallback(async () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsRunning(false);

    if (startTimeRef.current && elapsed > 30) {
      const duration = Math.round(elapsed / 60);
      const session: StudySession = {
        id: crypto.randomUUID(),
        subject: selectedSubject,
        startTime: startTimeRef.current.toISOString(),
        endTime: new Date().toISOString(),
        duration,
        notes: '',
        date: dateToKey(startTimeRef.current),
        type: sessionType,
      };
      await addStudySession(session);
      await addXP(Math.max(5, Math.floor(duration / 5)));
    }

    setElapsed(0);
    startTimeRef.current = null;
  }, [elapsed, selectedSubject, sessionType, addStudySession, addXP]);

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const recentSessions = studySessions
    .slice()
    .sort((a, b) => b.startTime.localeCompare(a.startTime))
    .slice(0, 10);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-white">Study Timer</h2>

      {/* Progress bar */}
      <div className="bg-slate-800/50 rounded-xl p-4">
        <div className="flex justify-between text-sm text-slate-400 mb-2">
          <span>Today: {formatDuration(todayMinutes)}</span>
          <span>Goal: {formatDuration(settings.dailyStudyGoal)}</span>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-2">
          <div
            className="bg-brand-500 h-2 rounded-full transition-all"
            style={{ width: `${Math.min(100, (todayMinutes / settings.dailyStudyGoal) * 100)}%` }}
          />
        </div>
      </div>

      {/* Timer */}
      <div className="bg-slate-800/50 rounded-xl p-6 text-center">
        {subjectNames.length === 0 ? (
          <p className="text-slate-400 text-sm mb-4">Add subjects in Settings first</p>
        ) : (
          <>
            <div className="flex gap-2 justify-center mb-4 flex-wrap">
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                disabled={isRunning}
                className="bg-slate-700 text-white px-3 py-2 rounded-lg text-sm border-0"
                aria-label="Select subject"
              >
                {subjectNames.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <select
                value={sessionType}
                onChange={(e) => setSessionType(e.target.value as 'regular' | 'pomodoro')}
                disabled={isRunning}
                className="bg-slate-700 text-white px-3 py-2 rounded-lg text-sm border-0"
                aria-label="Session type"
              >
                <option value="regular">Regular</option>
                <option value="pomodoro">Pomodoro</option>
              </select>
            </div>

            <p className="text-5xl font-mono font-bold text-white mb-6" aria-live="polite">
              {formatTimer(elapsed)}
            </p>

            <button
              onClick={isRunning ? stopTimer : startTimer}
              className={`px-8 py-3 rounded-xl font-semibold text-white text-lg transition ${
                isRunning
                  ? 'bg-rose-600 hover:bg-rose-500'
                  : 'bg-brand-600 hover:bg-brand-500'
              }`}
            >
              {isRunning ? 'Stop' : 'Start Studying'}
            </button>
          </>
        )}
      </div>

      {/* Recent Sessions */}
      <section>
        <h3 className="text-sm font-semibold text-slate-400 mb-2">Recent Sessions</h3>
        {recentSessions.length === 0 ? (
          <EmptyState icon="📖" title="No sessions yet" description="Start your first study session above!" />
        ) : (
          <div className="space-y-2">
            {recentSessions.map((s) => (
              <div key={s.id} className="bg-slate-800/50 rounded-lg p-3 flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-white">{s.subject}</p>
                  <p className="text-xs text-slate-400">{s.date} • {s.type}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-white font-medium">{formatDuration(s.duration)}</span>
                  <button
                    onClick={() => deleteStudySession(s.id)}
                    className="text-slate-500 hover:text-rose-400 text-sm"
                    aria-label={`Delete session for ${s.subject}`}
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
