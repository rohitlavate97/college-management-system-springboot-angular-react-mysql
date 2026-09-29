import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import { courseService } from '@/api/courseService';
import { subjectService } from '@/api/subjectService';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { StatusBadge } from '@/components/StatusBadge';

export const CourseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: res, isLoading } = useQuery({
    queryKey: ['course', id],
    queryFn: () => courseService.getById(Number(id)),
    enabled: !!id,
  });

  const { data: subRes, isLoading: subjectsLoading } = useQuery({
    queryKey: ['courseSubjects', id],
    queryFn: () => subjectService.getAll({ courseId: Number(id), page: 0, size: 100 }),
    enabled: !!id,
  });

  if (isLoading) return <LoadingSpinner />;
  const course = res?.data;
  if (!course) return <div>Course not found</div>;
  const subjects = subRes?.data?.content || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4 mb-4">
        <button onClick={() => navigate('/courses')} className="p-2 hover:bg-gray-100 rounded-full">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold flex-1">{course.name}</h1>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div><p className="text-sm text-gray-500">Code</p><p className="font-medium">{course.code}</p></div>
          <div><p className="text-sm text-gray-500">Department ID</p><p className="font-medium">{course.departmentId}</p></div>
          <div><p className="text-sm text-gray-500">Degree Type</p><p className="font-medium">{course.degreeType}</p></div>
          <div><p className="text-sm text-gray-500">Duration (Years)</p><p className="font-medium">{course.durationYears}</p></div>
          <div><p className="text-sm text-gray-500">Total Semesters</p><p className="font-medium">{course.totalSemesters}</p></div>
          <div><p className="text-sm text-gray-500">Status</p><StatusBadge status={course.isActive ? 'ACTIVE' : 'INACTIVE'} /></div>
          <div className="md:col-span-2 lg:col-span-3"><p className="text-sm text-gray-500">Description</p><p className="font-medium">{course.description}</p></div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border mt-6">
        <h2 className="text-lg font-semibold mb-4">Subjects in Course</h2>
        {subjectsLoading ? <LoadingSpinner /> : (
          subjects.length ? (
            <ul className="divide-y">
              {subjects.map((sub: any) => (
                <li key={sub.id} className="py-3 flex justify-between items-center">
                  <div>
                    <p className="font-medium">{sub.name}</p>
                    <p className="text-sm text-gray-500">{sub.code} - Sem {sub.semester}</p>
                  </div>
                  <StatusBadge status={sub.isActive ? 'ACTIVE' : 'INACTIVE'} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No subjects found for this course.</p>
          )
        )}
      </div>
    </div>
  );
};
