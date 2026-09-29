import { Component, inject } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  template: `
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-gray-500 text-sm font-medium">Total Students</h3>
        <p class="mt-2 text-3xl font-bold text-gray-900">1,245</p>
      </div>
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-gray-500 text-sm font-medium">Total Professors</h3>
        <p class="mt-2 text-3xl font-bold text-gray-900">86</p>
      </div>
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-gray-500 text-sm font-medium">Active Courses</h3>
        <p class="mt-2 text-3xl font-bold text-gray-900">42</p>
      </div>
    </div>
    
    <div class="bg-white shadow rounded-lg p-6">
      <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">Welcome back, {{ authService.currentUser()?.username }}</h3>
      <p class="text-gray-600">Your role is: <span class="font-bold">{{ authService.currentUser()?.role }}</span></p>
    </div>
  `
})
export class DashboardComponent {
  authService = inject(AuthService);
}
