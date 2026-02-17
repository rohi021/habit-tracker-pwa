import { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { todayKey } from '../utils/dates';
import type { SleepLog, ExerciseLog, MoodEntry } from '../schemas/app.schema';

const MOODS: Record<string, string> = { veryHappy: '😄', happy: '😊', neutral: '😐', sad: '😔', verySad: '😢' };

export default function WellnessPage() {
  const { sleepLog, exerciseLog, moodLog, waterLog, settings, addSleepLog, addExercise, logMood, logWater } = useAppStore();
  const today = todayKey();

  // Water
  const todayWater = waterLog[today] || 0;

  // Mood
  const todayMood = moodLog[today];
  const [selectedMood, setSelectedMood] = useState<string>(todayMood?.mood || '');
  const [energy, setEnergy] = useState(todayMood?.energy || 3);

  // Sleep form
  const [showSleepForm, setShowSleepForm] = useState(false);
  const [bedtime, setBedtime] = useState('23:00');
  const [wakeTime, setWakeTime] = useState('07:00');
  const [sleepQuality, setSleepQuality] = useState(3);

  // Exercise form
  const [showExerciseForm, setShowExerciseForm] = useState(false);
  const [exerciseType, setExerciseType] = useState('Running');
  const [exerciseDuration, setExerciseDuration] = useState('30');

  const handleWater = async (delta: number) => {
    await logWater(today, Math.max(0, todayWater + delta));
  };

  const handleMood = async (mood: string) => {
    setSelectedMood(mood);
    const entry: MoodEntry = { mood: mood as MoodEntry['mood'], energy, note: '' };
    await logMood(today, entry);
  };

  const handleSleep = async () => {
    const [bh, bm] = bedtime.split(':').map(Number);
    const [wh, wm] = wakeTime.split(':').map(Number);
    let hours = wh + wm / 60 - (bh + bm / 60);
    if (hours < 0) hours += 24;
    const log: SleepLog = {
      id: crypto.randomUUID(),
      date: today,
      bedtime,
      wakeTime,
      hours: Math.round(hours * 10) / 10,
      quality: sleepQuality,
    };
    await addSleepLog(log);
    setShowSleepForm(false);
  };

  const handleExercise = async () => {
    const log: ExerciseLog = {
      id: crypto.randomUUID(),
      date: today,
      type: exerciseType,
      duration: parseInt(exerciseDuration) || 30,
      notes: '',
    };
    await addExercise(log);
    setShowExerciseForm(false);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-white">Wellness</h2>

      {/* Water tracker */}
      <div className="bg-slate-800/50 rounded-xl p-4">
        <h3 className="text-sm font-semibold text-white mb-2">💧 Water Intake</h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => handleWater(-1)} className="w-8 h-8 bg-slate-700 rounded-full text-white text-lg" aria-label="Decrease water">-</button>
            <span className="text-2xl font-bold text-white">{todayWater}</span>
            <button onClick={() => handleWater(1)} className="w-8 h-8 bg-brand-600 rounded-full text-white text-lg" aria-label="Increase water">+</button>
          </div>
          <span className="text-sm text-slate-400">Goal: {settings.waterGoal} glasses</span>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-2 mt-2">
          <div className="bg-cyan-500 h-2 rounded-full transition-all" style={{ width: `${Math.min(100, (todayWater / settings.waterGoal) * 100)}%` }} />
        </div>
      </div>

      {/* Mood */}
      <div className="bg-slate-800/50 rounded-xl p-4">
        <h3 className="text-sm font-semibold text-white mb-2">😊 How are you feeling?</h3>
        <div className="flex gap-3 justify-center">
          {Object.entries(MOODS).map(([key, emoji]) => (
            <button
              key={key}
              onClick={() => handleMood(key)}
              className={`text-3xl p-2 rounded-lg transition ${selectedMood === key ? 'bg-brand-600/30 ring-2 ring-brand-500' : 'hover:bg-slate-700'}`}
              aria-label={key}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>

      {/* Sleep */}
      <div className="bg-slate-800/50 rounded-xl p-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-semibold text-white">😴 Sleep Log</h3>
          <button onClick={() => setShowSleepForm(!showSleepForm)} className="text-xs text-brand-500">+ Log Sleep</button>
        </div>
        {showSleepForm && (
          <div className="space-y-2 mt-2">
            <div className="grid grid-cols-2 gap-2">
              <input type="time" value={bedtime} onChange={(e) => setBedtime(e.target.value)} className="bg-slate-700 text-white px-3 py-2 rounded-lg text-sm" aria-label="Bedtime" />
              <input type="time" value={wakeTime} onChange={(e) => setWakeTime(e.target.value)} className="bg-slate-700 text-white px-3 py-2 rounded-lg text-sm" aria-label="Wake time" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Quality:</span>
              {[1, 2, 3, 4, 5].map((q) => (
                <button key={q} onClick={() => setSleepQuality(q)} className={`text-sm ${sleepQuality >= q ? 'text-yellow-400' : 'text-slate-600'}`} aria-label={`Quality ${q}`}>★</button>
              ))}
            </div>
            <button onClick={handleSleep} className="w-full py-2 bg-brand-600 text-white rounded-lg text-sm">Log Sleep</button>
          </div>
        )}
        {sleepLog.slice(-3).reverse().map((s) => (
          <div key={s.id} className="bg-slate-700/50 rounded-lg p-2 mt-2">
            <p className="text-sm text-white">{s.hours}h • {s.date}</p>
          </div>
        ))}
      </div>

      {/* Exercise */}
      <div className="bg-slate-800/50 rounded-xl p-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-semibold text-white">💪 Exercise</h3>
          <button onClick={() => setShowExerciseForm(!showExerciseForm)} className="text-xs text-brand-500">+ Log</button>
        </div>
        {showExerciseForm && (
          <div className="space-y-2 mt-2">
            <input value={exerciseType} onChange={(e) => setExerciseType(e.target.value)} placeholder="Exercise type" className="w-full bg-slate-700 text-white px-3 py-2 rounded-lg text-sm" aria-label="Exercise type" />
            <input type="number" value={exerciseDuration} onChange={(e) => setExerciseDuration(e.target.value)} placeholder="Minutes" className="w-full bg-slate-700 text-white px-3 py-2 rounded-lg text-sm" aria-label="Duration in minutes" />
            <button onClick={handleExercise} className="w-full py-2 bg-brand-600 text-white rounded-lg text-sm">Log Exercise</button>
          </div>
        )}
        {exerciseLog.slice(-3).reverse().map((e) => (
          <div key={e.id} className="bg-slate-700/50 rounded-lg p-2 mt-2">
            <p className="text-sm text-white">{e.type} • {e.duration}min • {e.date}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
