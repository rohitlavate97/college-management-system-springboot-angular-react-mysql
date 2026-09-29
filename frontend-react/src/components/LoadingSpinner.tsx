import React from 'react';

export function LoadingSpinner({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      {message && <p className="mt-2 text-sm text-slate-500">{message}</p>}
    </div>
  );
}
