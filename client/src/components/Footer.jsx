import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Phone, Mail, MapPin, Globe, Share2, ShieldAlert, Award } from 'lucide-react';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-slate-900 text-slate-300 dark:bg-slate-950 border-t border-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Logo & Description */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2 text-white font-extrabold text-2xl tracking-tight">
              <span className="p-1.5 bg-teal-500/20 text-teal-400 rounded-lg">
                <ShieldAlert className="h-6 w-6" />
              </span>
              <span className="bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">SDMS</span>
            </div>
            <p className="text-sm text-slate-400 max-w-sm">
              {t('footer_desc')}
            </p>
            <div className="flex gap-4">
              <a href="#" className="p-2 bg-slate-800 hover:bg-teal-600 hover:text-white rounded-full transition-all">
                <Globe className="h-4 w-4" />
              </a>
              <a href="#" className="p-2 bg-slate-800 hover:bg-teal-600 hover:text-white rounded-full transition-all">
                <Share2 className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">{t('footer_quick')}</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/" className="hover:text-teal-400 transition-all">{t('footer_home')}</Link></li>
              <li><Link to="/map" className="hover:text-teal-400 transition-all">{t('footer_map')}</Link></li>
              <li><Link to="/track" className="hover:text-teal-400 transition-all">{t('footer_track')}</Link></li>
              <li><Link to="/report" className="hover:text-teal-400 transition-all">{t('footer_report')}</Link></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">{t('footer_contact')}</h3>
            <ul className="space-y-3.5 text-sm">
              <li className="flex gap-3 items-start">
                <MapPin className="h-5 w-5 text-teal-400 shrink-0 mt-0.5" />
                <span className="text-slate-400">{t('footer_address')}</span>
              </li>
              <li className="flex gap-3 items-center">
                <Phone className="h-4 w-4 text-teal-400 shrink-0" />
                <span className="text-slate-400">{t('footer_toll')}</span>
              </li>
              <li className="flex gap-3 items-center">
                <Mail className="h-4 w-4 text-teal-400 shrink-0" />
                <span className="text-slate-400">support@smartdrainage.gov</span>
              </li>
            </ul>
          </div>

        </div>

        <hr className="border-slate-800 my-8" />

        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>{t('footer_copyright').replace('{year}', new Date().getFullYear())}</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-teal-400 transition-all">{t('footer_privacy')}</a>
            <a href="#" className="hover:text-teal-400 transition-all">{t('footer_terms')}</a>
            <span className="flex items-center gap-1"><Award className="h-3.5 w-3.5 text-teal-400" /> {t('footer_govt')}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
