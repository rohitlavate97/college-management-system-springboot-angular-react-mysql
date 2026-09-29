import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { Eye, Pencil, Trash2 } from 'lucide-react';

import { courseService } from '@/api/courseService';
import { departmentService } from '@/api/departmentService';
import { useAuth } from '@/features/auth/AuthContext';
import { useToast } from '@/components/Toast';
import { PageHeader } from '@/components/PageHeader';
import { DataTable, Column } from '@/components/DataTable';
import { Modal } from '@/components/Modal';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { StatusBadge } from '@/components/StatusBadge';
import { FormInput } from '@/components/FormInput';
import { FormSelect } from '@/components/FormSelect';

const courseSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  code: z.string().min(2, 'Code is required'),
  description: z.string().optional(),
  departmentId: z.coerce.number().min(1, 'Department is required'),
  durationYears: z.coerce.number().min(1, 'Duration is required'),
  totalSemesters: z.coerce.number().min(1, 'Total Semesters is required'),
  degreeType: z.enum(['BACHELOR', 'MASTER', 'DIPLOMA', 'DOCTORATE']),
  isActive: z.boolean().default(true),
});

type CourseFormValues = z.infer<typeof courseSchema>;

export const CourseList: React.FC = () => {
  const { hasAnyRole } = useAuth() as any;
  const toast = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isAdmin = hasAnyRole(['SUPER_ADMIN', 'ADMIN']);

  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [departmentId, setDepartmentId] = useState<number | undefined>();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['courses', page, size, departmentId],
    queryFn: () => courseService.getAll({ page, size, departmentId }),
  });

  const { data: deptRes } = useQuery({
    queryKey: ['departmentsForSelect'],
    queryFn: () => departmentService.getAll({ page: 0, size: 100 }),
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CourseFormValues>({
    resolver: zodResolver(courseSchema),
  });

  const createMutation = useMutation({
    mutationFn: (data: CourseFormValues) => courseService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      toast.success('Course created');
      setIsModalOpen(false);
      reset();
    },
    onError: () => toast.error('Failed to create course'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: CourseFormValues }) => courseService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      toast.success('Course updated');
      setIsModalOpen(false);
      reset();
    },
    onError: () => toast.error('Failed to update course'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => courseService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      toast.success('Course deleted');
      setIsDeleteModalOpen(false);
    },
    onError: () => toast.error('Failed to delete course'),
  });

  const onSubmit = (formData: CourseFormValues) => {
    if (selectedCourse) updateMutation.mutate({ id: selectedCourse.id, data: formData });
    else createMutation.mutate(formData);
  };

  const columns: Column<any>[] = [
    { header: 'Code', accessor: 'code' },
    { header: 'Name', accessor: 'name' },
    { header: 'Department', accessor: 'departmentName' },
    { header: 'Status', accessor: 'isActive', render: (item) => <StatusBadge status={item.isActive ? 'ACTIVE' : 'INACTIVE'} /> },
    { header: 'Actions', accessor: 'id', render: (item) => (
        <div className="flex space-x-2">
          <button onClick={() => navigate(`/courses/${item.id}`)} className="text-blue-600"><Eye size={18} /></button>
          {isAdmin && (
            <>
              <button onClick={() => { setSelectedCourse(item); reset(item); setIsModalOpen(true); }} className="text-yellow-600"><Pencil size={18} /></button>
              <button onClick={() => { setSelectedCourse(item); setIsDeleteModalOpen(true); }} className="text-red-600"><Trash2 size={18} /></button>
            </>
          )}
        </div>
      )
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Courses" action={isAdmin ? <button className="px-4 py-2 bg-blue-600 text-white rounded-md" onClick={() => { setSelectedCourse(null); reset({}); setIsModalOpen(true); }}>Add Course</button> : undefined} />
      
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <select 
          className="w-full md:w-1/3 p-2 border rounded-md"
          value={departmentId || ''}
          onChange={(e) => setDepartmentId(e.target.value ? Number(e.target.value) : undefined)}
        >
          <option value="">All Departments</option>
          {deptRes?.data?.content?.map((d: any) => <option key={d.id} value={d.id}>{d.name}</option>)}
        </select>
      </div>

      <DataTable columns={columns} data={data?.data?.content || []} loading={isLoading} page={page} totalPages={data?.data?.totalPages || 0} onPageChange={setPage} />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={selectedCourse ? 'Edit Course' : 'Add Course'}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormInput label="Name" {...register('name')} error={errors.name?.message} />
          <FormInput label="Code" {...register('code')} error={errors.code?.message} />
          <FormSelect label="Department" {...register('departmentId')} error={errors.departmentId?.message} options={deptRes?.data?.content?.map((d: any) => ({ value: d.id, label: d.name })) || []} />
          <FormSelect label="Degree Type" {...register('degreeType')} error={errors.degreeType?.message} options={[{value: 'BACHELOR', label: 'Bachelor'}, {value: 'MASTER', label: 'Master'}, {value: 'DIPLOMA', label: 'Diploma'}, {value: 'DOCTORATE', label: 'Doctorate'}]} />
          <div className="grid grid-cols-2 gap-4">
            <FormInput label="Duration (Years)" type="number" {...register('durationYears')} error={errors.durationYears?.message} />
            <FormInput label="Total Semesters" type="number" {...register('totalSemesters')} error={errors.totalSemesters?.message} />
          </div>
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

      <ConfirmDialog isOpen={isDeleteModalOpen} title="Delete Course" message="Are you sure?" onConfirm={() => deleteMutation.mutate(selectedCourse?.id)} onClose={() => setIsDeleteModalOpen(false)} variant="danger" />
    </div>
  );
};
