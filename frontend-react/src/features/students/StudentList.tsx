import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { Eye, Pencil, Trash2 } from 'lucide-react';

import { studentService } from '@/api/studentService';
import { departmentService } from '@/api/departmentService';
import { courseService } from '@/api/courseService';
import { useAuth } from '@/features/auth/AuthContext';
import { useToast } from '@/components/Toast';
import { PageHeader } from '@/components/PageHeader';
import { DataTable, Column } from '@/components/DataTable';
import { Modal } from '@/components/Modal';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { StatusBadge } from '@/components/StatusBadge';
import { FormInput } from '@/components/FormInput';
import { FormSelect } from '@/components/FormSelect';

const studentSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().min(10, 'Phone is required'),
  rollNumber: z.string().min(2, 'Roll number is required'),
  registrationNumber: z.string().min(2, 'Registration number is required'),
  departmentId: z.coerce.number().min(1, 'Department is required'),
  courseId: z.coerce.number().min(1, 'Course is required'),
  currentSemester: z.coerce.number().min(1, 'Semester is required'),
  admissionDate: z.string().min(1, 'Admission date is required'),
  admissionType: z.enum(['REGULAR', 'LATERAL', 'MANAGEMENT']),
  batchYear: z.string().min(4, 'Batch year is required'),
  dateOfBirth: z.string().min(1, 'DOB is required'),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
  bloodGroup: z.string().optional(),
  nationality: z.string().optional(),
  religion: z.string().optional(),
  category: z.string().optional(),
  permanentAddress: z.string().min(5, 'Address is required'),
  currentAddress: z.string().min(5, 'Address is required'),
});

type StudentFormValues = z.infer<typeof studentSchema>;

export const StudentList: React.FC = () => {
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
  const [selectedStudent, setSelectedStudent] = useState<any>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['students', page, size, search],
    queryFn: () => search ? studentService.search({ query: search, page, size }) : studentService.getAll({ page, size }),
  });

  const { data: deptRes } = useQuery({
    queryKey: ['departmentsForSelect'],
    queryFn: () => departmentService.getAll({ page: 0, size: 100 }),
  });

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<StudentFormValues>({
    resolver: zodResolver(studentSchema),
  });

  const selectedDeptId = watch('departmentId');

  const { data: courseRes } = useQuery({
    queryKey: ['coursesForSelect', selectedDeptId],
    queryFn: () => courseService.getAll({ departmentId: selectedDeptId, page: 0, size: 100 }),
    enabled: !!selectedDeptId,
  });

  const createMutation = useMutation({
    mutationFn: (data: StudentFormValues) => studentService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast.success('Student created');
      setIsModalOpen(false);
      reset();
    },
    onError: () => toast.error('Failed to create student'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: StudentFormValues }) => studentService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast.success('Student updated');
      setIsModalOpen(false);
      reset();
    },
    onError: () => toast.error('Failed to update student'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => studentService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast.success('Student deleted');
      setIsDeleteModalOpen(false);
    },
    onError: () => toast.error('Failed to delete student'),
  });

  const onSubmit = (formData: StudentFormValues) => {
    if (selectedStudent) updateMutation.mutate({ id: selectedStudent.id, data: formData });
    else createMutation.mutate(formData);
  };

  const columns: Column<any>[] = [
    { header: 'Roll No', accessor: 'rollNumber' },
    { header: 'First Name', accessor: 'firstName' },
    { header: 'Last Name', accessor: 'lastName' },
    { header: 'Department', accessor: 'departmentName' },
    { header: 'Course', accessor: 'courseName' },
    { header: 'Sem', accessor: 'currentSemester' },
    { header: 'Status', accessor: 'status', render: (item) => <StatusBadge status={item.status as any} /> },
    { header: 'Actions', accessor: 'id', render: (item) => (
        <div className="flex space-x-2">
          <button onClick={() => navigate(`/students/${item.id}`)} className="text-blue-600"><Eye size={18} /></button>
          {isAdmin && (
            <>
              <button onClick={() => { setSelectedStudent(item); reset(item); setIsModalOpen(true); }} className="text-yellow-600"><Pencil size={18} /></button>
              <button onClick={() => { setSelectedStudent(item); setIsDeleteModalOpen(true); }} className="text-red-600"><Trash2 size={18} /></button>
            </>
          )}
        </div>
      )
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Students" action={isAdmin ? <button className="px-4 py-2 bg-blue-600 text-white rounded-md" onClick={() => { setSelectedStudent(null); reset({}); setIsModalOpen(true); }}>Add Student</button> : undefined} />
      
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <input type="text" placeholder="Search..." className="w-full md:w-1/3 p-2 border rounded-md" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <DataTable columns={columns} data={data?.data?.content || []} loading={isLoading} page={page} totalPages={data?.data?.totalPages || 0} onPageChange={setPage} />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={selectedStudent ? 'Edit Student' : 'Add Student'}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
          <div className="grid grid-cols-2 gap-4">
            <FormInput label="First Name" {...register('firstName')} error={errors.firstName?.message} />
            <FormInput label="Last Name" {...register('lastName')} error={errors.lastName?.message} />
            <FormInput label="Email" type="email" {...register('email')} error={errors.email?.message} />
            <FormInput label="Phone" {...register('phone')} error={errors.phone?.message} />
            <FormInput label="Roll Number" {...register('rollNumber')} error={errors.rollNumber?.message} />
            <FormInput label="Registration Number" {...register('registrationNumber')} error={errors.registrationNumber?.message} />
            <FormSelect label="Department" {...register('departmentId')} error={errors.departmentId?.message} options={deptRes?.data?.content?.map((d: any) => ({ value: d.id, label: d.name })) || []} />
            <FormSelect label="Course" {...register('courseId')} error={errors.courseId?.message} options={courseRes?.data?.content?.map((c: any) => ({ value: c.id, label: c.name })) || []} disabled={!selectedDeptId} />
            <FormInput label="Current Semester" type="number" {...register('currentSemester')} error={errors.currentSemester?.message} />
            <FormInput label="Admission Date" type="date" {...register('admissionDate')} error={errors.admissionDate?.message} />
            <FormSelect label="Admission Type" {...register('admissionType')} error={errors.admissionType?.message} options={[{value: 'REGULAR', label: 'Regular'}, {value: 'LATERAL', label: 'Lateral'}, {value: 'MANAGEMENT', label: 'Management'}]} />
            <FormInput label="Batch Year" {...register('batchYear')} error={errors.batchYear?.message} />
            <FormInput label="Date of Birth" type="date" {...register('dateOfBirth')} error={errors.dateOfBirth?.message} />
            <FormSelect label="Gender" {...register('gender')} error={errors.gender?.message} options={[{value: 'MALE', label: 'Male'}, {value: 'FEMALE', label: 'Female'}, {value: 'OTHER', label: 'Other'}]} />
            <FormInput label="Blood Group" {...register('bloodGroup')} error={errors.bloodGroup?.message} />
            <FormInput label="Nationality" {...register('nationality')} error={errors.nationality?.message} />
            <FormInput label="Religion" {...register('religion')} error={errors.religion?.message} />
            <FormInput label="Category" {...register('category')} error={errors.category?.message} />
            <div className="col-span-2"><FormInput label="Permanent Address" {...register('permanentAddress')} error={errors.permanentAddress?.message} /></div>
            <div className="col-span-2"><FormInput label="Current Address" {...register('currentAddress')} error={errors.currentAddress?.message} /></div>
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded-md">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md">Save</button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog isOpen={isDeleteModalOpen} title="Delete Student" message="Are you sure?" onConfirm={() => deleteMutation.mutate(selectedStudent?.id)} onClose={() => setIsDeleteModalOpen(false)} variant="danger" />
    </div>
  );
};
