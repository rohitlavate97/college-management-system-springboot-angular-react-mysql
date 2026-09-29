import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { Eye, Pencil, Trash2 } from 'lucide-react';

import { collegeService } from '@/api/collegeService';
import { useAuth } from '@/features/auth/AuthContext';
import { useToast } from '@/components/Toast';
import { PageHeader } from '@/components/PageHeader';
import { DataTable, Column } from '@/components/DataTable';
import { Modal } from '@/components/Modal';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { StatusBadge } from '@/components/StatusBadge';
import { FormInput } from '@/components/FormInput';

const collegeSchema = z.object({
  name: z.string().min(3, 'Name is required'),
  code: z.string().min(2, 'Code is required'),
  address: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  country: z.string().min(2, 'Country is required'),
  pincode: z.string().min(4, 'Pincode is required'),
  phone: z.string().min(10, 'Phone is required'),
  email: z.string().email('Invalid email'),
  website: z.string().url().optional().or(z.literal('')),
  establishedYear: z.coerce.number().min(1800, 'Invalid year').max(new Date().getFullYear()),
  isActive: z.boolean().default(true),
});

type CollegeFormValues = z.infer<typeof collegeSchema>;

export const CollegeList: React.FC = () => {
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
  const [selectedCollege, setSelectedCollege] = useState<any>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['colleges', page, size, search],
    queryFn: () => search ? collegeService.search({ query: search, page, size }) : collegeService.getAll({ page, size }),
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CollegeFormValues>({
    resolver: zodResolver(collegeSchema),
  });

  const createMutation = useMutation({
    mutationFn: (data: CollegeFormValues) => collegeService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['colleges'] });
      toast.success('College created successfully');
      setIsModalOpen(false);
      reset();
    },
    onError: () => toast.error('Failed to create college'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: CollegeFormValues }) => collegeService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['colleges'] });
      toast.success('College updated successfully');
      setIsModalOpen(false);
      reset();
    },
    onError: () => toast.error('Failed to update college'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => collegeService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['colleges'] });
      toast.success('College deleted successfully');
      setIsDeleteModalOpen(false);
    },
    onError: () => toast.error('Failed to delete college'),
  });

  const onSubmit = (formData: CollegeFormValues) => {
    if (selectedCollege) {
      updateMutation.mutate({ id: selectedCollege.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const columns: Column<any>[] = [
    { header: 'Name', accessor: 'name' },
    { header: 'Code', accessor: 'code' },
    { header: 'City', accessor: 'city' },
    { header: 'State', accessor: 'state' },
    { header: 'Status', accessor: 'isActive', render: (item) => <StatusBadge status={item.isActive ? 'ACTIVE' : 'INACTIVE'} /> },
    { header: 'Actions', accessor: 'id', render: (item) => (
        <div className="flex space-x-2">
          <button onClick={() => navigate(`/colleges/${item.id}`)} className="text-blue-600 hover:text-blue-800"><Eye size={18} /></button>
          {isAdmin && (
            <>
              <button onClick={() => { setSelectedCollege(item); reset(item); setIsModalOpen(true); }} className="text-yellow-600 hover:text-yellow-800"><Pencil size={18} /></button>
              <button onClick={() => { setSelectedCollege(item); setIsDeleteModalOpen(true); }} className="text-red-600 hover:text-red-800"><Trash2 size={18} /></button>
            </>
          )}
        </div>
      )
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Colleges" 
        action={isAdmin ? <button className="px-4 py-2 bg-blue-600 text-white rounded-md" onClick={() => { setSelectedCollege(null); reset({}); setIsModalOpen(true); }}>Add College</button> : undefined} 
      />
      
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <input 
          type="text" 
          placeholder="Search colleges..." 
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

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={selectedCollege ? 'Edit College' : 'Add College'}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormInput label="Name" {...register('name')} error={errors.name?.message} />
            <FormInput label="Code" {...register('code')} error={errors.code?.message} />
            <FormInput label="Address" {...register('address')} error={errors.address?.message} />
            <FormInput label="City" {...register('city')} error={errors.city?.message} />
            <FormInput label="State" {...register('state')} error={errors.state?.message} />
            <FormInput label="Country" {...register('country')} error={errors.country?.message} />
            <FormInput label="Pincode" {...register('pincode')} error={errors.pincode?.message} />
            <FormInput label="Phone" {...register('phone')} error={errors.phone?.message} />
            <FormInput label="Email" type="email" {...register('email')} error={errors.email?.message} />
            <FormInput label="Website" {...register('website')} error={errors.website?.message} />
            <FormInput label="Established Year" type="number" {...register('establishedYear')} error={errors.establishedYear?.message} />
            <div className="flex items-center mt-6">
              <input type="checkbox" id="isActive" {...register('isActive')} className="mr-2" />
              <label htmlFor="isActive" className="ml-2">Is Active</label>
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded-md">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Save</button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={isDeleteModalOpen}
        title="Delete College"
        message={`Are you sure you want to delete ${selectedCollege?.name}?`}
        onConfirm={() => deleteMutation.mutate(selectedCollege?.id)}
        onClose={() => setIsDeleteModalOpen(false)}
        variant="danger"
      />
    </div>
  );
};
