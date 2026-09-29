import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { StudentService } from '../../../core/services/student.service';
import { StudentResponse, EnrollmentResponse } from '../../../core/models/models';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';

@Component({
  selector: 'app-student-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, PageHeaderComponent, StatusBadgeComponent],
  template: `
    <div class="p-6">
      <app-page-header title="Student Details"  ></app-page-header>
      
      <div *ngIf="student()" class="mt-6 bg-white shadow rounded-lg overflow-hidden">
        <div class="px-4 py-5 sm:px-6 flex justify-between items-center border-b border-gray-200">
          <div><h3 class="text-lg leading-6 font-medium text-gray-900">{{ student()?.firstName }} {{ student()?.lastName }}</h3><p class="mt-1 max-w-2xl text-sm text-gray-500">Roll No: {{ student()?.rollNumber }} | Reg No: {{ student()?.registrationNumber }}</p></div>
          <app-status-badge [status]="student()!.status"></app-status-badge>
        </div>
        <div class="border-t border-gray-200 px-4 py-5 sm:p-0">
          <dl class="sm:divide-y sm:divide-gray-200">
            <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"><dt class="text-sm font-medium text-gray-500">Department</dt><dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ student()?.departmentName }}</dd></div>
            <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"><dt class="text-sm font-medium text-gray-500">Course</dt><dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ student()?.courseName }}</dd></div>
            <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"><dt class="text-sm font-medium text-gray-500">Current Semester</dt><dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ student()?.currentSemester }}</dd></div>
            <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"><dt class="text-sm font-medium text-gray-500">Email</dt><dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ student()?.email }}</dd></div>
            <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"><dt class="text-sm font-medium text-gray-500">Phone</dt><dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ student()?.phone }}</dd></div>
            <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"><dt class="text-sm font-medium text-gray-500">Admission Date</dt><dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ student()?.admissionDate }}</dd></div>
          </dl>
        </div>
      </div>
      
      <div class="mt-8">
        <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">Enrollments</h3>
        <div class="bg-white shadow overflow-hidden sm:rounded-md">
          <ul role="list" class="divide-y divide-gray-200">
            <li *ngFor="let enrollment of enrollments()">
              <div class="px-4 py-4 sm:px-6"><div class="flex items-center justify-between"><p class="text-sm font-medium text-indigo-600 truncate">{{ enrollment.subjectName }} ({{ enrollment.subjectCode }})</p><app-status-badge [status]="enrollment.status"></app-status-badge></div><div class="mt-2 sm:flex sm:justify-between"><div class="sm:flex"><p class="flex items-center text-sm text-gray-500">Sem: {{ enrollment.semester }} | Academic Year: {{ enrollment.academicYear }}</p></div></div></div>
            </li>
            <li *ngIf="enrollments().length === 0" class="px-4 py-4 sm:px-6 text-sm text-gray-500">No enrollments found.</li>
          </ul>
        </div>
      </div>
    </div>
  `
})
export class StudentDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private studentService = inject(StudentService);

  student = signal<StudentResponse | null>(null);
  enrollments = signal<EnrollmentResponse[]>([]);

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.studentService.getById(id).subscribe(s => this.student.set(s));
      this.studentService.getEnrollments(id).subscribe(e => this.enrollments.set(e));
    }
  }
}
