import React from 'react';
import { AlertCircle, Clock, Hourglass, CheckCircle2 } from 'lucide-react';

export default function StatusBadge({ status }) {
  const getBadgeConfig = () => {
    switch (status) {
      case 'Submitted':
        return {
          icon: AlertCircle,
          className: 'status-submitted',
          text: 'Submitted'
        };
      case 'Under Review':
        return {
          icon: Hourglass,
          className: 'status-review',
          text: 'Under Review'
        };
      case 'In Progress':
        return {
          icon: Clock,
          className: 'status-progress',
          text: 'In Progress'
        };
      case 'Resolved':
        return {
          icon: CheckCircle2,
          className: 'status-resolved',
          text: 'Resolved'
        };
      default:
        return {
          icon: AlertCircle,
          className: 'bg-slate-100 text-slate-700',
          text: status || 'Unknown'
        };
    }
  };

  const { icon: Icon, className, text } = getBadgeConfig();

  return (
    <span className={`status-badge ${className} animate-scale-in`}>
      <Icon className="h-3.5 w-3.5" />
      {text}
    </span>
  );
}
