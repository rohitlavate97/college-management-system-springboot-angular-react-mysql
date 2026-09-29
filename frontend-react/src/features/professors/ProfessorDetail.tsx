import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import { professorService } from '@/api/professorService';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { StatusBadge } from '@/components/StatusBadge';

export const ProfessorDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: res, isLoading } = useQuery({
    queryKey: ['professor', id],
    queryFn: () => professorService.getById(Number(id)),
    enabled: !!id,
  });

  if (isLoading) return <LoadingSpinner />;
  const prof = res?.data;
  if (!prof) return <div>Professor not found</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4 mb-4">
        <button onClick={() => navigate('/professors')} className="p-2 hover:bg-gray-100 rounded-full">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold flex-1">{prof.firstName} {prof.lastName}</h1>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div><p className="text-sm text-gray-500">Employee ID</p><p className="font-medium">{prof.employeeId}</p></div>
          <div><p className="text-sm text-gray-500">Email</p><p className="font-medium">{prof.email}</p></div>
          <div><p className="text-sm text-gray-500">Phone</p><p className="font-medium">{prof.phone}</p></div>
          <div><p className="text-sm text-gray-500">Department ID</p><p className="font-medium">{prof.departmentId}</p></div>
          <div><p className="text-sm text-gray-500">Designation</p><p className="font-medium">{prof.designation}</p></div>
          <div><p className="text-sm text-gray-500">Qualification</p><p className="font-medium">{prof.qualification}</p></div>
          <div><p className="text-sm text-gray-500">Specialization</p><p className="font-medium">{prof.specialization}</p></div>
          <div><p className="text-sm text-gray-500">Joining Date</p><p className="font-medium">{prof.joiningDate}</p></div>
          <div><p className="text-sm text-gray-500">Status</p><StatusBadge status={prof.status as any} /></div>
        </div>
      </div>
    </div>
  );
};
