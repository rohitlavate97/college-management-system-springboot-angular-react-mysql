import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="flex h-screen bg-gray-100">
      <!-- Sidebar -->
      <aside class="w-64 bg-slate-900 text-white flex flex-col hidden md:flex">
        <div class="h-16 flex items-center justify-center border-b border-slate-700">
          <h1 class="text-xl font-bold tracking-wider text-indigo-400">College ERP</h1>
        </div>
        <nav class="flex-1 overflow-y-auto py-4">
          <ul class="space-y-1">
            <li>
              <a routerLink="/dashboard" routerLinkActive="bg-indigo-600 border-l-4 border-indigo-400" class="block px-6 py-3 hover:bg-slate-800 transition-colors">Dashboard</a>
            </li>
            <li *ngIf="authService.hasAnyRole(['ROLE_ADMIN'])">
              <a routerLink="/colleges" routerLinkActive="bg-indigo-600 border-l-4 border-indigo-400" class="block px-6 py-3 hover:bg-slate-800 transition-colors">Colleges</a>
            </li>
            <li *ngIf="authService.hasAnyRole(['ROLE_ADMIN'])">
              <a routerLink="/departments" routerLinkActive="bg-indigo-600 border-l-4 border-indigo-400" class="block px-6 py-3 hover:bg-slate-800 transition-colors">Departments</a>
            </li>
            <li *ngIf="authService.hasAnyRole(['ROLE_ADMIN', 'ROLE_DEAN'])">
              <a routerLink="/professors" routerLinkActive="bg-indigo-600 border-l-4 border-indigo-400" class="block px-6 py-3 hover:bg-slate-800 transition-colors">Professors</a>
            </li>
            <li *ngIf="authService.hasAnyRole(['ROLE_ADMIN', 'ROLE_DEAN'])">
              <a routerLink="/courses" routerLinkActive="bg-indigo-600 border-l-4 border-indigo-400" class="block px-6 py-3 hover:bg-slate-800 transition-colors">Courses</a>
            </li>
            <li *ngIf="authService.hasAnyRole(['ROLE_ADMIN', 'ROLE_HOD'])">
              <a routerLink="/subjects" routerLinkActive="bg-indigo-600 border-l-4 border-indigo-400" class="block px-6 py-3 hover:bg-slate-800 transition-colors">Subjects</a>
            </li>
            <li *ngIf="authService.hasAnyRole(['ROLE_ADMIN', 'ROLE_PROFESSOR', 'ROLE_HOD'])">
              <a routerLink="/students" routerLinkActive="bg-indigo-600 border-l-4 border-indigo-400" class="block px-6 py-3 hover:bg-slate-800 transition-colors">Students</a>
            </li>
            <li>
              <a routerLink="/attendance" routerLinkActive="bg-indigo-600 border-l-4 border-indigo-400" class="block px-6 py-3 hover:bg-slate-800 transition-colors">Attendance</a>
            </li>
            <li>
              <a routerLink="/examinations" routerLinkActive="bg-indigo-600 border-l-4 border-indigo-400" class="block px-6 py-3 hover:bg-slate-800 transition-colors">Examinations</a>
            </li>
            <li>
              <a routerLink="/results" routerLinkActive="bg-indigo-600 border-l-4 border-indigo-400" class="block px-6 py-3 hover:bg-slate-800 transition-colors">Results</a>
            </li>
            <li *ngIf="authService.hasAnyRole(['ROLE_ADMIN', 'ROLE_STUDENT'])">
              <a routerLink="/fees" routerLinkActive="bg-indigo-600 border-l-4 border-indigo-400" class="block px-6 py-3 hover:bg-slate-800 transition-colors">Fees</a>
            </li>
          </ul>
        </nav>
      </aside>

      <!-- Main Content -->
      <div class="flex-1 flex flex-col overflow-hidden">
        <!-- Top header -->
        <header class="h-16 bg-white shadow-sm flex items-center justify-between px-6 z-10">
          <div class="flex items-center md:hidden">
            <span class="text-xl font-bold text-indigo-600">ERP</span>
          </div>
          <div class="hidden md:block text-gray-500 font-medium">
            <!-- Breadcrumbs or global search could go here -->
          </div>
          
          <div class="flex items-center space-x-4">
            <a routerLink="/notifications" class="text-gray-500 hover:text-indigo-600 relative">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
            </a>
            <div class="flex items-center space-x-2">
              <div class="text-right">
                <div class="text-sm font-medium text-gray-900">{{ authService.currentUser()?.username || 'User' }}</div>
                <div class="text-xs text-gray-500">{{ authService.currentRoles().join(', ') }}</div>
              </div>
              <button (click)="authService.logout()" class="ml-2 text-sm text-red-600 hover:text-red-800 underline">Logout</button>
            </div>
          </div>
        </header>

        <!-- Main Page Content -->
        <main class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `
})
export class AppLayoutComponent {
  authService = inject(AuthService);
}
