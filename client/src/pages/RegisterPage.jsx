import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { User, Lock, Mail, Phone, MapPin, AlertCircle, ArrowRight, Shield } from 'lucide-react';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const { register } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, phone, address, password, confirmPassword } = formData;

    if (!name || !email || !password) {
      setError(t('report_err_fields'));
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      await register({ name, email, phone, address, password });
      toast.success('Registration successful! Welcome to SDMS.');
      navigate('/profile');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Registration failed. Try a different email.');
      toast.error('Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-stretch">
      
      {/* Left Form Panel */}
      <div className="w-full lg:w-[45%] flex items-center justify-center p-8 sm:p-12 bg-white dark:bg-slate-900 transition-colors duration-300">
        <div className="w-full max-w-md space-y-6 animate-fade-in-up">
          
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">{t('register_title')}</h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              {t('register_subtitle')}
            </p>
          </div>

          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 rounded-xl flex gap-3 text-red-700 dark:text-red-400 text-sm font-semibold animate-scale-in">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            
            <div className="form-group mb-0">
              <label className="form-label">{t('register_name')}</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter full name" 
                  className="w-full pl-10 pr-4 py-2.5 form-input"
                  required
                />
              </div>
            </div>

            <div className="form-group mb-0">
              <label className="form-label">{t('register_email')}</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email address" 
                  className="w-full pl-10 pr-4 py-2.5 form-input"
                  required
                />
              </div>
            </div>

            <div className="form-group mb-0">
              <label className="form-label">{t('register_phone')}</label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input 
                  type="text" 
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number" 
                  className="w-full pl-10 pr-4 py-2.5 form-input"
                />
              </div>
            </div>

            <div className="form-group mb-0">
              <label className="form-label">Residential Address</label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input 
                  type="text" 
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter address details" 
                  className="w-full pl-10 pr-4 py-2.5 form-input"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="form-group mb-0">
                <label className="form-label">{t('register_password')}</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input 
                    type="password" 
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Password" 
                    className="w-full pl-10 pr-4 py-2.5 form-input"
                    required
                  />
                </div>
              </div>

              <div className="form-group mb-0">
                <label className="form-label">{t('register_confirm')}</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input 
                    type="password" 
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm" 
                    className="w-full pl-10 pr-4 py-2.5 form-input"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="flex items-start text-sm pt-2">
              <label className="flex items-start gap-2.5 text-slate-500 dark:text-slate-400 font-medium cursor-pointer">
                <input type="checkbox" className="rounded text-teal-600 focus:ring-teal-500 h-4 w-4 mt-0.5 bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700" required />
                <span>I agree to the SDMS privacy policies and civic terms.</span>
              </label>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-3.5 px-6 bg-gradient-to-r from-blue-900 to-blue-800 hover:from-blue-850 hover:to-blue-800 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 text-base disabled:opacity-50"
            >
              {loading ? 'Creating Account...' : t('register_btn')} <ArrowRight className="h-5 w-5" />
            </button>
          </form>

          <div className="text-center text-sm text-slate-500 dark:text-slate-400">
            {t('register_has_account')}{' '}
            <Link to="/login" className="font-bold text-teal-600 dark:text-teal-400 hover:underline">{t('register_login_link')}</Link>
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
          <h3 className="text-3xl font-extrabold text-teal-400 leading-tight">Help Us Keep the Streets Drainage Free</h3>
          <p className="text-slate-300 text-base">
            SDMS is designed to automate responses for roadway leaks, structural blockages, and overflow hazards. Join other active citizens cleaning the city.
          </p>
        </div>

        <div className="relative flex gap-6 text-xs text-slate-500 z-10 border-t border-slate-900 pt-6">
          <span>© {new Date().getFullYear()} Government Portal</span>
          <span>Security Certified</span>
        </div>
      </div>

    </div>
  );
}
