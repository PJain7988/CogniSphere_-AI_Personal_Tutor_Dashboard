import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Flame, 
  Clock, 
  GraduationCap, 
  Award, 
  Calendar, 
  CheckCircle2, 
  Play, 
  ArrowRight,
  BookOpen
} from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { WeeklyPerformance, CompletionRadial } from '../components/ProgressCharts';
import { useApp } from '../lib/AppContext';
import { recommendations } from '../lib/mock';

export default function Home() {
  const { profile, upcoming, lessons, attendLesson, addLesson } = useApp();
  const navigate = useNavigate();

  // Dynamic statistics calculations
  const totalLessons = lessons.length;
  const completedCount = lessons.filter(l => l.progress === 100).length;
  const completionRate = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  // Compile weekly performance from real tracked scores
  const scores = profile.weeklyScores?.length === 7
    ? profile.weeklyScores
    : [0, 0, 0, 0, 0, 0, 0];

  const weeklyData = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => ({
    day,
    score: scores[i]
  }));

  // Handle recommendation click
  const handleStartRecommendation = (title: string, tag: string) => {
    // Check if the lesson already exists
    const exists = lessons.some(l => l.title === title);
    if (!exists) {
      addLesson({
        title,
        subject: tag === 'Computer Science' ? 'CS' : tag,
        difficulty: 'Intermediate',
        type: 'exercise',
        duration: '45 mins',
        instructor: 'CogniSphere Tutor',
        description: `Custom practice track generated for ${title}.`
      });
    }
    navigate('/lessons');
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-primary to-indigo-700 dark:from-purple-950 dark:to-indigo-950 rounded-3xl p-6 md:p-8 text-white relative overflow-hidden shadow-md">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-2xl"></div>
        <div className="absolute bottom-0 right-1/4 w-32 h-32 bg-cyan-400/10 rounded-full blur-xl"></div>
        <div className="relative z-10 space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold backdrop-blur-sm">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>Active learning session running</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">Welcome back, {profile.name}!</h2>
          <p className="text-white/80 text-sm md:text-base font-medium">
            Your AI tutor suggests mastering **Eigenvectors** or finishing your **Kinematics Assessment** today.
          </p>
        </div>
      </div>

      {/* Dynamic Stats Row */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="flex items-center gap-4 bg-white dark:bg-zinc-900/40 border-slate-100 dark:border-zinc-800/50 hover:shadow-md transition-shadow">
          <div className="p-3 bg-amber-50 dark:bg-amber-950/20 rounded-2xl text-amber-500">
            <Flame className="h-6 w-6 fill-amber-500 stroke-amber-600" />
          </div>
          <div>
            <span className="text-xs text-slate-400 dark:text-zinc-550 font-bold block uppercase tracking-wider">Streak</span>
            <span className="text-lg font-black text-slate-800 dark:text-zinc-200">{profile.streak} Days</span>
          </div>
        </Card>

        <Card className="flex items-center gap-4 bg-white dark:bg-zinc-900/40 border-slate-100 dark:border-zinc-800/50 hover:shadow-md transition-shadow">
          <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-2xl text-blue-500">
            <Clock className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 dark:text-zinc-550 font-bold block uppercase tracking-wider">Study Time</span>
            <span className="text-lg font-black text-slate-800 dark:text-zinc-200">{profile.studyTime} Hours</span>
          </div>
        </Card>

        <Card className="flex items-center gap-4 bg-white dark:bg-zinc-900/40 border-slate-100 dark:border-zinc-800/50 hover:shadow-md transition-shadow">
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 rounded-2xl text-emerald-500">
            <GraduationCap className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 dark:text-zinc-550 font-bold block uppercase tracking-wider">Avg Grade</span>
            <span className="text-lg font-black text-slate-800 dark:text-zinc-200">{profile.avgGrade}%</span>
          </div>
        </Card>

        <Card className="flex items-center gap-4 bg-white dark:bg-zinc-900/40 border-slate-100 dark:border-zinc-800/50 hover:shadow-md transition-shadow">
          <div className="p-3 bg-purple-50 dark:bg-purple-950/20 rounded-2xl text-purple-500">
            <Award className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 dark:text-zinc-550 font-bold block uppercase tracking-wider">Level XP</span>
            <span className="text-lg font-black text-slate-800 dark:text-zinc-200">{profile.xp} XP</span>
          </div>
        </Card>
      </section>

      {/* Row 1: Upcoming Lessons & Completion Rate */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Lessons Card */}
        <Card className="lg:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-zinc-100 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                <span>Upcoming Scheduled Sessions</span>
              </h3>
              <Button onClick={() => navigate('/lessons')} className="text-xs font-semibold px-3 py-1.5" variant="outline">
                View Library
              </Button>
            </div>
            
            <ul className="space-y-3">
              {upcoming.map(item => (
                <li 
                  key={item.id} 
                  className={`flex flex-col sm:flex-row sm:items-center justify-between rounded-xl border p-4 gap-3 transition-all ${
                    item.attended 
                      ? 'bg-slate-50/70 dark:bg-zinc-900/20 border-slate-100 dark:border-zinc-850 text-slate-500 dark:text-zinc-500 opacity-80' 
                      : 'bg-white dark:bg-zinc-900/40 border-slate-200 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700 hover:shadow-sm'
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <div className={`font-bold truncate ${item.attended ? 'text-slate-500 dark:text-zinc-500 line-through' : 'text-slate-800 dark:text-zinc-200'}`}>
                      {item.title}
                    </div>
                    <div className="text-xs text-slate-400 dark:text-zinc-500 mt-1 font-medium flex flex-wrap items-center gap-1.5">
                      <span>{item.time}</span>
                      <span>•</span>
                      <span className="text-slate-500 dark:text-zinc-400 font-semibold">{item.instructor}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 self-end sm:self-auto">
                    <span className="badge text-[10px] uppercase font-bold">{item.difficulty}</span>
                    {item.attended ? (
                      <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 px-3 py-1.5 rounded-xl border border-emerald-100 dark:border-emerald-900/30">
                        <CheckCircle2 className="h-4 w-4 fill-emerald-50 dark:fill-emerald-950/10" />
                        <span>Attended</span>
                      </span>
                    ) : (
                      <button 
                        onClick={() => attendLesson(item.id)} 
                        className="btn-primary text-xs px-3.5 py-1.5 shadow-none border-0"
                      >
                        Attend
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </Card>

        {/* Completion radial metric */}
        <Card className="flex flex-col items-center justify-center p-6 text-center">
          <div className="w-full text-left mb-2">
            <h3 className="text-lg font-bold text-slate-900 dark:text-zinc-100">Total Completion</h3>
            <p className="text-xs text-slate-400 dark:text-zinc-500 font-medium">Progress across all lessons</p>
          </div>
          <CompletionRadial percent={completionRate} />
          <div className="text-xs text-slate-400 dark:text-zinc-550 font-bold uppercase tracking-wider mt-2">
            {completedCount} of {totalLessons} Lessons Finished
          </div>
        </Card>
      </section>

      {/* Row 2: Personalized Recommendations & Weekly Performance */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Personalized recommendations */}
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-zinc-100 flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              <span>Personalized Recommendations</span>
            </h3>
            <span className="text-xs font-bold text-slate-450 dark:text-zinc-500 uppercase tracking-widest bg-slate-50 dark:bg-zinc-800/40 border border-slate-100 dark:border-zinc-800 px-2 py-1 rounded-lg">AI Generated</span>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendations.slice(0, 3).map(r => (
              <div 
                key={r.id} 
                className="rounded-2xl border border-slate-150 dark:border-zinc-800 overflow-hidden flex flex-col group hover:shadow-md hover:border-slate-200 dark:hover:border-zinc-700 transition-all duration-300 bg-white dark:bg-zinc-900/30"
              >
                <div className="h-28 bg-slate-100 dark:bg-zinc-800 relative overflow-hidden">
                   <img src={r.thumbnail} alt={r.title} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
                   <div className="absolute top-2 right-2">
                     <span className="badge bg-black/60 text-white border-none backdrop-blur-sm text-[10px] uppercase font-bold">{r.tag}</span>
                   </div>
                </div>
                <div className="p-4 flex flex-col flex-grow justify-between">
                  <div className="font-bold leading-tight mb-3 flex-grow text-slate-800 dark:text-zinc-200 text-sm group-hover:text-primary dark:group-hover:text-purple-400 transition-colors line-clamp-2">
                    {r.title}
                  </div>
                  <button 
                    onClick={() => handleStartRecommendation(r.title, r.tag)}
                    className="w-full btn-outline text-xs py-2 gap-1"
                  >
                    <span>Start Track</span>
                    <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Weekly performance chart */}
        <Card className="flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-zinc-100">Weekly Performance</h3>
            <p className="text-xs text-slate-400 dark:text-zinc-550 font-medium mb-4">Score analytics across active tests</p>
          </div>
          <WeeklyPerformance data={weeklyData} />
        </Card>
      </section>
    </div>
  );
}
