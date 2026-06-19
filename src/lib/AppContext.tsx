import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { askTutor } from './api';

export interface UserProfile {
  name: string;
  difficulty: 'Auto' | 'Beginner' | 'Intermediate' | 'Advanced';
  goals: string;
  level: number;
  xp: number;
  xpNextLevel: number;
  streak: number;
  studyTime: number; // in hours
  avgGrade: number; // average score 0-100
  weeklyScores: number[]; // [Mon,Tue,Wed,Thu,Fri,Sat,Sun] real activity scores
  notifications: {
    reminders: boolean;
    streaks: boolean;
    recommendations: boolean;
    reports: boolean;
  };
  badges: string[];
}

export interface Lesson {
  id: string;
  type: 'video' | 'quiz' | 'exercise' | 'article';
  subject: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  title: string;
  description: string;
  duration: string;
  instructor: string;
  progress: number;
}

export interface UpcomingLesson {
  id: string;
  title: string;
  time: string;
  difficulty: string;
  instructor: string;
  attended: boolean;
}

export interface Student {
  id: string;
  name: string;
  lastActive: string;
  avgScore: number;
  completed: number;
  risk: boolean;
  avatar: string;
}

export interface Message {
  id: string;
  role: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'xp';
}

export interface NotificationItem {
  id: string;
  text: string;
  time: string;
  read: boolean;
}

interface AppContextType {
  profile: UserProfile;
  lessons: Lesson[];
  upcoming: UpcomingLesson[];
  students: Student[];
  messages: Message[];
  toasts: Toast[];
  notificationsList: NotificationItem[];
  isOnboarding: boolean;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  completeOnboarding: (name: string, difficulty: UserProfile['difficulty'], goals: string) => void;
  updateLessonProgress: (id: string, progress: number) => void;
  addLesson: (lesson: Omit<Lesson, 'id' | 'progress'>) => void;
  attendLesson: (id: string) => void;
  sendMessage: (text: string) => void;
  addStudent: (student: { name: string; avgScore: number; completed: number; risk: boolean; lastActive?: string }) => void;
  toggleStudentRisk: (id: string) => void;
  updateStudentScore: (id: string, score: number) => void;
  deleteStudent: (id: string) => void;
  renameStudent: (id: string, name: string) => void;
  showToast: (
    message: string, 
    type?: 'success' | 'info' | 'xp', 
    category?: 'reminders' | 'streaks' | 'recommendations' | 'reports'
  ) => void;
  dismissToast: (id: string) => void;
  markNotificationsRead: () => void;
  clearNotifications: () => void;
  resetAll: () => void;
}

const STORAGE_KEY = 'cognisphere_state_v4';

const defaultProfile: UserProfile = {
  name: '',
  difficulty: 'Intermediate',
  goals: '',
  level: 1,
  xp: 0,
  xpNextLevel: 500,
  streak: 0,
  studyTime: 0,
  avgGrade: 0,
  weeklyScores: [0, 0, 0, 0, 0, 0, 0], // Mon-Sun
  notifications: {
    reminders: true,
    streaks: true,
    recommendations: true,
    reports: true
  },
  badges: []
};

/** Returns today's index in Mon-Sun order (Mon=0 … Sun=6) */
function getTodayIndex(): number {
  const jsDay = new Date().getDay(); // 0=Sun,1=Mon,...,6=Sat
  return jsDay === 0 ? 6 : jsDay - 1;
}

/** Recalculates avgGrade from all lessons with some progress */
function calcAvgGrade(lessons: Lesson[]): number {
  const withProgress = lessons.filter(l => l.progress > 0);
  if (withProgress.length === 0) return 0;
  const total = withProgress.reduce((acc, l) => acc + l.progress, 0);
  return Math.round(total / withProgress.length);
}

/** Writes a new score into today's weeklyScores slot (takes the max so it never drops) */
function patchWeeklyScore(current: number[], score: number): number[] {
  const updated = [...current];
  const idx = getTodayIndex();
  updated[idx] = Math.max(updated[idx], score);
  return updated;
}

const defaultUpcoming: UpcomingLesson[] = [
  { id: '1', title: 'Advanced Linear Algebra: Eigenvectors', time: 'Today 5:00 PM', difficulty: 'Advanced', instructor: 'Dr. Sarah Chen', attended: false },
  { id: '2', title: 'Cellular Biology: Mitochondrial Function', time: 'Tomorrow 10:00 AM', difficulty: 'Intermediate', instructor: 'Prof. James Wilson', attended: false },
  { id: '3', title: 'Data Structures: Graph Algorithms', time: 'Wed 2:00 PM', difficulty: 'Advanced', instructor: 'Alex Rodriguez', attended: false },
];

const defaultLessons: Lesson[] = [
  { 
    id: 'l1', type: 'video', subject: 'Math', difficulty: 'Beginner', 
    title: 'Understanding Calculus Foundations', description: 'A deep dive into limits and continuity.',
    duration: '45 mins', thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=300',
    instructor: 'Dr. Sarah Chen', progress: 100 
  },
  { 
    id: 'l2', type: 'quiz', subject: 'Physics', difficulty: 'Intermediate', 
    title: 'Kinematics & Dynamics Assessment', description: 'Test your knowledge on motion and forces.',
    duration: '20 Qs', thumbnail: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?auto=format&fit=crop&q=80&w=300',
    instructor: 'Prof. James Wilson', progress: 0 
  },
  { 
    id: 'l3', type: 'exercise', subject: 'CS', difficulty: 'Advanced', 
    title: 'Building a Full-Stack App', description: 'Interactive exercise to build a React and Node.js application.',
    duration: '2 Hours', thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=300',
    instructor: 'Alex Rodriguez', progress: 45 
  },
  { 
    id: 'l4', type: 'video', subject: 'Biology', difficulty: 'Beginner', 
    title: 'Genetics and DNA Sequencing', description: 'Learn how DNA holds the blueprint of life.',
    duration: '32 mins', thumbnail: 'https://images.unsplash.com/photo-1530213786676-4189f1756920?auto=format&fit=crop&q=80&w=300',
    instructor: 'Dr. Emily Carter', progress: 15 
  },
  { 
    id: 'l5', type: 'article', subject: 'Chemistry', difficulty: 'Intermediate', 
    title: 'Thermodynamics Principles', description: 'Reading material covering the laws of thermodynamics.',
    duration: '15 Min Read', thumbnail: 'https://images.unsplash.com/photo-1603126859738-1260ca13d09a?auto=format&fit=crop&q=80&w=300',
    instructor: 'Prof. Michael Chang', progress: 100 
  },
  { 
    id: 'l6', type: 'video', subject: 'CS', difficulty: 'Beginner', 
    title: 'Introduction to Python', description: 'Getting started with Python programming language.',
    duration: '55 mins', thumbnail: 'https://images.unsplash.com/photo-1526379095098-d400fd0bfce8?auto=format&fit=crop&q=80&w=300',
    instructor: 'Alex Rodriguez', progress: 0 
  },
];

const defaultStudents: Student[] = [
  { id: 's1', name: 'Aarav Patel', lastActive: '1h ago', avgScore: 88, completed: 42, risk: false, avatar: 'https://i.pravatar.cc/150?u=s1' },
  { id: 's2', name: 'Diya Sharma', lastActive: '3d ago', avgScore: 62, completed: 18, risk: true, avatar: 'https://i.pravatar.cc/150?u=s2' },
  { id: 's3', name: 'Kabir Singh', lastActive: '12h ago', avgScore: 95, completed: 56, risk: false, avatar: 'https://i.pravatar.cc/150?u=s3' },
  { id: 's4', name: 'Ananya Gupta', lastActive: '2h ago', avgScore: 78, completed: 34, risk: false, avatar: 'https://i.pravatar.cc/150?u=s4' },
  { id: 's5', name: 'Rohan Mehta', lastActive: '5d ago', avgScore: 55, completed: 12, risk: true, avatar: 'https://i.pravatar.cc/150?u=s5' },
];

const defaultMessages: Message[] = [
  { id: '1', role: 'ai', text: 'Hi there! I am CogniSphere, your adaptive AI tutor. I can explain complex subjects, generate quick assessments, or guide you through code implementations. What are we studying today?', timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
];

const defaultNotificationsList: NotificationItem[] = [
  { id: 'n1', text: 'Welcome to CogniSphere! Explore your lessons to begin.', time: 'Today 3:00 PM', read: false },
  { id: 'n2', text: 'Daily learning streak active: Day 7 checked.', time: 'Today 1:00 PM', read: true }
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const [lessons, setLessons] = useState<Lesson[]>(defaultLessons);
  const [upcoming, setUpcoming] = useState<UpcomingLesson[]>(defaultUpcoming);
  const [students, setStudents] = useState<Student[]>(defaultStudents);
  const [messages, setMessages] = useState<Message[]>(defaultMessages);
  const [notificationsList, setNotificationsList] = useState<NotificationItem[]>(defaultNotificationsList);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [isOnboarding, setIsOnboarding] = useState<boolean>(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Refs to avoid stale closure state in timeouts
  const profileRef = useRef(profile);
  const lessonsRef = useRef(lessons);
  const upcomingRef = useRef(upcoming);
  const studentsRef = useRef(students);
  const messagesRef = useRef(messages);
  const notificationsListRef = useRef(notificationsList);

  useEffect(() => { profileRef.current = profile; }, [profile]);
  useEffect(() => { lessonsRef.current = lessons; }, [lessons]);
  useEffect(() => { upcomingRef.current = upcoming; }, [upcoming]);
  useEffect(() => { studentsRef.current = students; }, [students]);
  useEffect(() => { messagesRef.current = messages; }, [messages]);
  useEffect(() => { notificationsListRef.current = notificationsList; }, [notificationsList]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    let initialTheme: 'light' | 'dark' = 'light';
    
    // Check system preference
    if (typeof window !== 'undefined' && window.matchMedia) {
      initialTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.profile) {
          setProfile(parsed.profile);
          if (!parsed.profile.name || parsed.profile.name.trim() === '') {
            setIsOnboarding(true);
          }
        }
        if (parsed.lessons) setLessons(parsed.lessons);
        if (parsed.upcoming) setUpcoming(parsed.upcoming);
        if (parsed.students) setStudents(parsed.students);
        if (parsed.messages) setMessages(parsed.messages);
        if (parsed.notificationsList) setNotificationsList(parsed.notificationsList);
        if (parsed.theme) {
          initialTheme = parsed.theme;
        }
      } catch (e) {
        console.error('Failed to parse cached state', e);
      }
    } else {
      setIsOnboarding(true);
    }
    
    setTheme(initialTheme);
    if (initialTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const saveState = (
    updatedProfile: UserProfile, 
    updatedLessons: Lesson[], 
    updatedUpcoming: UpcomingLesson[], 
    updatedStudents: Student[], 
    updatedMessages: Message[],
    updatedNotifications: NotificationItem[],
    updatedTheme?: 'light' | 'dark'
  ) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      profile: updatedProfile,
      lessons: updatedLessons,
      upcoming: updatedUpcoming,
      students: updatedStudents,
      messages: updatedMessages,
      notificationsList: updatedNotifications,
      theme: updatedTheme || theme
    }));
  };

  const showToast = (
    message: string, 
    type: 'success' | 'info' | 'xp' = 'info', 
    category?: 'reminders' | 'streaks' | 'recommendations' | 'reports'
  ) => {
    const newNotif: NotificationItem = {
      id: Math.random().toString(36).slice(2, 9),
      text: message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false
    };
    
    const updatedNotifications = [newNotif, ...notificationsListRef.current];
    setNotificationsList(updatedNotifications);

    if (category && profileRef.current.notifications[category] === false) {
      saveState(profileRef.current, lessonsRef.current, upcomingRef.current, studentsRef.current, messagesRef.current, updatedNotifications);
      return;
    }

    const id = Math.random().toString(36).slice(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      dismissToast(id);
    }, 4000);

    saveState(profileRef.current, lessonsRef.current, upcomingRef.current, studentsRef.current, messagesRef.current, updatedNotifications);
  };

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const markNotificationsRead = () => {
    const updated = notificationsListRef.current.map(n => ({ ...n, read: true }));
    setNotificationsList(updated);
    saveState(profileRef.current, lessonsRef.current, upcomingRef.current, studentsRef.current, messagesRef.current, updated);
  };

  const clearNotifications = () => {
    setNotificationsList([]);
    saveState(profileRef.current, lessonsRef.current, upcomingRef.current, studentsRef.current, messagesRef.current, []);
  };

  const addXp = (amount: number, currentProfile: UserProfile): UserProfile => {
    let newXp = currentProfile.xp + amount;
    let newLevel = currentProfile.level;
    const xpNeeded = currentProfile.xpNextLevel;

    if (newXp >= xpNeeded) {
      newXp = newXp - xpNeeded;
      newLevel += 1;
      showToast(`🎉 Level Up! You reached Level ${newLevel}!`, 'success', 'streaks');
    } else {
      showToast(`+${amount} XP Earned`, 'xp', 'streaks');
    }

    return {
      ...currentProfile,
      xp: newXp,
      level: newLevel
    };
  };

  const completeOnboarding = (name: string, difficulty: UserProfile['difficulty'], goals: string) => {
    const onboardedProfile: UserProfile = {
      ...defaultProfile,
      name: name.trim(),
      difficulty,
      goals: goals.trim(),
      level: 1,
      xp: 0,
      xpNextLevel: 500,
      streak: 0,
      studyTime: 0,
      avgGrade: 0,
      weeklyScores: [0, 0, 0, 0, 0, 0, 0],
      badges: []
    };
    setProfile(onboardedProfile);
    setIsOnboarding(false);
    saveState(onboardedProfile, lessonsRef.current, upcomingRef.current, studentsRef.current, messagesRef.current, notificationsListRef.current);
    showToast(`Welcome to CogniSphere, ${name}! 🎉`, 'success', 'reminders');
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    const newProfile = { ...profileRef.current, ...updates };
    setProfile(newProfile);
    saveState(newProfile, lessonsRef.current, upcomingRef.current, studentsRef.current, messagesRef.current, notificationsListRef.current);
    showToast('Preferences updated successfully!', 'success', 'reports');
  };

  const updateLessonProgress = (id: string, newProgress: number) => {
    const prevLesson = lessonsRef.current.find(l => l.id === id);
    if (!prevLesson) return;

    const progressValue = Math.min(100, Math.max(0, newProgress));
    const isNowCompleted = progressValue === 100 && prevLesson.progress < 100;

    const updatedLessons = lessonsRef.current.map(l => {
      if (l.id === id) {
        return { ...l, progress: progressValue };
      }
      return l;
    });

    let updatedProfile = { ...profileRef.current };

    if (isNowCompleted) {
      updatedProfile = addXp(150, updatedProfile);
      updatedProfile.studyTime += 1;
      
      const activeBadges = [...updatedProfile.badges];
      
      if (prevLesson.subject === 'Math' && !activeBadges.includes('Math Pro')) {
        activeBadges.push('Math Pro');
        showToast('🏆 Milestone: Unlocked Math Pro badge!', 'success', 'recommendations');
      }
      if (prevLesson.subject === 'CS' && !activeBadges.includes('DSA Grinder')) {
        activeBadges.push('DSA Grinder');
        showToast('🏆 Milestone: Unlocked DSA Grinder badge!', 'success', 'recommendations');
      }
      if ((prevLesson.subject === 'Physics' || prevLesson.subject === 'Biology' || prevLesson.subject === 'Chemistry') && !activeBadges.includes('Science Star')) {
        activeBadges.push('Science Star');
        showToast('🏆 Milestone: Unlocked Science Star badge!', 'success', 'recommendations');
      }
      if (prevLesson.type === 'quiz' && !activeBadges.includes('Quiz Ace')) {
        activeBadges.push('Quiz Ace');
        showToast('🏆 Milestone: Unlocked Quiz Ace badge!', 'success', 'recommendations');
      }

      updatedProfile.badges = activeBadges;
    }

    // Always recalculate avgGrade from all lesson progress values
    const newAvgGrade = calcAvgGrade(updatedLessons);
    updatedProfile.avgGrade = newAvgGrade;

    // Record today's score in the weekly chart
    updatedProfile.weeklyScores = patchWeeklyScore(
      updatedProfile.weeklyScores ?? [0,0,0,0,0,0,0],
      progressValue
    );

    setLessons(updatedLessons);
    setProfile(updatedProfile);
    saveState(updatedProfile, updatedLessons, upcomingRef.current, studentsRef.current, messagesRef.current, notificationsListRef.current);
  };

  const addLesson = (newLessonData: Omit<Lesson, 'id' | 'progress'>) => {
    const newLesson: Lesson = {
      ...newLessonData,
      id: 'l' + (lessonsRef.current.length + 1) + Math.random().toString(36).slice(2, 5),
      progress: 0
    };
    const updatedLessons = [newLesson, ...lessonsRef.current];
    setLessons(updatedLessons);
    saveState(profileRef.current, updatedLessons, upcomingRef.current, studentsRef.current, messagesRef.current, notificationsListRef.current);
    showToast(`Playlist "${newLessonData.title}" created successfully!`, 'success', 'reminders');
  };

  const attendLesson = (id: string) => {
    const updatedUpcoming = upcomingRef.current.map(u => {
      if (u.id === id) {
        return { ...u, attended: true };
      }
      return u;
    });

    let updatedProfile = addXp(100, profileRef.current);
    updatedProfile.streak += 1;
    if (updatedProfile.streak === 8 && !updatedProfile.badges.includes('Streak x7')) {
      updatedProfile.badges = [...updatedProfile.badges, 'Streak x7'];
    }

    // Attending a session boosts today's weekly score
    const sessionScore = 80; // baseline attendance score
    updatedProfile.weeklyScores = patchWeeklyScore(
      updatedProfile.weeklyScores ?? [0,0,0,0,0,0,0],
      sessionScore
    );
    // Attendance also slightly lifts avgGrade if it was lower
    if (updatedProfile.avgGrade < sessionScore) {
      updatedProfile.avgGrade = Math.round((updatedProfile.avgGrade + sessionScore) / 2);
    }

    setUpcoming(updatedUpcoming);
    setProfile(updatedProfile);
    saveState(updatedProfile, lessonsRef.current, updatedUpcoming, studentsRef.current, messagesRef.current, notificationsListRef.current);
    showToast('Session attended! Knowledge points collected.', 'success', 'reminders');
  };

  const sendMessage = async (text: string) => {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: Message = {
      id: Math.random().toString(36).slice(2),
      role: 'user',
      text,
      timestamp
    };

    // 1. Post user message instantly
    const latestMessages = [...messagesRef.current, userMsg];
    setMessages(latestMessages);
    
    // Award +5 XP for asking question
    const updatedProfile = addXp(5, profileRef.current);
    setProfile(updatedProfile);
    
    saveState(
      updatedProfile, 
      lessonsRef.current, 
      upcomingRef.current, 
      studentsRef.current, 
      latestMessages, 
      notificationsListRef.current
    );

    // 2. Fetch AI response asynchronously from the API module
    try {
      const replyText = await askTutor(text, updatedProfile, lessonsRef.current);
      
      const aiMsg: Message = {
        id: Math.random().toString(36).slice(2) + 'ai',
        role: 'ai',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      const finalMessages = [...messagesRef.current, aiMsg];
      setMessages(finalMessages);

      const cleanText = text.toLowerCase().trim();
      let finalProfile = profileRef.current;
      if (cleanText === 'b' || cleanText.includes('answer b') || cleanText === '1') {
        finalProfile = addXp(50, finalProfile);
        setProfile(finalProfile);
      } else if (cleanText === 'thanks' || cleanText === 'thank you') {
        finalProfile = addXp(15, finalProfile);
        setProfile(finalProfile);
      }

      saveState(
        finalProfile, 
        lessonsRef.current, 
        upcomingRef.current, 
        studentsRef.current, 
        finalMessages, 
        notificationsListRef.current
      );
    } catch (error) {
      console.error("Failed to fetch tutor response", error);
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    saveState(profileRef.current, lessonsRef.current, upcomingRef.current, studentsRef.current, messagesRef.current, notificationsListRef.current, newTheme);
  };

  const addStudent = (newStudent: { name: string; avgScore: number; completed: number; risk: boolean; lastActive?: string }) => {
    const sId = 's' + (studentsRef.current.length + 1) + Math.random().toString(36).slice(2, 5);
    const created: Student = {
      id: sId,
      name: newStudent.name,
      avgScore: newStudent.avgScore,
      completed: newStudent.completed,
      risk: newStudent.risk,
      lastActive: newStudent.lastActive || 'Just now',
      avatar: `https://i.pravatar.cc/150?u=${sId}`
    };

    const updatedStudents = [...studentsRef.current, created];
    setStudents(updatedStudents);
    saveState(profileRef.current, lessonsRef.current, upcomingRef.current, updatedStudents, messagesRef.current, notificationsListRef.current);
    showToast(`Student ${newStudent.name} registered.`, 'success', 'reports');
  };

  const toggleStudentRisk = (id: string) => {
    const updatedStudents = studentsRef.current.map(s => {
      if (s.id === id) {
        return { ...s, risk: !s.risk };
      }
      return s;
    });
    setStudents(updatedStudents);
    saveState(profileRef.current, lessonsRef.current, upcomingRef.current, updatedStudents, messagesRef.current, notificationsListRef.current);
    showToast(`Status updated for student.`, 'info', 'reports');
  };

  const updateStudentScore = (id: string, score: number) => {
    const updatedStudents = studentsRef.current.map(s => {
      if (s.id === id) {
        return { ...s, avgScore: score };
      }
      return s;
    });
    setStudents(updatedStudents);
    saveState(profileRef.current, lessonsRef.current, upcomingRef.current, updatedStudents, messagesRef.current, notificationsListRef.current);
  };

  const deleteStudent = (id: string) => {
    const updatedStudents = studentsRef.current.filter(s => s.id !== id);
    setStudents(updatedStudents);
    saveState(profileRef.current, lessonsRef.current, upcomingRef.current, updatedStudents, messagesRef.current, notificationsListRef.current);
  };

  const renameStudent = (id: string, name: string) => {
    const updatedStudents = studentsRef.current.map(s => {
      if (s.id === id) {
        return { ...s, name };
      }
      return s;
    });
    setStudents(updatedStudents);
    saveState(profileRef.current, lessonsRef.current, upcomingRef.current, updatedStudents, messagesRef.current, notificationsListRef.current);
  };

  const resetAll = () => {
    setProfile(defaultProfile);
    setLessons(defaultLessons);
    setUpcoming(defaultUpcoming);
    setStudents(defaultStudents);
    setMessages(defaultMessages);
    setNotificationsList(defaultNotificationsList);
    setIsOnboarding(true);
    localStorage.removeItem(STORAGE_KEY);
    showToast('Application reset. Please set up your profile.', 'info', 'reports');
  };

  return (
    <AppContext.Provider value={{
      profile,
      lessons,
      upcoming,
      students,
      messages,
      toasts,
      notificationsList,
      isOnboarding,
      theme,
      toggleTheme,
      updateProfile,
      completeOnboarding,
      updateLessonProgress,
      addLesson,
      attendLesson,
      sendMessage,
      addStudent,
      toggleStudentRisk,
      updateStudentScore,
      deleteStudent,
      renameStudent,
      showToast,
      dismissToast,
      markNotificationsRead,
      clearNotifications,
      resetAll
    }}>
      {children}
      {/* Toast Notification Container */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map(t => (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-xl shadow-lg border text-sm font-semibold animate-fade-in ${
              t.type === 'success' 
                ? 'bg-emerald-500 border-emerald-600 text-white' 
                : t.type === 'xp' 
                  ? 'bg-purple-600 border-purple-700 text-white' 
                  : 'bg-slate-900 border-slate-800 text-white'
            }`}
          >
            <span>{t.message}</span>
            <button 
              onClick={() => dismissToast(t.id)} 
              className="text-white/60 hover:text-white ml-2 transition-colors cursor-pointer text-xs"
              aria-label="Dismiss"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
