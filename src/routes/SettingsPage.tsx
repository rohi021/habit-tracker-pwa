import { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { exportAllData } from '../db/migrations';
import { exportJSON, exportEncryptedJSON, importJSON, importEncryptedJSON, downloadFile } from '../utils/exportImport';
import type { Subject } from '../schemas/app.schema';

export default function SettingsPage() {
  const { settings, updateSettings, subjects, addSubject, updateSubject, deleteSubject, migrationLogs } = useAppStore();
  const [showSubjectForm, setShowSubjectForm] = useState(false);
  const [subjectName, setSubjectName] = useState('');
  const [subjectColor, setSubjectColor] = useState('#6366f1');
  const [exportPassphrase, setExportPassphrase] = useState('');
  const [importStatus, setImportStatus] = useState('');

  const handleAddSubject = async () => {
    if (!subjectName.trim()) return;
    const subject: Subject = {
      id: crypto.randomUUID(),
      name: subjectName,
      color: subjectColor,
      icon: '📘',
      weeklyGoalHours: 0,
    };
    await addSubject(subject);
    setSubjectName('');
    setShowSubjectForm(false);
  };

  const handleExport = async (encrypted: boolean) => {
    const data = await exportAllData();
    if (encrypted && exportPassphrase) {
      const content = await exportEncryptedJSON(data, exportPassphrase);
      downloadFile(content, `studentos-backup-encrypted-${new Date().toISOString().slice(0, 10)}.json`);
    } else {
      const content = exportJSON(data);
      downloadFile(content, `studentos-backup-${new Date().toISOString().slice(0, 10)}.json`);
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    const result = importJSON(text);
    if (result.success) {
      setImportStatus(`✅ Valid backup with ${result.data.assignments.length} assignments, ${result.data.studySessions.length} sessions`);
    } else {
      setImportStatus(`❌ ${result.error}`);
    }
    e.target.value = '';
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-white">Settings</h2>

      {/* Migration logs */}
      {migrationLogs && (
        <div className="bg-slate-800/50 rounded-xl p-4">
          <h3 className="text-sm font-semibold text-white mb-2">Migration Report (v3 → v4)</h3>
          <div className="space-y-1">
            {migrationLogs.map((log, i) => (
              <p key={i} className={`text-xs ${log.status === 'success' ? 'text-green-400' : 'text-rose-400'}`}>
                {log.status === 'success' ? '✅' : '❌'} {log.step}
                {log.details && <span className="text-slate-500"> — {log.details}</span>}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Subjects */}
      <section className="bg-slate-800/50 rounded-xl p-4 space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-semibold text-white">Subjects / Courses</h3>
          <button onClick={() => setShowSubjectForm(true)} className="text-xs text-brand-500">+ Add</button>
        </div>
        {showSubjectForm && (
          <div className="flex gap-2">
            <input value={subjectName} onChange={(e) => setSubjectName(e.target.value)} placeholder="Subject name" className="flex-1 bg-slate-700 text-white px-3 py-2 rounded-lg text-sm" aria-label="Subject name" />
            <input type="color" value={subjectColor} onChange={(e) => setSubjectColor(e.target.value)} className="w-10 h-10 rounded-lg border-0 cursor-pointer" aria-label="Subject color" />
            <button onClick={handleAddSubject} className="px-3 py-2 bg-brand-600 text-white rounded-lg text-sm">Add</button>
          </div>
        )}
        <div className="space-y-1">
          {subjects.map((s) => (
            <div key={s.id} className="flex items-center justify-between bg-slate-700/50 rounded-lg p-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: s.color }} />
                <span className="text-sm text-white">{s.name}</span>
              </div>
              <button onClick={() => deleteSubject(s.id)} className="text-slate-500 hover:text-rose-400 text-xs" aria-label={`Delete ${s.name}`}>✕</button>
            </div>
          ))}
        </div>
      </section>

      {/* Preferences */}
      <section className="bg-slate-800/50 rounded-xl p-4 space-y-3">
        <h3 className="text-sm font-semibold text-white">Preferences</h3>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-slate-400 block mb-1">Theme</label>
            <select value={settings.theme} onChange={(e) => updateSettings({ theme: e.target.value as 'dark' | 'light' | 'system' })} className="w-full bg-slate-700 text-white px-3 py-2 rounded-lg text-sm">
              <option value="dark">Dark</option>
              <option value="light">Light</option>
              <option value="system">System</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-slate-400 block mb-1">Currency</label>
            <select value={settings.currency} onChange={(e) => updateSettings({ currency: e.target.value })} className="w-full bg-slate-700 text-white px-3 py-2 rounded-lg text-sm">
              {['₹', '$', '€', '£', '¥'].map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-slate-400 block mb-1">Time Format</label>
            <select value={settings.timeFormat} onChange={(e) => updateSettings({ timeFormat: e.target.value as '12h' | '24h' })} className="w-full bg-slate-700 text-white px-3 py-2 rounded-lg text-sm">
              <option value="12h">12 Hour</option>
              <option value="24h">24 Hour</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-slate-400 block mb-1">Daily Study Goal (min)</label>
            <input type="number" value={settings.dailyStudyGoal} onChange={(e) => updateSettings({ dailyStudyGoal: parseInt(e.target.value) || 120 })} className="w-full bg-slate-700 text-white px-3 py-2 rounded-lg text-sm" />
          </div>
          <div>
            <label className="text-xs text-slate-400 block mb-1">Monthly Budget</label>
            <input type="number" value={settings.monthlyBudget} onChange={(e) => updateSettings({ monthlyBudget: parseInt(e.target.value) || 5000 })} className="w-full bg-slate-700 text-white px-3 py-2 rounded-lg text-sm" />
          </div>
          <div>
            <label className="text-xs text-slate-400 block mb-1">Water Goal (glasses)</label>
            <input type="number" value={settings.waterGoal} onChange={(e) => updateSettings({ waterGoal: parseInt(e.target.value) || 8 })} className="w-full bg-slate-700 text-white px-3 py-2 rounded-lg text-sm" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={settings.reducedMotion}
            onChange={(e) => updateSettings({ reducedMotion: e.target.checked })}
            id="reducedMotion"
            className="rounded"
          />
          <label htmlFor="reducedMotion" className="text-sm text-slate-300">Reduce motion</label>
        </div>
      </section>

      {/* Export/Import */}
      <section className="bg-slate-800/50 rounded-xl p-4 space-y-3">
        <h3 className="text-sm font-semibold text-white">Data Management</h3>
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => handleExport(false)} className="px-3 py-2 bg-slate-700 text-white rounded-lg text-sm hover:bg-slate-600 transition">
            📥 Export JSON
          </button>
          <button onClick={() => handleExport(true)} className="px-3 py-2 bg-slate-700 text-white rounded-lg text-sm hover:bg-slate-600 transition" disabled={!exportPassphrase}>
            🔒 Export Encrypted
          </button>
        </div>
        <input
          value={exportPassphrase}
          onChange={(e) => setExportPassphrase(e.target.value)}
          placeholder="Encryption passphrase (for encrypted export)"
          type="password"
          className="w-full bg-slate-700 text-white px-3 py-2 rounded-lg text-sm"
          aria-label="Encryption passphrase"
        />
        <div>
          <label className="text-xs text-slate-400 block mb-1">Import Backup</label>
          <input type="file" accept=".json" onChange={handleImport} className="text-sm text-slate-400" />
        </div>
        {importStatus && <p className="text-xs">{importStatus}</p>}
      </section>

      {/* Privacy info */}
      <section className="bg-slate-800/50 rounded-xl p-4">
        <h3 className="text-sm font-semibold text-white mb-2">🔒 Privacy</h3>
        <div className="text-xs text-slate-400 space-y-1">
          <p>• All data is stored locally in IndexedDB on your device</p>
          <p>• No data is sent to any server — zero telemetry</p>
          <p>• Encrypted exports use AES-256-GCM (WebCrypto)</p>
          <p>• You can delete all data at any time</p>
        </div>
      </section>

      <p className="text-center text-xs text-slate-600">StudentOS v4.0.0</p>
    </div>
  );
}
