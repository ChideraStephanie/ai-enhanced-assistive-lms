
import React, { useState, useEffect } from 'react';
import { User, Material, Course } from './types';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import AuthView from './views/AuthView';
import TeacherDashboard from './views/TeacherDashboard';
import StudentDashboard from './views/StudentDashboard';
import UploadNotes from './views/UploadNotes';
import SummariesList from './views/SummariesList';
import ProfileView from './views/ProfileView';
import ManageMaterials from './views/ManageMaterials';
import { dbService } from './services/dbService';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState('dashboard');
  const [materials, setMaterials] = useState<Material[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [theme, setTheme] = useState<'light' | 'dark'>(dbService.getTheme());
  const [isReady, setIsReady] = useState(false);

  // Initialize app from database
  useEffect(() => {
    const session = dbService.getSession();
    if (session) {
      setUser(session);
    }
    setMaterials(dbService.getMaterials());
    setCourses(dbService.getCourses());
    setIsReady(true);
  }, []);

  // Apply theme class to document
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    dbService.setTheme(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleLoginSuccess = (loggedInUser: User) => {
    setUser(loggedInUser);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    dbService.logout();
    setUser(null);
  };

  const addMaterial = (newMaterial: Material) => {
    dbService.saveMaterial(newMaterial);
    setMaterials(dbService.getMaterials());
  };

  const deleteMaterial = (id: string) => {
    if (user?.role !== 'teacher') return;
    dbService.deleteMaterial(id);
    setMaterials(dbService.getMaterials());
  };

  const handleAddCourse = (course: Course) => {
    dbService.addCourse(course);
    setCourses(dbService.getCourses());
  };

  const handleDeleteCourse = (id: string) => {
    if (window.confirm('Delete this course? All associated material references will be orphaned.')) {
      dbService.deleteCourse(id);
      setCourses(dbService.getCourses());
    }
  };

  const updateUser = (updatedUser: User) => {
    dbService.updateProfile(updatedUser);
    setUser(updatedUser);
  };

  if (!isReady) return null;

  if (!user) {
    return <AuthView onLoginSuccess={handleLoginSuccess} />;
  }

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return user.role === 'teacher' 
          ? <TeacherDashboard user={user} onNavigate={setCurrentView} materials={materials} onDeleteMaterial={deleteMaterial} /> 
          : <StudentDashboard user={user} onNavigate={setCurrentView} materials={materials} courses={courses} />;
      case 'upload':
        return (
          <UploadNotes 
            courses={courses}
            onAddCourse={handleAddCourse}
            onDeleteCourse={handleDeleteCourse}
            onUploadComplete={addMaterial} 
            onNavigate={setCurrentView} 
          />
        );
      case 'manage-notes':
        return <ManageMaterials materials={materials} courses={courses} onDeleteMaterial={deleteMaterial} />;
      case 'summaries':
        return <SummariesList materials={materials} courses={courses} />;
      case 'profile':
        return <ProfileView user={user} onUpdateUser={updateUser} theme={theme} onToggleTheme={toggleTheme} />;
      case 'feedback':
        return (
          <div className="p-8 text-center mt-20 dark:text-white">
            <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-200">Feedback Management</h2>
            <p className="text-slate-500 dark:text-slate-400">Feature coming soon in the next update.</p>
          </div>
        );
      case 'timetable':
      case 'assignments':
        return (
          <div className="p-8 text-center mt-20 dark:text-white">
            <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-200">{currentView.charAt(0).toUpperCase() + currentView.slice(1)} View</h2>
            <p className="text-slate-500 dark:text-slate-400">This feature is currently under development.</p>
          </div>
        );
      default:
        return <div>View not found</div>;
    }
  };

  return (
    <div className="flex bg-[#f3f6fc] dark:bg-slate-950 min-h-screen transition-colors duration-300">
      <Sidebar 
        role={user.role} 
        currentView={currentView} 
        onNavigate={setCurrentView} 
        onLogout={handleLogout} 
      />
      <div className="flex-1 ml-64 overflow-x-hidden min-h-screen flex flex-col">
        <Header user={user} theme={theme} onToggleTheme={toggleTheme} />
        <main className="flex-1 custom-scrollbar overflow-y-auto">
          {renderView()}
        </main>
      </div>
    </div>
  );
};

export default App;
