import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { DashboardService } from '../../core/services/dashboard.service';
import { AdminDashboardResponse, ProfessorDashboardResponse, StudentDashboardResponse } from '../../core/models/models';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent, LoadingSpinnerComponent, EmptyStateComponent],
  template: `
    <div class="p-6">
      <app-page-header title="Dashboard"></app-page-header>
      
      <div *ngIf="loading()" class="mt-8 flex justify-center">
        <app-loading-spinner text="Loading dashboard data..."></app-loading-spinner>
      </div>
      
      <div *ngIf="!loading() && !error()" class="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Admin Cards -->
        <ng-container *ngIf="isAdmin()">
          <div class="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-500">
            <div class="flex items-center"><div class="text-3xl mr-4">👨‍🎓</div><div><p class="text-sm text-gray-500 font-medium">Total Students</p><p class="text-2xl font-bold text-gray-800">{{ adminStats()?.totalStudents || 0 }}</p></div></div>
          </div>
          <div class="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500">
            <div class="flex items-center"><div class="text-3xl mr-4">👨‍🏫</div><div><p class="text-sm text-gray-500 font-medium">Professors</p><p class="text-2xl font-bold text-gray-800">{{ adminStats()?.totalProfessors || 0 }}</p></div></div>
          </div>
          <div class="bg-white rounded-lg shadow-sm p-6 border-l-4 border-purple-500">
            <div class="flex items-center"><div class="text-3xl mr-4">🏢</div><div><p class="text-sm text-gray-500 font-medium">Departments</p><p class="text-2xl font-bold text-gray-800">{{ adminStats()?.totalDepartments || 0 }}</p></div></div>
          </div>
          <div class="bg-white rounded-lg shadow-sm p-6 border-l-4 border-yellow-500">
            <div class="flex items-center"><div class="text-3xl mr-4">📚</div><div><p class="text-sm text-gray-500 font-medium">Active Courses</p><p class="text-2xl font-bold text-gray-800">{{ adminStats()?.activeCourses || 0 }}</p></div></div>
          </div>
          <div class="bg-white rounded-lg shadow-sm p-6 border-l-4 border-red-500">
            <div class="flex items-center"><div class="text-3xl mr-4">💰</div><div><p class="text-sm text-gray-500 font-medium">Pending Fees</p><p class="text-2xl font-bold text-gray-800">{{ adminStats()?.pendingFeesCount || 0 }}</p></div></div>
          </div>
          <div class="bg-white rounded-lg shadow-sm p-6 border-l-4 border-teal-500">
            <div class="flex items-center"><div class="text-3xl mr-4">✅</div><div><p class="text-sm text-gray-500 font-medium">Attendance Rate</p><p class="text-2xl font-bold text-gray-800">{{ adminStats()?.attendanceRate || 0 }}%</p></div></div>
          </div>
        </ng-container>

        <!-- Professor Cards -->
        <ng-container *ngIf="isProfessor()">
          <div class="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-500">
            <div class="flex items-center"><div class="text-3xl mr-4">📖</div><div><p class="text-sm text-gray-500 font-medium">Assigned Subjects</p><p class="text-2xl font-bold text-gray-800">{{ profStats()?.assignedSubjects || 0 }}</p></div></div>
          </div>
          <div class="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500">
            <div class="flex items-center"><div class="text-3xl mr-4">👥</div><div><p class="text-sm text-gray-500 font-medium">Total Students Taught</p><p class="text-2xl font-bold text-gray-800">{{ profStats()?.totalStudentsTaught || 0 }}</p></div></div>
          </div>
          <div class="bg-white rounded-lg shadow-sm p-6 border-l-4 border-purple-500">
            <div class="flex items-center"><div class="text-3xl mr-4">📅</div><div><p class="text-sm text-gray-500 font-medium">Recent Attendances</p><p class="text-2xl font-bold text-gray-800">{{ profStats()?.recentAttendances || 0 }}</p></div></div>
          </div>
        </ng-container>

        <!-- Student Cards -->
        <ng-container *ngIf="isStudent()">
          <div class="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-500">
            <div class="flex items-center"><div class="text-3xl mr-4">🎓</div><div><p class="text-sm text-gray-500 font-medium">Enrolled Courses</p><p class="text-2xl font-bold text-gray-800">{{ studentStats()?.currentEnrolledCourses || 0 }}</p></div></div>
          </div>
          <div class="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500">
            <div class="flex items-center"><div class="text-3xl mr-4">✅</div><div><p class="text-sm text-gray-500 font-medium">Attendance</p><p class="text-2xl font-bold text-gray-800">{{ studentStats()?.attendancePercentage || 0 }}%</p></div></div>
          </div>
          <div class="bg-white rounded-lg shadow-sm p-6 border-l-4 border-red-500">
            <div class="flex items-center"><div class="text-3xl mr-4">💵</div><div><p class="text-sm text-gray-500 font-medium">Pending Fees</p><p class="text-2xl font-bold text-gray-800">$\{{ studentStats()?.pendingFeeAmount || 0 }}</p></div></div>
          </div>
          <div class="bg-white rounded-lg shadow-sm p-6 border-l-4 border-purple-500">
            <div class="flex items-center"><div class="text-3xl mr-4">📝</div><div><p class="text-sm text-gray-500 font-medium">Recent Results</p><p class="text-2xl font-bold text-gray-800">{{ studentStats()?.recentExamResults || 0 }}</p></div></div>
          </div>
        </ng-container>
      </div>

      <div *ngIf="error()" class="mt-6">
        <app-empty-state icon="⚠️" title="Error" [message]="error() || ''"></app-empty-state>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  private authService = inject(AuthService);
  private dashboardService = inject(DashboardService);

  loading = signal<boolean>(true);
  error = signal<string | null>(null);

  adminStats = signal<AdminDashboardResponse | null>(null);
  profStats = signal<ProfessorDashboardResponse | null>(null);
  studentStats = signal<StudentDashboardResponse | null>(null);

  isAdmin = signal<boolean>(false);
  isProfessor = signal<boolean>(false);
  isStudent = signal<boolean>(false);

  ngOnInit() {
    this.isAdmin.set(this.authService.hasAnyRole(['ROLE_SUPER_ADMIN', 'ROLE_ADMIN']));
    this.isProfessor.set(this.authService.hasAnyRole(['ROLE_PROFESSOR', 'ROLE_HOD']));
    this.isStudent.set(this.authService.hasRole('ROLE_STUDENT'));

    this.loadDashboardData();
  }

  private loadDashboardData() {
    this.loading.set(true);
    this.error.set(null);

    if (this.isAdmin()) {
      this.dashboardService.getAdminStats().pipe(
        finalize(() => this.loading.set(false))
      ).subscribe({
        next: (data) => this.adminStats.set(data),
        error: (err) => this.error.set('Failed to load admin dashboard data')
      });
    } else if (this.isProfessor()) {
      this.dashboardService.getProfessorStats().pipe(
        finalize(() => this.loading.set(false))
      ).subscribe({
        next: (data) => this.profStats.set(data),
        error: (err) => this.error.set('Failed to load professor dashboard data')
      });
    } else if (this.isStudent()) {
      this.dashboardService.getStudentStats().pipe(
        finalize(() => this.loading.set(false))
      ).subscribe({
        next: (data) => this.studentStats.set(data),
        error: (err) => this.error.set('Failed to load student dashboard data')
      });
    } else {
      this.loading.set(false);
      this.error.set('No dashboard available for your role');
    }
  }
}
