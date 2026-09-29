import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { Eye, Pencil, Trash2 } from 'lucide-react';

import { departmentService } from '@/api/departmentService';
import { collegeService } from '@/api/collegeService';
import { useAuth } from '@/features/auth/AuthContext';
import { useToast } from '@/components/Toast';
import { PageHeader } from '@/components/PageHeader';
import { DataTable, Column } from '@/components/DataTable';
import { Modal } from '@/components/Modal';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { StatusBadge } from '@/components/StatusBadge';
import { FormInput } from '@/components/FormInput';
import { FormSelect } from '@/components/FormSelect';

const departmentSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  code: z.string().min(2, 'Code is required'),
  description: z.string().optional(),
  collegeId: z.coerce.number().min(1, 'College is required'),
  hodId: z.coerce.number().optional(),
  isActive: z.boolean().default(true),
});

type DepartmentFormValues = z.infer<typeof departmentSchema>;

export const DepartmentList: React.FC = () => {
  const { hasAnyRole } = useAuth() as any;
  const toast = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isAdmin = hasAnyRole(['SUPER_ADMIN', 'ADMIN']);

  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [search, setSearch] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedDept, setSelectedDept] = useState<any>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['departments', page, size, search],
    queryFn: () => search ? departmentService.search({ query: search, page, size }) : departmentService.getAll({ page, size }),
  });

  const { data: collegesRes } = useQuery({
    queryKey: ['collegesForSelect'],
    queryFn: () => collegeService.getAll({ page: 0, size: 100 }),
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm<DepartmentFormValues>({
    resolver: zodResolver(departmentSchema),
  });

  const createMutation = useMutation({
    mutationFn: (data: DepartmentFormValues) => departmentService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      toast.success('Department created');
      setIsModalOpen(false);
      reset();
    },
    onError: () => toast.error('Failed to create department'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: DepartmentFormValues }) => departmentService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      toast.success('Department updated');
      setIsModalOpen(false);
      reset();
    },
    onError: () => toast.error('Failed to update department'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => departmentService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      toast.success('Department deleted');
      setIsDeleteModalOpen(false);
    },
    onError: () => toast.error('Failed to delete department'),
  });

  const onSubmit = (formData: DepartmentFormValues) => {
    if (selectedDept) {
      updateMutation.mutate({ id: selectedDept.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const columns: Column<any>[] = [
    { header: 'Name', accessor: 'name' },
    { header: 'Code', accessor: 'code' },
    { header: 'College', accessor: 'collegeName' },
    { header: 'Status', accessor: 'isActive', render: (item) => <StatusBadge status={item.isActive ? 'ACTIVE' : 'INACTIVE'} /> },
    { header: 'Actions', accessor: 'id', render: (item) => (
        <div className="flex space-x-2">
          <button onClick={() => navigate(`/departments/${item.id}`)} className="text-blue-600"><Eye size={18} /></button>
          {isAdmin && (
            <>
              <button onClick={() => { setSelectedDept(item); reset(item); setIsModalOpen(true); }} className="text-yellow-600"><Pencil size={18} /></button>
              <button onClick={() => { setSelectedDept(item); setIsDeleteModalOpen(true); }} className="text-red-600"><Trash2 size={18} /></button>
            </>
          )}
        </div>
      )
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Departments" 
        action={isAdmin ? <button className="px-4 py-2 bg-blue-600 text-white rounded-md" onClick={() => { setSelectedDept(null); reset({}); setIsModalOpen(true); }}>Add Department</button> : undefined} 
      />
      
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <input 
          type="text" 
          placeholder="Search departments..." 
          className="w-full md:w-1/3 p-2 border rounded-md"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <DataTable
        columns={columns}
        data={data?.data?.content || []}
        loading={isLoading}
        page={page}
        totalPages={data?.data?.totalPages || 0}
        onPageChange={setPage}
      />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={selectedDept ? 'Edit Department' : 'Add Department'}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormInput label="Name" {...register('name')} error={errors.name?.message} />
          <FormInput label="Code" {...register('code')} error={errors.code?.message} />
          <FormSelect label="College" {...register('collegeId')} error={errors.collegeId?.message} options={collegesRes?.data?.content?.map((c: any) => ({ value: c.id, label: c.name })) || []} />
          <FormInput label="Description" {...register('description')} error={errors.description?.message} />
          <div className="flex items-center mt-4">
            <input type="checkbox" id="isActive" {...register('isActive')} className="mr-2" />
            <label htmlFor="isActive" className="ml-2">Is Active</label>
          </div>
          <div className="flex justify-end space-x-2">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded-md">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md">Save</button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={isDeleteModalOpen}
        title="Delete Department"
        message={`Delete ${selectedDept?.name}?`}
        onConfirm={() => deleteMutation.mutate(selectedDept?.id)}
        onClose={() => setIsDeleteModalOpen(false)}
        variant="danger"
      />
    </div>
  );
};
