import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { feeService } from '@/api/feeService';
import { PageHeader } from '@/components/PageHeader';
import { useAuth } from '@/features/auth/AuthContext';

export const FeeManagement: React.FC = () => {
  const { hasRole } = useAuth() as any;

  return (
    <div className="space-y-6">
      <PageHeader title="Fee Management" />
      {hasRole('STUDENT') ? <StudentFeeSummary /> : <div>Admin Fee Views</div>}
    </div>
  );
};

const StudentFeeSummary = () => {
  const { user } = useAuth() as any;
  const { data: summary } = useQuery({
    queryKey: ['fee-summary', (user as any)?.userId || (user as any)?.id],
    queryFn: () => feeService.getStudentSummary((user as any)?.userId || (user as any)?.id!).then((res: any) => res.data),
    enabled: !!((user as any)?.userId || (user as any)?.id)
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="border p-4 rounded shadow bg-blue-50">
        <h3 className="text-gray-600">Total Fees</h3>
        <p className="text-2xl font-bold">${summary?.totalFees || 0}</p>
      </div>
      <div className="border p-4 rounded shadow bg-green-50">
        <h3 className="text-gray-600">Paid</h3>
        <p className="text-2xl font-bold">${summary?.paidFees || 0}</p>
      </div>
      <div className="border p-4 rounded shadow bg-red-50">
        <h3 className="text-gray-600">Pending</h3>
        <p className="text-2xl font-bold">${summary?.pendingFees || 0}</p>
      </div>
    </div>
  );
};
