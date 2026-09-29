import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CourseService } from '../../../core/services/course.service';
import { SubjectService } from '../../../core/services/subject.service';
import { CourseResponse, SubjectSummaryResponse } from '../../../core/models/models';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';

@Component({
  selector: 'app-course-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, PageHeaderComponent, StatusBadgeComponent],
  template: `
    <div class="p-6">
      <app-page-header title="Course Details"  ></app-page-header>
      
      <div *ngIf="course()" class="mt-6 bg-white shadow rounded-lg overflow-hidden">
        <div class="px-4 py-5 sm:px-6 flex justify-between items-center border-b border-gray-200">
          <div><h3 class="text-lg leading-6 font-medium text-gray-900">{{ course()?.name }}</h3><p class="mt-1 max-w-2xl text-sm text-gray-500">Code: {{ course()?.code }} | Dept: {{ course()?.departmentName }}</p></div>
          <app-status-badge [status]="course()!.isActive ? 'ACTIVE' : 'INACTIVE'"></app-status-badge>
        </div>
        <div class="border-t border-gray-200 px-4 py-5 sm:p-0">
          <dl class="sm:divide-y sm:divide-gray-200">
            <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"><dt class="text-sm font-medium text-gray-500">Description</dt><dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ course()?.description }}</dd></div>
            <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"><dt class="text-sm font-medium text-gray-500">Duration</dt><dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ course()?.durationYears }} Years</dd></div>
            <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"><dt class="text-sm font-medium text-gray-500">Total Semesters</dt><dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ course()?.totalSemesters }}</dd></div>
            <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"><dt class="text-sm font-medium text-gray-500">Degree Type</dt><dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ course()?.degreeType }}</dd></div>
          </dl>
        </div>
      </div>
      
      <div class="mt-8">
        <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">Subjects</h3>
        <div class="bg-white shadow overflow-hidden sm:rounded-md">
          <ul role="list" class="divide-y divide-gray-200">
            <li *ngFor="let subject of subjects()">
              <a [routerLink]="['/subjects', subject.id]" class="block hover:bg-gray-50"><div class="px-4 py-4 sm:px-6"><div class="flex items-center justify-between"><p class="text-sm font-medium text-indigo-600 truncate">{{ subject.name }}</p><p class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">Sem {{ subject.semester }}</p></div><div class="mt-2 sm:flex sm:justify-between"><div class="sm:flex"><p class="flex items-center text-sm text-gray-500">Code: {{ subject.code }} | Credits: {{ subject.credits }}</p></div></div></div></a>
            </li>
            <li *ngIf="subjects().length === 0" class="px-4 py-4 sm:px-6 text-sm text-gray-500">No subjects found.</li>
          </ul>
        </div>
      </div>
    </div>
  `
})
export class CourseDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private courseService = inject(CourseService);
  private subjectService = inject(SubjectService);

  course = signal<CourseResponse | null>(null);
  subjects = signal<SubjectSummaryResponse[]>([]);

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.courseService.getById(id).subscribe(c => this.course.set(c));
      (this.subjectService as any).getByCourse(id).subscribe((s: any) => this.subjects.set(s));
    }
  }
}
