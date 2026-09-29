import React from 'react';
import { useAuth } from '@/features/auth/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '@/api/dashboardService';
import { PageHeader } from '@/components/PageHeader';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Users, GraduationCap, Building2, BookOpen, DollarSign, BarChart3, ClipboardCheck } from 'lucide-react';

const StatCard = ({ icon: Icon, label, value, colorClass }: { icon: any, label: string, value: string | number, colorClass: string }) => (
  <div className={`bg-white p-6 rounded-lg shadow-sm border-l-4 ${colorClass} flex items-center`}>
    <div className="p-3 rounded-full bg-gray-50 mr-4">
      <Icon className={`w-6 h-6 ${colorClass.replace('border-', 'text-')}`} />
    </div>
    <div>
      <p className="text-sm text-gray-500 font-medium">{label}</p>
      <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
    </div>
  </div>
);

export const Dashboard: React.FC = () => {
  const { user, hasRole, hasAnyRole } = useAuth() as any;
  const isAdmin = hasAnyRole(['SUPER_ADMIN', 'ADMIN']);
  const isProfessor = hasAnyRole(['PROFESSOR', 'HOD']);
  const isStudent = hasRole('STUDENT');

  const { data: adminRes, isLoading: adminLoading } = useQuery({
    queryKey: ['adminDashboard'],
    queryFn: () => dashboardService.getAdminDashboard(),
    enabled: isAdmin,
  });

  const { data: profRes, isLoading: profLoading } = useQuery({
    queryKey: ['professorDashboard'],
    queryFn: () => dashboardService.getProfessorDashboard(),
    enabled: isProfessor,
  });

  const { data: studentRes, isLoading: studentLoading } = useQuery({
    queryKey: ['studentDashboard'],
    queryFn: () => dashboardService.getStudentDashboard(),
    enabled: isStudent,
  });

  if (adminLoading || profLoading || studentLoading) return <LoadingSpinner />;

  const adminData = adminRes?.data;
  const profData = profRes?.data;
  const studentData = studentRes?.data;

  return (
    <div className="space-y-6">
      <PageHeader title={`Welcome back, ${(user as any)?.username || 'User'}!`} />
      
      {isAdmin && adminData && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard icon={Users} label="Total Students" value={adminData.totalStudents || 0} colorClass="border-blue-500 text-blue-500" />
          <StatCard icon={GraduationCap} label="Total Professors" value={adminData.totalProfessors || 0} colorClass="border-green-500 text-green-500" />
          <StatCard icon={Building2} label="Total Departments" value={adminData.totalDepartments || 0} colorClass="border-purple-500 text-purple-500" />
          <StatCard icon={BookOpen} label="Active Courses" value={adminData.activeCourses || 0} colorClass="border-indigo-500 text-indigo-500" />
          <StatCard icon={DollarSign} label="Pending Fees" value={`$${adminData.pendingFeesCount || 0}`} colorClass="border-amber-500 text-amber-500" />
          <StatCard icon={BarChart3} label="Attendance Rate" value={`${adminData.attendanceRate || 0}%`} colorClass="border-emerald-500 text-emerald-500" />
        </div>
      )}

      {isProfessor && profData && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard icon={BookOpen} label="Assigned Subjects" value={profData.assignedSubjects || 0} colorClass="border-indigo-500 text-indigo-500" />
          <StatCard icon={Users} label="Total Students Taught" value={profData.totalStudentsTaught || 0} colorClass="border-blue-500 text-blue-500" />
          <StatCard icon={ClipboardCheck} label="Recent Attendances" value={profData.recentAttendances || 0} colorClass="border-green-500 text-green-500" />
        </div>
      )}

      {isStudent && studentData && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard icon={BookOpen} label="Enrolled Courses" value={studentData.currentEnrolledCourses || 0} colorClass="border-indigo-500 text-indigo-500" />
          <StatCard icon={BarChart3} label="Attendance %" value={`${studentData.attendancePercentage || 0}%`} colorClass="border-emerald-500 text-emerald-500" />
          <StatCard icon={DollarSign} label="Pending Fee Amount" value={`$${studentData.pendingFeeAmount || 0}`} colorClass="border-amber-500 text-amber-500" />
          <StatCard icon={ClipboardCheck} label="Recent Exam Results" value={studentData.recentExamResults || 0} colorClass="border-blue-500 text-blue-500" />
        </div>
      )}
    </div>
  );
};
