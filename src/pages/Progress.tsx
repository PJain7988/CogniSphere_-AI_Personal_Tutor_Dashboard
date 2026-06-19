import React from 'react';
import {
  Award,
  CheckCircle,
  Lock,
  Calendar,
  BookOpen,
  TrendingUp,
  Flame,
  Zap,
  Star,
  BarChart2,
} from 'lucide-react';
import { Card } from '../components/Card';
import { WeeklyPerformance, CompletionRadial } from '../components/ProgressCharts';
import { useApp } from '../lib/AppContext';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

interface BadgeDefinition {
  id: string;
  title: string;
  icon: string;
  description: string;
  requirement: string;
  category: 'streak' | 'quiz' | 'level' | 'subject';
}

const ALL_BADGES: BadgeDefinition[] = [
  { id: 'Streak x7',   icon: '🔥', title: 'Streak x7',    description: 'Log in and study 7 days in a row.',              requirement: 'Maintain a 7-day streak',      category: 'streak'  },
  { id: 'Quiz Ace',    icon: '🎯', title: 'Quiz Ace',      description: 'Score 100% on any assessment.',                  requirement: 'Finish a Quiz at 100%',         category: 'quiz'    },
  { id: 'Fast Learner',icon: '⚡', title: 'Fast Learner',  description: 'Reach Level 7 in course acceleration metrics.',  requirement: 'Reach Level 7',                 category: 'level'   },
  { id: 'Math Pro',    icon: '📐', title: 'Math Pro',      description: 'Master calculus derivatives, integrals, limits.', requirement: 'Complete any Math lesson',       category: 'subject' },
  { id: 'Science Star',icon: '🔬', title: 'Science Star',  description: 'Understand biology, physics or chemistry.',       requirement: 'Complete a Science lesson',     category: 'subject' },
  { id: 'DSA Grinder', icon: '💻', title: 'DSA Grinder',   description: 'Build full-stack apps or traverse graph routes.', requirement: 'Complete a CS Exercise',         category: 'subject' },
];

/** Mini summary pill */
function StatPill({ icon: Icon, label, value, color }: { icon: any; label: string; value: string | number; color: string }) {
  return (
    <div className={`flex items-center gap-2.5 bg-white dark:bg-zinc-900/40 border border-slate-100 dark:border-zinc-800 rounded-2xl px-4 py-3 shadow-sm hover:shadow-md transition-shadow`}>
      <div className={`p-2 rounded-xl ${color}`}><Icon className="h-4 w-4" /></div>
      <div>
        <p className="text-[10px] text-slate-400 dark:text-zinc-500 font-bold uppercase tracking-wider leading-none">{label}</p>
        <p className="text-base font-black text-slate-800 dark:text-zinc-250 mt-0.5 leading-none">{value}</p>
      </div>
    </div>
  );
}

export default function Progress() {
  const { profile, lessons } = useApp();

  // ── Dynamic calculations ─────────────────────────────────────────────────
  const totalLessons = lessons.length;
  const completedLessons = lessons.filter(l => l.progress === 100);
  const inProgressLessons = lessons.filter(l => l.progress > 0 && l.progress < 100);
  const completedCount = completedLessons.length;
  const completionRate = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  // Use real weeklyScores from profile (guaranteed 7 slots by AppContext)
  const scores = profile.weeklyScores?.length === 7
    ? profile.weeklyScores
    : [0, 0, 0, 0, 0, 0, 0];

  const weeklyData = DAYS.map((day, i) => ({ day, score: scores[i] }));
  const hasAnyScore = scores.some(s => s > 0);

  const totalXP = profile.xp + (profile.level - 1) * profile.xpNextLevel;
  const xpPct = Math.round((profile.xp / profile.xpNextLevel) * 100);

  return (
    <div className="space-y-6">

      {/* ── Quick Stats Row ──────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatPill icon={Flame}    label="Streak"     value={`${profile.streak} Days`}     color="bg-amber-50 text-amber-500" />
        <StatPill icon={Zap}      label="Total XP"   value={`${totalXP} XP`}              color="bg-purple-50 text-primary"  />
        <StatPill icon={Star}     label="Avg Grade"  value={profile.avgGrade > 0 ? `${profile.avgGrade}%` : '—'} color="bg-emerald-50 text-emerald-600" />
        <StatPill icon={BookOpen} label="Completed"  value={`${completedCount} / ${totalLessons}`} color="bg-blue-50 text-blue-500" />
      </div>

      {/* ── Chart + Radial ───────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Weekly Grade Analytics */}
        <Card className="bg-white dark:bg-zinc-900/40 border-slate-100 dark:border-zinc-850 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-bold text-slate-800 dark:text-zinc-100">Weekly Grade Analytics</h3>
            </div>
            <p className="text-xs text-slate-400 dark:text-zinc-500 font-medium mb-4">
              {hasAnyScore
                ? 'Your real activity scores — updates as you complete lessons'
                : 'No activity yet — complete lessons or attend sessions to see scores'}
            </p>
          </div>

          {hasAnyScore ? (
            <WeeklyPerformance data={weeklyData} />
          ) : (
            /* Premium SVG empty state */
            <div className="flex flex-col items-center justify-center py-6 gap-4 text-center">
              <div className="relative w-48 h-32 flex items-center justify-center overflow-hidden">
                <svg className="w-full h-full opacity-60 text-slate-200 dark:text-zinc-805" viewBox="0 0 200 120">
                  {/* Grid lines */}
                  <line x1="20" y1="20" x2="180" y2="20" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
                  <line x1="20" y1="50" x2="180" y2="50" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
                  <line x1="20" y1="80" x2="180" y2="80" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
                  <line x1="20" y1="110" x2="180" y2="110" stroke="currentColor" strokeWidth="1.5" />
                  <line x1="20" y1="10" x2="20" y2="110" stroke="currentColor" strokeWidth="1.5" />
                  {/* Placeholder dotted path */}
                  <path
                    d="M 20 90 Q 60 70 100 85 T 180 30"
                    fill="none"
                    stroke="#a78bfa"
                    strokeWidth="2"
                    strokeDasharray="4 4"
                    className="opacity-40"
                  />
                  {/* Floating particles */}
                  <circle cx="100" cy="85" r="3" fill="#6E56CF" className="animate-pulse" />
                  <circle cx="180" cy="30" r="3" fill="#22D3EE" className="animate-pulse" />
                </svg>
                <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-zinc-900/60 via-transparent to-transparent" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800 dark:text-zinc-200">Weekly Charts are Locked</p>
                <p className="text-xs text-slate-400 dark:text-zinc-550 max-w-[240px] mt-1 mx-auto leading-relaxed">
                  Complete lessons or attend upcoming sessions to populate score records here
                </p>
              </div>
            </div>
          )}
        </Card>

        {/* Syllabus Completion */}
        <Card className="bg-white dark:bg-zinc-900/40 border-slate-100 dark:border-zinc-850 p-6 flex flex-col justify-between items-center">
          <div className="w-full text-left">
            <div className="flex items-center gap-2 mb-1">
              <Award className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-bold text-slate-800 dark:text-zinc-100">Syllabus Completion</h3>
            </div>
            <p className="text-xs text-slate-400 dark:text-zinc-500 font-medium">Percentage of total modules completed</p>
          </div>
          <CompletionRadial percent={completionRate} />
          <div className="w-full flex items-center justify-between text-xs font-bold text-slate-400 dark:text-zinc-500 mt-2">
            <span>{completedCount} finished</span>
            <span>{inProgressLessons.length} in progress</span>
            <span>{totalLessons - completedCount - inProgressLessons.length} not started</span>
          </div>
        </Card>
      </div>

      {/* ── XP Progress Bar ──────────────────────────────────────────── */}
      <Card className="bg-white dark:bg-zinc-900/40 border-slate-100 dark:border-zinc-850 p-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-extrabold text-slate-800 dark:text-zinc-200 flex items-center gap-1.5">
              <Zap className="h-4 w-4 text-primary fill-purple-100" />
              XP Progress — Level {profile.level}
            </h3>
            <p className="text-xs text-slate-400 dark:text-zinc-500 font-medium mt-0.5">
              {profile.xp} / {profile.xpNextLevel} XP to Level {profile.level + 1}
            </p>
          </div>
          <span className="text-xs font-black text-primary bg-purple-50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/30 px-3 py-1 rounded-full">
            {xpPct}%
          </span>
        </div>
        <div className="w-full bg-slate-100 dark:bg-zinc-800 h-3 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-cyan-400 rounded-full transition-all duration-700 ease-out"
            style={{ width: `${Math.max(xpPct, profile.xp > 0 ? 2 : 0)}%` }}
          />
        </div>
        {profile.xp === 0 && (
          <p className="text-[11px] text-slate-400 dark:text-zinc-550 font-medium mt-2">
            💡 Complete lessons or chat with the AI tutor to earn XP
          </p>
        )}
      </Card>

      {/* ── Milestones & Badges ──────────────────────────────────────── */}
      <Card className="bg-white dark:bg-zinc-900/40 border-slate-100 dark:border-zinc-850 p-6">
        <div className="mb-5">
          <h3 className="text-lg font-bold text-slate-900 dark:text-zinc-100">Milestones & Achievements</h3>
          <p className="text-xs text-slate-400 dark:text-zinc-500 font-medium mt-0.5">
            {profile.badges.length > 0
              ? `${profile.badges.length} of ${ALL_BADGES.length} badges unlocked`
              : 'Complete courses and activities to unlock badges'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {ALL_BADGES.map(badge => {
            const isUnlocked = profile.badges.includes(badge.id);
            return (
              <div
                key={badge.id}
                className={`p-4 rounded-2xl border flex items-start gap-3 transition-all duration-300 ${
                  isUnlocked
                    ? 'bg-gradient-to-br from-purple-50/60 to-white dark:from-purple-950/20 dark:to-zinc-900 border-purple-200 dark:border-purple-900/30 shadow-sm'
                    : 'bg-slate-50/40 dark:bg-zinc-900/10 border-slate-100 dark:border-zinc-850 opacity-55 grayscale-[30%]'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl shrink-0 flex items-center justify-center text-xl ${
                  isUnlocked ? 'bg-primary/10 dark:bg-purple-900/20' : 'bg-slate-200/60 dark:bg-zinc-800'
                }`}>
                  {isUnlocked ? badge.icon : <Lock className="h-4 w-4 text-slate-400" />}
                </div>

                <div className="space-y-1 select-none">
                  <h4 className={`text-sm font-extrabold ${isUnlocked ? 'text-slate-800 dark:text-zinc-200' : 'text-slate-500 dark:text-zinc-500'}`}>
                    {badge.title}
                  </h4>
                  <p className="text-xs text-slate-400 dark:text-zinc-450 leading-relaxed font-medium">
                    {badge.description}
                  </p>
                  <span className={`inline-block text-[9px] font-bold uppercase tracking-wider mt-1 px-2 py-0.5 rounded-md ${
                    isUnlocked ? 'bg-primary/10 text-primary dark:bg-purple-905/30' : 'bg-slate-100 dark:bg-zinc-800 text-slate-450 dark:text-zinc-500'
                  }`}>
                    {isUnlocked ? '✓ Completed' : badge.requirement}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* ── Learning Timeline ────────────────────────────────────────── */}
      <Card className="bg-white dark:bg-zinc-900/40 border-slate-100 dark:border-zinc-850 p-6">
        <div className="mb-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-zinc-100 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Learning Timeline
          </h3>
          <p className="text-xs text-slate-400 dark:text-zinc-500 font-medium">Chronological logs of coursework completions</p>
        </div>

        {completedCount === 0 ? (
          <div className="flex flex-col items-center gap-3 py-10">
            <div className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-zinc-800 border border-slate-100 dark:border-zinc-850 flex items-center justify-center">
              <BookOpen className="h-7 w-7 text-slate-350 dark:text-zinc-600" />
            </div>
            <p className="text-sm font-bold text-slate-400 dark:text-zinc-550">No completions yet</p>
            <p className="text-xs text-slate-300 dark:text-zinc-600 font-medium text-center max-w-xs">
              Head to the <strong>Lessons</strong> page, slide a progress bar to 100% and your timeline will fill in automatically.
            </p>
          </div>
        ) : (
          <div className="relative border-l-2 border-slate-100 dark:border-zinc-800 pl-6 space-y-6 ml-2 py-2">
            {completedLessons.map(l => (
              <div key={l.id} className="relative group">
                <span className="absolute -left-[29px] top-1.5 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white dark:border-zinc-900 shadow-sm flex items-center justify-center">
                  <CheckCircle className="h-2.5 w-2.5 text-white fill-white" />
                </span>
                <div className="space-y-1 bg-emerald-50/45 dark:bg-emerald-950/10 border border-emerald-100/60 dark:border-emerald-900/20 rounded-2xl p-3 group-hover:shadow-sm transition-shadow">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest">{l.subject}</span>
                    <span className="text-[10px] text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/30 font-bold px-2 py-0.5 rounded-full">✓ Finished</span>
                    <span className="text-[10px] text-primary dark:text-purple-300 font-bold ml-auto">+150 XP</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-800 dark:text-zinc-200">{l.title}</h4>
                  <p className="text-xs text-slate-500 dark:text-zinc-450 font-medium">by {l.instructor}</p>
                </div>
              </div>
            ))}

            {/* Base entry */}
            <div className="relative">
              <span className="absolute -left-[29px] top-1.5 w-4 h-4 rounded-full bg-primary border-2 border-white dark:border-zinc-900 shadow-sm" />
              <div className="space-y-1 pl-2">
                <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-550 uppercase tracking-widest">System</span>
                <h4 className="text-sm font-bold text-slate-800 dark:text-zinc-250">Account Initialized</h4>
                <p className="text-xs text-slate-500 dark:text-zinc-450 font-medium">CogniSphere profile activated. Learning streak began.</p>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
