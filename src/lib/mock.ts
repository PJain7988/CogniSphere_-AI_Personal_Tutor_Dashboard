export interface Lesson {
  id: string;
  type: 'video' | 'quiz' | 'exercise' | 'article';
  subject: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  title: string;
  description: string;
  duration: string;
  thumbnail: string;
  instructor: string;
  progress: number;
}

export const upcomingLessons = [
  { id: '1', title: 'Advanced Linear Algebra: Eigenvectors', time: 'Today 5:00 PM', difficulty: 'Advanced', instructor: 'Dr. Sarah Chen' },
  { id: '2', title: 'Cellular Biology: Mitochondrial Function', time: 'Tomorrow 10:00 AM', difficulty: 'Intermediate', instructor: 'Prof. James Wilson' },
  { id: '3', title: 'Data Structures: Graph Algorithms', time: 'Wed 2:00 PM', difficulty: 'Advanced', instructor: 'Alex Rodriguez' },
];

export const recommendations = [
  { id: 'r1', title: 'Dynamic Programming Patterns', tag: 'Computer Science', thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=300' },
  { id: 'r2', title: 'Introduction to Quantum Mechanics', tag: 'Physics', thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=300' },
  { id: 'r3', title: 'Organic Chemistry: Alkene Reactions', tag: 'Chemistry', thumbnail: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=300' },
  { id: 'r4', title: 'Machine Learning: Neural Networks', tag: 'AI/ML', thumbnail: 'https://images.unsplash.com/photo-1555255707-c07966088b7b?auto=format&fit=crop&q=80&w=300' },
];

export const lessons: Lesson[] = [
  { 
    id: 'l1', type: 'video', subject: 'Math', difficulty: 'Beginner', 
    title: 'Understanding Calculus Foundations', description: 'A deep dive into limits and continuity.',
    duration: '45:30', thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=300',
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
    duration: '32:10', thumbnail: 'https://images.unsplash.com/photo-1530213786676-4189f1756920?auto=format&fit=crop&q=80&w=300',
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
    duration: '55:00', thumbnail: 'https://images.unsplash.com/photo-1526379095098-d400fd0bfce8?auto=format&fit=crop&q=80&w=300',
    instructor: 'Alex Rodriguez', progress: 0 
  },
];

export const weekly = [
  { day: 'Mon', score: 65 },
  { day: 'Tue', score: 72 },
  { day: 'Wed', score: 68 },
  { day: 'Thu', score: 85 },
  { day: 'Fri', score: 92 },
  { day: 'Sat', score: 88 },
  { day: 'Sun', score: 95 },
];

export const cohortPerformance = [
  { day: 'Week 1', score: 72 },
  { day: 'Week 2', score: 74 },
  { day: 'Week 3', score: 76 },
  { day: 'Week 4', score: 82 },
];

export const studentsData = [
  { id: 's1', name: 'Aarav Patel', lastActive: '1h ago', avgScore: 88, completed: 42, risk: false, avatar: 'https://i.pravatar.cc/150?u=s1' },
  { id: 's2', name: 'Diya Sharma', lastActive: '3d ago', avgScore: 62, completed: 18, risk: true, avatar: 'https://i.pravatar.cc/150?u=s2' },
  { id: 's3', name: 'Kabir Singh', lastActive: '12h ago', avgScore: 95, completed: 56, risk: false, avatar: 'https://i.pravatar.cc/150?u=s3' },
  { id: 's4', name: 'Ananya Gupta', lastActive: '2h ago', avgScore: 78, completed: 34, risk: false, avatar: 'https://i.pravatar.cc/150?u=s4' },
  { id: 's5', name: 'Rohan Mehta', lastActive: '5d ago', avgScore: 55, completed: 12, risk: true, avatar: 'https://i.pravatar.cc/150?u=s5' },
];
