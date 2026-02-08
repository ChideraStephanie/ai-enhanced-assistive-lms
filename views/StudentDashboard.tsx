
import React, { useState, useEffect } from 'react';
import { User, Task, Material, Course } from '../types';
import { dbService } from '../services/dbService';

interface StudentDashboardProps {
  user: User;
  onNavigate: (view: string) => void;
  materials: Material[];
  courses: Course[];
}

const CourseThumbnail: React.FC<{ course: Course }> = ({ course }) => {
  if (course.image && (course.image.startsWith('data:image') || course.image.startsWith('blob:'))) {
    return <img src={course.image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" alt={course.name} />;
  }

  // Consistent color based on course code
  const themes = [
    'from-indigo-600 to-indigo-800',
    'from-emerald-600 to-emerald-800',
    'from-rose-600 to-rose-800',
    'from-amber-600 to-amber-800',
    'from-cyan-600 to-cyan-800',
    'from-violet-600 to-violet-800'
  ];
  const themeIndex = course.code.length % themes.length;
  const theme = themes[themeIndex];

  return (
    <div className={`w-full h-full bg-gradient-to-br ${theme} flex items-center justify-center p-8 opacity-90 group-hover:opacity-100 transition-opacity`}>
      <div className="text-white text-5xl font-black opacity-10 select-none absolute inset-0 flex items-center justify-center overflow-hidden">
        {course.code}
      </div>
      <svg className="w-16 h-16 text-white/40 z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
    </div>
  );
};

const StudentDashboard: React.FC<StudentDashboardProps> = ({ user, onNavigate, materials, courses }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskCourse, setNewTaskCourse] = useState(courses[0]?.code || 'N/A');
  const [selectedCourseForModal, setSelectedCourseForModal] = useState<Course | null>(null);

  const [viewDate, setViewDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<number | null>(new Date().getDate());

  useEffect(() => {
    setTasks(dbService.getTasks());
  }, []);

  useEffect(() => {
    dbService.saveTasks(tasks);
  }, [tasks]);

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    
    const newTask: Task = {
      id: Math.random().toString(36).substr(2, 9),
      title: newTaskTitle,
      time: 'Just now',
      courseCode: newTaskCourse,
      completed: false
    };
    
    setTasks([newTask, ...tasks]);
    setNewTaskTitle('');
  };

  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  
  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const handlePrevMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
    setSelectedDay(null);
  };

  const handleNextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
    setSelectedDay(null);
  };

  const isToday = (day: number) => {
    const today = new Date();
    return today.getDate() === day && 
           today.getMonth() === viewDate.getMonth() && 
           today.getFullYear() === viewDate.getFullYear();
  };

  const daysInMonth = getDaysInMonth(viewDate.getFullYear(), viewDate.getMonth());
  const firstDayIdx = getFirstDayOfMonth(viewDate.getFullYear(), viewDate.getMonth());
  const blanks = Array.from({ length: firstDayIdx }, (_, i) => i);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const getCourseStats = (courseId: string) => {
    const courseMaterials = materials.filter(m => m.courseId === courseId);
    return {
      notes: courseMaterials.length,
      summaries: courseMaterials.filter(m => m.summaryStatus === 'completed').length
    };
  };

  const recentMaterials = materials.slice(0, 4);

  const filteredMaterialsForModal = selectedCourseForModal 
    ? materials.filter(m => m.courseId === selectedCourseForModal.id)
    : [];

  return (
    <div className="p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fadeIn transition-colors duration-300">
      <div className="lg:col-span-9 space-y-8">
        <div className="bg-indigo-600 rounded-3xl p-10 text-white relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 p-10 opacity-10">
            <svg className="w-64 h-64 rotate-12" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
          </div>
          <div className="relative z-10 max-w-xl">
             <h1 className="text-4xl font-black mb-4 mt-2">Welcome, {user.name.split(' ')[0]}!</h1>
             <p className="text-indigo-100 text-lg mb-8 leading-relaxed font-medium">
               Explore AI-powered summaries of your latest lectures.
             </p>
             <div className="flex space-x-4">
                <div className="bg-indigo-500/50 backdrop-blur-md p-4 rounded-2xl flex-1 text-center border border-white/10">
                   <p className="text-2xl font-black">{courses.length}</p>
                   <p className="text-[10px] uppercase font-black text-indigo-200 tracking-widest">Courses</p>
                </div>
                <div className="bg-indigo-500/50 backdrop-blur-md p-4 rounded-2xl flex-1 text-center border border-white/10">
                   <p className="text-2xl font-black">{materials.filter(m => m.summaryStatus === 'completed').length}</p>
                   <p className="text-[10px] uppercase font-black text-indigo-200 tracking-widest">AI Summaries</p>
                </div>
                <div className="bg-indigo-500/50 backdrop-blur-md p-4 rounded-2xl flex-1 text-center border border-white/10">
                   <p className="text-2xl font-black">{materials.length}</p>
                   <p className="text-[10px] uppercase font-black text-indigo-200 tracking-widest">Total Materials</p>
                </div>
             </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-50 dark:border-slate-800 shadow-sm transition-colors">
           <div className="flex items-center justify-between mb-8">
             <div>
               <h2 className="text-xl font-black text-slate-800 dark:text-slate-100">Fresh from your Professors</h2>
               <p className="text-sm font-medium text-slate-400 dark:text-slate-500">Newly uploaded materials and summaries.</p>
             </div>
             {materials.length > 0 && (
               <button onClick={() => onNavigate('summaries')} className="text-indigo-600 dark:text-indigo-400 font-black text-sm hover:underline uppercase tracking-tighter transition-colors">View All Summaries</button>
             )}
           </div>
           
           {materials.length > 0 ? (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {recentMaterials.map(mat => (
                  <div key={mat.id} className="p-5 bg-slate-50 dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 hover:border-indigo-200 dark:hover:border-indigo-900 transition-all group cursor-pointer" onClick={() => onNavigate('summaries')}>
                     <div className="w-10 h-10 bg-white dark:bg-slate-900 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-4 shadow-sm group-hover:bg-indigo-600 group-hover:text-white transition-all">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                     </div>
                     <h4 className="font-bold text-slate-800 dark:text-slate-200 text-xs truncate mb-1">{mat.title}</h4>
                     <p className="text-[9px] font-black text-indigo-500 dark:text-indigo-400 uppercase tracking-widest">{courses.find(c => c.id === mat.courseId)?.code}</p>
                     <div className="mt-4 flex items-center justify-between pt-4 border-t border-slate-100/50 dark:border-slate-700">
                        <span className="text-[9px] text-slate-400 dark:text-slate-500 font-bold">{mat.uploadDate}</span>
                        <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${mat.summaryStatus === 'completed' ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'}`}>
                          {mat.summaryStatus}
                        </span>
                     </div>
                  </div>
                ))}
             </div>
           ) : (
             <div className="py-16 text-center bg-slate-50/50 dark:bg-slate-800/50 rounded-3xl border-2 border-dashed border-slate-100 dark:border-slate-700">
                <div className="w-16 h-16 bg-white dark:bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-200 dark:text-slate-600">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                </div>
                <h3 className="text-slate-800 dark:text-slate-100 font-black text-lg">No Materials Yet</h3>
                <p className="text-slate-400 dark:text-slate-500 text-sm max-w-xs mx-auto mt-2">Once your lecturer uploads content, it will appear here instantly for review.</p>
             </div>
           )}
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-slate-800 dark:text-slate-100">Your Curriculum</h2>
            <p className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Active Enrollment</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-12">
            {courses.map(course => {
              const stats = getCourseStats(course.id);
              return (
                <div key={course.id} className="bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-sm border border-slate-50 dark:border-slate-800 group hover:shadow-xl transition-all hover:-translate-y-1">
                  <div className="h-40 relative overflow-hidden bg-slate-100 dark:bg-slate-800">
                     <CourseThumbnail course={course} />
                     <div className="absolute top-4 left-4 z-20">
                       <span className="px-3 py-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-lg text-xs font-black shadow-sm dark:text-white transition-colors">{course.code}</span>
                     </div>
                  </div>
                  <div className="p-6 space-y-4">
                    <div>
                      <h3 className="text-lg font-black text-slate-800 dark:text-slate-100 mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{course.name}</h3>
                      <p className="text-xs text-slate-400 dark:text-slate-500 font-medium leading-relaxed line-clamp-1">{course.description}</p>
                    </div>
                    <div className="flex space-x-3">
                      <div className="flex-1 bg-slate-50 dark:bg-slate-800 p-3 rounded-2xl flex items-center justify-between transition-colors">
                         <svg className="w-4 h-4 text-indigo-500 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                         <span className="text-[10px] font-black text-slate-700 dark:text-slate-300 uppercase">{stats.notes} Notes</span>
                      </div>
                      <div className="flex-1 bg-slate-50 dark:bg-slate-800 p-3 rounded-2xl flex items-center justify-between transition-colors">
                         <svg className="w-4 h-4 text-blue-500 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                         <span className="text-[10px] font-black text-slate-700 dark:text-slate-300 uppercase">{stats.summaries} AI Items</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => setSelectedCourseForModal(course)}
                      className="w-full py-3 bg-indigo-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 dark:shadow-indigo-900/20"
                    >
                      View Materials
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="lg:col-span-3 space-y-8">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-50 dark:border-slate-800 transition-colors">
          <div className="flex items-center justify-between mb-6">
            <button onClick={handlePrevMonth} className="text-slate-400 dark:text-slate-600 hover:text-indigo-600 transition-colors p-1">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
            </button>
            <h3 className="font-black text-slate-800 dark:text-slate-100 text-sm">{months[viewDate.getMonth()]} {viewDate.getFullYear()}</h3>
            <button onClick={handleNextMonth} className="text-slate-400 dark:text-slate-600 hover:text-indigo-600 transition-colors p-1">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
          <div className="grid grid-cols-7 gap-y-2 text-center text-[9px] font-black text-slate-400 dark:text-slate-600 mb-2 uppercase tracking-widest">
            <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
          </div>
          <div className="grid grid-cols-7 gap-y-2 text-center">
            {blanks.map(b => <div key={`b-${b}`} className="py-2"></div>)}
            {days.map(d => (
              <button 
                key={d} 
                onClick={() => setSelectedDay(d)}
                className={`py-2 text-[10px] font-black rounded-full transition-all flex items-center justify-center mx-auto w-8 h-8 ${
                  isToday(d) 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100 dark:shadow-indigo-900/20' 
                    : selectedDay === d 
                      ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-200'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-50 dark:border-slate-800 transition-colors">
           <div className="flex items-center justify-between mb-6">
             <h3 className="font-black text-slate-800 dark:text-slate-100 text-sm">Study Tasks</h3>
             <span className="bg-slate-50 dark:bg-slate-800 text-[9px] px-2 py-1 rounded-lg text-slate-400 dark:text-slate-500 font-black uppercase transition-colors">{tasks.length}</span>
           </div>

           <form onSubmit={addTask} className="mb-6 space-y-2">
              <input 
                type="text" 
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="New study task..."
                className="w-full text-xs p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border-none focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-300 dark:placeholder:text-slate-600 font-black text-black dark:text-white"
              />
              <button 
                type="submit"
                className="w-full bg-indigo-600 text-white py-2 rounded-xl hover:bg-indigo-700 transition-colors shadow-sm text-[10px] font-black uppercase tracking-wider"
              >
                Add Task
              </button>
           </form>

           <div className="space-y-3 max-h-[300px] overflow-y-auto no-scrollbar">
             {tasks.length > 0 ? tasks.map(task => (
               <div key={task.id} className="flex items-start space-x-3 group animate-fadeIn">
                 <button 
                  onClick={() => toggleTask(task.id)}
                  className={`w-4 h-4 rounded-md border-2 flex-shrink-0 flex items-center justify-center transition-all mt-0.5 ${
                    task.completed ? 'bg-indigo-600 border-indigo-600' : 'border-slate-200 dark:border-slate-700 hover:border-indigo-400'
                  }`}
                 >
                   {task.completed && <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>}
                 </button>
                 <div className="flex-1 min-w-0">
                   <p className={`text-[11px] font-bold transition-all leading-tight ${task.completed ? 'text-slate-300 dark:text-slate-600 line-through' : 'text-slate-700 dark:text-slate-300'}`}>{task.title}</p>
                 </div>
                 <button 
                  onClick={() => deleteTask(task.id)}
                  className="opacity-0 group-hover:opacity-100 text-slate-300 dark:text-slate-600 hover:text-red-500 transition-all"
                 >
                   <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                 </button>
               </div>
             )) : (
              <div className="text-center py-4">
                <p className="text-[10px] text-slate-300 dark:text-slate-600 font-bold uppercase tracking-widest">Done for today!</p>
              </div>
             )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
