import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  User, 
  Clock, 
  CheckCircle2, 
  Video, 
  GraduationCap, 
  Code, 
  BookOpen, 
  Sparkles,
  X
} from 'lucide-react';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { useApp, Lesson } from '../lib/AppContext';

export default function Lessons() {
  const { lessons, updateLessonProgress, addLesson } = useApp();
  const [query, setQuery] = useState('');
  const [subject, setSubject] = useState('All');
  const [difficulty, setDifficulty] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Modal form states
  const [newTitle, setNewTitle] = useState('');
  const [newSubject, setNewSubject] = useState('CS');
  const [newDifficulty, setNewDifficulty] = useState('Intermediate');
  const [newType, setNewType] = useState<'video' | 'quiz' | 'exercise' | 'article'>('video');
  const [newInstructor, setNewInstructor] = useState('');
  const [newDuration, setNewDuration] = useState('');
  const [newDesc, setNewDesc] = useState('');

  // Filter lessons
  const filtered = lessons.filter(l => 
    (subject === 'All' || l.subject === subject) &&
    (difficulty === 'All' || l.difficulty === difficulty) &&
    (l.title.toLowerCase().includes(query.toLowerCase()) || 
     l.instructor.toLowerCase().includes(query.toLowerCase()))
  );

  const getSubjectIcon = (sub: string) => {
    switch (sub) {
      case 'Math': return <GraduationCap className="h-4 w-4 text-purple-500" />;
      case 'Physics': return <Sparkles className="h-4 w-4 text-cyan-500" />;
      case 'CS': return <Code className="h-4 w-4 text-emerald-500" />;
      case 'Biology': return <BookOpen className="h-4 w-4 text-pink-500" />;
      default: return <Clock className="h-4 w-4 text-blue-500" />;
    }
  };

  const handleCreateLesson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newInstructor.trim()) return;

    // Pick a high quality abstract thumbnail based on subject
    const subjectImages: Record<string, string> = {
      Math: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=300',
      Physics: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?auto=format&fit=crop&q=80&w=300',
      CS: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=300',
      Biology: 'https://images.unsplash.com/photo-1530213786676-4189f1756920?auto=format&fit=crop&q=80&w=300',
      Chemistry: 'https://images.unsplash.com/photo-1603126859738-1260ca13d09a?auto=format&fit=crop&q=80&w=300',
    };

    const thumbnail = subjectImages[newSubject] || subjectImages.CS;

    addLesson({
      title: newTitle,
      subject: newSubject,
      difficulty: newDifficulty as any,
      type: newType,
      duration: newDuration || '30 mins',
      instructor: newInstructor,
      description: newDesc || 'No description provided.',
      thumbnail
    });

    // Reset states
    setNewTitle('');
    setNewInstructor('');
    setNewDuration('');
    setNewDesc('');
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 relative">
      {/* Search and Filters */}
      <Card className="shadow-sm border-slate-100 dark:border-zinc-800 bg-white dark:bg-zinc-900/60">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Search title, instructor..." 
              value={query} 
              onChange={e => setQuery(e.target.value)} 
              aria-label="Search lessons" 
              className="pl-9"
            />
          </div>
          
          <select 
            className="input select" 
            value={subject} 
            onChange={e => setSubject(e.target.value)} 
            aria-label="Filter by subject"
          >
            {['All', 'Math', 'Physics', 'CS', 'Biology', 'Chemistry'].map(s => (
              <option key={s} value={s}>{s === 'All' ? 'All Subjects' : s}</option>
            ))}
          </select>
          
          <select 
            className="input select" 
            value={difficulty} 
            onChange={e => setDifficulty(e.target.value)} 
            aria-label="Filter by difficulty"
          >
            {['All', 'Beginner', 'Intermediate', 'Advanced'].map(d => (
              <option key={d} value={d}>{d === 'All' ? 'All Difficulties' : d}</option>
            ))}
          </select>
          
          <Button 
            onClick={() => setIsModalOpen(true)}
            className="btn-primary gap-1.5 flex items-center justify-center font-bold"
          >
            <Plus className="h-4.5 w-4.5" />
            <span>Create Playlist</span>
          </Button>
        </div>
      </Card>

      {/* Grid of lessons */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 text-slate-400 dark:text-zinc-500 font-medium">
          No lessons found matching the filters. Create a new playlist to get started!
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(item => (
            <Card key={item.id} className="p-0 overflow-hidden flex flex-col hover:shadow-lg border-slate-150 dark:border-zinc-800 transition-all duration-300 relative group bg-white dark:bg-zinc-900/40 rounded-2xl">
              {/* Card Image header */}
              <div className="h-40 bg-slate-100 relative overflow-hidden">
                <img 
                  src={item.thumbnail} 
                  alt={item.title} 
                  className="object-cover w-full h-full group-hover:scale-[1.03] transition-transform duration-500" 
                />
                <div className="absolute top-2.5 right-2.5 flex gap-1">
                  <span className="badge bg-black/60 text-white border-none backdrop-blur-sm text-[10px] uppercase font-bold py-0.5 px-2">
                    {item.duration}
                  </span>
                </div>
                <div className="absolute top-2.5 left-2.5">
                  <span className="badge bg-white/95 text-slate-900 border-none backdrop-blur-sm text-[10px] font-extrabold uppercase py-0.5 px-2 flex items-center gap-1">
                    {getSubjectIcon(item.subject)}
                    {item.subject}
                  </span>
                </div>
              </div>

              {/* Card content body */}
              <div className="p-5 flex flex-col flex-grow justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-primary tracking-widest uppercase">{item.type}</span>
                    <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase">{item.difficulty}</span>
                  </div>
                  <h4 className="font-bold text-slate-800 dark:text-zinc-200 leading-snug line-clamp-2 text-base group-hover:text-primary dark:group-hover:text-purple-400 transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-400 dark:text-zinc-550 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Instructor detail */}
                  <div className="text-xs text-slate-500 dark:text-zinc-400 flex items-center gap-2 font-medium">
                     <span className="w-5 h-5 rounded-full bg-slate-155 dark:bg-zinc-800 flex items-center justify-center text-[10px] text-slate-600 dark:text-zinc-400 font-bold overflow-hidden border border-slate-100 dark:border-zinc-800">
                        <img 
                          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(item.instructor)}&background=random&color=fff`} 
                          alt={item.instructor} 
                          className="w-full h-full" 
                        />
                     </span>
                     <span>{item.instructor}</span>
                  </div>

                  {/* Interactive Progress Segment */}
                  <div className="pt-2 border-t border-slate-100 dark:border-zinc-800">
                    <div className="flex justify-between text-xs font-bold text-slate-500 dark:text-zinc-450 mb-1">
                      <span>Course Progress</span>
                      <span className={item.progress === 100 ? "text-emerald-600 dark:text-emerald-400" : "text-primary"}>
                        {item.progress}%
                      </span>
                    </div>

                    {/* Progress slider bar */}
                    <div className="flex items-center gap-2.5">
                      <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        value={item.progress} 
                        onChange={e => updateLessonProgress(item.id, parseInt(e.target.value))}
                        className="w-full h-2 bg-slate-100 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-primary"
                        title="Drag to change progress"
                      />
                      {item.progress < 100 ? (
                        <button 
                          onClick={() => updateLessonProgress(item.id, 100)}
                          className="p-1 rounded-lg text-slate-400 hover:text-emerald-500 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 transition-all shrink-0 cursor-pointer"
                          title="Instant complete (Mark 100%)"
                          aria-label="Mark as complete"
                        >
                          <CheckCircle2 className="h-4 w-4" />
                        </button>
                      ) : (
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 fill-emerald-50 dark:fill-emerald-950/10 shrink-0" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* New Playlist Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 dark:bg-black/80 backdrop-blur-sm animate-fade-in p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100 dark:border-zinc-800">
            <div className="bg-slate-50 dark:bg-zinc-950/40 px-6 py-4 border-b border-slate-100 dark:border-zinc-800 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-zinc-150">Create New Study Playlist</h3>
                <p className="text-xs text-slate-400 dark:text-zinc-500 font-medium">Add a dynamic learning track to your feed</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 dark:text-zinc-500 hover:text-slate-655 dark:hover:text-zinc-350 hover:bg-slate-200/50 dark:hover:bg-zinc-850 rounded-lg transition-colors cursor-pointer"
                aria-label="Close dialog"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleCreateLesson} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-zinc-500 uppercase tracking-wider mb-1" htmlFor="modal-sub">Subject</label>
                  <select 
                    id="modal-sub" 
                    className="input select py-2 text-xs" 
                    value={newSubject}
                    onChange={e => setNewSubject(e.target.value)}
                  >
                    {['Math', 'Physics', 'CS', 'Biology', 'Chemistry'].map(s => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-zinc-500 uppercase tracking-wider mb-1" htmlFor="modal-diff">Difficulty</label>
                  <select 
                    id="modal-diff" 
                    className="input select py-2 text-xs"
                    value={newDifficulty}
                    onChange={e => setNewDifficulty(e.target.value)}
                  >
                    {['Beginner', 'Intermediate', 'Advanced'].map(d => (
                      <option key={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-zinc-500 uppercase tracking-wider mb-1" htmlFor="modal-title">Playlist Title</label>
                <Input 
                  id="modal-title" 
                  placeholder="e.g. Dynamic Programming Optimization" 
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  required 
                  className="py-2.5 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-zinc-500 uppercase tracking-wider mb-1" htmlFor="modal-inst">Instructor</label>
                  <Input 
                    id="modal-inst" 
                    placeholder="e.g. Alex Rodriguez" 
                    value={newInstructor}
                    onChange={e => setNewInstructor(e.target.value)}
                    required
                    className="py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-zinc-500 uppercase tracking-wider mb-1" htmlFor="modal-dur">Duration</label>
                  <Input 
                    id="modal-dur" 
                    placeholder="e.g. 45 mins" 
                    value={newDuration}
                    onChange={e => setNewDuration(e.target.value)}
                    className="py-2 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-zinc-500 uppercase tracking-wider mb-1" htmlFor="modal-type">Format</label>
                <select 
                  id="modal-type" 
                  className="input select py-2 text-xs" 
                  value={newType}
                  onChange={e => setNewType(e.target.value as any)}
                >
                  <option value="video">Video Lecture</option>
                  <option value="quiz">Assessment Quiz</option>
                  <option value="exercise">Interactive Code Exercise</option>
                  <option value="article">Study Guide Article</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-zinc-500 uppercase tracking-wider mb-1" htmlFor="modal-desc">Brief Description</label>
                <textarea 
                  id="modal-desc" 
                  rows={2} 
                  placeholder="Describe what learners will learn in this session..." 
                  className="input py-2 text-xs resize-none"
                  value={newDesc}
                  onChange={e => setNewDesc(e.target.value)}
                />
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-zinc-800 flex justify-end gap-3">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsModalOpen(false)}
                  className="text-xs px-4 py-2"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="btn-primary text-xs px-5 py-2 font-bold"
                >
                  Add to library
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
