
import React, { useState } from 'react';
import { Material, Course } from '../types';
import { generateSummary } from '../services/geminiService';

interface UploadNotesProps {
  courses: Course[];
  onAddCourse: (course: Course) => void;
  onDeleteCourse: (id: string) => void;
  onUploadComplete: (material: Material) => void;
  onNavigate: (view: string) => void;
}

const UploadNotes: React.FC<UploadNotesProps> = ({ 
  courses, 
  onAddCourse, 
  onDeleteCourse, 
  onUploadComplete, 
  onNavigate 
}) => {
  const [selectedCourse, setSelectedCourse] = useState(courses[0]?.id || '');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState<{name: string, size: string, type: string}[]>([]);
  const [aiResult, setAiResult] = useState<string | null>(null);

  // Course Management State
  const [isAddingCourse, setIsAddingCourse] = useState(false);
  const [newCourseCode, setNewCourseCode] = useState('');
  const [newCourseName, setNewCourseName] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files) as File[];
      const newFiles = filesArray.map(f => ({
        name: f.name,
        size: (f.size / (1024 * 1024)).toFixed(1) + ' MB',
        type: f.type
      }));
      setUploadedFiles(prev => [...prev, ...newFiles]);
    }
  };

  const handleAddNewCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourseCode || !newCourseName) return;

    const newCourse: Course = {
      id: Math.random().toString(36).substr(2, 9),
      code: newCourseCode.toUpperCase(),
      name: newCourseName,
      description: `Course content for ${newCourseName}`,
      notesCount: 0,
      summariesCount: 0,
      image: ''
    };

    onAddCourse(newCourse);
    setNewCourseCode('');
    setNewCourseName('');
    setIsAddingCourse(false);
    setSelectedCourse(newCourse.id);
  };

  const startAIProcessing = async () => {
    if (uploadedFiles.length === 0 || !selectedCourse) return;
    setIsUploading(true);
    setUploadProgress(0);
    setAiResult(null);

    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 2;
      });
    }, 100);

    try {
      const course = courses.find(c => c.id === selectedCourse);
      const isImage = uploadedFiles[0].type.startsWith('image/');
      
      const promptText = `I am uploading ${uploadedFiles.length} file(s) for the course "${course?.name}". The main file is a ${isImage ? 'image' : 'document'} named "${uploadedFiles[0].name}". Please act as an AI professor and generate a placeholder structured summary about what this material likely contains.`;
      
      const summary = await generateSummary(promptText);
      
      setUploadProgress(100);
      setAiResult(summary);
      
      const newMaterial: Material = {
        id: Math.random().toString(36).substr(2, 9),
        courseId: selectedCourse,
        title: uploadedFiles[0].name.split('.')[0],
        type: isImage ? 'image' : 'pdf',
        uploadDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        week: 8,
        size: uploadedFiles[0].size,
        summaryStatus: 'completed',
        summaryText: summary,
        views: 0,
        downloads: 0
      };

      onUploadComplete(newMaterial);
      
      setTimeout(() => {
        setIsUploading(false);
      }, 1000);

    } catch (err) {
      console.error(err);
      setIsUploading(false);
      alert("Error during AI processing.");
    }
  };

  return (
    <div className="p-8 space-y-8 animate-fadeIn max-w-5xl mx-auto transition-colors duration-300">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {!aiResult ? (
            <>
              <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-sm border border-slate-50 dark:border-slate-800 transition-colors">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-black text-slate-800 dark:text-slate-100">Select Course</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Choose the course for this lecture material</p>
                  </div>
                  <button 
                    onClick={() => setIsAddingCourse(!isAddingCourse)}
                    className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 font-black text-[10px] uppercase tracking-widest hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                    <span>{isAddingCourse ? 'Cancel' : 'New Course'}</span>
                  </button>
                </div>

                {isAddingCourse ? (
                  <form onSubmit={handleAddNewCourse} className="p-6 bg-slate-50 dark:bg-slate-800 rounded-3xl border-2 border-indigo-100 dark:border-indigo-900/30 animate-fadeIn space-y-4 mb-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Course Code</label>
                        <input 
                          type="text" 
                          placeholder="e.g. CS101"
                          value={newCourseCode}
                          onChange={(e) => setNewCourseCode(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-black dark:text-white font-bold focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Course Name</label>
                        <input 
                          type="text" 
                          placeholder="e.g. Intro to Data"
                          value={newCourseName}
                          onChange={(e) => setNewCourseName(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-black dark:text-white font-bold focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                        />
                      </div>
                    </div>
                    <button 
                      type="submit"
                      className="w-full py-3 bg-indigo-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 dark:shadow-indigo-900/20"
                    >
                      Save Course
                    </button>
                  </form>
                ) : null}

                <div className="grid grid-cols-2 gap-4">
                  {courses.map(course => (
                    <div key={course.id} className="relative group">
                      <button
                        onClick={() => setSelectedCourse(course.id)}
                        className={`w-full p-4 rounded-2xl border-2 transition-all text-left group-hover:shadow-md ${
                          selectedCourse === course.id 
                            ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20' 
                            : 'border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
                        }`}
                      >
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black inline-block mb-2 ${
                          selectedCourse === course.id ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                        }`}>
                          {course.code}
                        </span>
                        <p className={`font-bold text-sm truncate pr-6 transition-colors ${selectedCourse === course.id ? 'text-indigo-900 dark:text-indigo-400' : 'text-slate-700 dark:text-slate-300'}`}>
                          {course.name}
                        </p>
                      </button>
                      
                      <button 
                        onClick={(e) => { e.stopPropagation(); onDeleteCourse(course.id); }}
                        className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 p-1.5 text-slate-300 dark:text-slate-600 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                        title="Remove Course"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  ))}
                  
                  {courses.length === 0 && (
                    <div className="col-span-2 py-12 text-center bg-slate-50 dark:bg-slate-800/50 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-700">
                      <p className="text-slate-400 dark:text-slate-500 text-sm font-bold uppercase tracking-widest">No courses available</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-sm border border-slate-50 dark:border-slate-800 transition-colors">
                <h2 className="text-xl font-black text-slate-800 dark:text-slate-100 mb-2">Upload Files</h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 font-medium">Drag and drop documents or images from your device</p>
                
                <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center group relative transition-all hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <input 
                    type="file" 
                    multiple 
                    onChange={handleFileChange}
                    disabled={isUploading}
                    accept=".pdf,.doc,.docx,.pptx,.png,.jpg,.jpeg,.gif"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                  />
                  <div className="bg-indigo-50 dark:bg-slate-800 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <svg className="w-8 h-8 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                  </div>
                  <h4 className="text-lg font-black text-slate-700 dark:text-slate-200">Drop lecture files here</h4>
                  <p className="text-slate-400 dark:text-slate-500 mt-1 font-medium">PDF, PPTX, or Images</p>
                  <button className="mt-6 px-8 py-3 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-100 dark:shadow-indigo-900/20 group-hover:bg-indigo-700 transition-all">
                    Browse Gallery
                  </button>
                </div>

                {uploadedFiles.length > 0 && (
                  <div className="mt-8 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-black text-slate-800 dark:text-slate-100">Selected Files ({uploadedFiles.length})</h3>
                      <button onClick={() => setUploadedFiles([])} disabled={isUploading} className="text-red-500 text-xs font-black uppercase hover:underline transition-colors">Clear All</button>
                    </div>
                    {uploadedFiles.map((file, i) => (
                      <div key={i} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-between transition-colors">
                        <div className="flex items-center space-x-4">
                          <div className="bg-white dark:bg-slate-900 p-2 rounded-xl text-indigo-600 dark:text-indigo-400 shadow-sm">
                            {file.type.startsWith('image/') ? (
                              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h14a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                            ) : (
                              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{file.name}</p>
                            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase">{file.size}</p>
                          </div>
                        </div>
                        {!isUploading && (
                          <button onClick={() => setUploadedFiles(prev => prev.filter((_, idx) => idx !== i))} className="text-slate-300 dark:text-slate-600 hover:text-red-500 transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                          </button>
                        )}
                      </div>
                    ))}
                    
                    {isUploading && (
                      <div className="space-y-4 py-4">
                        <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase tracking-widest">
                          <span className="flex items-center">
                            <svg className="w-3 h-3 mr-2 animate-spin text-indigo-600" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            Gemini AI Analysis...
                          </span>
                          <span>{uploadProgress}%</span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-indigo-600 transition-all duration-300 shadow-[0_0_15px_rgba(79,70,229,0.5)]" style={{ width: `${uploadProgress}%` }}></div>
                        </div>
                      </div>
                    )}

                    {!isUploading && (
                      <button 
                        onClick={startAIProcessing}
                        disabled={!selectedCourse}
                        className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-indigo-100 dark:shadow-indigo-900/20 hover:bg-indigo-700 transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {!selectedCourse ? 'Select a Course' : 'Process with Gemini AI'}
                      </button>
                    )}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-xl border border-indigo-100 dark:border-indigo-900/30 animate-fadeIn overflow-hidden relative transition-colors">
              <div className="absolute top-0 right-0 p-8 opacity-5 dark:opacity-10 pointer-events-none text-indigo-600">
                <svg className="w-40 h-40" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
              </div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center">
                       <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-slate-800 dark:text-slate-100">Analysis Complete</h3>
                      <p className="text-sm text-slate-400 dark:text-slate-500 font-medium">Intelligent summary generated.</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => {setAiResult(null); setUploadedFiles([]); onNavigate('dashboard')}}
                    className="text-slate-400 dark:text-slate-600 hover:text-indigo-600 transition-colors font-black text-[10px] uppercase tracking-widest"
                  >
                    Close
                  </button>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/50 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 mb-8 max-h-[300px] overflow-y-auto custom-scrollbar transition-colors">
                  <p className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-4">Gemini Output</p>
                  <div className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-wrap font-medium">
                    {aiResult}
                  </div>
                </div>

                <div className="flex space-x-4">
                  <button onClick={() => onNavigate('summaries')} className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 dark:shadow-indigo-900/20">
                    View Summaries
                  </button>
                  <button onClick={() => {setAiResult(null); setUploadedFiles([]); onNavigate('dashboard')}} className="flex-1 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-700 transition-all">
                    Dashboard
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-indigo-900 p-8 rounded-[2.5rem] text-white space-y-8 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
               <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <div className="relative z-10">
              <h3 className="text-xl font-black mb-4">AI Intelligence</h3>
              <p className="text-indigo-200 text-sm leading-relaxed mb-8 font-medium">
                Our system uses specialized vision-language models to interpret complex diagrams, equations, and structures in your notes.
              </p>
              <div className="space-y-6">
                <div className="flex items-center space-x-3">
                   <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-indigo-300">
                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                   </div>
                   <span className="text-xs font-black uppercase tracking-wider">Vision Optimized</span>
                </div>
                <div className="flex items-center space-x-3">
                   <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-indigo-300">
                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" /></svg>
                   </div>
                   <span className="text-xs font-black uppercase tracking-wider">Markdown Summaries</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadNotes;
