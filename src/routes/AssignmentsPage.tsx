import { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { formatDate, isOverdue, todayKey } from '../utils/dates';
import { EmptyState } from '../components/EmptyState';
import type { Assignment } from '../schemas/app.schema';

export default function AssignmentsPage() {
  const { assignments, subjects, addAssignment, updateAssignment, deleteAssignment, addXP } = useAppStore();
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [editId, setEditId] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [type, setType] = useState<'assignment' | 'exam'>('assignment');

  const subjectNames = subjects.map((s) => s.name);

  const resetForm = () => {
    setTitle('');
    setSubject('');
    setDueDate('');
    setPriority('medium');
    setType('assignment');
    setEditId(null);
    setShowForm(false);
  };

  const handleSubmit = async () => {
    if (!title.trim() || !dueDate) return;
    if (editId) {
      const existing = assignments.find((a) => a.id === editId);
      if (existing) {
        await updateAssignment({ ...existing, title, subject, dueDate, priority, type });
      }
    } else {
      const assignment: Assignment = {
        id: crypto.randomUUID(),
        title,
        subject: subject || subjectNames[0] || 'General',
        dueDate,
        priority,
        status: 'pending',
        type,
        prepProgress: 0,
        progress: 0,
        topics: [],
        notes: '',
        createdAt: new Date().toISOString(),
      };
      await addAssignment(assignment);
      await addXP(10);
    }
    resetForm();
  };

  const toggleComplete = async (a: Assignment) => {
    const newStatus = a.status === 'completed' ? 'pending' : 'completed';
    await updateAssignment({ ...a, status: newStatus });
    if (newStatus === 'completed') await addXP(25);
  };

  const startEdit = (a: Assignment) => {
    setTitle(a.title);
    setSubject(a.subject);
    setDueDate(a.dueDate);
    setPriority(a.priority);
    setType(a.type);
    setEditId(a.id);
    setShowForm(true);
  };

  const filtered = assignments
    .filter((a) => {
      if (filter === 'pending') return a.status !== 'completed';
      if (filter === 'completed') return a.status === 'completed';
      return true;
    })
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate));

  const priorityColor = { low: 'bg-green-500/20 text-green-400', medium: 'bg-amber-500/20 text-amber-400', high: 'bg-rose-500/20 text-rose-400' };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Assignments & Exams</h2>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="px-3 py-1.5 bg-brand-600 text-white rounded-lg text-sm hover:bg-brand-500 transition"
        >
          + Add
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2">
        {(['all', 'pending', 'completed'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition ${
              filter === f ? 'bg-brand-600 text-white' : 'bg-slate-800 text-slate-400'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="bg-slate-800 rounded-xl p-4 space-y-3 animate-fade-in">
          <h3 className="text-sm font-semibold text-white">{editId ? 'Edit' : 'New'} {type}</h3>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="w-full bg-slate-700 text-white px-3 py-2 rounded-lg text-sm"
            aria-label="Title"
          />
          <div className="grid grid-cols-2 gap-2">
            <select value={subject} onChange={(e) => setSubject(e.target.value)} className="bg-slate-700 text-white px-3 py-2 rounded-lg text-sm" aria-label="Subject">
              {subjectNames.map((s) => <option key={s} value={s}>{s}</option>)}
              <option value="General">General</option>
            </select>
            <select value={type} onChange={(e) => setType(e.target.value as 'assignment' | 'exam')} className="bg-slate-700 text-white px-3 py-2 rounded-lg text-sm" aria-label="Type">
              <option value="assignment">Assignment</option>
              <option value="exam">Exam</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="bg-slate-700 text-white px-3 py-2 rounded-lg text-sm" aria-label="Due date" />
            <select value={priority} onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')} className="bg-slate-700 text-white px-3 py-2 rounded-lg text-sm" aria-label="Priority">
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button onClick={handleSubmit} className="flex-1 py-2 bg-brand-600 text-white rounded-lg text-sm hover:bg-brand-500">
              {editId ? 'Update' : 'Add'}
            </button>
            <button onClick={resetForm} className="px-4 py-2 bg-slate-700 text-slate-300 rounded-lg text-sm">Cancel</button>
          </div>
        </div>
      )}

      {/* List */}
      {filtered.length === 0 ? (
        <EmptyState icon="📋" title="No assignments" description="Add your first assignment or exam!" action={{ label: '+ Add', onClick: () => setShowForm(true) }} />
      ) : (
        <div className="space-y-2">
          {filtered.map((a) => {
            const overdue = a.status !== 'completed' && isOverdue(a.dueDate);
            return (
              <div
                key={a.id}
                className={`bg-slate-800/50 rounded-lg p-3 ${overdue ? 'border border-rose-500/30' : ''}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2 flex-1 min-w-0">
                    <button
                      onClick={() => toggleComplete(a)}
                      className={`mt-0.5 w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center text-xs ${
                        a.status === 'completed'
                          ? 'bg-green-500 border-green-500 text-white'
                          : 'border-slate-500'
                      }`}
                      aria-label={`Mark ${a.title} as ${a.status === 'completed' ? 'pending' : 'completed'}`}
                    >
                      {a.status === 'completed' && '✓'}
                    </button>
                    <div className="min-w-0">
                      <p className={`text-sm font-medium ${a.status === 'completed' ? 'text-slate-500 line-through' : 'text-white'}`}>
                        {a.title}
                      </p>
                      <p className="text-xs text-slate-400">{a.subject} • {formatDate(a.dueDate)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${priorityColor[a.priority]}`}>
                      {a.priority}
                    </span>
                    <button onClick={() => startEdit(a)} className="text-slate-500 hover:text-white text-sm p-1" aria-label={`Edit ${a.title}`}>✏️</button>
                    <button onClick={() => deleteAssignment(a.id)} className="text-slate-500 hover:text-rose-400 text-sm p-1" aria-label={`Delete ${a.title}`}>✕</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
