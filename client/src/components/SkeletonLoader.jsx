import React from 'react';

export default function SkeletonLoader({ type = 'card', count = 1 }) {
  const skeletons = Array.from({ length: count });

  if (type === 'card') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {skeletons.map((_, i) => (
          <div key={i} className="card bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-6 flex flex-col justify-between h-96">
            <div>
              <div className="flex justify-between items-center mb-4">
                <div className="skeleton h-5 w-24"></div>
                <div className="skeleton h-6 w-20 rounded-full"></div>
              </div>
              <div className="skeleton skeleton-card rounded-lg mb-4"></div>
              <div className="skeleton skeleton-title"></div>
              <div className="skeleton skeleton-text"></div>
              <div className="skeleton skeleton-text"></div>
            </div>
            <div className="border-t border-slate-100 dark:border-slate-700/50 pt-4">
              <div className="skeleton h-4 w-3/4 mb-3"></div>
              <div className="flex justify-between items-center">
                <div className="skeleton h-4 w-1/3"></div>
                <div className="skeleton h-7 w-16"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'stats') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {skeletons.map((_, i) => (
          <div key={i} className="card bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-6 flex items-center justify-between">
            <div className="space-y-3 w-1/2">
              <div className="skeleton h-3 w-3/4"></div>
              <div className="skeleton h-8 w-1/2"></div>
            </div>
            <div className="skeleton skeleton-circle"></div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'table') {
    return (
      <div className="space-y-4 w-full">
        <div className="skeleton h-12 w-full rounded-t-lg"></div>
        {skeletons.map((_, i) => (
          <div key={i} className="skeleton h-16 w-full"></div>
        ))}
      </div>
    );
  }

  return null;
}
