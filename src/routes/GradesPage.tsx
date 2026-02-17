import { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { EmptyState } from '../components/EmptyState';

export default function GradesPage() {
  const { grades, setGrades } = useAppStore();
  const [showAddSemester, setShowAddSemester] = useState(false);
  const [semesterName, setSemesterName] = useState('');

  const addSemester = async () => {
    if (!semesterName.trim()) return;
    const newSemester = { id: crypto.randomUUID(), name: semesterName, courses: [] };
    await setGrades({ semesters: [...grades.semesters, newSemester] });
    setSemesterName('');
    setShowAddSemester(false);
  };

  const deleteSemester = async (id: string) => {
    await setGrades({ semesters: grades.semesters.filter((s) => s.id !== id) });
  };

  const calcCoursePercentage = (assessments: Array<{ score: number; maxScore: number; componentWeight: number; weight: number }>) => {
    if (assessments.length === 0) return 0;
    const byType: Record<string, typeof assessments> = {};
    for (const a of assessments) {
      const key = `${a.componentWeight}`;
      if (!byType[key]) byType[key] = [];
      byType[key].push(a);
    }
    let total = 0;
    for (const group of Object.values(byType)) {
      const weight = group[0].componentWeight;
      const avg = group.reduce((sum, a) => sum + (a.score / a.maxScore), 0) / group.length;
      total += avg * weight;
    }
    return total;
  };

  const getGradePoint = (pct: number) => {
    if (pct >= 90) return 10;
    if (pct >= 80) return 9;
    if (pct >= 70) return 8;
    if (pct >= 60) return 7;
    if (pct >= 50) return 6;
    if (pct >= 40) return 5;
    return 0;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Grade Tracker</h2>
        <button
          onClick={() => setShowAddSemester(true)}
          className="px-3 py-1.5 bg-brand-600 text-white rounded-lg text-sm hover:bg-brand-500 transition"
        >
          + Semester
        </button>
      </div>

      {showAddSemester && (
        <div className="bg-slate-800 rounded-xl p-4 space-y-3 animate-fade-in">
          <input
            value={semesterName}
            onChange={(e) => setSemesterName(e.target.value)}
            placeholder="Semester name (e.g. Fall 2025)"
            className="w-full bg-slate-700 text-white px-3 py-2 rounded-lg text-sm"
            aria-label="Semester name"
          />
          <div className="flex gap-2">
            <button onClick={addSemester} className="flex-1 py-2 bg-brand-600 text-white rounded-lg text-sm">Add</button>
            <button onClick={() => setShowAddSemester(false)} className="px-4 py-2 bg-slate-700 text-slate-300 rounded-lg text-sm">Cancel</button>
          </div>
        </div>
      )}

      {grades.semesters.length === 0 ? (
        <EmptyState icon="📈" title="No semesters" description="Add your first semester to start tracking grades" />
      ) : (
        <div className="space-y-4">
          {grades.semesters.map((semester) => {
            const gpaData = semester.courses.map((c) => {
              const pct = calcCoursePercentage(c.assessments);
              return { gp: getGradePoint(pct), credits: c.creditHours };
            });
            const totalCredits = gpaData.reduce((s, d) => s + d.credits, 0);
            const gpa = totalCredits > 0
              ? gpaData.reduce((s, d) => s + d.gp * d.credits, 0) / totalCredits
              : 0;

            return (
              <div key={semester.id} className="bg-slate-800/50 rounded-xl p-4">
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <h3 className="text-sm font-semibold text-white">{semester.name}</h3>
                    <p className="text-xs text-slate-400">{semester.courses.length} courses • GPA: {gpa.toFixed(2)}/10</p>
                  </div>
                  <button onClick={() => deleteSemester(semester.id)} className="text-slate-500 hover:text-rose-400 text-sm" aria-label={`Delete ${semester.name}`}>✕</button>
                </div>
                {semester.courses.length === 0 && (
                  <p className="text-xs text-slate-500 italic">No courses added yet</p>
                )}
                {semester.courses.map((course) => (
                  <div key={course.id} className="bg-slate-700/50 rounded-lg p-2 mb-2">
                    <p className="text-sm text-white">{course.name}</p>
                    <p className="text-xs text-slate-400">{course.creditHours} credits • {course.assessments.length} assessments</p>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
