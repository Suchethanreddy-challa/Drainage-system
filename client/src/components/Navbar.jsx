import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { Menu, X, Sun, Moon, LogOut, User, Shield, Map, FileText, AlertTriangle, CheckSquare, Globe } from 'lucide-react';

export default function Navbar() {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { language, changeLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  // Close language dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (langRef.current && !langRef.current.contains(e.target)) {
        setLangOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const LANGS = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'hi', label: 'हिंदी', flag: '🇮🇳' },
    { code: 'te', label: 'తెలుగు', flag: '🇮🇳' },
  ];

  const currentLang = LANGS.find(l => l.code === language) || LANGS[0];

  const isActive = (path) => location.pathname === path;
  const linkClass = (path) => `
    flex items-center gap-2 px-3 py-2 rounded-md text-sm font-semibold transition-all duration-200
    ${isActive(path) 
      ? 'bg-blue-900 text-white dark:bg-teal-600' 
      : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'}
  `;

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 dark:bg-slate-900/80 dark:border-slate-800 transition-colors duration-300 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 text-blue-900 dark:text-teal-400 font-extrabold text-xl tracking-tight">
              <span className="p-1.5 bg-blue-900 text-teal-400 dark:bg-teal-500/20 dark:text-teal-400 rounded-lg">
                <AlertTriangle className="h-6 w-6 animate-pulse" />
              </span>
              <span className="hidden sm:block text-gradient">SDMS</span>
              <span className="sm:hidden">SDMS</span>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-4">
            <Link to="/" className={linkClass('/')}>{t('nav_home')}</Link>
            <Link to="/map" className={linkClass('/map')}>
              <Map className="h-4 w-4" /> {t('nav_map')}
            </Link>
            <Link to="/track" className={linkClass('/track')}>
              <FileText className="h-4 w-4" /> {t('nav_track')}
            </Link>
            
            {isAuthenticated && !isAdmin && (
              <Link to="/report" className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-md text-sm font-semibold hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-md">
                <AlertTriangle className="h-4 w-4" /> {t('nav_report')}
              </Link>
            )}

            {isAuthenticated && isAdmin && (
              <Link to="/admin/dashboard" className={linkClass('/admin/dashboard')}>
                <Shield className="h-4 w-4" /> {t('nav_admin')}
              </Link>
            )}
          </div>

          {/* Right Side Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {/* Language Switcher SELECT */}
            <div className="relative">
              <select
                value={language}
                onChange={(e) => changeLanguage(e.target.value)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg cursor-pointer focus:outline-none focus:ring-1 focus:ring-teal-500"
                aria-label="Change language"
              >
                <option value="en">🇬🇧 English</option>
                <option value="hi">🇮🇳 हिंदी</option>
                <option value="te">🇮🇳 తెలుగు</option>
              </select>
            </div>

            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme}
              className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all"
              aria-label="Toggle Theme"
            >
              {isDark ? <Sun className="h-5 w-5 text-amber-400" /> : <Moon className="h-5 w-5 text-slate-700" />}
            </button>

            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link to="/profile" className="flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-blue-900 dark:text-slate-300 dark:hover:text-teal-400">
                  <User className="h-5 w-5 p-1 bg-slate-200 dark:bg-slate-800 rounded-full" />
                  <span>{user.name.split(' ')[0]}</span>
                </Link>
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-md transition-all border border-transparent hover:border-red-200"
                >
                  <LogOut className="h-4 w-4" /> {t('nav_logout')}
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-blue-900 dark:text-slate-300 dark:hover:text-white transition-all">
                  {t('nav_signin')}
                </Link>
                <Link to="/register" className="px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white rounded-md text-sm font-semibold transition-all shadow-md">
                  {t('nav_signup')}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            {/* Mobile Language SELECT */}
            <select
              value={language}
              onChange={(e) => changeLanguage(e.target.value)}
              className="px-2 py-1 text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg cursor-pointer focus:outline-none"
              aria-label="Change language"
            >
              <option value="en">🇬🇧</option>
              <option value="hi">🇮🇳 हिंदी</option>
              <option value="te">🇮🇳 తెలుగు</option>
            </select>

            <button 
              onClick={toggleTheme}
              className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 rounded-full transition-all"
            >
              {isDark ? <Sun className="h-5 w-5 text-amber-400" /> : <Moon className="h-5 w-5" />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden animate-fade-in-down border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-2 pb-4 space-y-2">
          <Link to="/" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">{t('nav_home')}</Link>
          <Link to="/map" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">{t('nav_map')}</Link>
          <Link to="/track" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">{t('nav_track')}</Link>
          
          {isAuthenticated && !isAdmin && (
            <Link to="/report" onClick={() => setIsOpen(false)} className="block px-3 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-md text-base font-medium">{t('nav_report')}</Link>
          )}

          {isAuthenticated && isAdmin && (
            <Link to="/admin/dashboard" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">{t('nav_admin')}</Link>
          )}

          <hr className="border-slate-200 dark:border-slate-800 my-2" />

          {isAuthenticated ? (
            <div className="space-y-2 pt-2">
              <div className="flex items-center gap-2 px-3">
                <User className="h-5 w-5 text-slate-500" />
                <span className="text-slate-800 dark:text-slate-200 font-semibold">{user.name}</span>
              </div>
              <Link to="/profile" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">{t('nav_profile')}</Link>
              <button 
                onClick={handleLogout}
                className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
              >
                {t('nav_logout')}
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2 pt-2">
              <Link to="/login" onClick={() => setIsOpen(false)} className="text-center px-4 py-2 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-md text-base font-medium">
                {t('nav_signin')}
              </Link>
              <Link to="/register" onClick={() => setIsOpen(false)} className="text-center px-4 py-2 bg-blue-900 text-white rounded-md text-base font-medium">
                {t('nav_signup')}
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
