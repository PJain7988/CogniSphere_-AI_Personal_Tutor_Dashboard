import React, { useState, useRef, useEffect } from "react";
import { NavLink, Outlet, Link } from "react-router-dom";
import { 
  Home as HomeIcon, 
  BookOpen, 
  LineChart, 
  MessageSquare, 
  Settings as SettingsIcon, 
  BarChart3, 
  Flame, 
  Bell, 
  RotateCcw,
  Sparkles,
  Menu,
  X,
  Check,
  Trash2,
  ArrowRight,
  User,
  Target,
  Sliders,
  Sun,
  Moon
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { AppProvider, useApp } from "./lib/AppContext";
import type { UserProfile } from "./lib/AppContext";

function SidebarLink({ to, icon: Icon, label }: { to: string; icon: any; label: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3.5 py-3 rounded-xl font-medium transition-all duration-200 ${
          isActive 
            ? "bg-purple-50 text-primary dark:bg-purple-950/20 dark:text-purple-300 shadow-[inset_4px_0_0_0_#6E56CF] dark:shadow-[inset_4px_0_0_0_#a78bfa]" 
            : "text-slate-600 dark:text-zinc-455 hover:bg-slate-50 dark:hover:bg-zinc-850 hover:text-slate-900 dark:hover:text-white"
        }`
      }
      aria-label={label}
    >
      <Icon className="h-5 w-5" aria-hidden="true" />
      <span className="text-sm">{label}</span>
    </NavLink>
  );
}

function OnboardingModal() {
  const { completeOnboarding } = useApp();
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [difficulty, setDifficulty] = useState<UserProfile['difficulty']>('Intermediate');
  const [goals, setGoals] = useState('');
  const [nameError, setNameError] = useState('');

  const handleNext = () => {
    if (step === 0) {
      if (!name.trim() || name.trim().length < 2) {
        setNameError('Please enter your full name (at least 2 characters)');
        return;
      }
      setNameError('');
      setStep(1);
    } else if (step === 1) {
      setStep(2);
    } else {
      completeOnboarding(name, difficulty, goals || `Master ${difficulty}-level subjects and build strong foundational skills.`);
    }
  };

  const steps = [
    { icon: User, label: 'Your Identity' },
    { icon: Sliders, label: 'Learning Level' },
    { icon: Target, label: 'Your Goals' },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" style={{ background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)' }}>
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse [animation-delay:1s]" />
        <div className="absolute top-3/4 left-1/2 w-64 h-64 bg-indigo-600/15 rounded-full blur-3xl animate-pulse [animation-delay:2s]" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative w-full max-w-md"
      >
        {/* Card */}
        <div className="bg-white/[0.07] backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-[0_25px_60px_rgba(0,0,0,0.5)]">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="h-10 w-10 flex items-center justify-center overflow-hidden rounded-xl bg-gradient-to-tr from-purple-600 to-cyan-400 p-0.5 shadow-lg">
              <div className="w-full h-full bg-[#1a1530] rounded-[10px] flex items-center justify-center font-black text-purple-300 text-xl">C</div>
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-white">CogniSphere</h1>
              <span className="text-[10px] text-white/40 font-semibold block -mt-1 uppercase tracking-widest">AI Adaptive Learning</span>
            </div>
          </div>

          {/* Step progress */}
          <div className="flex items-center gap-2 mb-8">
            {steps.map((s, i) => (
              <React.Fragment key={i}>
                <div className={`flex items-center gap-1.5 text-xs font-bold transition-all ${
                  i === step ? 'text-white' : i < step ? 'text-emerald-400' : 'text-white/30'
                }`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black border ${
                    i === step ? 'bg-purple-500 border-purple-400 text-white' 
                    : i < step ? 'bg-emerald-500 border-emerald-400 text-white' 
                    : 'bg-white/5 border-white/10 text-white/30'
                  }`}>{i < step ? '✓' : i + 1}</div>
                  <span className="hidden sm:block">{s.label}</span>
                </div>
                {i < steps.length - 1 && (
                  <div className={`flex-1 h-px transition-colors ${ i < step ? 'bg-emerald-500' : 'bg-white/10' }`} />
                )}
              </React.Fragment>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div
                key="step0"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className="space-y-5"
              >
                <div>
                  <h2 className="text-2xl font-extrabold text-white leading-tight">Welcome! 👋</h2>
                  <p className="text-sm text-white/50 mt-1 font-medium">Let's personalize your learning journey. What's your name?</p>
                </div>
                <div>
                  <label className="block text-xs font-bold text-white/60 uppercase tracking-wider mb-2">Your Full Name</label>
                  <input
                    autoFocus
                    type="text"
                    value={name}
                    onChange={e => { setName(e.target.value); setNameError(''); }}
                    onKeyDown={e => e.key === 'Enter' && handleNext()}
                    placeholder="e.g. Alex Johnson"
                    className="w-full bg-white/10 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm font-medium focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 transition-all"
                  />
                  {nameError && <p className="text-red-400 text-xs font-semibold mt-1.5">{nameError}</p>}
                </div>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className="space-y-5"
              >
                <div>
                  <h2 className="text-2xl font-extrabold text-white leading-tight">Hi, {name}! 🎓</h2>
                  <p className="text-sm text-white/50 mt-1 font-medium">Select your preferred difficulty level to adapt course content.</p>
                               <div className="grid grid-cols-2 gap-3">
                  {(['Beginner', 'Intermediate', 'Advanced', 'Auto'] as const).map(d => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setDifficulty(d)}
                      className={`p-4 rounded-xl border text-left transition-all ${
                        difficulty === d 
                          ? 'bg-purple-50/25 border-purple-400 text-white' 
                          : 'bg-white/5 border-white/10 text-white/60 hover:border-white/30 hover:bg-white/10'
                      }`}
                    >
                      <div className="text-lg mb-1">
                        {d === 'Beginner' ? '🌱' : d === 'Intermediate' ? '⚡' : d === 'Advanced' ? '🔥' : '🤖'}
                      </div>
                      <div className="text-sm font-bold">{d}</div>
                      <div className="text-[10px] text-white/40 font-medium mt-0.5">
                        {d === 'Beginner' ? 'New to the subject' : d === 'Intermediate' ? 'Some experience' : d === 'Advanced' ? 'Deep knowledge' : 'AI adjusts for you'}
                      </div>
                    </button>
                  ))}
                </div>             </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className="space-y-5"
              >
                <div>
                  <h2 className="text-2xl font-extrabold text-white leading-tight">Final Step! 🚀</h2>
                  <p className="text-sm text-white/50 mt-1 font-medium">What do you want to achieve? (optional — you can update this later)</p>
                </div>
                <div>
                  <label className="block text-xs font-bold text-white/60 uppercase tracking-wider mb-2">Your Learning Goals</label>
                  <textarea
                    value={goals}
                    onChange={e => setGoals(e.target.value)}
                    placeholder={`e.g. Master ${difficulty}-level mathematics and pass my upcoming exams.`}
                    rows={4}
                    className="w-full bg-white/10 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm font-medium focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 transition-all resize-none"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Next button */}
          <button
            key={step}
            type="button"
            onClick={handleNext}
            className="mt-6 w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm rounded-xl transition-all shadow-[0_8px_25px_rgba(110,86,207,0.4)] hover:shadow-[0_10px_30px_rgba(110,86,207,0.5)] active:scale-95"
          >
            <span>{step === 2 ? 'Launch Dashboard' : 'Continue'}</span>
            <ArrowRight className="h-4 w-4" />
          </button>

          {step < 2 && (
            <p className="text-center text-xs text-white/30 font-medium mt-3">
              Step {step + 1} of {steps.length}
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
}

function MainLayout() {
  const { profile, resetAll, notificationsList, markNotificationsRead, clearNotifications, isOnboarding, theme, toggleTheme } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const xpPercentage = (profile.xp / profile.xpNextLevel) * 100;
  const unreadCount = notificationsList.filter(n => !n.read).length;

  // Close notifications dropdown on clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setNotifDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#09090b] text-slate-900 dark:text-zinc-100 flex flex-col transition-colors duration-200">
      {/* Onboarding Modal Overlay */}
      <AnimatePresence>
        {isOnboarding && <OnboardingModal />}
      </AnimatePresence>

      {/* Dynamic Header */}
      <header className="sticky top-0 z-40 bg-white/85 dark:bg-zinc-950/80 backdrop-blur-md border-b border-slate-100 dark:border-zinc-900 shadow-[0_2px_15px_rgba(0,0,0,0.02)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
            <div className="h-10 w-10 flex items-center justify-center overflow-hidden rounded-xl bg-gradient-to-tr from-primary to-cyan-400 p-0.5 shadow-sm" aria-hidden="true">
              <div className="w-full h-full bg-white dark:bg-zinc-900 rounded-[10px] flex items-center justify-center font-black text-primary text-xl">C</div>
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary via-indigo-600 to-cyan-500">CogniSphere</h1>
              <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-semibold block -mt-1 uppercase tracking-widest">AI Adaptive Learning</span>
            </div>
          </Link>

          {/* Header Actions */}
          <div className="flex items-center gap-2 relative">
            <button 
              onClick={() => {
                if(confirm("Are you sure you want to reset all dashboard learning data to default?")) {
                  resetAll();
                }
              }}
              className="p-2 text-slate-400 hover:text-slate-655 dark:text-zinc-500 dark:hover:text-zinc-300 rounded-lg hover:bg-slate-50 dark:hover:bg-zinc-900 transition-colors"
              title="Reset All Data"
              aria-label="Reset All Data"
            >
              <RotateCcw className="h-4 w-4" />
            </button>

            {/* Theme Toggler */}
            <button
              onClick={toggleTheme}
              className="p-2 text-slate-400 hover:text-slate-600 dark:text-zinc-400 dark:hover:text-zinc-200 rounded-lg hover:bg-slate-50 dark:hover:bg-zinc-900 transition-colors"
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? (
                <motion.div whileTap={{ rotate: 90, scale: 0.8 }}><Moon className="h-4.5 w-4.5" /></motion.div>
              ) : (
                <motion.div whileTap={{ rotate: -90, scale: 0.8 }}><Sun className="h-4.5 w-4.5" /></motion.div>
              )}
            </button>
            
            {/* Notifications Bell with Dropdown Container */}
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                className="relative p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer" 
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Dynamic Notification Drawer */}
              <AnimatePresence>
                {notifDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-80 bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-2xl shadow-xl z-50 overflow-hidden"
                  >
                    {/* Header */}
                    <div className="bg-slate-50 dark:bg-zinc-950/40 px-4 py-3 border-b border-slate-100 dark:border-zinc-800 flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800 dark:text-zinc-300 uppercase tracking-wider">Activity Notifications</span>
                      <div className="flex gap-2">
                        {unreadCount > 0 && (
                          <button 
                            onClick={markNotificationsRead}
                            className="p-1 text-slate-500 hover:text-primary rounded hover:bg-slate-150 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                            title="Mark all read"
                            aria-label="Mark all read"
                          >
                            <Check className="h-3.5 w-3.5" />
                          </button>
                        )}
                        {notificationsList.length > 0 && (
                          <button 
                            onClick={clearNotifications}
                            className="p-1 text-slate-500 hover:text-red-500 rounded hover:bg-slate-150 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                            title="Clear all"
                            aria-label="Clear all"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Notification Rows */}
                    <div className="max-h-60 overflow-y-auto divide-y divide-slate-100 dark:divide-zinc-800">
                      {notificationsList.length === 0 ? (
                        <div className="p-6 text-center text-slate-400 dark:text-zinc-500 text-xs font-medium">
                          No notifications to display.
                        </div>
                      ) : (
                        notificationsList.map(notif => (
                          <div 
                            key={notif.id} 
                            className={`p-3 text-xs leading-relaxed font-medium transition-colors ${
                              notif.read ? "text-slate-500 dark:text-zinc-400 bg-white dark:bg-zinc-900" : "text-slate-900 dark:text-zinc-200 bg-purple-50/20 dark:bg-purple-950/10 font-bold"
                            }`}
                          >
                            <div className="flex items-start gap-2">
                              {!notif.read && (
                                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0"></span>
                              )}
                              <div className="flex-1">
                                <p>{notif.text}</p>
                                <span className="text-[9px] text-slate-400 dark:text-zinc-500 mt-1 block font-semibold">{notif.time}</span>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-500 dark:text-zinc-400 hover:text-slate-700 dark:hover:text-zinc-250 hover:bg-slate-50 dark:hover:bg-zinc-900 rounded-lg"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

            {/* Dynamic User Avatar Chip */}
            {profile.name ? (
              <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-slate-100 dark:border-zinc-800">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white text-xs font-black shadow-sm select-none" aria-label={`Signed in as ${profile.name}`}>
                  {profile.name.charAt(0).toUpperCase()}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-xs font-bold text-slate-800 dark:text-zinc-200 leading-none">{profile.name}</p>
                  <p className="text-[10px] text-slate-400 dark:text-zinc-500 font-medium mt-0.5">Lv. {profile.level} · {profile.xp} XP</p>
                </div>
              </div>
            ) : (
              <button className="hidden sm:inline-flex btn-primary px-4 py-2 text-sm shadow-sm gap-2">
                <Sparkles className="h-4 w-4" />
                <span>Premium Tutor Mode</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Grid Layout */}
      <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-6 flex-grow grid grid-cols-1 lg:grid-cols-[260px,1fr] gap-6 relative">
        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-16 left-0 right-0 bg-white dark:bg-zinc-900 border-b border-slate-200 dark:border-zinc-800 p-4 shadow-xl z-30 lg:hidden flex flex-col gap-2"
            >
              <SidebarLink to="/" icon={HomeIcon} label="Home" />
              <SidebarLink to="/lessons" icon={BookOpen} label="Lessons" />
              <SidebarLink to="/progress" icon={LineChart} label="Progress" />
              <SidebarLink to="/chat" icon={MessageSquare} label="Chat" />
              <SidebarLink to="/settings" icon={SettingsIcon} label="Settings" />
              <SidebarLink to="/tutor-analytics" icon={BarChart3} label="Tutor Analytics" />
              <hr className="my-2 border-slate-100 dark:border-zinc-800" />
              <div className="p-3 bg-purple-50 dark:bg-purple-950/20 rounded-xl flex items-center justify-between">
                <span className="text-sm font-semibold text-primary">Streak Status</span>
                <span className="flex items-center gap-1 text-sm font-bold text-amber-600">
                  <Flame className="h-4 w-4 fill-amber-500 stroke-amber-600" /> {profile.streak} Days
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sidebar Nav */}
        <nav aria-label="Primary" className="hidden lg:flex flex-col gap-4 card p-4 h-max sticky top-24 bg-white dark:bg-zinc-900/60 border border-slate-100 dark:border-zinc-850 shadow-[0_4px_20px_rgba(0,0,0,0.01)] rounded-2xl">
          <div>
            <div className="text-xs font-bold px-2 py-1 mb-2 text-slate-400 dark:text-zinc-500 uppercase tracking-widest">Menu</div>
            <div className="flex flex-col gap-1">
              <SidebarLink to="/" icon={HomeIcon} label="Home" />
              <SidebarLink to="/lessons" icon={BookOpen} label="Lessons" />
              <SidebarLink to="/progress" icon={LineChart} label="Progress" />
              <SidebarLink to="/chat" icon={MessageSquare} label="Chat" />
              <SidebarLink to="/settings" icon={SettingsIcon} label="Settings" />
              <SidebarLink to="/tutor-analytics" icon={BarChart3} label="Tutor Analytics" />
            </div>
          </div>
          
          <hr className="border-slate-100 dark:border-zinc-800" />

          {/* Gamification Stats Card */}
          <div className="p-3 bg-gradient-to-b from-slate-50 to-white dark:from-zinc-900 dark:to-zinc-900/20 border border-slate-100 dark:border-zinc-800 rounded-xl">
            {/* User identity row */}
            {profile.name && (
              <div className="flex items-center gap-2 mb-3 pb-3 border-b border-slate-100 dark:border-zinc-800">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white text-xs font-black shadow-sm shrink-0">
                  {profile.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 text-left">
                  <p className="text-xs font-bold text-slate-800 dark:text-zinc-200 truncate">{profile.name}</p>
                  <p className="text-[10px] text-slate-400 dark:text-zinc-500 font-medium">{profile.difficulty} Track</p>
                </div>
              </div>
            )}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 rounded bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">Lvl</div>
                <span className="text-xs font-bold text-slate-800 dark:text-zinc-200">Level {profile.level}</span>
              </div>
              <span className="text-[10px] font-bold text-slate-450 dark:text-zinc-500 uppercase tracking-wider">{profile.xp} / {profile.xpNextLevel} XP</span>
            </div>
            
            {/* XP Bar */}
            <div className="w-full bg-slate-100 dark:bg-zinc-800 h-2 rounded-full overflow-hidden mb-3">
              <div 
                className="bg-primary h-full rounded-full transition-all duration-500 ease-out" 
                style={{ width: `${xpPercentage}%` }}
              ></div>
            </div>

            {/* Streak Counter */}
            <div className="flex items-center justify-between text-xs border-t border-slate-100/80 dark:border-zinc-800/80 pt-2 text-slate-650 dark:text-zinc-400 font-medium">
              <span>Learning Streak</span>
              <span className="flex items-center gap-1 font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/20 px-2 py-0.5 rounded-full border border-amber-100 dark:border-amber-900/30">
                <Flame className="h-3.5 w-3.5 fill-amber-500 stroke-amber-600 animate-pulse" />
                <span>{profile.streak} Days</span>
              </span>
            </div>
          </div>
        </nav>

        {/* Page Content */}
        <main className="min-w-0">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="space-y-6"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-200/50 dark:border-zinc-900 bg-white dark:bg-zinc-950 py-6 text-xs text-slate-400 dark:text-zinc-500 font-medium mt-auto transition-colors duration-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-3">
          <div>© 2026 CogniSphere adaptive prototype. All rights reserved.</div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-slate-600 dark:hover:text-zinc-300 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-600 dark:hover:text-zinc-300 transition-colors">Accessibility Standards</a>
            <a href="#" className="hover:text-slate-600 dark:hover:text-zinc-300 transition-colors">Help & Documentation</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
