import React, { forwardRef } from 'react';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  label: string;
  error?: string;
  as?: 'input' | 'textarea';
}

export const FormInput = forwardRef<HTMLInputElement | HTMLTextAreaElement, FormInputProps>(
  ({ label, error, as = 'input', className = '', ...props }, ref) => {
    const Component = as;
    return (
      <div className="w-full">
        <label className="block text-sm font-medium text-slate-700 mb-1">
          {label}
        </label>
        <Component
          ref={ref as any}
          className={`block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2 ${error ? 'border-red-300' : ''} ${className}`}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    );
  }
);
FormInput.displayName = 'FormInput';
