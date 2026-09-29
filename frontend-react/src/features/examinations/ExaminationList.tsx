import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { examinationService } from '@/api/examinationService';
import { PageHeader } from '@/components/PageHeader';
import { DataTable, Column } from '@/components/DataTable';
import { useAuth } from '@/features/auth/AuthContext';

export const ExaminationList: React.FC = () => {
  const [page, setPage] = useState(0);
  const { hasAnyRole } = useAuth() as any;
  
  const { data, isLoading } = useQuery({
    queryKey: ['examinations', page],
    queryFn: () => examinationService.getAll({ page, size: 10 } as any).then((res: any) => res.data)
  });

  const columns: Column<any>[] = [
    { header: 'Name', accessor: 'name' },
    { header: 'Academic Year', accessor: 'academicYear' },
    { header: 'Semester', accessor: 'semester' },
    { header: 'Type', accessor: 'examType' },
    { header: 'Status', accessor: 'status' },
    {
      header: 'Actions',
      accessor: 'id',
      render: (row: any) => (
        <Link to={`/examinations/${row.id}`} className="text-blue-600">View</Link>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <PageHeader 
          title="Examinations" 
          action={hasAnyRole(['ADMIN', 'HOD']) ? (
            <button className="bg-blue-600 text-white px-4 py-2 rounded">
              Create Examination
            </button>
          ) : undefined}
        />
      </div>

      <DataTable 
        columns={columns}
        data={data?.content || []}
        loading={isLoading}
        page={page}
        totalPages={data?.totalPages || 1}
        onPageChange={setPage}
      />
    </div>
  );
};
