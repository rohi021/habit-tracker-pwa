import { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { todayKey, formatDate } from '../utils/dates';
import { EmptyState } from '../components/EmptyState';
import type { ResearchEntry } from '../schemas/app.schema';

const TYPES = ['paper', 'experiment', 'model', 'deployment', 'insight', 'bugfix'] as const;

export default function ResearchPage() {
  const { researchLog, addResearchEntry, deleteResearchEntry } = useAppStore();
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [type, setType] = useState<typeof TYPES[number]>('paper');
  const [notes, setNotes] = useState('');
  const [duration, setDuration] = useState('60');

  const handleSubmit = async () => {
    if (!title.trim()) return;
    const entry: ResearchEntry = {
      id: crypto.randomUUID(),
      date: todayKey(),
      type,
      title,
      notes,
      duration: parseInt(duration) || 60,
      domain: 'research',
    };
    await addResearchEntry(entry);
    setTitle('');
    setNotes('');
    setShowForm(false);
  };

  const sorted = researchLog.slice().sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Research</h2>
        <button onClick={() => setShowForm(true)} className="px-3 py-1.5 bg-brand-600 text-white rounded-lg text-sm hover:bg-brand-500 transition">+ Add</button>
      </div>

      {showForm && (
        <div className="bg-slate-800 rounded-xl p-4 space-y-3 animate-fade-in">
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" className="w-full bg-slate-700 text-white px-3 py-2 rounded-lg text-sm" aria-label="Title" />
          <div className="grid grid-cols-2 gap-2">
            <select value={type} onChange={(e) => setType(e.target.value as typeof TYPES[number])} className="bg-slate-700 text-white px-3 py-2 rounded-lg text-sm" aria-label="Type">
              {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            <input type="number" value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="Minutes" className="bg-slate-700 text-white px-3 py-2 rounded-lg text-sm" aria-label="Duration" />
          </div>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notes" rows={3} className="w-full bg-slate-700 text-white px-3 py-2 rounded-lg text-sm resize-none" aria-label="Notes" />
          <div className="flex gap-2">
            <button onClick={handleSubmit} className="flex-1 py-2 bg-brand-600 text-white rounded-lg text-sm">Add</button>
            <button onClick={() => setShowForm(false)} className="px-4 py-2 bg-slate-700 text-slate-300 rounded-lg text-sm">Cancel</button>
          </div>
        </div>
      )}

      {sorted.length === 0 ? (
        <EmptyState icon="🔬" title="No research entries" description="Track your research progress" />
      ) : (
        <div className="space-y-2">
          {sorted.map((e) => (
            <div key={e.id} className="bg-slate-800/50 rounded-lg p-3">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-white">{e.title}</p>
                  <p className="text-xs text-slate-400">{e.type} • {e.duration}min • {formatDate(e.date)}</p>
                  {e.notes && <p className="text-xs text-slate-500 mt-1">{e.notes}</p>}
                </div>
                <button onClick={() => deleteResearchEntry(e.id)} className="text-slate-500 hover:text-rose-400 text-sm" aria-label={`Delete ${e.title}`}>✕</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
