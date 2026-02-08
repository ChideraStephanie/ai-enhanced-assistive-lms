
export type UserRole = 'student' | 'teacher';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  university?: string;
  department?: string;
  bio?: string;
  password?: string;
}

export interface Course {
  id: string;
  code: string;
  name: string;
  description: string;
  notesCount: number;
  summariesCount: number;
  image: string;
}

export interface Material {
  id: string;
  courseId: string;
  title: string;
  type: 'pdf' | 'pptx' | 'doc' | 'image';
  uploadDate: string;
  week: number;
  pages?: number;
  size: string;
  summaryStatus: 'pending' | 'processing' | 'completed';
  summaryText?: string;
  audioUrl?: string;
  views: number;
  downloads: number;
}

export interface Feedback {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  materialTitle: string;
}

export interface Task {
  id: string;
  title: string;
  time: string;
  courseCode: string;
  completed: boolean;
}
