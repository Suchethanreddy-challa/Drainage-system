import React from 'react';
import { Search, Filter } from 'lucide-react';

const AREAS = [
  'Sector 1 - Downtown',
  'Sector 2 - Market Area',
  'Sector 3 - Industrial Zone',
  'Sector 4 - Residential Colony',
  'Sector 5 - Old City',
  'Sector 6 - University Area',
  'Sector 7 - Hospital Road',
  'Sector 8 - Railway Station',
  'Sector 9 - Bus Stand',
  'Sector 10 - Lake View'
];

export default function SearchFilter({ search, status, area, onSearchChange, onStatusChange, onAreaChange }) {
  return (
    <div className="card bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-5 mb-8 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
        
        {/* Search */}
        <div className="md:col-span-2 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input 
            type="text" 
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by Complaint ID, Address, or Description..." 
            className="w-full pl-11 pr-4 py-2.5 border-2 border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:border-teal-500 dark:focus:border-teal-500 focus:bg-white dark:focus:bg-slate-800 transition-all font-medium text-sm"
          />
        </div>

        {/* Status Filter */}
        <div className="relative">
          <select 
            value={status}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full px-4 py-2.5 border-2 border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:border-teal-500 dark:focus:border-teal-500 focus:bg-white dark:focus:bg-slate-800 transition-all font-semibold text-sm cursor-pointer appearance-none"
          >
            <option value="all">All Statuses</option>
            <option value="Submitted">Submitted</option>
            <option value="Under Review">Under Review</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>
          <Filter className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
        </div>

        {/* Area Filter */}
        <div className="relative">
          <select 
            value={area}
            onChange={(e) => onAreaChange(e.target.value)}
            className="w-full px-4 py-2.5 border-2 border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:border-teal-500 dark:focus:border-teal-500 focus:bg-white dark:focus:bg-slate-800 transition-all font-semibold text-sm cursor-pointer appearance-none"
          >
            <option value="all">All Areas</option>
            {AREAS.map((a, idx) => (
              <option key={idx} value={a}>{a}</option>
            ))}
          </select>
          <Filter className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
        </div>

      </div>
    </div>
  );
}
