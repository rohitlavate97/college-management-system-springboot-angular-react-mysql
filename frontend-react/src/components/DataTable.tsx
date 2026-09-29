import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

export interface Column<T> {
  header: string;
  accessor: keyof T | string;
  render?: (item: T) => React.ReactNode;
  sortable?: boolean;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onSort?: (field: string) => void;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
  emptyMessage?: string;
}

export function DataTable<T extends { id?: number | string }>({
  columns,
  data,
  loading = false,
  page,
  totalPages,
  onPageChange,
  onSort,
  sortBy,
  sortDir,
  emptyMessage = "No records found"
}: DataTableProps<T>) {
  return (
    <div className="bg-white shadow-sm border border-slate-200 rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  scope="col"
                  className={`px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider ${col.sortable ? 'cursor-pointer select-none hover:bg-slate-100' : ''}`}
                  onClick={() => col.sortable && onSort && onSort(col.accessor as string)}
                >
                  <div className="flex items-center space-x-1">
                    <span>{col.header}</span>
                    {col.sortable && sortBy === col.accessor && (
                      sortDir === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {loading ? (
              [...Array(5)].map((_, i) => (
                <tr key={`skel-${i}`}>
                  {columns.map((_, j) => (
                    <td key={`skel-td-${j}`} className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-slate-200 rounded animate-pulse w-3/4"></div>
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-8 text-center text-slate-500">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, i) => (
                <tr key={row.id || i} className="hover:bg-slate-50 transition-colors">
                  {columns.map((col, j) => (
                    <td key={j} className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                      {col.render ? col.render(row) : (row[col.accessor as keyof T] as React.ReactNode)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {totalPages > 1 && (
        <div className="bg-white px-4 py-3 border-t border-slate-200 flex items-center justify-between sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => onPageChange(page - 1)}
              disabled={page === 0}
              className="relative inline-flex items-center px-4 py-2 border border-slate-300 text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages - 1}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-slate-300 text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-slate-700">
                Page <span className="font-medium">{page + 1}</span> of <span className="font-medium">{totalPages}</span>
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => onPageChange(page - 1)}
                  disabled={page === 0}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-slate-300 bg-white text-sm font-medium text-slate-500 hover:bg-slate-50 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => onPageChange(page + 1)}
                  disabled={page >= totalPages - 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-slate-300 bg-white text-sm font-medium text-slate-500 hover:bg-slate-50 disabled:opacity-50"
                >
                  Next
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
