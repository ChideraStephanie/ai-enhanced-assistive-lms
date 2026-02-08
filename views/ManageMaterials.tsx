
import React, { useState } from 'react';
import { Material, Course } from '../types';

interface ManageMaterialsProps {
  materials: Material[];
  courses: Course[];
  onDeleteMaterial: (id: string) => void;
}

const ManageMaterials: React.FC<ManageMaterialsProps> = ({ materials, courses, onDeleteMaterial }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = materials.filter(m => 
    m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    courses.find(c => c.id === m.courseId)?.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 animate-fadeIn transition-colors duration-300">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-800 dark:text-slate-100">Manage Notes</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">View and manage all uploaded lecture materials.</p>
        </div>
        <div className="relative w-72">
           <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400">
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
           </span>
           <input 
            type="text" 
            placeholder="Search notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900 rounded-2xl border-none focus:ring-2 focus:ring-indigo-500 shadow-sm text-sm text-black dark:text-white font-semibold transition-colors"
           />
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-sm border border-slate-50 dark:border-slate-800 overflow-hidden transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-50 dark:border-slate-800">
                <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-widest">Material Details</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-widest">Course Code</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-widest">Upload Date</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-widest">Status</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
              {filtered.length > 0 ? filtered.map(mat => (
                <tr key={mat.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-indigo-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                         <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 dark:text-slate-200 text-sm">{mat.title}</p>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-wider mt-0.5">{mat.size}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-lg text-[10px] font-black uppercase tracking-widest">
                      {courses.find(c => c.id === mat.courseId)?.code || 'N/A'}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-sm text-slate-500 dark:text-slate-400 font-bold">
                    {mat.uploadDate}
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-tighter ${mat.summaryStatus === 'completed' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 animate-pulse'}`}>
                      {mat.summaryStatus}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end space-x-2">
                       <button 
                        onClick={() => { if(confirm(`Delete "${mat.title}" permanently?`)) onDeleteMaterial(mat.id) }}
                        className="p-2.5 text-slate-300 dark:text-slate-600 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all"
                        title="Delete permanently"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="px-8 py-24 text-center">
                     <div className="bg-slate-50 dark:bg-slate-800 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                       <svg className="w-10 h-10 text-slate-300 dark:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
                     </div>
                     <p className="text-sm text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest">No matching materials found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageMaterials;
