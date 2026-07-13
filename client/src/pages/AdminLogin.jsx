import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, AlertCircle, Shield, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@smartdrainage.gov');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login(email, password);
      if (user.role !== 'admin') {
        setError('Access denied. Admin role required.');
        toast.error('Unauthorized access.');
        return;
      }
      toast.success('Admin authentication verified!');
      navigate('/admin/dashboard');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Login failed. Please check admin credentials.');
      toast.error('Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-slate-900 text-white px-4 relative overflow-hidden">
      
      {/* Decorative Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-900/20 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-float delay-500"></div>

      <div className="w-full max-w-md space-y-6 relative z-10 animate-scale-in">
        
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 bg-teal-500/10 text-teal-400 border border-teal-500/20 rounded-2xl mb-2">
            <Shield className="h-8 w-8" />
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight">SDMS Admin Gateway</h2>
          <p className="text-sm text-slate-400">Authorized personnel secure login dashboard.</p>
        </div>

        {error && (
          <div className="p-4 bg-red-950/20 border border-red-900/50 rounded-xl flex gap-3 text-red-400 text-sm font-semibold animate-scale-in">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="card bg-slate-850 border-slate-700/60 p-6 space-y-5">
          
          <div className="form-group mb-0">
            <label className="form-label text-slate-300">Admin Email</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@smartdrainage.gov" 
                className="w-full pl-11 pr-4 py-3 form-input bg-slate-900 border-slate-800 text-white placeholder-slate-600 focus:border-teal-500"
                required
              />
            </div>
          </div>

          <div className="form-group mb-0">
            <label className="form-label text-slate-300">Security Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" 
                className="w-full pl-11 pr-4 py-3 form-input bg-slate-900 border-slate-800 text-white placeholder-slate-600 focus:border-teal-500"
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-3.5 px-6 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-650 hover:to-teal-600 text-white font-bold rounded-xl shadow-lg shadow-teal-500/10 transition-all flex items-center justify-center gap-2 text-base disabled:opacity-50"
          >
            {loading ? 'Authenticating Officer...' : 'Access Dashboard'} <ArrowRight className="h-5 w-5" />
          </button>
        </form>

        <p className="text-center text-xs text-slate-500">
          This system logs login timestamps and IP addresses for audit purposes.
        </p>

      </div>
    </div>
  );
}
