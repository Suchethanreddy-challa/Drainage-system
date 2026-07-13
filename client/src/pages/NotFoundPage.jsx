import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="container py-24 flex flex-col items-center justify-center text-center space-y-6">
      <div className="inline-flex p-4 bg-teal-50 dark:bg-slate-800 text-teal-500 rounded-3xl border border-teal-100 dark:border-slate-700 animate-bounce">
        <ShieldAlert className="h-16 w-16" />
      </div>
      <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">Page Not Found</h2>
      <p className="text-slate-500 dark:text-slate-400 max-w-md">
        The page you are looking for does not exist or has been relocated by municipal administration.
      </p>
      <Link to="/" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-900 to-blue-800 text-white font-bold rounded-xl shadow-md hover:translate-y-[-1px] transition-all">
        <ArrowLeft className="h-4 w-4" /> Return to Home
      </Link>
    </div>
  );
}
