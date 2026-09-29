import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { DepartmentService } from '../../../core/services/department.service';
import { ProfessorService } from '../../../core/services/professor.service';
import { CourseService } from '../../../core/services/course.service';
import { DepartmentResponse, ProfessorSummaryResponse, CourseSummaryResponse } from '../../../core/models/models';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';

@Component({
  selector: 'app-department-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, PageHeaderComponent, StatusBadgeComponent],
  template: `
    <div class="p-6">
      <app-page-header title="Department Details"  ></app-page-header>
      
      <div *ngIf="department()" class="mt-6 bg-white shadow rounded-lg overflow-hidden">
        <div class="px-4 py-5 sm:px-6 flex justify-between items-center border-b border-gray-200">
          <div><h3 class="text-lg leading-6 font-medium text-gray-900">{{ department()?.name }}</h3><p class="mt-1 max-w-2xl text-sm text-gray-500">Code: {{ department()?.code }} | College: {{ department()?.collegeName }}</p></div>
          <app-status-badge [status]="department()!.isActive ? 'ACTIVE' : 'INACTIVE'"></app-status-badge>
        </div>
        <div class="border-t border-gray-200 px-4 py-5 sm:p-0">
          <dl class="sm:divide-y sm:divide-gray-200">
            <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"><dt class="text-sm font-medium text-gray-500">Description</dt><dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ department()?.description }}</dd></div>
          </dl>
        </div>
      </div>
      
      <div class="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">Professors</h3>
          <div class="bg-white shadow overflow-hidden sm:rounded-md">
            <ul role="list" class="divide-y divide-gray-200">
              <li *ngFor="let prof of professors()">
                <a [routerLink]="['/professors', prof.id]" class="block hover:bg-gray-50"><div class="px-4 py-4 sm:px-6"><div class="flex items-center justify-between"><p class="text-sm font-medium text-indigo-600 truncate">{{ prof.id }}</p><p class="text-sm text-gray-500">{{ prof.designation }}</p></div></div></a>
              </li>
              <li *ngIf="professors().length === 0" class="px-4 py-4 sm:px-6 text-sm text-gray-500">No professors found.</li>
            </ul>
          </div>
        </div>
        
        <div>
          <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">Courses</h3>
          <div class="bg-white shadow overflow-hidden sm:rounded-md">
            <ul role="list" class="divide-y divide-gray-200">
              <li *ngFor="let course of courses()">
                <a [routerLink]="['/courses', course.id]" class="block hover:bg-gray-50"><div class="px-4 py-4 sm:px-6"><div class="flex items-center justify-between"><p class="text-sm font-medium text-indigo-600 truncate">{{ course.name }}</p><p class="text-sm text-gray-500">{{ course.code }}</p></div></div></a>
              </li>
              <li *ngIf="courses().length === 0" class="px-4 py-4 sm:px-6 text-sm text-gray-500">No courses found.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  `
})
export class DepartmentDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private deptService = inject(DepartmentService);
  private profService = inject(ProfessorService);
  private courseService = inject(CourseService);

  department = signal<DepartmentResponse | null>(null);
  professors = signal<ProfessorSummaryResponse[]>([]);
  courses = signal<CourseSummaryResponse[]>([]);

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.deptService.getById(id).subscribe(d => this.department.set(d));
      // NOTE: Using a hypothetical search method in services or simply pulling via getByDepartment
      (this.profService as any).getAssignments(id).subscribe((p: any) => this.professors.set(p));
      (this.courseService as any).getAssignments(id).subscribe((c: any) => this.courses.set(c));
    }
  }
}
