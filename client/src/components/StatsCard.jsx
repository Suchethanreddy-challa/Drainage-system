import React from 'react';

export default function StatsCard({ icon: Icon, title, value, colorClass = 'text-blue-900', bgColorClass = 'bg-blue-50 dark:bg-blue-950/20' }) {
  return (
    <div className="glass-card hover:translate-y-[-4px] transition-all duration-300 p-6 flex items-center justify-between">
      <div>
        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{title}</p>
        <h4 className={`text-3xl font-extrabold mt-2 ${colorClass}`}>{value}</h4>
      </div>
      <div className={`p-4 rounded-xl ${bgColorClass} shrink-0`}>
        <Icon className={`h-7 w-7 ${colorClass}`} />
      </div>
    </div>
  );
}
