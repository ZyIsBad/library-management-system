import React, { useState } from 'react';
import { Lock, User, Library, ChevronRight } from 'lucide-react';
import RegisterStudentModal from './RegisterStudentModal';
import { motion } from 'motion/react';

interface LoginPageProps {
  onLogin: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [role, setRole] = useState<'admin' | 'student'>('admin');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showRegister, setShowRegister] = useState(false);
  const handleRegister = (student: { firstName: string; lastName: string; username: string; password: string; studentId: string }) => {
    // Here you would send to backend or update state; for now, just log
    console.log('Registered student:', student);
    // Optionally show a success message
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    // Mock authentication logic
    setTimeout(() => {
      if (
        (role === 'admin' && username === 'admin' && password === 'admin123') ||
        (role === 'student' && username.startsWith('student') && password === 'student123')
      ) {
        onLogin();
      } else {
        setError('Invalid credentials.');
      }
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#F9F7F5] flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden" id="login-page">
      {/* Background Decorative Elements */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#000096]/5 rounded-full blur-3xl" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#000096]/5 rounded-full blur-3xl" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
        id="login-container"
      >
        <div className="text-center mb-8 sm:mb-10" id="login-header">
          <div className="inline-flex w-16 h-16 bg-[#000096] rounded-xl items-center justify-center text-white mb-5 shadow-2xl shadow-blue-900/20 sm:h-20 sm:w-20 sm:mb-6" id="login-logo">
            <Library size={36} strokeWidth={1.5} />
          </div>
          <h1 className="font-serif text-[40px] text-[#0F172A] leading-tight font-bold tracking-tight sm:text-[48px]" id="login-title">
            Library
          </h1>
          <p className="text-[#64748B] font-outfit font-bold uppercase tracking-[0.2em] text-xs mt-2 sm:text-sm sm:tracking-[0.3em]" id="login-subtitle">
            Management System
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-2xl shadow-slate-200/50 border border-slate-100 p-5 relative z-10 sm:p-10" id="login-card">
          <div className="mb-8" id="role-indicator">
            <div className="flex gap-2 mb-2">
              <button
                className={`px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-wider ${role === 'admin' ? 'bg-amber-50 text-amber-700 border-amber-100/50' : 'bg-slate-50 text-slate-400 border-slate-100'}`}
                type="button"
                onClick={() => setRole('admin')}
              >
                Admin
              </button>
              <button
                className={`px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-wider ${role === 'student' ? 'bg-blue-50 text-blue-700 border-blue-100/50' : 'bg-slate-50 text-slate-400 border-slate-100'}`}
                type="button"
                onClick={() => setRole('student')}
              >
                Student
              </button>
            </div>
            <h2 className="text-2xl font-serif font-bold text-slate-900 mt-2">{role === 'admin' ? 'Admin Login' : 'Student Login'}</h2>
            <p className="text-slate-500 font-outfit text-sm mt-1">Please enter your credentials to proceed.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6" id="login-form">
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Username</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#000096] transition-colors">
                  <User size={18} />
                </div>
                <input 
                  type="text" 
                  required
                  placeholder={role === 'admin' ? 'admin' : 'student123'}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#000096] transition-all font-medium text-slate-700"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#000096] transition-colors">
                  <Lock size={18} />
                </div>
                <input 
                  type="password" 
                  required
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#000096] transition-all font-medium text-slate-700"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {error && <div className="text-red-500 text-xs font-bold text-center">{error}</div>}

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#000096] text-white py-4 rounded-xl font-bold shadow-xl shadow-blue-900/20 hover:bg-[#00006f] transition-all flex items-center justify-center gap-2 group transform active:scale-[0.98]"
              id="login-btn"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
            {role === 'student' && (
              <button
                type="button"
                className="w-full mt-2 bg-blue-100 text-blue-700 py-2 rounded-xl font-bold border border-blue-200 hover:bg-blue-200 transition-all"
                onClick={() => setShowRegister(true)}
              >
                Register as Student
              </button>
            )}
                  <RegisterStudentModal
                    isOpen={showRegister}
                    onClose={() => setShowRegister(false)}
                    onRegister={handleRegister}
                  />
          </form>

          <div className="mt-8 pt-8 border-t border-slate-50 text-center" id="login-footer">
            <button className="text-sm font-outfit text-slate-400 hover:text-slate-600 transition-colors">
              Forgot your password?
            </button>
          </div>
        </div>
        
        <p className="text-center mt-8 text-slate-400 font-outfit text-[11px] font-medium uppercase tracking-widest" id="legal-footer">
          &copy; 2026 Academic Library Systems | All rights reserved.
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage;
