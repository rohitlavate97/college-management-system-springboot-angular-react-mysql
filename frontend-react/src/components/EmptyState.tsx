import React from 'react';
import { FileQuestion } from 'lucide-react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="text-center p-12 bg-white rounded-lg border border-slate-200 border-dashed">
      <div className="mx-auto flex h-12 w-12 items-center justify-center text-slate-400">
        {icon || <FileQuestion className="h-12 w-12" />}
      </div>
      <h3 className="mt-2 text-sm font-semibold text-slate-900">{title}</h3>
      {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
