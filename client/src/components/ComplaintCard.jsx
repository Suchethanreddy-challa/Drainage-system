import React from 'react';
import { Calendar, MapPin, Eye, CheckSquare } from 'lucide-react';
import StatusBadge from './StatusBadge';

export default function ComplaintCard({ complaint, onViewDetails }) {
  const { complaintId, status, description, address, area, photo, createdAt } = complaint;

  const formattedDate = new Date(createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="card hover:translate-y-[-4px] transition-all duration-300 flex flex-col justify-between h-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
      <div>
        <div className="flex items-center justify-between mb-4">
          <span className="font-mono text-sm font-bold text-blue-900 dark:text-teal-400">{complaintId}</span>
          <StatusBadge status={status} />
        </div>

        {photo ? (
          <div className="relative h-44 rounded-lg overflow-hidden mb-4 bg-slate-100 dark:bg-slate-900 border border-slate-100 dark:border-slate-700">
            <img 
              src={photo} 
              alt="Drainage leakage issue" 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://images.unsplash.com/photo-1542060748-10c28b629f6f?q=80&w=600&auto=format&fit=crop';
              }}
            />
          </div>
        ) : (
          <div className="relative h-44 rounded-lg overflow-hidden mb-4 bg-slate-100 dark:bg-slate-700/50 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 border border-dashed border-slate-300 dark:border-slate-600">
            <MapPin className="h-8 w-8 mb-2" />
            <span className="text-xs font-semibold">No Photo Uploaded</span>
          </div>
        )}

        <h5 className="font-semibold text-slate-900 dark:text-slate-100 mb-2 truncate">{area}</h5>
        
        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 mb-4">
          {description}
        </p>
      </div>

      <div className="border-t border-slate-100 dark:border-slate-700/50 pt-4 mt-auto">
        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-3">
          <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
          <span className="truncate">{address}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500">
            <Calendar className="h-3.5 w-3.5" />
            <span>{formattedDate}</span>
          </div>

          <button 
            onClick={() => onViewDetails(complaint)}
            className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-900 hover:bg-blue-100 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600 rounded-md text-xs font-bold transition-all"
          >
            <Eye className="h-3.5 w-3.5" />
            View
          </button>
        </div>
      </div>
    </div>
  );
}
