
import { User, Material, Task, Course } from '../types';

const KEYS = {
  USERS: 'learnai_db_users',
  MATERIALS: 'learnai_db_materials',
  TASKS: 'learnai_db_tasks',
  COURSES: 'learnai_db_courses',
  SESSION: 'learnai_db_session',
  THEME: 'learnai_db_theme'
};

const INITIAL_COURSES: Course[] = [
  {
    id: 'c1',
    code: 'SEN 401',
    name: 'Software Engineering Principles',
    description: 'Advanced software design patterns and methodologies',
    notesCount: 0,
    summariesCount: 0,
    image: ''
  },
  {
    id: 'c2',
    code: 'SEN 409',
    name: 'Machine Learning Systems',
    description: 'Building production ML pipelines and models',
    notesCount: 0,
    summariesCount: 0,
    image: ''
  },
  {
    id: 'c3',
    code: 'SEN 417',
    name: 'Database Systems',
    description: 'Advanced database design, optimization and implementation',
    notesCount: 0,
    summariesCount: 0,
    image: ''
  },
  {
    id: 'c4',
    code: 'SEN 461',
    name: 'Computer Networks & Security',
    description: 'Networks, Protocols and cybersecurity principles',
    notesCount: 0,
    summariesCount: 0,
    image: ''
  }
];

const initDB = () => {
  if (!localStorage.getItem(KEYS.USERS)) {
    localStorage.setItem(KEYS.USERS, JSON.stringify([
      { 
        id: 't1', 
        name: 'Prof. Sarah Johnson', 
        email: 'teacher@test.com', 
        password: 'password', 
        role: 'teacher', 
        avatar: '',
        university: 'Global Tech University',
        department: 'Software Engineering',
        bio: 'Passionate educator focused on AI and Software Architecture.'
      },
      { 
        id: 's1', 
        name: 'John Doe', 
        email: 'student@test.com', 
        password: 'password', 
        role: 'student', 
        avatar: '',
        university: 'Global Tech University',
        department: 'Computer Science',
        bio: 'Senior student interested in Machine Learning and Data Science.'
      }
    ]));
  }
  if (!localStorage.getItem(KEYS.MATERIALS)) {
    localStorage.setItem(KEYS.MATERIALS, JSON.stringify([]));
  }
  if (!localStorage.getItem(KEYS.COURSES)) {
    localStorage.setItem(KEYS.COURSES, JSON.stringify(INITIAL_COURSES));
  }
};

initDB();

export const dbService = {
  getUsers: (): any[] => {
    return JSON.parse(localStorage.getItem(KEYS.USERS) || '[]');
  },

  registerUser: (userData: any): boolean => {
    const users = dbService.getUsers();
    if (users.find(u => u.email === userData.email)) return false;
    
    const newUser = {
      ...userData,
      id: Math.random().toString(36).substr(2, 9)
    };
    users.push(newUser);
    localStorage.setItem(KEYS.USERS, JSON.stringify(users));
    return true;
  },

  login: (email: string, password: string): User | null => {
    const users = dbService.getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      const { password: _, ...userWithoutPassword } = user;
      localStorage.setItem(KEYS.SESSION, JSON.stringify(userWithoutPassword));
      return userWithoutPassword as User;
    }
    return null;
  },

  logout: () => {
    localStorage.removeItem(KEYS.SESSION);
  },

  getSession: (): User | null => {
    const session = localStorage.getItem(KEYS.SESSION);
    return session ? JSON.parse(session) : null;
  },

  updateProfile: (updatedUser: User) => {
    localStorage.setItem(KEYS.SESSION, JSON.stringify(updatedUser));
    const users = dbService.getUsers();
    const idx = users.findIndex(u => u.id === updatedUser.id);
    if (idx !== -1) {
      users[idx] = { ...users[idx], ...updatedUser };
      localStorage.setItem(KEYS.USERS, JSON.stringify(users));
    }
  },

  getMaterials: (): Material[] => {
    return JSON.parse(localStorage.getItem(KEYS.MATERIALS) || '[]');
  },

  saveMaterial: (material: Material) => {
    const materials = dbService.getMaterials();
    materials.unshift(material);
    localStorage.setItem(KEYS.MATERIALS, JSON.stringify(materials));
  },

  deleteMaterial: (id: string) => {
    const materials = dbService.getMaterials();
    const filtered = materials.filter(m => m.id !== id);
    localStorage.setItem(KEYS.MATERIALS, JSON.stringify(filtered));
  },

  getCourses: (): Course[] => {
    return JSON.parse(localStorage.getItem(KEYS.COURSES) || '[]');
  },

  addCourse: (course: Course) => {
    const courses = dbService.getCourses();
    courses.push(course);
    localStorage.setItem(KEYS.COURSES, JSON.stringify(courses));
  },

  deleteCourse: (id: string) => {
    const courses = dbService.getCourses();
    const filtered = courses.filter(c => c.id !== id);
    localStorage.setItem(KEYS.COURSES, JSON.stringify(filtered));
  },

  getTasks: (): Task[] => {
    return JSON.parse(localStorage.getItem(KEYS.TASKS) || '[]');
  },

  saveTasks: (tasks: Task[]) => {
    localStorage.setItem(KEYS.TASKS, JSON.stringify(tasks));
  },

  getTheme: (): 'light' | 'dark' => {
    return (localStorage.getItem(KEYS.THEME) as 'light' | 'dark') || 'light';
  },

  setTheme: (theme: 'light' | 'dark') => {
    localStorage.setItem(KEYS.THEME, theme);
  }
};
