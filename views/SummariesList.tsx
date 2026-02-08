
import React, { useState, useRef } from 'react';
import { Material, Course } from '../types';
import { generateAudio, decode, decodeAudioData } from '../services/geminiService';

interface SummariesListProps {
  materials: Material[];
  courses: Course[];
}

const SummariesList: React.FC<SummariesListProps> = ({ materials, courses }) => {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [selectedSummary, setSelectedSummary] = useState<any | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const currentSourceRef = useRef<AudioBufferSourceNode | null>(null);

  const categories = ['All', ...courses.slice(0, 4).map(c => c.code)];

  const filteredMaterials = materials.filter(m => {
    if (m.summaryStatus !== 'completed') return false;
    
    const matchesSearch = 
      m.title.toLowerCase().includes(search.toLowerCase()) || 
      m.summaryText?.toLowerCase().includes(search.toLowerCase()) ||
      courses.find(c => c.id === m.courseId)?.code.toLowerCase().includes(search.toLowerCase());

    if (filter === 'All') return matchesSearch;
    
    const courseMatch = courses.find(c => c.code === filter);
    if (courseMatch) return matchesSearch && m.courseId === courseMatch.id;
    
    return matchesSearch;
  });

  const stopAudio = () => {
    if (currentSourceRef.current) {
      try {
        currentSourceRef.current.stop();
      } catch (e) {
        // Source might already be stopped
      }
      currentSourceRef.current = null;
    }
    setPlayingId(null);
  };

  const handlePlayAudio = async (mat: any) => {
    if (playingId === mat.id) {
      stopAudio();
      return;
    }

    try {
      setIsGenerating(true);
      
      // Stop any current audio
      stopAudio();
      
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      }

      // Important: Resume context if suspended by browser policy
      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }

      const base64 = await generateAudio(mat.summaryText || mat.title);
      const audioBytes = decode(base64);
      const audioBuffer = await decodeAudioData(audioBytes, audioContextRef.current);

      const source = audioContextRef.current.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContextRef.current.destination);
      
      source.onended = () => {
        if (playingId === mat.id) {
          setPlayingId(null);
        }
      };

      source.start(0);
      currentSourceRef.current = source;
      setPlayingId(mat.id);
      setIsGenerating(false);

    } catch (err) {
      console.error("TTS Playback Error:", err);
      alert("Failed to play audio. Please ensure your API key is valid.");
      setPlayingId(null);
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8 animate-fadeIn transition-colors duration-300">
      <div className="space-y-2">
        <h1 className="text-3xl font-black text-slate-800 dark:text-slate-100">AI-Generated Summaries</h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium">Listen to intelligent key takeaways from your study materials.</p>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 sticky top-0 bg-[#f3f6fc]/80 dark:bg-slate-950/80 backdrop-blur-md py-4 z-20 transition-colors">
        <div className="relative flex-1 max-w-2xl">
          <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search summaries by title or content..."
            className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-900 rounded-2xl border-none focus:ring-2 focus:ring-indigo-500 shadow-sm text-black dark:text-white font-semibold transition-colors"
          />
        </div>
        <div className="flex p-1 bg-white dark:bg-slate-900 rounded-2xl shadow-sm overflow-x-auto no-scrollbar transition-colors">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${filter === cat ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100 dark:shadow-indigo-900/20' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 pb-20">
        {filteredMaterials.length > 0 ? filteredMaterials.map(mat => (
          <div key={mat.id} className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-50 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all group border-l-4 border-l-indigo-600">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-start space-x-6 w-full">
                 <div className="w-16 h-16 rounded-[1.5rem] bg-indigo-50 dark:bg-slate-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 flex-shrink-0 group-hover:scale-110 transition-transform shadow-sm">
                   <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                 </div>
                 <div className="flex-1 min-w-0">
                   <div className="flex flex-wrap items-center gap-3 mb-2">
                     <h3 className="text-xl font-black text-slate-800 dark:text-slate-100 truncate">{mat.title}</h3>
                     <span className="px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg text-[9px] font-black uppercase tracking-widest">AI SUMMARY</span>
                   </div>
                   <p className="text-[10px] font-black text-indigo-500 dark:text-indigo-400 mb-4 uppercase tracking-widest">{courses.find(c => c.id === mat.courseId)?.code}</p>
                   <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-relaxed line-clamp-2 max-w-3xl">
                     {mat.summaryText}
                   </p>
                 </div>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-6 pt-6 border-t border-slate-50 dark:border-slate-800 transition-colors">
              <div className="flex items-center text-[10px] text-slate-400 dark:text-slate-500 space-x-2 font-black uppercase tracking-widest">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span>~5 min read</span>
              </div>
              <div className="flex-1 flex items-center justify-end space-x-3">
                <button 
                  onClick={() => setSelectedSummary(mat)}
                  className="px-6 py-3 bg-indigo-900 dark:bg-slate-800 text-white rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center space-x-2 hover:bg-indigo-600 dark:hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 dark:shadow-indigo-900/20"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                  <span>Read Full</span>
                </button>
                <button 
                  onClick={() => handlePlayAudio(mat)}
                  disabled={isGenerating || (playingId !== null && playingId !== mat.id)}
                  className={`px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center space-x-2 transition-all ${
                    playingId === mat.id 
                      ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/40' 
                      : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {isGenerating && playingId !== mat.id ? (
                    <div className="flex items-center space-x-2">
                       <svg className="w-3 h-3 animate-spin text-indigo-600" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                       <span>AI Thinking...</span>
                    </div>
                  ) : playingId === mat.id ? (
                    <>
                      <div className="w-2 h-2 bg-red-600 dark:bg-red-400 rounded-full animate-pulse"></div>
                      <span>Stop Playback</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      <span>Listen to Audio</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )) : (
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-20 text-center border border-slate-100 dark:border-slate-800 shadow-sm transition-colors">
             <div className="bg-slate-50 dark:bg-slate-800 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-slate-300 dark:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
             </div>
             <h3 className="text-xl font-black text-slate-800 dark:text-slate-100 mb-2">No summaries found</h3>
             <p className="text-slate-400 dark:text-slate-500 font-medium max-w-xs mx-auto">Try a different search term or filter by course code.</p>
          </div>
        )}
      </div>

      {selectedSummary && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 w-full max-w-4xl max-h-[90vh] rounded-[3rem] overflow-hidden shadow-2xl flex flex-col border border-transparent dark:border-slate-800 transition-colors">
            <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100">{selectedSummary.title}</h2>
                <p className="text-indigo-600 dark:text-indigo-400 font-black mt-1 uppercase tracking-widest text-[10px]">
                  {courses.find(c => c.id === selectedSummary.courseId)?.code} • GEMINI AI SUMMARY
                </p>
              </div>
              <button 
                onClick={() => setSelectedSummary(null)}
                className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-12 custom-scrollbar transition-colors">
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 mb-8 font-black text-[10px] uppercase tracking-widest">
                   <span className="w-8 h-px bg-indigo-200 dark:bg-indigo-900"></span>
                   <span>Key Takeaways</span>
                   <span className="w-8 h-px bg-indigo-200 dark:bg-indigo-900"></span>
                </div>
                <div className="text-slate-700 dark:text-slate-300 text-lg leading-relaxed whitespace-pre-wrap font-medium">
                  {selectedSummary.summaryText}
                </div>
              </div>
            </div>
            <div className="p-8 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between transition-colors">
               <div className="text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest">
                 Analyzed on {selectedSummary.uploadDate}
               </div>
               <div className="flex items-center space-x-3">
                  <button 
                    onClick={() => handlePlayAudio(selectedSummary)}
                    className="px-6 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center space-x-2 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all shadow-sm"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>
                    <span>{playingId === selectedSummary.id ? 'Stop' : 'Listen'}</span>
                  </button>
                  <button className="px-8 py-3 bg-indigo-900 dark:bg-indigo-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 dark:shadow-indigo-900/20">
                    Export Notes
                  </button>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SummariesList;
