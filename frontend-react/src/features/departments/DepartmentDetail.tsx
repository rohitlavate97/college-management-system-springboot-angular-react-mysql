import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import { departmentService } from '@/api/departmentService';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { StatusBadge } from '@/components/StatusBadge';

export const DepartmentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: res, isLoading } = useQuery({
    queryKey: ['department', id],
    queryFn: () => departmentService.getById(Number(id)),
    enabled: !!id,
  });

  if (isLoading) return <LoadingSpinner />;
  const dept = res?.data;
  if (!dept) return <div>Department not found</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4 mb-4">
        <button onClick={() => navigate('/departments')} className="p-2 hover:bg-gray-100 rounded-full">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold flex-1">{dept.name}</h1>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div><p className="text-sm text-gray-500">Code</p><p className="font-medium">{dept.code}</p></div>
          <div><p className="text-sm text-gray-500">Status</p><StatusBadge status={dept.isActive ? 'ACTIVE' : 'INACTIVE'} /></div>
          <div><p className="text-sm text-gray-500">College ID</p><p className="font-medium">{dept.collegeId}</p></div>
          <div><p className="text-sm text-gray-500">HOD ID</p><p className="font-medium">{dept.hodId || 'Not Assigned'}</p></div>
          <div className="md:col-span-2"><p className="text-sm text-gray-500">Description</p><p className="font-medium">{dept.description}</p></div>
        </div>
      </div>
    </div>
  );
};
