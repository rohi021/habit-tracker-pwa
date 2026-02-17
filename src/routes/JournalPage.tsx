import { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { todayKey, formatDate } from '../utils/dates';
import { EmptyState } from '../components/EmptyState';
import type { JournalEntry } from '../schemas/app.schema';

export default function JournalPage() {
  const { journalEntries, addJournalEntry, updateJournalEntry, deleteJournalEntry } = useAppStore();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [content, setContent] = useState('');
  const [gratitude, setGratitude] = useState('');
  const [mood, setMood] = useState('neutral');
  const [date, setDate] = useState(todayKey());

  const resetForm = () => {
    setContent('');
    setGratitude('');
    setMood('neutral');
    setDate(todayKey());
    setEditId(null);
    setShowForm(false);
  };

  const handleSubmit = async () => {
    if (!content.trim()) return;
    const entry: JournalEntry = {
      id: editId || crypto.randomUUID(),
      date,
      content,
      mood,
      energy: 3,
      gratitude,
      tags: [],
      wordCount: content.split(/\s+/).filter(Boolean).length,
    };
    if (editId) {
      await updateJournalEntry(entry);
    } else {
      await addJournalEntry(entry);
    }
    resetForm();
  };

  const startEdit = (e: JournalEntry) => {
    setEditId(e.id);
    setContent(e.content);
    setGratitude(e.gratitude);
    setMood(e.mood);
    setDate(e.date);
    setShowForm(true);
  };

  const sorted = journalEntries.slice().sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Journal</h2>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="px-3 py-1.5 bg-brand-600 text-white rounded-lg text-sm hover:bg-brand-500 transition">
          + Write
        </button>
      </div>

      {showForm && (
        <div className="bg-slate-800 rounded-xl p-4 space-y-3 animate-fade-in">
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full bg-slate-700 text-white px-3 py-2 rounded-lg text-sm" aria-label="Date" />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind?"
            rows={5}
            className="w-full bg-slate-700 text-white px-3 py-2 rounded-lg text-sm resize-none"
            aria-label="Journal content"
          />
          <textarea
            value={gratitude}
            onChange={(e) => setGratitude(e.target.value)}
            placeholder="I'm grateful for..."
            rows={2}
            className="w-full bg-slate-700 text-white px-3 py-2 rounded-lg text-sm resize-none"
            aria-label="Gratitude"
          />
          <div className="flex gap-2">
            <button onClick={handleSubmit} className="flex-1 py-2 bg-brand-600 text-white rounded-lg text-sm">{editId ? 'Update' : 'Save'}</button>
            <button onClick={resetForm} className="px-4 py-2 bg-slate-700 text-slate-300 rounded-lg text-sm">Cancel</button>
          </div>
        </div>
      )}

      {sorted.length === 0 ? (
        <EmptyState icon="📔" title="No entries yet" description="Start journaling your thoughts" action={{ label: '+ Write', onClick: () => setShowForm(true) }} />
      ) : (
        <div className="space-y-3">
          {sorted.map((e) => (
            <div key={e.id} className="bg-slate-800/50 rounded-xl p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="text-xs text-slate-400">{formatDate(e.date)} • {e.wordCount} words</p>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => startEdit(e)} className="text-slate-500 hover:text-white text-sm" aria-label="Edit entry">✏️</button>
                  <button onClick={() => deleteJournalEntry(e.id)} className="text-slate-500 hover:text-rose-400 text-sm" aria-label="Delete entry">✕</button>
                </div>
              </div>
              <p className="text-sm text-white whitespace-pre-wrap line-clamp-4">{e.content}</p>
              {e.gratitude && (
                <p className="text-xs text-emerald-400 mt-2">🙏 {e.gratitude}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
