import { useAppStore } from '../store/useAppStore';
import { studyBySubject, studyPerDay } from '../utils/analytics';
import { formatDuration, todayKey } from '../utils/dates';

export default function AnalyticsPage() {
  const { studySessions, assignments, expenses, sleepLog, settings, gamification } = useAppStore();

  const today = todayKey();
  const currentMonth = today.slice(0, 7);

  // Study analytics
  const bySubject = studyBySubject(studySessions);
  const dailyStudy = studyPerDay(studySessions, 14);
  const totalStudyMinutes = studySessions.reduce((s, ss) => s + ss.duration, 0);

  // Assignment analytics
  const totalAssignments = assignments.length;
  const completedAssignments = assignments.filter((a) => a.status === 'completed').length;
  const completionRate = totalAssignments > 0 ? Math.round((completedAssignments / totalAssignments) * 100) : 0;

  // Expense analytics
  const monthExpenses = expenses.filter((e) => e.date.startsWith(currentMonth));
  const monthTotal = monthExpenses.reduce((s, e) => s + e.amount, 0);

  // Sleep analytics
  const avgSleep = sleepLog.length > 0
    ? sleepLog.reduce((s, l) => s + l.hours, 0) / sleepLog.length
    : 0;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-white">Analytics</h2>

      {/* Overview cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-slate-800/50 rounded-xl p-4">
          <p className="text-xs text-slate-400">Total Study Time</p>
          <p className="text-xl font-bold text-white">{formatDuration(totalStudyMinutes)}</p>
          <p className="text-[10px] text-slate-500">{studySessions.length} sessions</p>
        </div>
        <div className="bg-slate-800/50 rounded-xl p-4">
          <p className="text-xs text-slate-400">Assignment Rate</p>
          <p className="text-xl font-bold text-white">{completionRate}%</p>
          <p className="text-[10px] text-slate-500">{completedAssignments}/{totalAssignments} completed</p>
        </div>
        <div className="bg-slate-800/50 rounded-xl p-4">
          <p className="text-xs text-slate-400">Avg Sleep</p>
          <p className="text-xl font-bold text-white">{avgSleep.toFixed(1)}h</p>
          <p className="text-[10px] text-slate-500">Goal: {settings.sleepGoal}h</p>
        </div>
        <div className="bg-slate-800/50 rounded-xl p-4">
          <p className="text-xs text-slate-400">Monthly Spending</p>
          <p className="text-xl font-bold text-white">{settings.currency}{monthTotal.toFixed(0)}</p>
          <p className="text-[10px] text-slate-500">Budget: {settings.currency}{settings.monthlyBudget}</p>
        </div>
      </div>

      {/* Daily study chart (text-based) */}
      <section>
        <h3 className="text-sm font-semibold text-slate-400 mb-2">Study Trend (Last 14 Days)</h3>
        <div className="bg-slate-800/50 rounded-xl p-4">
          <div className="flex items-end gap-1 h-32">
            {dailyStudy.map((d, i) => {
              const maxMin = Math.max(...dailyStudy.map((x) => x.minutes), 1);
              const heightPct = (d.minutes / maxMin) * 100;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full bg-slate-700 rounded-t flex-1 relative" style={{ minHeight: '4px' }}>
                    <div
                      className="absolute bottom-0 w-full bg-brand-500 rounded-t transition-all"
                      style={{ height: `${heightPct}%` }}
                      title={`${d.date}: ${formatDuration(d.minutes)}`}
                    />
                  </div>
                  <span className="text-[8px] text-slate-500">{d.date.slice(8)}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Study by subject */}
      {Object.keys(bySubject).length > 0 && (
        <section>
          <h3 className="text-sm font-semibold text-slate-400 mb-2">Study by Subject</h3>
          <div className="space-y-2">
            {Object.entries(bySubject)
              .sort(([, a], [, b]) => b - a)
              .map(([subject, minutes]) => {
                const maxMin = Math.max(...Object.values(bySubject));
                return (
                  <div key={subject} className="bg-slate-800/50 rounded-lg p-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-white">{subject}</span>
                      <span className="text-slate-400">{formatDuration(minutes)}</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-1.5">
                      <div className="bg-brand-500 h-1.5 rounded-full" style={{ width: `${(minutes / maxMin) * 100}%` }} />
                    </div>
                  </div>
                );
              })}
          </div>
        </section>
      )}

      {/* Gamification summary */}
      <section>
        <h3 className="text-sm font-semibold text-slate-400 mb-2">Gamification</h3>
        <div className="bg-slate-800/50 rounded-xl p-4">
          <div className="flex items-center gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-white">{gamification.level}</p>
              <p className="text-[10px] text-slate-500">Level</p>
            </div>
            <div className="flex-1">
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>{gamification.xp} XP</span>
                <span>{gamification.achievements.length} achievements</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div className="bg-amber-500 h-2 rounded-full" style={{ width: `${(gamification.xp % 100)}%` }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <p className="text-xs text-slate-600 text-center italic">
        Note: Correlations shown here do not imply causation. Use insights as starting points for self-reflection.
      </p>
    </div>
  );
}
