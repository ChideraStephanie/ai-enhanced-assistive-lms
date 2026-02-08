
import React, { useState, useRef } from 'react';
import { User } from '../types';
import Avatar from '../components/Avatar';

interface ProfileViewProps {
  user: User;
  onUpdateUser: (updatedUser: User) => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ user, onUpdateUser, theme, onToggleTheme }) => {
  const [formData, setFormData] = useState({
    name: user.name || '',
    email: user.email || '',
    avatar: user.avatar || '',
    university: user.university || '',
    department: user.department || '',
    bio: user.bio || ''
  });
  
  const [passwordData, setPasswordData] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  const [isSaved, setIsSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'security'>('details');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      ...user,
      ...formData
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleRandomizeAvatar = () => {
    setFormData(prev => ({ ...prev, avatar: '' }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Image is too large. Please select a file under 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, avatar: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.new !== passwordData.confirm) {
      alert("Passwords do not match!");
      return;
    }
    alert("Password updated successfully!");
    setPasswordData({ current: '', new: '', confirm: '' });
  };

  return (
    <div className="p-8 max-w-4xl mx-auto animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-sm border border-slate-50 dark:border-slate-800 overflow-hidden">
        {/* Profile Header */}
        <div className="bg-indigo-600 p-10 flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 opacity-10 pointer-events-none text-white">
             <svg className="w-64 h-64" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
          </div>
          
          <div className="relative group z-10">
            <Avatar src={formData.avatar} name={formData.name} size="xl" className="border-4 border-white/20 shadow-2xl transition-transform group-hover:scale-105 duration-300 rounded-[2rem]" />
            
            <div className="absolute -bottom-2 -right-2 flex space-x-1">
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="bg-white text-indigo-600 p-2 rounded-xl shadow-lg hover:bg-indigo-50 transition-colors"
                title="Upload from Gallery"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              </button>
              <button 
                onClick={handleRandomizeAvatar}
                className="bg-white text-indigo-600 p-2 rounded-xl shadow-lg hover:bg-indigo-50 transition-colors"
                title="Reset to Initials"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
              </button>
            </div>
            
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="image/*" 
              className="hidden" 
            />
          </div>
          
          <div className="text-center md:text-left z-10">
            <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
              <h2 className="text-3xl font-black text-white">{formData.name}</h2>
              <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-lg text-[10px] font-black text-white uppercase tracking-widest self-center">
                {user.role}
              </span>
            </div>
            <p className="text-indigo-100 font-medium mt-1">{formData.email}</p>
            <p className="text-indigo-200 text-xs font-bold mt-2 uppercase tracking-tighter">
              {formData.university || 'No University Set'} • {formData.department || 'No Department Set'}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-50 dark:border-slate-800">
          <button 
            onClick={() => setActiveTab('details')}
            className={`flex-1 py-5 text-sm font-black uppercase tracking-widest transition-all ${activeTab === 'details' ? 'text-indigo-600 border-b-4 border-indigo-600' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'}`}
          >
            Personal Details
          </button>
          <button 
            onClick={() => setActiveTab('security')}
            className={`flex-1 py-5 text-sm font-black uppercase tracking-widest transition-all ${activeTab === 'security' ? 'text-indigo-600 border-b-4 border-indigo-600' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'}`}
          >
            Security & Display
          </button>
        </div>

        {/* Content */}
        <div className="p-10">
          {activeTab === 'details' ? (
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-2 border-transparent focus:border-indigo-600 outline-none transition-all font-bold text-black dark:text-white"
                    placeholder="Enter your name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-2 border-transparent focus:border-indigo-600 outline-none transition-all font-bold text-black dark:text-white"
                    placeholder="name@university.edu"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">University</label>
                  <input
                    type="text"
                    value={formData.university}
                    onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                    className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-2 border-transparent focus:border-indigo-600 outline-none transition-all font-bold text-black dark:text-white"
                    placeholder="e.g. Global Tech University"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Department</label>
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-2 border-transparent focus:border-indigo-600 outline-none transition-all font-bold text-black dark:text-white"
                    placeholder="e.g. Computer Science"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Bio / About Me</label>
                <textarea
                  rows={4}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-2 border-transparent focus:border-indigo-600 outline-none transition-all font-bold text-black dark:text-white resize-none"
                  placeholder="Tell us a bit about yourself..."
                />
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-slate-50 dark:border-slate-800">
                <div className={`text-emerald-600 font-black text-[10px] uppercase tracking-widest transition-opacity duration-500 ${isSaved ? 'opacity-100' : 'opacity-0'}`}>
                  Changes Saved Successfully!
                </div>
                <button
                  type="submit"
                  className="px-10 py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-xl shadow-indigo-100 dark:shadow-indigo-900/20 hover:bg-indigo-700 transition-all transform active:scale-95"
                >
                  Update Profile
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-12">
              {/* Theme Selector with HIGHLY PHYSICAL Buttons */}
              <div className="space-y-6">
                 <h3 className="text-lg font-black text-slate-800 dark:text-slate-100">Display Appearance</h3>
                 <div className="p-8 bg-slate-50 dark:bg-slate-800 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 transition-all">
                   <div className="flex flex-col space-y-6">
                     <div>
                       <p className="font-bold text-slate-800 dark:text-slate-100">System Physical Switch</p>
                       <p className="text-xs text-slate-400 font-medium">Click a button to push it down and switch the global mood.</p>
                     </div>
                     
                     <div className="grid grid-cols-2 gap-8">
                       {/* Light Mode Physical Button */}
                       <div className="flex flex-col items-center space-y-4">
                         <button
                           onClick={() => theme === 'dark' && onToggleTheme()}
                           className={`
                             relative w-full aspect-square rounded-[3rem] flex flex-col items-center justify-center transition-all duration-200 
                             border-b-[12px] active:border-b-0 active:translate-y-[12px]
                             ${theme === 'light' 
                               ? 'bg-white border-indigo-200 shadow-[0_15px_30px_-5px_rgba(79,70,229,0.3)]' 
                               : 'bg-slate-100 border-slate-300 dark:bg-slate-900 dark:border-slate-950 opacity-50 grayscale hover:opacity-100 hover:grayscale-0'
                             }
                           `}
                         >
                           <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mb-4 ${theme === 'light' ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-400'}`}>
                             <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707.707M12 8a4 4 0 100 8 4 4 0 000-8z" /></svg>
                           </div>
                           <span className={`text-xs font-black uppercase tracking-widest ${theme === 'light' ? 'text-indigo-600' : 'text-slate-400'}`}>Day Shift</span>
                         </button>
                         {theme === 'light' && <div className="h-1.5 w-8 bg-indigo-600 rounded-full animate-pulse shadow-[0_0_8px_rgba(79,70,229,0.5)]"></div>}
                       </div>

                       {/* Dark Mode Physical Button */}
                       <div className="flex flex-col items-center space-y-4">
                         <button
                           onClick={() => theme === 'light' && onToggleTheme()}
                           className={`
                             relative w-full aspect-square rounded-[3rem] flex flex-col items-center justify-center transition-all duration-200
                             border-b-[12px] active:border-b-0 active:translate-y-[12px]
                             ${theme === 'dark' 
                               ? 'bg-slate-800 border-slate-950 shadow-[0_15px_30px_-5px_rgba(0,0,0,0.6)]' 
                               : 'bg-slate-100 border-slate-300 dark:bg-slate-900 dark:border-slate-950 opacity-50 grayscale hover:opacity-100 hover:grayscale-0'
                             }
                           `}
                         >
                           <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mb-4 ${theme === 'dark' ? 'bg-amber-400 text-slate-900' : 'bg-slate-200 dark:bg-slate-800 text-slate-400'}`}>
                             <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                           </div>
                           <span className={`text-xs font-black uppercase tracking-widest ${theme === 'dark' ? 'text-amber-400' : 'text-slate-400'}`}>Night Shift</span>
                         </button>
                         {theme === 'dark' && <div className="h-1.5 w-8 bg-amber-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(251,191,36,0.5)]"></div>}
                       </div>
                     </div>
                   </div>
                 </div>
              </div>

              <form onSubmit={handlePasswordChange} className="space-y-8">
                <div className="space-y-6">
                  <h3 className="text-lg font-black text-slate-800 dark:text-slate-100">Change Password</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Current Password</label>
                      <input
                        type="password"
                        value={passwordData.current}
                        onChange={(e) => setPasswordData({ ...passwordData, current: e.target.value })}
                        className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-2 border-transparent focus:border-indigo-600 outline-none transition-all font-bold text-black dark:text-white"
                        placeholder="••••••••"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">New Password</label>
                        <input
                          type="password"
                          value={passwordData.new}
                          onChange={(e) => setPasswordData({ ...passwordData, new: e.target.value })}
                          className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-2 border-transparent focus:border-indigo-600 outline-none transition-all font-bold text-black dark:text-white"
                          placeholder="••••••••"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Confirm New Password</label>
                        <input
                          type="password"
                          value={passwordData.confirm}
                          onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })}
                          className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-2 border-transparent focus:border-indigo-600 outline-none transition-all font-bold text-black dark:text-white"
                          placeholder="••••••••"
                        />
                      </div>
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="px-8 py-3 bg-slate-800 dark:bg-slate-700 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-black dark:hover:bg-slate-600 transition-all"
                  >
                    Update Password
                  </button>
                </div>
              </form>

              <div className="pt-10 border-t border-slate-50 dark:border-slate-800">
                <h3 className="text-lg font-black text-red-600 mb-2">Danger Zone</h3>
                <p className="text-slate-400 dark:text-slate-500 text-sm mb-6 font-medium">Once you delete your account, there is no going back. Please be certain.</p>
                <button 
                  onClick={() => confirm("Are you absolutely sure? This will delete all your lecture materials and account data permanently.")}
                  className="px-8 py-4 border-2 border-red-100 dark:border-red-900/30 text-red-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-50 dark:hover:bg-red-900/10 transition-all"
                >
                  Delete Account
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
