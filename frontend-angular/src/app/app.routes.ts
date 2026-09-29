import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

import { Component } from '@angular/core';
@Component({standalone: true, template: '<h2>Attendance</h2>'}) class AttendancePlaceholder {}
@Component({standalone: true, template: '<h2>Examinations</h2>'}) class ExamListPlaceholder {}
@Component({standalone: true, template: '<h2>Results</h2>'}) class ResultsPlaceholder {}
@Component({standalone: true, template: '<h2>Fees</h2>'}) class FeesPlaceholder {}
@Component({standalone: true, template: '<h2>Notifications</h2>'}) class NotificationsPlaceholder {}
@Component({standalone: true, template: '<h2>Audit Logs</h2>'}) class AuditLogsPlaceholder {}

export const routes: Routes = [
  { 
    path: 'login', 
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent) 
  },
  {
    path: '',
    loadComponent: () => import('./layouts/app-layout/app-layout.component').then(m => m.AppLayoutComponent),
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent) },
      { path: 'colleges', loadComponent: () => import('./features/colleges/college-list/college-list.component').then(m => m.CollegeListComponent), canActivate: [roleGuard], data: { roles: ['ROLE_SUPER_ADMIN', 'ROLE_ADMIN'] } },
      { path: 'colleges/:id', loadComponent: () => import('./features/colleges/college-detail/college-detail.component').then(m => m.CollegeDetailComponent), canActivate: [roleGuard], data: { roles: ['ROLE_SUPER_ADMIN', 'ROLE_ADMIN'] } },
      { path: 'departments', loadComponent: () => import('./features/departments/department-list/department-list.component').then(m => m.DepartmentListComponent), canActivate: [roleGuard], data: { roles: ['ROLE_SUPER_ADMIN', 'ROLE_ADMIN'] } },
      { path: 'departments/:id', loadComponent: () => import('./features/departments/department-detail/department-detail.component').then(m => m.DepartmentDetailComponent), canActivate: [roleGuard], data: { roles: ['ROLE_SUPER_ADMIN', 'ROLE_ADMIN'] } },
      { path: 'professors', loadComponent: () => import('./features/professors/professor-list/professor-list.component').then(m => m.ProfessorListComponent), canActivate: [roleGuard], data: { roles: ['ROLE_SUPER_ADMIN', 'ROLE_ADMIN', 'ROLE_DEAN'] } },
      { path: 'professors/:id', loadComponent: () => import('./features/professors/professor-detail/professor-detail.component').then(m => m.ProfessorDetailComponent), canActivate: [roleGuard], data: { roles: ['ROLE_SUPER_ADMIN', 'ROLE_ADMIN', 'ROLE_DEAN'] } },
      { path: 'courses', loadComponent: () => import('./features/courses/course-list/course-list.component').then(m => m.CourseListComponent), canActivate: [roleGuard], data: { roles: ['ROLE_SUPER_ADMIN', 'ROLE_ADMIN', 'ROLE_DEAN'] } },
      { path: 'courses/:id', loadComponent: () => import('./features/courses/course-detail/course-detail.component').then(m => m.CourseDetailComponent), canActivate: [roleGuard], data: { roles: ['ROLE_SUPER_ADMIN', 'ROLE_ADMIN', 'ROLE_DEAN'] } },
      { path: 'subjects', loadComponent: () => import('./features/subjects/subject-list/subject-list.component').then(m => m.SubjectListComponent), canActivate: [roleGuard], data: { roles: ['ROLE_SUPER_ADMIN', 'ROLE_ADMIN', 'ROLE_HOD'] } },
      { path: 'subjects/:id', loadComponent: () => import('./features/subjects/subject-detail/subject-detail.component').then(m => m.SubjectDetailComponent), canActivate: [roleGuard], data: { roles: ['ROLE_SUPER_ADMIN', 'ROLE_ADMIN', 'ROLE_HOD'] } },
      { path: 'students', loadComponent: () => import('./features/students/student-list/student-list.component').then(m => m.StudentListComponent), canActivate: [roleGuard], data: { roles: ['ROLE_SUPER_ADMIN', 'ROLE_ADMIN', 'ROLE_PROFESSOR', 'ROLE_HOD'] } },
      { path: 'students/:id', loadComponent: () => import('./features/students/student-detail/student-detail.component').then(m => m.StudentDetailComponent), canActivate: [roleGuard], data: { roles: ['ROLE_SUPER_ADMIN', 'ROLE_ADMIN', 'ROLE_PROFESSOR', 'ROLE_HOD'] } },
      { path: 'attendance', component: AttendancePlaceholder },
      { path: 'examinations', component: ExamListPlaceholder },
      { path: 'results', component: ResultsPlaceholder },
      { path: 'fees', component: FeesPlaceholder, canActivate: [roleGuard], data: { roles: ['ROLE_ADMIN', 'ROLE_STUDENT'] } },
      { path: 'notifications', component: NotificationsPlaceholder },
      { path: 'audit-logs', component: AuditLogsPlaceholder, canActivate: [roleGuard], data: { roles: ['ROLE_ADMIN'] } },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: 'dashboard' }
];
