import { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { todayKey, formatDate } from '../utils/dates';
import { EmptyState } from '../components/EmptyState';
import type { Expense } from '../schemas/app.schema';

const DEFAULT_CATEGORIES = ['Food', 'Transport', 'Books', 'Entertainment', 'Subscriptions', 'Health', 'Other'];

export default function ExpensesPage() {
  const { expenses, settings, addExpense, deleteExpense } = useAppStore();
  const [showForm, setShowForm] = useState(false);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(todayKey());

  const today = todayKey();
  const currentMonth = today.slice(0, 7);
  const monthExpenses = expenses.filter((e) => e.date.startsWith(currentMonth));
  const monthTotal = monthExpenses.reduce((s, e) => s + e.amount, 0);
  const budgetPct = settings.monthlyBudget > 0 ? Math.min(100, (monthTotal / settings.monthlyBudget) * 100) : 0;

  const handleSubmit = async () => {
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt <= 0) return;
    const expense: Expense = {
      id: crypto.randomUUID(),
      amount: amt,
      category,
      description,
      date,
    };
    await addExpense(expense);
    setAmount('');
    setDescription('');
    setShowForm(false);
  };

  const recentExpenses = expenses.slice().sort((a, b) => b.date.localeCompare(a.date)).slice(0, 20);

  const categoryTotals = monthExpenses.reduce<Record<string, number>>((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Expenses</h2>
        <button onClick={() => setShowForm(true)} className="px-3 py-1.5 bg-brand-600 text-white rounded-lg text-sm hover:bg-brand-500 transition">
          + Add
        </button>
      </div>

      {/* Budget overview */}
      <div className="bg-slate-800/50 rounded-xl p-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-slate-400">This Month</span>
          <span className={monthTotal > settings.monthlyBudget ? 'text-rose-400 font-medium' : 'text-white'}>
            {settings.currency}{monthTotal.toFixed(2)} / {settings.currency}{settings.monthlyBudget}
          </span>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all ${budgetPct > 90 ? 'bg-rose-500' : budgetPct > 70 ? 'bg-amber-500' : 'bg-green-500'}`}
            style={{ width: `${budgetPct}%` }}
          />
        </div>
      </div>

      {/* Category breakdown */}
      {Object.keys(categoryTotals).length > 0 && (
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(categoryTotals).sort(([, a], [, b]) => b - a).map(([cat, total]) => (
            <div key={cat} className="bg-slate-800/50 rounded-lg p-3">
              <p className="text-xs text-slate-400">{cat}</p>
              <p className="text-sm font-medium text-white">{settings.currency}{total.toFixed(2)}</p>
            </div>
          ))}
        </div>
      )}

      {/* Form */}
      {showForm && (
        <div className="bg-slate-800 rounded-xl p-4 space-y-3 animate-fade-in">
          <h3 className="text-sm font-semibold text-white">Log Expense</h3>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount"
            className="w-full bg-slate-700 text-white px-3 py-2 rounded-lg text-sm"
            aria-label="Amount"
            step="0.01"
          />
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-slate-700 text-white px-3 py-2 rounded-lg text-sm" aria-label="Category">
            {DEFAULT_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description (optional)" className="w-full bg-slate-700 text-white px-3 py-2 rounded-lg text-sm" aria-label="Description" />
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full bg-slate-700 text-white px-3 py-2 rounded-lg text-sm" aria-label="Date" />
          <div className="flex gap-2">
            <button onClick={handleSubmit} className="flex-1 py-2 bg-brand-600 text-white rounded-lg text-sm">Add</button>
            <button onClick={() => setShowForm(false)} className="px-4 py-2 bg-slate-700 text-slate-300 rounded-lg text-sm">Cancel</button>
          </div>
        </div>
      )}

      {/* Recent */}
      {recentExpenses.length === 0 ? (
        <EmptyState icon="💰" title="No expenses" description="Start tracking your spending" />
      ) : (
        <div className="space-y-2">
          {recentExpenses.map((e) => (
            <div key={e.id} className="bg-slate-800/50 rounded-lg p-3 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-white">{settings.currency}{e.amount.toFixed(2)}</p>
                <p className="text-xs text-slate-400">{e.category}{e.description ? ` — ${e.description}` : ''} • {formatDate(e.date)}</p>
              </div>
              <button onClick={() => deleteExpense(e.id)} className="text-slate-500 hover:text-rose-400 text-sm" aria-label="Delete expense">✕</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
