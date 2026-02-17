import { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { formatTime } from '../utils/dates';
import { EmptyState } from '../components/EmptyState';
import type { TimetableEntry } from '../schemas/app.schema';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const SHORT_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function TimetablePage() {
  const { timetable, subjects, settings, addTimetableEntry, updateTimetableEntry, deleteTimetableEntry } = useAppStore();
  const [showForm, setShowForm] = useState(false);
  const [selectedDay, setSelectedDay] = useState(new Date().getDay());

  // Form state
  const [editId, setEditId] = useState<string | null>(null);
  const [subject, setSubject] = useState('');
  const [day, setDay] = useState(selectedDay);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [room, setRoom] = useState('');

  const subjectNames = subjects.map((s) => s.name);

  const resetForm = () => {
    setEditId(null);
    setSubject('');
    setDay(selectedDay);
    setStartTime('09:00');
    setEndTime('10:00');
    setRoom('');
    setShowForm(false);
  };

  const handleSubmit = async () => {
    if (!subject) return;
    const entry: TimetableEntry = {
      id: editId || crypto.randomUUID(),
      subject,
      day,
      startTime,
      endTime,
      room,
      color: subjects.find((s) => s.name === subject)?.color || '#6366f1',
      notes: '',
    };
    if (editId) {
      await updateTimetableEntry(entry);
    } else {
      await addTimetableEntry(entry);
    }
    resetForm();
  };

  const dayEntries = timetable
    .filter((t) => t.day === selectedDay)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Timetable</h2>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="px-3 py-1.5 bg-brand-600 text-white rounded-lg text-sm hover:bg-brand-500 transition">
          + Add
        </button>
      </div>

      {/* Day selector */}
      <div className="flex gap-1 overflow-x-auto pb-1">
        {SHORT_DAYS.map((d, i) => (
          <button
            key={i}
            onClick={() => setSelectedDay(i)}
            className={`px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition ${
              selectedDay === i ? 'bg-brand-600 text-white' : 'bg-slate-800 text-slate-400'
            }`}
          >
            {d}
          </button>
        ))}
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-slate-800 rounded-xl p-4 space-y-3 animate-fade-in">
          <h3 className="text-sm font-semibold text-white">{editId ? 'Edit' : 'Add'} Class</h3>
          <select value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full bg-slate-700 text-white px-3 py-2 rounded-lg text-sm" aria-label="Subject">
            <option value="">Select subject</option>
            {subjectNames.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <select value={day} onChange={(e) => setDay(Number(e.target.value))} className="w-full bg-slate-700 text-white px-3 py-2 rounded-lg text-sm" aria-label="Day">
            {DAYS.map((d, i) => <option key={i} value={i}>{d}</option>)}
          </select>
          <div className="grid grid-cols-2 gap-2">
            <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="bg-slate-700 text-white px-3 py-2 rounded-lg text-sm" aria-label="Start time" />
            <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="bg-slate-700 text-white px-3 py-2 rounded-lg text-sm" aria-label="End time" />
          </div>
          <input value={room} onChange={(e) => setRoom(e.target.value)} placeholder="Room (optional)" className="w-full bg-slate-700 text-white px-3 py-2 rounded-lg text-sm" aria-label="Room" />
          <div className="flex gap-2">
            <button onClick={handleSubmit} className="flex-1 py-2 bg-brand-600 text-white rounded-lg text-sm hover:bg-brand-500">{editId ? 'Update' : 'Add'}</button>
            <button onClick={resetForm} className="px-4 py-2 bg-slate-700 text-slate-300 rounded-lg text-sm">Cancel</button>
          </div>
        </div>
      )}

      {/* Day schedule */}
      <div>
        <h3 className="text-sm font-semibold text-slate-400 mb-2">{DAYS[selectedDay]}</h3>
        {dayEntries.length === 0 ? (
          <EmptyState icon="📅" title="No classes" description={`No classes on ${DAYS[selectedDay]}`} />
        ) : (
          <div className="space-y-2">
            {dayEntries.map((entry) => (
              <div key={entry.id} className="bg-slate-800/50 rounded-lg p-3 border-l-4" style={{ borderColor: entry.color }}>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-white">{entry.subject}</p>
                    <p className="text-xs text-slate-400">
                      {formatTime(entry.startTime, settings.timeFormat)} - {formatTime(entry.endTime, settings.timeFormat)}
                      {entry.room && ` • ${entry.room}`}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => {
                        setEditId(entry.id);
                        setSubject(entry.subject);
                        setDay(entry.day);
                        setStartTime(entry.startTime);
                        setEndTime(entry.endTime);
                        setRoom(entry.room);
                        setShowForm(true);
                      }}
                      className="text-slate-500 hover:text-white text-sm p-1"
                      aria-label={`Edit ${entry.subject}`}
                    >✏️</button>
                    <button onClick={() => deleteTimetableEntry(entry.id)} className="text-slate-500 hover:text-rose-400 text-sm p-1" aria-label={`Delete ${entry.subject}`}>✕</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
