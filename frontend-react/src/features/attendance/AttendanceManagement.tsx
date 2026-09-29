import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { attendanceService } from '@/api/attendanceService';
import { subjectService } from '@/api/subjectService';
import { studentService } from '@/api/studentService';
import { useAuth } from '@/features/auth/AuthContext';
import { useToast } from '@/components/Toast';
import { PageHeader } from '@/components/PageHeader';
import { FormSelect } from '@/components/FormSelect';
import { DataTable } from '@/components/DataTable';
import { LoadingSpinner } from '@/components/LoadingSpinner';

const markAttendanceSchema = z.object({
  subjectId: z.number(),
  date: z.string(),
});

type MarkAttendanceForm = z.infer<typeof markAttendanceSchema>;

export const AttendanceManagement: React.FC = () => {
  const { user, hasAnyRole } = useAuth() as any;
  const { success, error } = useToast() as any;
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'mark' | 'view'>('view');

  const canMark = hasAnyRole(['PROFESSOR', 'ADMIN']);

  return (
    <div className="space-y-6">
      <PageHeader title="Attendance Management" />
      
      {canMark && (
        <div className="flex space-x-4 border-b">
          <button 
            className={`py-2 px-4 ${activeTab === 'view' ? 'border-b-2 border-blue-500' : ''}`}
            onClick={() => setActiveTab('view')}
          >
            View Attendance
          </button>
          <button 
            className={`py-2 px-4 ${activeTab === 'mark' ? 'border-b-2 border-blue-500' : ''}`}
            onClick={() => setActiveTab('mark')}
          >
            Mark Attendance
          </button>
        </div>
      )}

      {activeTab === 'mark' && canMark && <MarkAttendanceTab />}
      {activeTab === 'view' && <ViewAttendanceTab />}
    </div>
  );
};

const MarkAttendanceTab = () => {
  const { success, error } = useToast() as any;
  const { control, watch } = useForm<MarkAttendanceForm>({
    defaultValues: { date: new Date().toISOString().split('T')[0] }
  });
  
  const subjectId = watch('subjectId');
  const date = watch('date');

  const { data: subjects } = useQuery({
    queryKey: ['subjects'],
    queryFn: () => subjectService.getAll({ page: 0, size: 100 } as any).then((res: any) => res.data.content)
  });

  const { data: students, isLoading } = useQuery({
    queryKey: ['students-by-subject', subjectId],
    queryFn: () => studentService.getAll({ page: 0, size: 100 } as any).then((res: any) => res.data.content),
    enabled: !!subjectId
  });

  const [attendanceData, setAttendanceData] = useState<Record<number, { status: string, remarks: string }>>({});

  const mutation = useMutation({
    mutationFn: (data: any) => attendanceService.markBatch(data),
    onSuccess: () => {
      success('Attendance marked successfully');
      setAttendanceData({});
    }
  });

  const handleSubmit = () => {
    if (!subjectId || !date) return;
    const records = Object.entries(attendanceData).map(([studentId, data]) => ({
      studentId: Number(studentId),
      subjectId,
      date,
      status: data.status,
      remarks: data.remarks
    }));
    mutation.mutate(records);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <Controller
          name="subjectId"
          control={control}
          render={({ field }) => (
            <select {...field} className="border p-2 rounded" value={field.value || ''} onChange={e => field.onChange(Number(e.target.value))}>
              <option value="">Select Subject</option>
              {subjects?.map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          )}
        />
        <Controller
          name="date"
          control={control}
          render={({ field }) => (
            <input type="date" {...field} className="border p-2 rounded" />
          )}
        />
      </div>

      {isLoading && <LoadingSpinner />}
      {students && (
        <div>
          <table className="w-full text-left border">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border">Student Name</th>
                <th className="p-2 border">Status</th>
                <th className="p-2 border">Remarks</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student: any) => (
                <tr key={student.id}>
                  <td className="p-2 border">{student.firstName} {student.lastName}</td>
                  <td className="p-2 border space-x-2">
                    {['PRESENT', 'ABSENT', 'LATE', 'EXCUSED'].map(status => (
                      <label key={status}>
                        <input
                          type="radio"
                          name={`status-${student.id}`}
                          value={status}
                          checked={attendanceData[student.id]?.status === status}
                          onChange={() => setAttendanceData(prev => ({
                            ...prev,
                            [student.id]: { ...prev[student.id], status }
                          }))}
                        /> {status}
                      </label>
                    ))}
                  </td>
                  <td className="p-2 border">
                    <input 
                      type="text" 
                      className="border p-1 w-full"
                      value={attendanceData[student.id]?.remarks || ''}
                      onChange={e => setAttendanceData(prev => ({
                        ...prev,
                        [student.id]: { ...prev[student.id], remarks: e.target.value }
                      }))}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button 
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
            onClick={handleSubmit}
            disabled={mutation.isPending}
          >
            Submit Attendance
          </button>
        </div>
      )}
    </div>
  );
};

const ViewAttendanceTab = () => {
  const { user, hasRole } = useAuth() as any;
  
  if (hasRole('STUDENT')) {
    return <StudentAttendanceStats studentId={(user as any)?.userId || (user as any)?.id} />;
  }

  return <div>Admin/Professor View Attendance - To be implemented full table search</div>;
};

const StudentAttendanceStats = ({ studentId }: { studentId?: number }) => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['attendance-stats', studentId],
    queryFn: () => attendanceService.getStudentStats(studentId!).then((res: any) => res.data),
    enabled: !!studentId
  });

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {stats?.map((stat: any) => (
        <div key={stat.subjectId} className="border p-4 rounded shadow-sm">
          <h3 className="font-bold">{stat.subjectName}</h3>
          <p>Percentage: <span className={stat.percentage > 75 ? 'text-green-600' : stat.percentage > 60 ? 'text-yellow-600' : 'text-red-600'}>{stat.percentage}%</span></p>
        </div>
      ))}
    </div>
  );
};
