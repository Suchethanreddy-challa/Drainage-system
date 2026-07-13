import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { complaintAPI } from '../services/api';
import StatsCard from '../components/StatsCard';
import { FileText, CheckCircle2, Clock, Users, ArrowRight, ShieldAlert, Sparkles, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';

export default function HomePage() {
  const { isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const [stats, setStats] = useState({
    total: 0,
    resolved: 0,
    pending: 0,
    activeUsers: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await complaintAPI.getStats();
        if (res.data.success) {
          setStats(res.data.stats);
        }
      } catch (err) {
        console.error('Error fetching home page stats:', err);
        // Fallback stats
        setStats({
          total: 1240,
          resolved: 980,
          pending: 260,
          activeUsers: 450
        });
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-950 text-white py-24 px-4 sm:px-6 lg:px-8">
        {/* Animated Background Canvas Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-950 via-slate-950 to-slate-950 opacity-90"></div>
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        
        {/* Decorative Glowing Orbs */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-float delay-300"></div>

        <div className="relative max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Hero Details */}
          <div className="space-y-6 text-center lg:text-left animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-500/10 text-teal-400 border border-teal-500/20 rounded-full text-xs font-bold tracking-wider uppercase">
              <Sparkles className="h-3.5 w-3.5" /> {t('hero_badge')}
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
              {t('hero_title_1')} <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-teal-400 via-orange-400 to-amber-300 bg-clip-text text-transparent">
                {t('hero_title_2')}
              </span>
            </h1>

            <p className="text-lg text-slate-400 max-w-xl mx-auto lg:mx-0">
              {t('hero_desc')}
            </p>

            <div className="flex flex-wrap justify-center lg:justify-start gap-4">
              {isAuthenticated ? (
                <Link to="/report" className="px-8 py-4 bg-teal-500 hover:bg-teal-600 text-white font-bold rounded-xl shadow-lg shadow-teal-500/20 transition-all flex items-center gap-2">
                  <ShieldAlert className="h-5 w-5" /> {t('hero_report_btn')} <ArrowRight className="h-5 w-5" />
                </Link>
              ) : (
                <Link to="/login" className="px-8 py-4 bg-teal-500 hover:bg-teal-600 text-white font-bold rounded-xl shadow-lg shadow-teal-500/20 transition-all flex items-center gap-2">
                  {t('hero_get_started')} <ArrowRight className="h-5 w-5" />
                </Link>
              )}
              <Link to="/track" className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl border border-slate-700 hover:border-slate-600 transition-all">
                {t('hero_track_btn')}
              </Link>
            </div>
          </div>

          {/* Map Illustration */}
          <div className="relative flex justify-center lg:justify-end animate-fade-in-up delay-200">
            <div className="w-full max-w-lg aspect-square relative rounded-3xl overflow-hidden glass-card border border-white/10 shadow-2xl flex items-center justify-center p-6 bg-slate-900/50">
              
              {/* Map Graphic overlay */}
              <div className="absolute inset-0 bg-cover bg-center opacity-30 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=800&auto=format&fit=crop')]"></div>
              
              {/* City Map simulation styling */}
              <div className="relative w-full h-full border border-teal-500/20 rounded-2xl bg-slate-950/70 p-4 flex flex-col justify-between overflow-hidden">
                <div className="absolute top-1/4 left-1/3 w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
                <div className="absolute top-1/4 left-1/3 w-2 h-2 bg-red-500 rounded-full"></div>
                <div className="absolute top-1/2 left-2/3 w-2 h-2 bg-orange-500 rounded-full animate-ping"></div>
                <div className="absolute top-1/2 left-2/3 w-2 h-2 bg-orange-500 rounded-full"></div>
                <div className="absolute top-2/3 left-1/4 w-2 h-2 bg-teal-400 rounded-full"></div>
                <div className="absolute top-2/3 left-1/4 w-2 h-2 bg-teal-400 rounded-full"></div>

                <div className="flex justify-between items-center bg-slate-900/90 border border-white/10 rounded-xl p-3 z-10 backdrop-blur-md">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-red-500/20 text-red-500 rounded-lg">
                      <ShieldAlert className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">{t('hero_overflow')}</h4>
                      <p className="text-[10px] text-slate-400">{t('hero_sector4')}</p>
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 bg-red-500/10 text-red-400 rounded-full font-bold uppercase tracking-wider">{t('hero_pending')}</span>
                </div>

                <div className="flex justify-between items-center bg-slate-900/90 border border-white/10 rounded-xl p-3 z-10 backdrop-blur-md self-end mt-auto w-4/5">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-teal-500/20 text-teal-400 rounded-lg">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">{t('hero_resolved_card')}</h4>
                      <p className="text-[10px] text-slate-400">{t('hero_sector1')}</p>
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 bg-teal-500/10 text-teal-400 rounded-full font-bold uppercase tracking-wider">{t('hero_resolved')}</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-slate-50 dark:bg-slate-900/50 -translate-y-6 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(n => (
                <div key={n} className="skeleton h-24 rounded-2xl"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatsCard icon={FileText} title={t('stat_total')} value={stats.total} colorClass="text-blue-900 dark:text-blue-400" bgColorClass="bg-blue-50 dark:bg-blue-950/30" />
              <StatsCard icon={CheckCircle2} title={t('stat_resolved')} value={stats.resolved} colorClass="text-teal-600 dark:text-teal-400" bgColorClass="bg-teal-50 dark:bg-teal-950/30" />
              <StatsCard icon={Clock} title={t('stat_pending')} value={stats.pending} colorClass="text-orange-500 dark:text-orange-400" bgColorClass="bg-orange-50 dark:bg-orange-950/30" />
              <StatsCard icon={Users} title={t('stat_users')} value={stats.activeUsers} colorClass="text-indigo-600 dark:text-indigo-400" bgColorClass="bg-indigo-50 dark:bg-indigo-950/30" />
            </div>
          )}
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-16 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="section-title">{t('how_title')}</h2>
            <p className="section-subtitle">{t('how_desc')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center p-6 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
              <span className="w-12 h-12 flex items-center justify-center bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400 rounded-xl font-bold text-lg mb-6 shadow-sm">1</span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{t('step1_title')}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">{t('step1_desc')}</p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center p-6 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
              <span className="w-12 h-12 flex items-center justify-center bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400 rounded-xl font-bold text-lg mb-6 shadow-sm">2</span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{t('step2_title')}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">{t('step2_desc')}</p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center p-6 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
              <span className="w-12 h-12 flex items-center justify-center bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 rounded-xl font-bold text-lg mb-6 shadow-sm">3</span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{t('step3_title')}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">{t('step3_desc')}</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
