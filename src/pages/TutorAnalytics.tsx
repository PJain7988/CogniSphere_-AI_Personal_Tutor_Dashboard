import React, { useState, useMemo } from 'react';
import {
  Users,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Plus,
  X,
  Edit3,
  Save,
  Lock,
  Unlock,
  ShieldCheck,
  Eye,
  EyeOff,
  BarChart3,
  BookOpen,
  Star,
  Clock,
  ChevronUp,
  ChevronDown,
  Search,
  Filter,
  Trash2,
  RefreshCw,
} from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { WeeklyPerformance } from '../components/ProgressCharts';
import { useApp, Student } from '../lib/AppContext';

const TUTOR_PIN = '1234'; // In production this would be server-side auth

// ─── Stat Card ──────────────────────────────────────────────────────────────
function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  color,
  delta,
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon: any;
  color: string;
  delta?: { val: string; up: boolean };
}) {
  return (
    <div className={`bg-white border border-slate-100 rounded-2xl p-5 flex flex-col gap-3 hover:shadow-md transition-shadow`}>
      <div className="flex items-start justify-between">
        <div className={`p-2.5 rounded-xl ${color}`}>
          <Icon className="h-5 w-5" />
        </div>
        {delta && (
          <span
            className={`flex items-center gap-0.5 text-[10px] font-bold px-2 py-0.5 rounded-full ${
              delta.up ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'
            }`}
          >
            {delta.up ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            {delta.val}
          </span>
        )}
      </div>
      <div>
        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">{label}</p>
        <p className="text-2xl font-black text-slate-900 mt-0.5 leading-none">{value}</p>
        {sub && <p className="text-[11px] text-slate-400 font-medium mt-1">{sub}</p>}
      </div>
    </div>
  );
}

// ─── Score Ring ──────────────────────────────────────────────────────────────
function ScoreRing({ score }: { score: number }) {
  const r = 22;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color =
    score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#ef4444';

  return (
    <svg width="56" height="56" viewBox="0 0 56 56" className="shrink-0">
      <circle cx="28" cy="28" r={r} fill="none" stroke="#f1f5f9" strokeWidth="5" />
      <circle
        cx="28"
        cy="28"
        r={r}
        fill="none"
        stroke={color}
        strokeWidth="5"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform="rotate(-90 28 28)"
        style={{ transition: 'stroke-dashoffset 0.6s ease' }}
      />
      <text x="28" y="33" textAnchor="middle" fontSize="11" fontWeight="800" fill={color}>
        {score}%
      </text>
    </svg>
  );
}

// ─── PIN Gate Modal ──────────────────────────────────────────────────────────
function PinGateModal({
  onSuccess,
  onClose,
}: {
  onSuccess: () => void;
  onClose: () => void;
}) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [showPin, setShowPin] = useState(false);

  const handleSubmit = () => {
    if (pin === TUTOR_PIN) {
      onSuccess();
    } else {
      setError('Incorrect PIN. Please try again.');
      setPin('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full overflow-hidden border border-slate-100">
        {/* Header */}
        <div className="bg-gradient-to-br from-primary to-indigo-700 px-6 py-6 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10 blur-2xl" />
          <div className="relative z-10 flex items-center gap-3">
            <div className="w-10 h-10 bg-white/15 rounded-2xl flex items-center justify-center">
              <ShieldCheck className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-extrabold text-base">Tutor Authentication</h3>
              <p className="text-white/70 text-xs font-medium">Enter your 4-digit access PIN</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Access PIN
            </label>
            <div className="relative">
              <input
                autoFocus
                type={showPin ? 'text' : 'password'}
                maxLength={4}
                value={pin}
                onChange={e => { setPin(e.target.value.replace(/\D/g, '')); setError(''); }}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                placeholder="••••"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-center text-xl font-black tracking-[0.5em] text-slate-800 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPin(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPin ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {error && (
              <p className="text-red-500 text-xs font-semibold mt-2 flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" /> {error}
              </p>
            )}
            <p className="text-[10px] text-slate-400 font-medium mt-2">Demo PIN: <strong>1234</strong></p>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 border border-slate-200 text-slate-600 rounded-xl py-2.5 text-sm font-bold hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disab// ─── Student Detail Modal ─────────────────────────────────────────────────────
function StudentDetailModal({
  student,
  isTutor,
  onClose,
  onSaveScore,
  onToggleRisk,
  onRenameStudent,
  onDeleteStudent,
}: {
  student: Student;
  isTutor: boolean;
  onClose: () => void;
  onSaveScore: (id: string, score: number) => void;
  onToggleRisk: (id: string) => void;
  onRenameStudent: (id: string, name: string) => void;
  onDeleteStudent: (id: string) => void;
}) {
  const [editingScore, setEditingScore] = useState(false);
  const [tempScore, setTempScore] = useState(student.avgScore);
  const [editingName, setEditingName] = useState(false);
  const [tempName, setTempName] = useState(student.name);

  const handleSave = () => {
    const clamped = Math.min(100, Math.max(0, tempScore));
    onSaveScore(student.id, clamped);
    setEditingScore(false);
  };

  const grade =
    student.avgScore >= 90 ? 'A+' :
    student.avgScore >= 80 ? 'A' :
    student.avgScore >= 70 ? 'B' :
    student.avgScore >= 60 ? 'C' : 'D';

  const gradeColor =
    student.avgScore >= 80 ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/30' :
    student.avgScore >= 60 ? 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20 border-amber-100 dark:border-amber-900/20' :
    'text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-955/20 border-red-100 dark:border-red-900/20';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 dark:bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100 dark:border-zinc-800">
        {/* Header */}
        <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 px-6 py-5">
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: 'radial-gradient(circle at 20% 80%, #6e56cf 0%, transparent 50%), radial-gradient(circle at 80% 20%, #06b6d4 0%, transparent 50%)' }}
          />
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  src={student.avatar}
                  alt={student.name}
                  className="w-14 h-14 rounded-2xl border-2 border-white/20 object-cover"
                />
                <span className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-slate-800 ${student.risk ? 'bg-red-500' : 'bg-emerald-500'}`} />
              </div>
              <div className="text-left">
                {isTutor && editingName ? (
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      type="text"
                      value={tempName}
                      onChange={e => setTempName(e.target.value)}
                      className="bg-white/10 text-white border border-white/20 rounded-xl px-3 py-1.5 text-sm font-semibold focus:outline-none focus:border-purple-400"
                    />
                    <button
                      onClick={() => {
                        if (tempName.trim()) {
                          onRenameStudent(student.id, tempName.trim());
                          setEditingName(false);
                        }
                      }}
                      className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg p-1.5 transition-colors cursor-pointer"
                      title="Save name"
                    >
                      <Save className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => { setEditingName(false); setTempName(student.name); }}
                      className="bg-white/10 text-white rounded-lg p-1.5 hover:bg-white/20 transition-colors cursor-pointer"
                      title="Cancel renaming"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <h3 className="text-white font-extrabold text-lg leading-tight">{student.name}</h3>
                    {isTutor && (
                      <button
                        onClick={() => setEditingName(true)}
                        className="p-1 text-white/60 hover:text-white hover:bg-white/15 rounded-lg transition-colors cursor-pointer"
                        title="Rename Student"
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                )}
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-white/50 text-xs font-medium">ID: {student.id}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${student.risk ? 'bg-red-500/20 border-red-500/30 text-red-300' : 'bg-emerald-500/20 border-emerald-500/30 text-emerald-300'}`}>
                    {student.risk ? '⚠ At Risk' : '✓ On Track'}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-white/40 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Key Metrics */}
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 bg-slate-50 dark:bg-zinc-950/30 rounded-xl border border-slate-100 dark:border-zinc-800">
              <ScoreRing score={student.avgScore} />
              <p className="text-[10px] text-slate-400 dark:text-zinc-550 font-bold uppercase tracking-wider mt-2">Avg Score</p>
            </div>
            <div className="text-center p-3 bg-slate-50 dark:bg-zinc-950/30 rounded-xl border border-slate-100 dark:border-zinc-800 flex flex-col items-center justify-center">
              <span className={`text-3xl font-black border rounded-xl px-3 py-1 ${gradeColor}`}>{grade}</span>
              <p className="text-[10px] text-slate-400 dark:text-zinc-550 font-bold uppercase tracking-wider mt-2">Grade</p>
            </div>
            <div className="text-center p-3 bg-slate-50 dark:bg-zinc-950/30 rounded-xl border border-slate-100 dark:border-zinc-800 flex flex-col items-center justify-center">
              <span className="text-3xl font-black text-slate-800 dark:text-zinc-200">{student.completed}</span>
              <p className="text-[10px] text-slate-400 dark:text-zinc-550 font-bold uppercase tracking-wider mt-2">Modules</p>
            </div>
          </div>

          {/* Last Active */}
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-zinc-400 font-medium bg-slate-50 dark:bg-zinc-950/30 rounded-xl px-4 py-2.5 border border-slate-100 dark:border-zinc-800">
            <Clock className="h-3.5 w-3.5 text-slate-400 dark:text-zinc-500" />
            <span>Last active: <strong className="text-slate-700 dark:text-zinc-300">{student.lastActive}</strong></span>
          </div>

          {/* Score Editor — Tutor Only */}
          <div className="border border-slate-200 dark:border-zinc-800 rounded-2xl overflow-hidden">
            <div className="bg-slate-50 dark:bg-zinc-950/50 px-4 py-3 flex items-center justify-between border-b border-slate-100 dark:border-zinc-800">
              <span className="text-xs font-bold text-slate-600 dark:text-zinc-450 uppercase tracking-wider flex items-center gap-1.5">
                <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-400" />
                Grade Score Management
              </span>
              {isTutor && !editingScore && (
                <button
                  onClick={() => { setEditingScore(true); setTempScore(student.avgScore); }}
                  className="flex items-center gap-1 text-xs font-bold text-primary dark:text-purple-400 hover:text-indigo-700 dark:hover:text-purple-300 transition-colors"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                  Edit
                </button>
              )}
              {!isTutor && (
                <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400 dark:text-zinc-500">
                  <Lock className="h-3 w-3" /> Tutor Only
                </span>
              )}
            </div>
            <div className="px-4 py-3 bg-white dark:bg-zinc-900">
              {editingScore && isTutor ? (
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={tempScore}
                      onChange={e => setTempScore(Number(e.target.value))}
                      className="w-full accent-primary"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 dark:text-zinc-500 font-bold mt-1">
                      <span>0%</span><span className="text-primary dark:text-purple-400 font-black text-sm">{tempScore}%</span><span>100%</span>
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button onClick={handleSave} className="bg-primary text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-1 cursor-pointer">
                      <Save className="h-3 w-3" /> Save
                    </button>
                    <button onClick={() => setEditingScore(false)} className="border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-450 text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer">
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-slate-800 dark:text-zinc-200">{student.avgScore}</span>
                    <span className="text-slate-400 dark:text-zinc-550 font-bold">/ 100</span>
                  </div>
                  {!isTutor && (
                    <p className="text-[10px] text-slate-400 dark:text-zinc-500 font-medium italic">Unlock Tutor Mode to edit grades</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Risk Toggle & Delete Row */}
          <div className="space-y-2">
            {isTutor && (
              <button
                onClick={() => { onToggleRisk(student.id); onClose(); }}
                className={`w-full py-3 rounded-xl text-sm font-bold border flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  student.risk
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/20 dark:border-emerald-900/30 dark:text-emerald-400 dark:hover:bg-emerald-950/30'
                    : 'bg-red-50 border-red-200 text-red-650 hover:bg-red-100 dark:bg-red-955/20 dark:border-red-900/30 dark:text-red-400 dark:hover:bg-red-955/30'
                }`}
              >
                {student.risk
                  ? <><CheckCircle2 className="h-4 w-4" /> Mark as On Track</>
                  : <><AlertTriangle className="h-4 w-4" /> Flag as At Risk</>
                }
              </button>
            )}

            {isTutor && (
              <button
                onClick={() => onDeleteStudent(student.id)}
                className="w-full py-3 rounded-xl text-sm font-bold border border-red-200/60 dark:border-red-900/30 bg-red-500/10 dark:bg-red-950/10 hover:bg-red-500/20 dark:hover:bg-red-950/25 text-red-650 dark:text-red-400 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Trash2 className="h-4 w-4" />
                Remove Student from Cohort
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
                student.risk
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
                  : 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100'
              }`}
            >
              {student.risk
                ? <><CheckCircle2 className="h-4 w-4" /> Mark as On Track</>
                : <><AlertTriangle className="h-4 w-4" /> Flag as At Risk</>
              }
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function TutorAnalytics() {
  const { students, toggleStudentRisk, addStudent, updateStudentScore, deleteStudent, renameStudent, showToast } = useApp();

  // Tutor mode state
  const [isTutorMode, setIsTutorMode] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);

  // Modals
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isNewStudentOpen, setIsNewStudentOpen] = useState(false);

  // Search & filter
  const [search, setSearch] = useState('');
  const [filterRisk, setFilterRisk] = useState<'all' | 'risk' | 'track'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'score' | 'completed'>('score');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  // New student form
  const [newName, setNewName] = useState('');
  const [newScore, setNewScore] = useState(80);
  const [newCompleted, setNewCompleted] = useState(0);
  const [newRisk, setNewRisk] = useState(false);

  // ── Computed Metrics ──
  const totalStudents = students.length;
  const averageCohortScore =
    totalStudents > 0
      ? Math.round(students.reduce((a, s) => a + s.avgScore, 0) / totalStudents)
      : 0;
  const totalCompletedLessons = students.reduce((a, s) => a + s.completed, 0);
  const studentsAtRisk = students.filter(s => s.risk).length;
  const topStudents = [...students].sort((a, b) => b.avgScore - a.avgScore).slice(0, 3);

  // ── Filtered / Sorted Table ──
  const filteredStudents = useMemo(() => {
    let list = [...students];
    if (search) list = list.filter(s => s.name.toLowerCase().includes(search.toLowerCase()));
    if (filterRisk === 'risk') list = list.filter(s => s.risk);
    if (filterRisk === 'track') list = list.filter(s => !s.risk);
    list.sort((a, b) => {
      let va = sortBy === 'name' ? a.name : sortBy === 'score' ? a.avgScore : a.completed;
      let vb = sortBy === 'name' ? b.name : sortBy === 'score' ? b.avgScore : b.completed;
      if (typeof va === 'string') return sortDir === 'asc' ? va.localeCompare(vb as string) : (vb as string).localeCompare(va);
      return sortDir === 'asc' ? (va as number) - (vb as number) : (vb as number) - (va as number);
    });
    return list;
  }, [students, search, filterRisk, sortBy, sortDir]);

  const chartData = filteredStudents.map(s => ({ day: s.name.split(' ')[0], score: s.avgScore }));

  const handleSort = (col: typeof sortBy) => {
    if (sortBy === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortBy(col); setSortDir('desc'); }
  };

  const SortIcon = ({ col }: { col: typeof sortBy }) =>
    sortBy === col
      ? sortDir === 'asc' ? <ChevronUp className="h-3 w-3 inline ml-0.5" /> : <ChevronDown className="h-3 w-3 inline ml-0.5" />
      : <span className="h-3 w-3 inline ml-0.5 opacity-0 group-hover:opacity-40"><ChevronDown className="h-3 w-3" /></span>;

  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    addStudent({ name: newName.trim(), avgScore: Number(newScore), completed: Number(newCompleted), risk: newRisk, lastActive: 'Just now' });
    setNewName(''); setNewScore(80); setNewCompleted(0); setNewRisk(false);
    setIsNewStudentOpen(false);
  };

  const handleUnlockTutor = () => { setIsTutorMode(true); setShowPinModal(false); showToast('Tutor Mode activated. You can now edit student records.', 'success'); };
  const handleLockTutor = () => { setIsTutorMode(false); showToast('Tutor Mode locked.', 'info'); };

  return (
    <div className="space-y-6">

      {/* ── Page Header ─────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Tutor Analytics
          </h2>
          <p className="text-xs text-slate-400 font-medium mt-0.5">Cohort performance insights and student management</p>
        </div>

        <div className="flex items-center gap-2">
          {isTutorMode ? (
            <button
              onClick={handleLockTutor}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-xs font-bold hover:bg-emerald-100 transition-colors"
            >
              <Unlock className="h-3.5 w-3.5" />
              Tutor Mode Active
            </button>
          ) : (
            <button
              onClick={() => setShowPinModal(true)}
              cl      {/* ── Stat Cards ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Enrolled" value={totalStudents} sub="Active learners" icon={Users} color="bg-purple-50 dark:bg-purple-950/20 text-primary dark:text-purple-400" delta={{ val: '+2 this week', up: true }} />
        <StatCard label="Cohort Average" value={`${averageCohortScore}%`} sub="Mean score" icon={TrendingUp} color="bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400" delta={{ val: '+3% vs last week', up: true }} />
        <StatCard label="At Risk" value={studentsAtRisk} sub="Need intervention" icon={AlertTriangle} color="bg-red-50 dark:bg-red-955/20 text-red-500 dark:text-red-400" />
        <StatCard label="Completions" value={totalCompletedLessons} sub="Total modules done" icon={BookOpen} color="bg-blue-50 dark:bg-blue-950/20 text-blue-500 dark:text-blue-400" delta={{ val: '+12 this week', up: true }} />
      </div>

      {/* ── Chart + Leaderboard ─────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 bg-white dark:bg-zinc-900/40 border-slate-100 dark:border-zinc-850 p-6">
          <h3 className="text-sm font-extrabold text-slate-800 dark:text-zinc-200 mb-1">Grade Distribution Matrix</h3>
          <p className="text-xs text-slate-400 dark:text-zinc-500 font-medium mb-4">Real-time score breakdown across cohort</p>
          <WeeklyPerformance data={chartData} />
        </Card>

        <Card className="bg-white dark:bg-zinc-900/40 border-slate-100 dark:border-zinc-850 p-6">
          <h3 className="text-sm font-extrabold text-slate-800 dark:text-zinc-200 mb-1 flex items-center gap-1.5">
            <Star className="h-4 w-4 text-amber-500 fill-amber-400" />
            Top Performers
          </h3>
          <p className="text-xs text-slate-400 dark:text-zinc-550 font-medium mb-4">Highest scoring students this period</p>
          <div className="space-y-3">
            {topStudents.map((s, i) => (
              <div key={s.id} className="flex items-center gap-3">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 ${
                  i === 0 ? 'bg-amber-100 dark:bg-amber-955/40 text-amber-700 dark:text-amber-400' : i === 1 ? 'bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300' : 'bg-orange-100 dark:bg-orange-955/40 text-orange-700 dark:text-orange-400'
                }`}>{i + 1}</span>
                <img src={s.avatar} alt={s.name} className="w-8 h-8 rounded-full border border-slate-100 dark:border-zinc-800 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-800 dark:text-zinc-200 truncate">{s.name}</p>
                  <div className="w-full bg-slate-100 dark:bg-zinc-800 h-1.5 rounded-full mt-1 overflow-hidden">
                    <div className="bg-gradient-to-r from-primary to-cyan-400 h-full rounded-full" style={{ width: `${s.avgScore}%`, transition: 'width 0.6s ease' }} />
                  </div>
                </div>
                <span className="text-xs font-black text-slate-700 dark:text-zinc-350 shrink-0">{s.avgScore}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* ── Student Roster Table ─────────────────────────────────────── */}
      <Card className="bg-white dark:bg-zinc-900/40 border-slate-100 dark:border-zinc-855 p-0 overflow-hidden rounded-3xl">
        {/* Table header */}
        <div className="px-6 py-4 bg-slate-50/80 dark:bg-zinc-950/20 border-b border-slate-100 dark:border-zinc-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="text-left">
              <h3 className="text-sm font-extrabold text-slate-800 dark:text-zinc-200">Enrollment Roster</h3>
              <p className="text-[10px] text-slate-400 dark:text-zinc-550 font-medium mt-0.5">
                {isTutorMode
                  ? '🔓 Tutor Mode — click rows to edit'
                  : '🔒 View-only — unlock Tutor Mode to edit'}
              </p>
            </div>
            {/* Search + Filter */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-550" />
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search students..."
                  className="pl-8 pr-3 py-2 text-xs border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 rounded-xl focus:outline-none focus:border-primary transition-colors font-medium text-slate-800 dark:text-zinc-200"
                />
              </div>
              <select
                value={filterRisk}
                onChange={e => setFilterRisk(e.target.value as any)}
                className="text-xs border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 rounded-xl px-3 py-2 focus:outline-none focus:border-primary font-bold text-slate-600 dark:text-zinc-400"
              >
                <option value="all">All Students</option>
                <option value="risk">At Risk</option>
                <option value="track">On Track</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">d-3xl">
        {/* Table header */}
        <div className="px-6 py-4 bg-slate-50/80 dark:bg-zinc-950/20 border-b border-slate-100 dark:border-zinc-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="text-left">
              <h3 className="text-sm font-extrabold text-slate-800 dark:text-zinc-200">Enrollment Roster</h3>
              <p className="text-[10px] text-slate-400 dark:text-zinc-550 font-medium mt-0.5">
                {isTutorMode
                  ? '🔓 Tutor Mode — click rows to edit'
                  : '🔒 View-only — unlock Tutor Mode to edit'}
              </p>
            </div>
            {/* Search + Filter */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-550" />
                <input
                  typ        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="text-[10px] text-slate-400 dark:text-zinc-500 uppercase tracking-widest border-b border-slate-100 dark:border-zinc-800 bg-slate-50/30 dark:bg-zinc-900/10">
                <th className="py-3.5 px-6 font-bold">Student</th>
                <th className="py-3.5 px-6 font-bold cursor-pointer group select-none" onClick={() => handleSort('score')}>
                  Score <SortIcon col="score" />
                </th>
                <th className="py-3.5 px-6 font-bold cursor-pointer group select-none" onClick={() => handleSort('completed')}>
                  Modules <SortIcon col="completed" />
                </th>
                <th className="py-3.5 px-6 font-bold">Last Active</th>
                <th className="py-3.5 px-6 font-bold">Status</th>
                <th className="py-3.5 px-6 text-right font-bold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/80">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-slate-400 dark:text-zinc-550 text-xs font-semibold">
                    No students match your search criteria.
                  </td>
                </tr>
              ) : filteredStudents.map(s => (
                <tr
                  key={s.id}
                  className={`font-medium transition-colors group border-b border-slate-100 dark:border-zinc-800/60 ${isTutorMode ? 'hover:bg-purple-50/30 dark:hover:bg-purple-950/10 cursor-pointer' : 'hover:bg-slate-50/40 dark:hover:bg-zinc-800/20'}`}
                  onClick={() => setSelectedStudent(s)}
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="relative shrink-0">
                        <img src={s.avatar} alt={s.name} className="w-9 h-9 rounded-full border border-slate-100 dark:border-zinc-800 object-cover" />
                        <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-zinc-900 ${s.risk ? 'bg-red-500' : 'bg-emerald-500'}`} />
                      </div>
                      <span className="font-bold text-slate-800 dark:text-zinc-250 text-sm">{s.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${s.avgScore >= 80 ? 'bg-emerald-500' : s.avgScore >= 60 ? 'bg-amber-400' : 'bg-red-500'}`}
                          style={{ width: `${s.avgScore}%` }}
                        />
                      </div>
                      <span className="font-bold text-slate-800 dark:text-zinc-200 text-sm">{s.avgScore}%</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-slate-500 dark:text-zinc-400 text-sm">{s.completed} modules</td>
                  <td className="py-4 px-6 text-slate-400 dark:text-zinc-550 text-sm">{s.lastActive}</td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase border ${
                      s.risk ? 'bg-red-50 dark:bg-red-955/20 border-red-100 dark:border-red-900/30 text-red-655 dark:text-red-400' : 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/30 text-emerald-600 dark:text-emerald-400'
                    }`}>
                      {s.risk ? '⚠ At Risk' : '✓ On Track'}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={e => { e.stopPropagation(); setSelectedStudent(s); }}
                      className="text-primary dark:text-purple-400 font-bold text-xs hover:underline hover:text-indigo-700 dark:hover:text-purple-300 flex items-center gap-1 ml-auto"
                    >
                      {isTutorMode ? <><Edit3 className="h-3 w-3" />Edit</> : <><Eye className="h-3 w-3" />View</>}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="px-6 py-3 bg-slate-50/50 dark:bg-zinc-950/20 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between">
          <span className="text-[11px] text-slate-400 dark:text-zinc-550 font-medium">
            Showing <strong className="text-slate-600 dark:text-zinc-350">{filteredStudents.length}</strong> of <strong className="text-slate-600 dark:text-zinc-350">{totalStudents}</strong> students
          </span>
          <button onClick={() => { setSearch(''); setFilterRisk('all'); }} className="text-[11px] text-slate-455 dark:text-zinc-500 font-bold hover:text-primary dark:hover:text-purple-300 transition-colors flex items-center gap-1 cursor-pointer">
            <RefreshCw className="h-3 w-3" /> Reset filters
          </button>
        </div>
      </Card>line hover:text-indigo-700 flex items-center gap-1 ml-auto"
                    >
                      {isTutorMode ? <><Edit3 className="h-3 w-3" />Edit</> : <><Eye className="h-3 w-3" />View</>}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="px-6 py-3 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[11px] text-slate-400 font-medium">
            Showing <strong className="text-slate-600">{filteredStudents.length}</strong> of <strong className="text-slate-600">{totalStudents}</strong> students
          </span>
          <button onClick={() => { setSearch(''); setFilterRisk('all'); }} className="text-[11px] text-slate-400 font-bold hover:text-primary transition-colors flex items-center gap-1">
            <RefreshCw className="h-3 w-3" /> Reset filters
          </button>
        </div>
      </Card>

      {/* ── Modals ────────────────────────────────────────────────────── */}
      {showPinModal && (
        <PinGateModal onSuccess={handleUnlockTutor} onClose={() => setShowPinModal(false)} />
      )}

      {selectedStudent && (
        <StudentDetailModal
          student={selectedStudent}
          isTutor={isTutorMode}
          onClose={() => setSelectedStudent(null)}
          onSaveScore={(id, score) => {
            updateStudentScore(id, score);
            setSelectedStudent(prev => prev ? { ...prev, avgScore: score } : null);
            showToast(`Score updated for ${selectedStudent.name}`, 'success');
          }}
          onToggleRisk={toggleStudentRisk}
          onRenameStudent={(id, name) => {
            renameStudent(id, name);
            setSelectedStudent(prev => prev ? { ...prev, name } : null);
            showToast(`Student name updated to ${name}`, 'success');
          }}
          onDeleteStudent={(id) => {
            if (confirm(`Are you sure you want to remove ${selectedStudent.name} from the cohort?`)) {
              deleteStudent(id);
              setSelectedStudent(null);
              showToast(`Student removed from cohort.`, 'info');
            }
          }}
        />
      )}

      {isNewStudentOpen && isTutorMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full overflow-hidden border border-slate-100">
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-slate-900">Enroll New Student</h3>
                <p className="text-xs text-slate-400 font-medium">Add a learner to your cohort</p>
              </div>
              <button onClick={() => setIsNewStudentOpen(false)} className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 rounded-xl cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleCreateStudent} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5" htmlFor="ns-name">Full Name</label>
                <Input id="ns-name" placeholder="e.g. Priya Nair" value={newName} onChange={e => setNewName(e.target.value)} required className="py-2.5 text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5" htmlFor="ns-score">Initial Score (%)</label>
                  <Input id="ns-score" type="number" min="0" max="100" value={newScore} onChange={e => setNewScore(Number(e.target.value))} className="py-2 text-sm text-center font-bold" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5" htmlFor="ns-comp">Modules Done</label>
                  <Input id="ns-comp" type="number" min="0" value={newCompleted} onChange={e => setNewCompleted(Number(e.target.value))} className="py-2 text-sm text-center font-bold" />
                </div>
              </div>
              <label className="flex items-center gap-3 cursor-pointer select-none p-3 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors">
                <input type="checkbox" checked={newRisk} onChange={e => setNewRisk(e.target.checked)} className="h-4 w-4 accent-red-500 rounded cursor-pointer" />
                <div>
                  <span className="text-xs font-bold text-slate-700 block">Flag as "At Risk"</span>
                  <span className="text-[10px] text-slate-400 font-medium">Mark for academic intervention</span>
                </div>
              </label>
              <div className="pt-2 border-t border-slate-100 flex justify-end gap-3">
                <button type="button" onClick={() => setIsNewStudentOpen(false)} className="px-4 py-2 text-xs font-bold border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors">Cancel</button>
                <button type="submit" className="px-5 py-2 text-xs font-bold bg-gradient-to-r from-primary to-indigo-600 text-white rounded-xl shadow-sm hover:from-purple-600 hover:to-indigo-700 transition-all">Enroll Student</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
