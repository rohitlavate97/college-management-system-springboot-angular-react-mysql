import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { resultService } from '@/api/resultService';
import { PageHeader } from '@/components/PageHeader';
import { useAuth } from '@/features/auth/AuthContext';

export const ResultsManagement: React.FC = () => {
  const { hasAnyRole } = useAuth() as any;
  const isStudent = hasAnyRole(['STUDENT']);

  return (
    <div className="space-y-6">
      <PageHeader title="Results Management" />
      {isStudent ? <StudentReportCards /> : <GradeEntry />}
    </div>
  );
};

const GradeEntry = () => {
  return <div>Grade Entry Implementation</div>;
};

const StudentReportCards = () => {
  const { user } = useAuth() as any;
  const { data: reports } = useQuery({
    queryKey: ['report-cards', (user as any)?.userId || (user as any)?.id],
    queryFn: () => resultService.getStudentAllReportCards((user as any)?.userId || (user as any)?.id!).then((res: any) => res.data),
    enabled: !!((user as any)?.userId || (user as any)?.id)
  });

  return (
    <div className="space-y-4">
      {reports?.map((report: any) => (
        <div key={report.examId} className="border p-4 rounded shadow">
          <h3 className="font-bold">{report.examName}</h3>
          <p>GPA: {report.gpa}</p>
        </div>
      ))}
    </div>
  );
};
