
import React, { useState } from 'react';
import { UserRole, User } from '../types';
import { dbService } from '../services/dbService';

interface AuthViewProps {
  onLoginSuccess: (user: User) => void;
}

const AuthView: React.FC<AuthViewProps> = ({ onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState<UserRole>('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleAuthAction = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError('');
    setSuccess('');

    if (isLogin) {
      const user = dbService.login(email, password);
      if (user) {
        onLoginSuccess(user);
      } else {
        setError('Invalid email or password.');
      }
    } else {
      if (!name || !email || !password) {
        setError('Please fill in all fields');
        return;
      }
      const registered = dbService.registerUser({
        name,
        email,
        password,
        role,
        avatar: ''
      });

      if (registered) {
        setSuccess('Account created! You can now log in.');
        setIsLogin(true);
        setName('');
        setEmail('');
        setPassword('');
      } else {
        setError('Email already exists');
      }
    }
  };

  const handleQuickLogin = (type: 'teacher' | 'student') => {
    const testEmail = type === 'teacher' ? 'teacher@test.com' : 'student@test.com';
    const testPass = 'password';
    
    setEmail(testEmail);
    setPassword(testPass);
    setIsLogin(true);
    
    // Slight delay to allow state to settle
    setTimeout(() => {
      const user = dbService.login(testEmail, testPass);
      if (user) onLoginSuccess(user);
    }, 100);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-indigo-50 dark:bg-slate-950 transition-colors duration-300">
      <div className="w-full max-w-6xl flex bg-white dark:bg-slate-900 rounded-[3rem] overflow-hidden shadow-2xl animate-fadeIn border border-transparent dark:border-slate-800">
        <div className="hidden lg:flex w-1/2 bg-indigo-600 items-center justify-center p-12 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
             <div className="absolute -top-20 -left-20 w-80 h-80 bg-white rounded-full blur-3xl"></div>
             <div className="absolute -bottom-40 -right-20 w-[30rem] h-[30rem] bg-indigo-400 rounded-full blur-3xl"></div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center opacity-10">
            <svg className="w-full h-full p-20" fill="white" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
          </div>
          
          <div className="text-center space-y-12 z-10">
            <div className="w-32 h-32 bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-2xl">
              <span className="text-6xl font-black text-white">L</span>
            </div>
            <div className="space-y-4">
              <h2 className="text-4xl font-black text-white tracking-tight">LearnAI Intelligence</h2>
              <p className="text-indigo-100 max-w-xs mx-auto text-lg font-medium leading-relaxed">
                The modern platform for smart learning. Summaries, audio, and organization.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto">
               <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                  <div className="text-2xl font-black text-white">100%</div>
                  <div className="text-[10px] font-black uppercase text-indigo-200 tracking-widest">AI Local</div>
               </div>
               <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                  <div className="text-2xl font-black text-white">FAST</div>
                  <div className="text-[10px] font-black uppercase text-indigo-200 tracking-widest">Processing</div>
               </div>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-1/2 p-12 flex flex-col justify-center bg-white dark:bg-slate-900 transition-colors">
          <form onSubmit={handleAuthAction} className="max-w-md mx-auto w-full space-y-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-2xl mx-auto mb-4">L</div>
              <h1 className="text-4xl font-black text-slate-800 dark:text-slate-100 mb-2">
                {isLogin ? 'Welcome Back!' : 'Get Started'}
              </h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                {isLogin ? 'Sign in to access your course materials' : 'Join our intelligent learning community'}
              </p>
            </div>

            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 text-red-700 dark:text-red-400 text-xs font-bold rounded-xl">
                {error}
              </div>
            )}

            {success && (
              <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 border-l-4 border-emerald-500 text-emerald-700 dark:text-emerald-400 text-xs font-bold rounded-xl">
                {success}
              </div>
            )}

            <div className="space-y-5">
              {!isLogin && (
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 ml-1 uppercase tracking-widest">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Sarah Johnson"
                    className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-2 border-transparent focus:border-indigo-600 outline-none transition-all font-semibold text-black dark:text-white"
                  />
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 ml-1 uppercase tracking-widest">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@university.edu"
                  className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-2 border-transparent focus:border-indigo-600 outline-none transition-all font-semibold text-black dark:text-white"
                  required
                />
              </div>

              <div className="space-y-1.5 relative">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 ml-1 uppercase tracking-widest">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-2 border-transparent focus:border-indigo-600 outline-none transition-all font-semibold text-black dark:text-white"
                  required
                />
              </div>

              {!isLogin && (
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 ml-1 uppercase tracking-widest">Select Your Role</label>
                  <div className="flex p-1.5 bg-slate-50 dark:bg-slate-800 rounded-2xl border-2 border-transparent">
                    <button
                      type="button"
                      onClick={() => setRole('teacher')}
                      className={`flex-1 py-3 rounded-xl font-black text-[10px] transition-all uppercase tracking-widest ${role === 'teacher' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'}`}
                    >
                      Lecturer
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole('student')}
                      className={`flex-1 py-3 rounded-xl font-black text-[10px] transition-all uppercase tracking-widest ${role === 'student' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'}`}
                    >
                      Student
                    </button>
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-indigo-700 shadow-xl shadow-indigo-100 dark:shadow-indigo-900/20 transition-all transform hover:-translate-y-0.5 active:scale-95"
              >
                {isLogin ? 'Login to Dashboard' : 'Create My Account'}
              </button>
            </div>

            <div className="pt-6 border-t border-slate-50 dark:border-slate-800">
              <div className="flex flex-col items-center space-y-6">
                <p className="text-slate-400 dark:text-slate-500 text-xs font-bold">
                  {isLogin ? "Don't have an account?" : "Already have an account?"}
                  <button
                    type="button"
                    onClick={() => setIsLogin(!isLogin)}
                    className="ml-2 text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    {isLogin ? 'Sign up' : 'Sign in'}
                  </button>
                </p>

                <div className="w-full space-y-3">
                  <div className="flex items-center space-x-2 text-[10px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-widest justify-center">
                    <div className="h-px flex-1 bg-slate-100 dark:bg-slate-800"></div>
                    <span>Demo Accounts</span>
                    <div className="h-px flex-1 bg-slate-100 dark:bg-slate-800"></div>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={() => handleQuickLogin('teacher')}
                      className="flex-1 py-3 bg-slate-50 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 border border-slate-100 dark:border-slate-700 hover:border-indigo-100 dark:hover:border-indigo-800 rounded-xl text-[10px] font-black text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all uppercase tracking-wider"
                    >
                      Lecturer
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickLogin('student')}
                      className="flex-1 py-3 bg-slate-50 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 border border-slate-100 dark:border-slate-700 hover:border-indigo-100 dark:hover:border-indigo-800 rounded-xl text-[10px] font-black text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all uppercase tracking-wider"
                    >
                      Student
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthView;
