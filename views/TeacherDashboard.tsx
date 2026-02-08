
import React from 'react';
import { User, Material } from '../types';
import { FEEDBACKS, COURSES } from '../constants';

interface TeacherDashboardProps {
  user: User;
  onNavigate: (view: string) => void;
  materials: Material[];
  onDeleteMaterial: (id: string) => void;
}

const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ user, onNavigate, materials, onDeleteMaterial }) => {
  const completedSummaries = materials.filter(m => m.summaryStatus === 'completed').length;
  const processingSummaries = materials.filter(m => m.summaryStatus === 'processing').length;
  
  return (
    <div className="p-8 space-y-8 animate-fadeIn transition-colors duration-300">
      {/* Hero Welcome */}
      <div className="bg-indigo-600 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 p-10 opacity-10">
          <svg className="w-64 h-64" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
        </div>
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-4xl font-black mb-4">Welcome back, {user.name.split(' ')[1]}! 👋</h1>
          <p className="text-indigo-100 text-lg mb-8 font-medium">
            Currently managing {materials.length} total materials across {COURSES.length} courses.
          </p>
          <div className="flex space-x-4">
            <button
              onClick={() => onNavigate('upload')}
              className="px-8 py-4 bg-white text-indigo-600 rounded-2xl font-black hover:bg-indigo-50 transition-all shadow-xl shadow-indigo-900/20 inline-flex items-center space-x-3 active:scale-95"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
              <span>Upload New Material</span>
            </button>
            <button
              onClick={() => onNavigate('manage-notes')}
              className="px-8 py-4 bg-indigo-500/50 backdrop-blur-md text-white border border-white/20 rounded-2xl font-black hover:bg-indigo-500/70 transition-all inline-flex items-center space-x-3 active:scale-95"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
              <span>Manage All Notes</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Upload Section */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-50 dark:border-slate-800 shadow-sm flex flex-col transition-colors">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-black text-slate-800 dark:text-slate-100 flex items-center space-x-3">
              <span className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
              </span>
              <span>Quick Upload Center</span>
            </h2>
          </div>
          
          <div 
            onClick={() => onNavigate('upload')}
            className="flex-1 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-3xl p-12 text-center hover:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/10 transition-all cursor-pointer group flex flex-col items-center justify-center min-h-[300px]"
          >
            <div className="bg-indigo-50 dark:bg-slate-800 w-20 h-20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
              <svg className="w-10 h-10 text-indigo-600 dark:text-indigo-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
            </div>
            <h4 className="text-xl font-black text-slate-800 dark:text-slate-100 mb-2">Deploy Lecture Content</h4>
            <p className="text-slate-400 max-w-xs mx-auto text-sm font-medium">Click to upload documents. AI analysis starts immediately after upload.</p>
          </div>
        </div>

        {/* Status Breakdown */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-50 dark:border-slate-800 shadow-sm transition-colors">
           <div className="flex items-center justify-between mb-8">
             <h3 className="text-xl font-black text-slate-800 dark:text-slate-100">Recent Activity</h3>
             {materials.length > 0 && (
               <button onClick={() => onNavigate('manage-notes')} className="text-xs font-black text-indigo-600 dark:text-indigo-400 hover:underline uppercase">View All</button>
             )}
           </div>
           <div className="space-y-4">
             {materials.length > 0 ? (
               materials.slice(0, 8).map(mat => (
                 <div key={mat.id} className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group">
                   <div className="flex items-center space-x-3 overflow-hidden">
                      <div className="w-10 h-10 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 flex-shrink-0 shadow-sm group-hover:bg-indigo-600 group-hover:text-white transition-all">
                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">{mat.title}</p>
                        <p className="text-[9px] text-slate-400 font-black uppercase tracking-wider">{COURSES.find(c => c.id === mat.courseId)?.code}</p>
                      </div>
                   </div>
                   <div className="flex items-center space-x-1 flex-shrink-0">
                     <div className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase ${mat.summaryStatus === 'completed' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 animate-pulse'}`}>
                       {mat.summaryStatus}
                     </div>
                     <button 
                        onClick={(e) => { e.stopPropagation(); if(confirm(`Delete "${mat.title}"?`)) onDeleteMaterial(mat.id) }}
                        className="p-2 text-slate-300 dark:text-slate-600 hover:text-red-500 transition-all"
                        title="Delete note"
                      >
                       <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                     </button>
                   </div>
                 </div>
               ))
             ) : (
               <div className="text-center py-20 bg-slate-50/50 dark:bg-slate-800/50 rounded-3xl border border-dashed border-slate-100 dark:border-slate-700">
                 <div className="w-12 h-12 bg-white dark:bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300 dark:text-slate-600">
                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
                 </div>
                 <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">No Submissions Yet</p>
               </div>
             )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
