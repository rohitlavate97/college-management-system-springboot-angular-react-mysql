import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import { studentService } from '@/api/studentService';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { StatusBadge } from '@/components/StatusBadge';

export const StudentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'profile' | 'guardians' | 'enrollments'>('profile');

  const { data: res, isLoading } = useQuery({
    queryKey: ['student', id],
    queryFn: () => studentService.getById(Number(id)),
    enabled: !!id,
  });

  const { data: envRes, isLoading: enrollmentsLoading } = useQuery({
    queryKey: ['studentEnrollments', id],
    queryFn: () => studentService.getEnrollments(Number(id)),
    enabled: !!id && activeTab === 'enrollments',
  });

  if (isLoading) return <LoadingSpinner />;
  const student = res?.data;
  if (!student) return <div>Student not found</div>;
  const enrollments = envRes?.data || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4 mb-4">
        <button onClick={() => navigate('/students')} className="p-2 hover:bg-gray-100 rounded-full">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold flex-1">{student.firstName} {student.lastName}</h1>
        <StatusBadge status={student.status as any} />
      </div>

      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="flex border-b">
          <button className={`px-6 py-3 font-medium ${activeTab === 'profile' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`} onClick={() => setActiveTab('profile')}>Profile</button>
          <button className={`px-6 py-3 font-medium ${activeTab === 'guardians' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`} onClick={() => setActiveTab('guardians')}>Guardians</button>
          <button className={`px-6 py-3 font-medium ${activeTab === 'enrollments' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`} onClick={() => setActiveTab('enrollments')}>Enrollments</button>
        </div>

        <div className="p-6">
          {activeTab === 'profile' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div><p className="text-sm text-gray-500">Roll Number</p><p className="font-medium">{student.rollNumber}</p></div>
              <div><p className="text-sm text-gray-500">Registration Number</p><p className="font-medium">{student.registrationNumber}</p></div>
              <div><p className="text-sm text-gray-500">Email</p><p className="font-medium">{student.email}</p></div>
              <div><p className="text-sm text-gray-500">Phone</p><p className="font-medium">{student.phone}</p></div>
              <div><p className="text-sm text-gray-500">Department ID</p><p className="font-medium">{student.departmentId}</p></div>
              <div><p className="text-sm text-gray-500">Course ID</p><p className="font-medium">{student.courseId}</p></div>
              <div><p className="text-sm text-gray-500">Current Semester</p><p className="font-medium">{student.currentSemester}</p></div>
              <div><p className="text-sm text-gray-500">Batch Year</p><p className="font-medium">{student.batchYear}</p></div>
              <div><p className="text-sm text-gray-500">Gender</p><p className="font-medium">{student.gender}</p></div>
            </div>
          )}
          
          {activeTab === 'guardians' && (
            <div>
              <h3 className="text-lg font-medium mb-4">Guardians</h3>
              <p className="text-gray-500">No guardians listed yet.</p>
            </div>
          )}

          {activeTab === 'enrollments' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Enrolled Subjects</h3>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm">Enroll in Subject</button>
              </div>
              {enrollmentsLoading ? <LoadingSpinner /> : (
                enrollments.length ? (
                  <ul className="divide-y border rounded-md">
                    {enrollments.map((env: any) => (
                      <li key={env.id} className="p-4 flex justify-between items-center">
                        <div>
                          <p className="font-medium">Subject ID: {env.subjectId}</p>
                          <p className="text-sm text-gray-500">Academic Year: {env.academicYear}</p>
                        </div>
                        <StatusBadge status={env.status as any} />
                      </li>
                    ))}
                  </ul>
                ) : <p className="text-gray-500">No enrollments found.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
