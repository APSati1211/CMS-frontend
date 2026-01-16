import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, getSystemStatus, setupAdmin } from '../../api';
import { useAuth } from '../../context/AuthContext';
import { Lock, Mail, Loader2, AlertCircle, Hexagon, ArrowRight, CheckCircle2, User, ShieldAlert } from 'lucide-react';

export default function Login() {
  const [mode, setMode] = useState('loading'); // 'loading' | 'login' | 'setup'
  
  // --- UPDATED: Pre-fill from .env if available ---
  const [formData, setFormData] = useState({ 
    username: process.env.REACT_APP_ADMIN_USERNAME || '', 
    password: process.env.REACT_APP_ADMIN_PASSWORD || '' 
  });
  
  // Setup State
  const [setupData, setSetupData] = useState({ username: '', email: '', password: '', confirmPassword: '' });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  // 1. Check System Status on Mount
  useEffect(() => {
    checkStatus();
  }, []);

  const checkStatus = async () => {
    try {
        const res = await getSystemStatus();
        if (res.data.is_setup_complete) {
            setMode('login');
        } else {
            setMode('setup');
        }
    } catch (err) {
        console.error("Failed to check system status", err);
        setMode('login'); // Fallback to login on error
    }
  };

  // 2. Handle Inputs
  const handleLoginChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleSetupChange = (e) => setSetupData({ ...setupData, [e.target.name]: e.target.value });

  // 3. Submit Handler (Switch based on mode)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
        if (mode === 'login') {
            // --- LOGIN LOGIC ---
            // Note: The Backend MUST already have a user with these credentials for this to succeed.
            const res = await loginUser(formData);
            login(res.data.token, { role: res.data.role, id: res.data.user_id });
            navigate('/admin');
        } else {
            // --- SETUP LOGIC ---
            if (setupData.password !== setupData.confirmPassword) {
                throw new Error("Passwords do not match");
            }
            await setupAdmin({
                username: setupData.username,
                email: setupData.email,
                password: setupData.password
            });
            alert("Admin Account Created! Please log in.");
            setMode('login'); // Switch to login screen
            
            // Auto-fill login form with the just-created credentials
            setFormData({ 
                username: setupData.username, 
                password: '' // Don't auto-fill password for security after creation
            }); 
        }
    } catch (err) {
        console.error(err);
        const msg = err.response?.data?.error || err.message || "Operation failed.";
        setError(msg);
    } finally {
        setLoading(false);
    }
  };

  if (mode === 'loading') {
    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center">
            <Loader2 className="animate-spin text-blue-500" size={40} />
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      
      {/* Background Decorations */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px]"></div>
      </div>

      <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-lg relative z-10 border border-white/10 overflow-hidden animate-in fade-in zoom-in-95 duration-500">
        
        {/* Header */}
        <div className="pt-10 pb-6 px-10 text-center">
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl text-white shadow-lg mb-6 ${mode === 'setup' ? 'bg-gradient-to-tr from-orange-500 to-red-600 shadow-orange-500/30' : 'bg-gradient-to-tr from-blue-600 to-indigo-600 shadow-blue-500/30'}`}>
            {mode === 'setup' ? <ShieldAlert size={32} /> : <Hexagon size={32} />}
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {mode === 'setup' ? 'Admin Setup' : 'Welcome Back'}
          </h1>
          <p className="text-slate-500 mt-2 text-sm font-medium">
            {mode === 'setup' ? 'Create the first superuser account.' : 'Sign in to XpertAI Administration'}
          </p>
        </div>

        {/* Form */}
        <div className="px-10 pb-10">
          
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl mb-6 flex items-center gap-3 text-sm font-bold shadow-sm">
              <AlertCircle size={20} className="shrink-0" /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Username (Both Modes) */}
            <div className="group">
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Username</label>
              <div className="relative">
                <div className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-blue-600 transition-colors"><User size={20} /></div>
                <input 
                  type="text" 
                  name="username"
                  required
                  value={mode === 'login' ? formData.username : setupData.username}
                  onChange={mode === 'login' ? handleLoginChange : handleSetupChange}
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:border-blue-500 outline-none transition-all"
                  placeholder="Enter username"
                />
              </div>
            </div>

            {/* Email (Setup Only) */}
            {mode === 'setup' && (
                <div className="group animate-in slide-in-from-top-4 fade-in">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Email Address</label>
                <div className="relative">
                    <div className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-blue-600 transition-colors"><Mail size={20} /></div>
                    <input 
                    type="email" 
                    name="email"
                    required
                    value={setupData.email}
                    onChange={handleSetupChange}
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:border-blue-500 outline-none transition-all"
                    placeholder="admin@company.com"
                    />
                </div>
                </div>
            )}

            {/* Password (Both Modes) */}
            <div className="group">
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Password</label>
              <div className="relative">
                <div className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-blue-600 transition-colors"><Lock size={20} /></div>
                <input 
                  type="password" 
                  name="password"
                  required
                  value={mode === 'login' ? formData.password : setupData.password}
                  onChange={mode === 'login' ? handleLoginChange : handleSetupChange}
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:border-blue-500 outline-none transition-all"
                  placeholder="••••••••••••"
                />
              </div>
            </div>

            {/* Confirm Password (Setup Only) */}
            {mode === 'setup' && (
                <div className="group animate-in slide-in-from-top-4 fade-in">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Confirm Password</label>
                <div className="relative">
                    <div className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-blue-600 transition-colors"><CheckCircle2 size={20} /></div>
                    <input 
                    type="password" 
                    name="confirmPassword"
                    required
                    value={setupData.confirmPassword}
                    onChange={handleSetupChange}
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:border-blue-500 outline-none transition-all"
                    placeholder="••••••••••••"
                    />
                </div>
                </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className={`w-full text-white py-4 rounded-xl font-bold text-base hover:opacity-90 active:scale-[0.98] transition-all flex justify-center items-center gap-2 shadow-xl mt-4 ${mode === 'setup' ? 'bg-orange-600 shadow-orange-900/20' : 'bg-slate-900 shadow-slate-900/20'}`}
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : (
                <>
                  {mode === 'setup' ? 'Create Admin Account' : 'Sign In'} 
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

        </div>
        <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
      </div>
      
      <div className="absolute bottom-6 text-slate-500 text-xs font-medium">
        &copy; {new Date().getFullYear()} XpertAI Inc. All rights reserved.
      </div>
    </div>
  );
}