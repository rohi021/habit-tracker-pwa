import { useAppStore } from '../store/useAppStore';
import { todayKey, formatDate, formatDuration, isOverdue } from '../utils/dates';
import { studyMinutesForDate, studyMinutesThisWeek } from '../utils/analytics';
import { EmptyState } from '../components/EmptyState';

export default function DashboardPage() {
  const {
    studySessions, assignments, expenses, goals, timetable,
    settings, gamification, subjects,
  } = useAppStore();

  const today = todayKey();
  const todayMinutes = studyMinutesForDate(studySessions, today);
  const weekMinutes = studyMinutesThisWeek(studySessions, settings.weekStartsOn);

  const upcomingAssignments = assignments
    .filter((a) => a.status !== 'completed' && !isOverdue(a.dueDate))
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    .slice(0, 5);

  const overdueAssignments = assignments.filter(
    (a) => a.status !== 'completed' && isOverdue(a.dueDate),
  );

  const todayDay = new Date().getDay();
  const todayClasses = timetable
    .filter((t) => t.day === todayDay)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const monthExpenses = expenses
    .filter((e) => e.date.startsWith(today.slice(0, 7)))
    .reduce((sum, e) => sum + e.amount, 0);

  const activeGoals = goals.filter((g) => {
    const completed = g.milestones.length > 0 && g.milestones.every((m) => m.done);
    return !completed;
  });

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-white">Dashboard</h2>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard icon="📖" label="Today" value={formatDuration(todayMinutes)} sub={`Goal: ${formatDuration(settings.dailyStudyGoal)}`} />
        <StatCard icon="📅" label="This Week" value={formatDuration(weekMinutes)} sub={`Goal: ${formatDuration(settings.weeklyStudyGoal)}`} />
        <StatCard icon="⭐" label="Level" value={String(gamification.level)} sub={`${gamification.xp} XP`} />
        <StatCard icon="💰" label="Spending" value={`${settings.currency}${monthExpenses.toFixed(0)}`} sub={`Budget: ${settings.currency}${settings.monthlyBudget}`} />
      </div>

      {/* Overdue Alerts */}
      {overdueAssignments.length > 0 && (
        <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-4">
          <h3 className="text-sm font-semibold text-rose-400 mb-2">⚠️ Overdue ({overdueAssignments.length})</h3>
          {overdueAssignments.map((a) => (
            <p key={a.id} className="text-sm text-rose-300">• {a.title} — due {formatDate(a.dueDate)}</p>
          ))}
        </div>
      )}

      {/* Today's Schedule */}
      <section>
        <h3 className="text-sm font-semibold text-slate-400 mb-2">Today&apos;s Classes</h3>
        {todayClasses.length === 0 ? (
          <p className="text-slate-500 text-sm">No classes today 🎉</p>
        ) : (
          <div className="space-y-2">
            {todayClasses.map((c) => (
              <div key={c.id} className="bg-slate-800/50 rounded-lg p-3 flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-white">{c.subject}</p>
                  <p className="text-xs text-slate-400">{c.room}</p>
                </div>
                <p className="text-xs text-slate-400">{c.startTime} - {c.endTime}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Upcoming Assignments */}
      <section>
        <h3 className="text-sm font-semibold text-slate-400 mb-2">Upcoming Deadlines</h3>
        {upcomingAssignments.length === 0 ? (
          <EmptyState icon="✅" title="All clear!" description="No upcoming deadlines" />
        ) : (
          <div className="space-y-2">
            {upcomingAssignments.map((a) => (
              <div key={a.id} className="bg-slate-800/50 rounded-lg p-3 flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-white">{a.title}</p>
                  <p className="text-xs text-slate-400">{a.subject} • {a.type}</p>
                </div>
                <p className="text-xs text-slate-400">{formatDate(a.dueDate)}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Active Goals */}
      {activeGoals.length > 0 && (
        <section>
          <h3 className="text-sm font-semibold text-slate-400 mb-2">Active Goals ({activeGoals.length})</h3>
          <div className="space-y-2">
            {activeGoals.slice(0, 3).map((g) => {
              const done = g.milestones.filter((m) => m.done).length;
              const total = g.milestones.length;
              const pct = total > 0 ? Math.round((done / total) * 100) : 0;
              return (
                <div key={g.id} className="bg-slate-800/50 rounded-lg p-3">
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-sm font-medium text-white">{g.title}</p>
                    <span className="text-xs text-slate-400">{pct}%</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-1.5">
                    <div className="bg-brand-500 h-1.5 rounded-full transition-all" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Subjects */}
      {subjects.length > 0 && (
        <section>
          <h3 className="text-sm font-semibold text-slate-400 mb-2">Subjects ({subjects.length})</h3>
          <div className="flex flex-wrap gap-2">
            {subjects.map((s) => (
              <span key={s.id} className="px-3 py-1 rounded-full text-xs font-medium text-white" style={{ backgroundColor: s.color }}>
                {s.icon} {s.name}
              </span>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function StatCard({ icon, label, value, sub }: { icon: string; label: string; value: string; sub: string }) {
  return (
    <div className="bg-slate-800/50 rounded-xl p-3">
      <div className="flex items-center gap-2 mb-1">
        <span aria-hidden="true">{icon}</span>
        <span className="text-xs text-slate-400">{label}</span>
      </div>
      <p className="text-lg font-bold text-white">{value}</p>
      <p className="text-[10px] text-slate-500">{sub}</p>
    </div>
  );
}
