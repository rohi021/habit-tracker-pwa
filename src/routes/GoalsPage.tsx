import { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { formatDate, todayKey } from '../utils/dates';
import { EmptyState } from '../components/EmptyState';
import type { Goal } from '../schemas/app.schema';

const CATEGORIES = ['Academic', 'Health', 'Financial', 'Personal', 'Career'];

export default function GoalsPage() {
  const { goals, addGoal, updateGoal, deleteGoal, addXP } = useAppStore();
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Academic');
  const [targetDate, setTargetDate] = useState('');
  const [milestoneText, setMilestoneText] = useState('');
  const [milestones, setMilestones] = useState<Array<{ text: string; done: boolean }>>([]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setCategory('Academic');
    setTargetDate('');
    setMilestones([]);
    setMilestoneText('');
    setShowForm(false);
  };

  const addMilestone = () => {
    if (!milestoneText.trim()) return;
    setMilestones([...milestones, { text: milestoneText, done: false }]);
    setMilestoneText('');
  };

  const handleSubmit = async () => {
    if (!title.trim()) return;
    const goal: Goal = {
      id: crypto.randomUUID(),
      title,
      description,
      category,
      targetDate: targetDate || todayKey(),
      milestones,
      createdAt: new Date().toISOString(),
    };
    await addGoal(goal);
    await addXP(15);
    resetForm();
  };

  const toggleMilestone = async (goal: Goal, idx: number) => {
    const updated = {
      ...goal,
      milestones: goal.milestones.map((m, i) => (i === idx ? { ...m, done: !m.done } : m)),
    };
    await updateGoal(updated);
    if (!goal.milestones[idx].done) await addXP(10);
  };

  const active = goals.filter((g) => !g.milestones.every((m) => m.done) || g.milestones.length === 0);
  const completed = goals.filter((g) => g.milestones.length > 0 && g.milestones.every((m) => m.done));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Goals</h2>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="px-3 py-1.5 bg-brand-600 text-white rounded-lg text-sm hover:bg-brand-500 transition">
          + Goal
        </button>
      </div>

      {showForm && (
        <div className="bg-slate-800 rounded-xl p-4 space-y-3 animate-fade-in">
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Goal title" className="w-full bg-slate-700 text-white px-3 py-2 rounded-lg text-sm" aria-label="Goal title" />
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" rows={2} className="w-full bg-slate-700 text-white px-3 py-2 rounded-lg text-sm resize-none" aria-label="Description" />
          <div className="grid grid-cols-2 gap-2">
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="bg-slate-700 text-white px-3 py-2 rounded-lg text-sm" aria-label="Category">
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <input type="date" value={targetDate} onChange={(e) => setTargetDate(e.target.value)} className="bg-slate-700 text-white px-3 py-2 rounded-lg text-sm" aria-label="Target date" />
          </div>
          <div className="flex gap-2">
            <input value={milestoneText} onChange={(e) => setMilestoneText(e.target.value)} placeholder="Add milestone" className="flex-1 bg-slate-700 text-white px-3 py-2 rounded-lg text-sm" aria-label="Milestone text" onKeyDown={(e) => e.key === 'Enter' && addMilestone()} />
            <button onClick={addMilestone} className="px-3 py-2 bg-slate-600 text-white rounded-lg text-sm">+</button>
          </div>
          {milestones.map((m, i) => (
            <div key={i} className="flex items-center gap-2 text-sm text-slate-300">
              <span>•</span> {m.text}
            </div>
          ))}
          <div className="flex gap-2">
            <button onClick={handleSubmit} className="flex-1 py-2 bg-brand-600 text-white rounded-lg text-sm">Create Goal</button>
            <button onClick={resetForm} className="px-4 py-2 bg-slate-700 text-slate-300 rounded-lg text-sm">Cancel</button>
          </div>
        </div>
      )}

      {/* Active goals */}
      {active.length === 0 && completed.length === 0 ? (
        <EmptyState icon="🎯" title="No goals yet" description="Set your first goal!" action={{ label: '+ Goal', onClick: () => setShowForm(true) }} />
      ) : (
        <>
          {active.length > 0 && (
            <section>
              <h3 className="text-sm font-semibold text-slate-400 mb-2">Active ({active.length})</h3>
              <div className="space-y-3">
                {active.map((g) => {
                  const done = g.milestones.filter((m) => m.done).length;
                  const total = g.milestones.length;
                  return (
                    <div key={g.id} className="bg-slate-800/50 rounded-xl p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="text-sm font-medium text-white">{g.title}</p>
                          <p className="text-xs text-slate-400">{g.category} • {formatDate(g.targetDate)}</p>
                        </div>
                        <button onClick={() => deleteGoal(g.id)} className="text-slate-500 hover:text-rose-400 text-sm" aria-label={`Delete ${g.title}`}>✕</button>
                      </div>
                      {g.description && <p className="text-xs text-slate-400 mb-2">{g.description}</p>}
                      {total > 0 && (
                        <>
                          <div className="w-full bg-slate-700 rounded-full h-1.5 mb-2">
                            <div className="bg-brand-500 h-1.5 rounded-full" style={{ width: `${(done / total) * 100}%` }} />
                          </div>
                          <div className="space-y-1">
                            {g.milestones.map((m, i) => (
                              <button
                                key={i}
                                onClick={() => toggleMilestone(g, i)}
                                className={`flex items-center gap-2 text-sm w-full text-left p-1 rounded hover:bg-slate-700/50 ${m.done ? 'text-slate-500 line-through' : 'text-white'}`}
                              >
                                <span className={`w-4 h-4 rounded-full border flex-shrink-0 flex items-center justify-center text-xs ${m.done ? 'bg-green-500 border-green-500' : 'border-slate-500'}`}>
                                  {m.done && '✓'}
                                </span>
                                {m.text}
                              </button>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {completed.length > 0 && (
            <section>
              <h3 className="text-sm font-semibold text-slate-400 mb-2">Completed ({completed.length})</h3>
              <div className="space-y-2">
                {completed.map((g) => (
                  <div key={g.id} className="bg-slate-800/50 rounded-lg p-3 opacity-60">
                    <p className="text-sm text-slate-400 line-through">{g.title}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
