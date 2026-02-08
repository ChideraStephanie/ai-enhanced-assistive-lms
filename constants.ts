
import { Course, Material, User, Feedback, Task } from './types';

export const MOCK_TEACHER: User = {
  id: 't1',
  name: 'Prof. Sarah Johnson',
  email: 's.johnson@university.edu',
  role: 'teacher',
  avatar: ''
};

export const MOCK_STUDENT: User = {
  id: 's1',
  name: 'John Doe',
  email: 'john.doe@student.edu',
  role: 'student',
  avatar: ''
};

export const COURSES: Course[] = [
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

export const MATERIALS: Material[] = [];
export const FEEDBACKS: Feedback[] = [];

export const TASKS: Task[] = [
  { id: '1', title: 'Start Technical Report', time: '2:00 PM', courseCode: 'SEN 403', completed: false },
  { id: '2', title: 'ML Assignment 2', time: '10:00 AM', courseCode: 'SEN 409', completed: false },
  { id: '3', title: 'Finish Up Presentation Slides', time: '8:00 PM', courseCode: 'SEN 411', completed: false },
  { id: '4', title: 'Submit Assignment 3', time: '1:00 AM', courseCode: 'SEN 405', completed: true },
  { id: '5', title: 'Listen To Audio Summaries', time: '7:00 AM', courseCode: 'SEN 409', completed: true },
];
