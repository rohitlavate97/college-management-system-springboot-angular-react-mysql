import React from 'react';

interface StatusBadgeProps {
  status: string;
  colorMap?: Record<string, string>;
}

export function StatusBadge({ status, colorMap }: StatusBadgeProps) {
  const defaultColors: Record<string, string> = {
    ACTIVE: 'bg-green-100 text-green-800 border-green-200',
    INACTIVE: 'bg-slate-100 text-slate-800 border-slate-200',
    SUSPENDED: 'bg-red-100 text-red-800 border-red-200',
    PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    APPROVED: 'bg-green-100 text-green-800 border-green-200',
    REJECTED: 'bg-red-100 text-red-800 border-red-200',
    COMPLETED: 'bg-blue-100 text-blue-800 border-blue-200'
  };

  const colors = colorMap || defaultColors;
  const normalizedStatus = status?.toUpperCase() || 'UNKNOWN';
  const colorClass = colors[normalizedStatus] || 'bg-slate-100 text-slate-800 border-slate-200';

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${colorClass}`}>
      {status?.replace(/_/g, ' ') || 'Unknown'}
    </span>
  );
}
