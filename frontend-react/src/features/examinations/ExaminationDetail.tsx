import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { examinationService } from '@/api/examinationService';
import { PageHeader } from '@/components/PageHeader';
import { LoadingSpinner } from '@/components/LoadingSpinner';

export const ExaminationDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const { data: exam, isLoading } = useQuery({
    queryKey: ['examination', id],
    queryFn: () => examinationService.getById(Number(id)).then(res => res.data)
  });

  const { data: subjects } = useQuery({
    queryKey: ['examination-subjects', id],
    queryFn: () => examinationService.getSubjects(Number(id)).then(res => res.data)
  });

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/examinations" className="text-gray-500">&larr; Back</Link>
        <PageHeader title={exam?.name || 'Examination Details'} />
      </div>

      <div className="bg-white p-4 rounded shadow-sm border">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div><p className="text-gray-500 text-sm">Academic Year</p><p>{exam?.academicYear}</p></div>
          <div><p className="text-gray-500 text-sm">Semester</p><p>{exam?.semester}</p></div>
          <div><p className="text-gray-500 text-sm">Type</p><p>{exam?.examType}</p></div>
          <div><p className="text-gray-500 text-sm">Status</p><p>{exam?.status}</p></div>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Exam Subjects</h2>
          <button className="bg-blue-600 text-white px-4 py-2 rounded">Add Subject</button>
        </div>
        
        <table className="w-full text-left border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Subject</th>
              <th className="p-2 border">Date</th>
              <th className="p-2 border">Time</th>
              <th className="p-2 border">Room</th>
              <th className="p-2 border">Max/Passing Marks</th>
            </tr>
          </thead>
          <tbody>
            {subjects?.map((sub: any) => (
              <tr key={sub.id}>
                <td className="p-2 border">{sub.subjectName}</td>
                <td className="p-2 border">{sub.examDate}</td>
                <td className="p-2 border">{sub.startTime} - {sub.endTime}</td>
                <td className="p-2 border">{sub.room}</td>
                <td className="p-2 border">{sub.maxMarks} / {sub.passingMarks}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
