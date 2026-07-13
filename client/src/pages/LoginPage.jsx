import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Lock, Mail, AlertCircle, ArrowRight, Shield } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const { login } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError(t('report_err_fields'));
      return;
    }
    setError('');
    setLoading(true);
    try {
      const user = await login(email, password);
      toast.success(`Welcome back, ${user.name}!`);
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/profile');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Login failed. Please verify credentials.');
      toast.error('Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-stretch">
      
      {/* Left Form Panel */}
      <div className="w-full lg:w-[45%] flex items-center justify-center p-8 sm:p-12 md:p-16 bg-white dark:bg-slate-900 transition-colors duration-300">
        <div className="w-full max-w-md space-y-8 animate-fade-in-up">
          
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">{t('login_title')}</h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              {t('login_subtitle')}
            </p>
          </div>

          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 rounded-xl flex gap-3 text-red-700 dark:text-red-400 text-sm font-semibold animate-scale-in">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">{t('login_email')}</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email" 
                  className="w-full pl-11 pr-4 py-3 form-input"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">{t('login_password')}</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password" 
                  className="w-full pl-11 pr-4 py-3 form-input"
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-4 px-6 bg-gradient-to-r from-blue-900 to-blue-800 hover:from-blue-850 hover:to-blue-800 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 text-base disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : t('login_btn')} <ArrowRight className="h-5 w-5" />
            </button>
          </form>

          <div className="text-center text-sm text-slate-500 dark:text-slate-400">
            {t('login_no_account')}{' '}
            <Link to="/register" className="font-bold text-teal-600 dark:text-teal-400 hover:underline">{t('login_signup_link')}</Link>
          </div>

          <hr className="border-slate-100 dark:border-slate-800" />

          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-950 text-blue-900 dark:text-blue-400 rounded-lg">
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800 dark:text-white">Admin Credentials</h4>
                <p className="text-[10px] text-slate-400">admin@smartdrainage.gov / admin123</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Right Graphic Panel */}
      <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden bg-slate-950 p-16 flex-col justify-between text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-950 via-slate-950 to-slate-950 opacity-90"></div>
        <div className="absolute inset-0 opacity-15 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:32px_32px]"></div>

        <div className="relative flex items-center gap-2 text-white font-extrabold text-2xl tracking-tight">
          <span className="p-1.5 bg-teal-500/20 text-teal-400 rounded-lg">
            <Shield className="h-6 w-6" />
          </span>
          <span>SDMS</span>
        </div>

        <div className="relative space-y-6 max-w-lg z-10 my-auto">
          <blockquote className="text-2xl font-semibold leading-relaxed">
            "An efficient municipal drainage tracking dashboard connecting citizens directly to local engineers for a healthier, garbage-free neighborhood."
          </blockquote>
          <div>
            <h4 className="font-bold text-teal-400">Department of Civic Services</h4>
            <p className="text-sm text-slate-400">Smart Drainage Management Initiative</p>
          </div>
        </div>

        <div className="relative flex gap-6 text-xs text-slate-500 z-10 border-t border-slate-900 pt-6">
          <span>© {new Date().getFullYear()} Government Portal</span>
          <span>Security Certified</span>
        </div>
      </div>

    </div>
  );
}
