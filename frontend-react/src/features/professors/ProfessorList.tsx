import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { Eye, Pencil, Trash2 } from 'lucide-react';

import { professorService } from '@/api/professorService';
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

const professorSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().min(10, 'Phone is required'),
  employeeId: z.string().min(2, 'Employee ID is required'),
  departmentId: z.coerce.number().min(1, 'Department is required'),
  designation: z.string().min(2, 'Designation is required'),
  specialization: z.string().min(2, 'Specialization is required'),
  qualification: z.string().min(2, 'Qualification is required'),
  joiningDate: z.string().min(1, 'Joining date is required'),
  status: z.enum(['ACTIVE', 'INACTIVE', 'ON_LEAVE', 'RETIRED']),
});

type ProfessorFormValues = z.infer<typeof professorSchema>;

export const ProfessorList: React.FC = () => {
  const { hasAnyRole } = useAuth() as any;
  const toast = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isAdmin = hasAnyRole(['SUPER_ADMIN', 'ADMIN', 'HOD']);

  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [search, setSearch] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProf, setSelectedProf] = useState<any>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['professors', page, size, search],
    queryFn: () => search ? professorService.search({ query: search, page, size }) : professorService.getAll({ page, size }),
  });

  const { data: deptRes } = useQuery({
    queryKey: ['departmentsForSelect'],
    queryFn: () => departmentService.getAll({ page: 0, size: 100 }),
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProfessorFormValues>({
    resolver: zodResolver(professorSchema),
    defaultValues: { status: 'ACTIVE' },
  });

  const createMutation = useMutation({
    mutationFn: (data: ProfessorFormValues) => professorService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['professors'] });
      toast.success('Professor created');
      setIsModalOpen(false);
      reset();
    },
    onError: () => toast.error('Failed to create professor'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: ProfessorFormValues }) => professorService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['professors'] });
      toast.success('Professor updated');
      setIsModalOpen(false);
      reset();
    },
    onError: () => toast.error('Failed to update professor'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => professorService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['professors'] });
      toast.success('Professor deleted');
      setIsDeleteModalOpen(false);
    },
    onError: () => toast.error('Failed to delete professor'),
  });

  const onSubmit = (formData: ProfessorFormValues) => {
    if (selectedProf) updateMutation.mutate({ id: selectedProf.id, data: formData });
    else createMutation.mutate(formData);
  };

  const columns: Column<any>[] = [
    { header: 'Emp ID', accessor: 'employeeId' },
    { header: 'First Name', accessor: 'firstName' },
    { header: 'Last Name', accessor: 'lastName' },
    { header: 'Department', accessor: 'departmentName' },
    { header: 'Designation', accessor: 'designation' },
    { header: 'Status', accessor: 'status', render: (item) => <StatusBadge status={item.status as any} /> },
    { header: 'Actions', accessor: 'id', render: (item) => (
        <div className="flex space-x-2">
          <button onClick={() => navigate(`/professors/${item.id}`)} className="text-blue-600"><Eye size={18} /></button>
          {isAdmin && (
            <>
              <button onClick={() => { setSelectedProf(item); reset(item); setIsModalOpen(true); }} className="text-yellow-600"><Pencil size={18} /></button>
              <button onClick={() => { setSelectedProf(item); setIsDeleteModalOpen(true); }} className="text-red-600"><Trash2 size={18} /></button>
            </>
          )}
        </div>
      )
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Professors" action={isAdmin ? <button className="px-4 py-2 bg-blue-600 text-white rounded-md" onClick={() => { setSelectedProf(null); reset({}); setIsModalOpen(true); }}>Add Professor</button> : undefined} />
      
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <input type="text" placeholder="Search..." className="w-full md:w-1/3 p-2 border rounded-md" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <DataTable columns={columns} data={data?.data?.content || []} loading={isLoading} page={page} totalPages={data?.data?.totalPages || 0} onPageChange={setPage} />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={selectedProf ? 'Edit Professor' : 'Add Professor'}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormInput label="First Name" {...register('firstName')} error={errors.firstName?.message} />
            <FormInput label="Last Name" {...register('lastName')} error={errors.lastName?.message} />
            <FormInput label="Email" type="email" {...register('email')} error={errors.email?.message} />
            <FormInput label="Phone" {...register('phone')} error={errors.phone?.message} />
            <FormInput label="Employee ID" {...register('employeeId')} error={errors.employeeId?.message} />
            <FormSelect label="Department" {...register('departmentId')} error={errors.departmentId?.message} options={deptRes?.data?.content?.map((d: any) => ({ value: d.id, label: d.name })) || []} />
            <FormInput label="Designation" {...register('designation')} error={errors.designation?.message} />
            <FormInput label="Specialization" {...register('specialization')} error={errors.specialization?.message} />
            <FormInput label="Qualification" {...register('qualification')} error={errors.qualification?.message} />
            <FormInput label="Joining Date" type="date" {...register('joiningDate')} error={errors.joiningDate?.message} />
            <FormSelect label="Status" {...register('status')} error={errors.status?.message} options={[{value: 'ACTIVE', label: 'Active'}, {value: 'INACTIVE', label: 'Inactive'}, {value: 'ON_LEAVE', label: 'On Leave'}, {value: 'RETIRED', label: 'Retired'}]} />
          </div>
          <div className="flex justify-end space-x-2">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded-md">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md">Save</button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog isOpen={isDeleteModalOpen} title="Delete Professor" message="Are you sure?" onConfirm={() => deleteMutation.mutate(selectedProf?.id)} onClose={() => setIsDeleteModalOpen(false)} variant="danger" />
    </div>
  );
};
