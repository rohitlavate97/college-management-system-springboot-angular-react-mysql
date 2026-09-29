import { Component, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Student } from '../../core/models/models';

@Component({
  selector: 'app-students',
  standalone: true,
  template: `
    <div class="bg-white shadow rounded-lg">
      <div class="px-4 py-5 sm:px-6 flex justify-between items-center border-b border-gray-200">
        <h3 class="text-lg leading-6 font-medium text-gray-900">Students Directory</h3>
        <button class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">Add Student</button>
      </div>
      
      @if (loading()) {
        <div class="p-6 text-center text-gray-500">Loading students...</div>
      } @else {
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Enrollment Date</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              @for (student of students(); track student.id) {
                <tr>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ student.id }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ student.firstName }} {{ student.lastName }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ student.email }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ student.enrollmentDate }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button class="text-indigo-600 hover:text-indigo-900 mr-4">Edit</button>
                    <button class="text-red-600 hover:text-red-900">Delete</button>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="5" class="px-6 py-4 text-center text-sm text-gray-500">No students found</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    </div>
  `
})
export class StudentsComponent {
  private http = inject(HttpClient);
  
  students = signal<Student[]>([]);
  loading = signal(true);

  constructor() {
    this.loadStudents();
  }

  loadStudents() {
    this.loading.set(true);
    this.http.get<Student[]>('/api/v1/students').subscribe({
      next: (data) => {
        this.students.set(data);
        this.loading.set(false);
      },
      error: () => {
        // Mock data for fallback during testing if backend isn't ready
        this.students.set([
          { id: 1, firstName: 'John', lastName: 'Doe', email: 'john@example.com', enrollmentDate: '2023-09-01' },
          { id: 2, firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com', enrollmentDate: '2023-09-01' }
        ]);
        this.loading.set(false);
      }
    });
  }
}
