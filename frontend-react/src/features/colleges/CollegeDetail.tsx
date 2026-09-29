import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import { collegeService } from '@/api/collegeService';
import { departmentService } from '@/api/departmentService';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { StatusBadge } from '@/components/StatusBadge';
import { useAuth } from '@/features/auth/AuthContext';

export const CollegeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: collegeRes, isLoading } = useQuery({
    queryKey: ['college', id],
    queryFn: () => collegeService.getById(Number(id)),
    enabled: !!id,
  });

  const { data: deptRes, isLoading: deptLoading } = useQuery({
    queryKey: ['collegeDepartments', id],
    queryFn: () => departmentService.getByCollege(Number(id), { page: 0, size: 100 }),
    enabled: !!id,
  });

  if (isLoading) return <LoadingSpinner />;
  const college = collegeRes?.data;
  if (!college) return <div>College not found</div>;
  const departments = deptRes?.data?.content || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4 mb-4">
        <button onClick={() => navigate('/colleges')} className="p-2 hover:bg-gray-100 rounded-full">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold flex-1">{college.name}</h1>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div><p className="text-sm text-gray-500">Code</p><p className="font-medium">{college.code}</p></div>
          <div><p className="text-sm text-gray-500">Status</p><StatusBadge status={college.isActive ? 'ACTIVE' : 'INACTIVE'} /></div>
          <div><p className="text-sm text-gray-500">Email</p><p className="font-medium">{college.email}</p></div>
          <div><p className="text-sm text-gray-500">Phone</p><p className="font-medium">{college.phone}</p></div>
          <div><p className="text-sm text-gray-500">Website</p><p className="font-medium text-blue-600 hover:underline"><a href={college.website} target="_blank" rel="noreferrer">{college.website}</a></p></div>
          <div><p className="text-sm text-gray-500">Established</p><p className="font-medium">{college.establishedYear}</p></div>
          <div className="col-span-1 md:col-span-2 lg:col-span-3">
            <p className="text-sm text-gray-500">Address</p>
            <p className="font-medium">{college.address}, {college.city}, {college.state}, {college.country} - {college.pincode}</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border mt-6">
        <h2 className="text-lg font-semibold mb-4">Associated Departments</h2>
        {deptLoading ? <LoadingSpinner /> : (
          departments.length ? (
            <ul className="divide-y">
              {departments.map((dept: any) => (
                <li key={dept.id} className="py-3 flex justify-between items-center">
                  <div>
                    <p className="font-medium">{dept.name}</p>
                    <p className="text-sm text-gray-500">{dept.code}</p>
                  </div>
                  <StatusBadge status={dept.isActive ? 'ACTIVE' : 'INACTIVE'} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No departments found for this college.</p>
          )
        )}
      </div>
    </div>
  );
};
