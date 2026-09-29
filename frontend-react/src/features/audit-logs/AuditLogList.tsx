import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { auditLogService } from '@/api/auditLogService';
import { PageHeader } from '@/components/PageHeader';
import { DataTable, Column } from '@/components/DataTable';
import { StatusBadge } from '@/components/StatusBadge';

export const AuditLogList: React.FC = () => {
  const [page, setPage] = useState(0);

  const { data, isLoading } = useQuery({
    queryKey: ['audit-logs', page],
    queryFn: () => auditLogService.getAll({ page, size: 10 }).then(res => res.data)
  });

  const columns: Column<any>[] = [
    { header: 'Timestamp', accessor: 'timestamp' },
    { header: 'User Email', accessor: 'userEmail' },
    { 
      header: 'Action',
      accessor: 'action',
      render: (row: any) => <StatusBadge status={row.action} />
    },
    { header: 'Entity Type', accessor: 'entityType' },
    { header: 'IP Address', accessor: 'ipAddress' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Audit Logs" />
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
