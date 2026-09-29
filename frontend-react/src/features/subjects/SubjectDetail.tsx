import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import { subjectService } from '@/api/subjectService';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { StatusBadge } from '@/components/StatusBadge';

export const SubjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: res, isLoading } = useQuery({
    queryKey: ['subject', id],
    queryFn: () => subjectService.getById(Number(id)),
    enabled: !!id,
  });

  if (isLoading) return <LoadingSpinner />;
  const subject = res?.data;
  if (!subject) return <div>Subject not found</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4 mb-4">
        <button onClick={() => navigate('/subjects')} className="p-2 hover:bg-gray-100 rounded-full">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold flex-1">{subject.name}</h1>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div><p className="text-sm text-gray-500">Code</p><p className="font-medium">{subject.code}</p></div>
          <div><p className="text-sm text-gray-500">Department ID</p><p className="font-medium">{subject.departmentId}</p></div>
          <div><p className="text-sm text-gray-500">Course ID</p><p className="font-medium">{subject.courseId}</p></div>
          <div><p className="text-sm text-gray-500">Semester</p><p className="font-medium">{subject.semester}</p></div>
          <div><p className="text-sm text-gray-500">Credits</p><p className="font-medium">{subject.credits}</p></div>
          <div><p className="text-sm text-gray-500">Type</p><p className="font-medium">{subject.subjectType}</p></div>
          <div><p className="text-sm text-gray-500">Status</p><StatusBadge status={subject.isActive ? 'ACTIVE' : 'INACTIVE'} /></div>
          <div className="md:col-span-2"><p className="text-sm text-gray-500">Description</p><p className="font-medium">{subject.description}</p></div>
        </div>
      </div>
    </div>
  );
};
