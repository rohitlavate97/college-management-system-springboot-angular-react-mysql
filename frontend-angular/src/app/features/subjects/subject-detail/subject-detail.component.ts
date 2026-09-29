import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { SubjectService } from '../../../core/services/subject.service';
import { ProfessorService } from '../../../core/services/professor.service';
import { SubjectResponse, ProfessorSummaryResponse } from '../../../core/models/models';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';

@Component({
  selector: 'app-subject-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, PageHeaderComponent, StatusBadgeComponent],
  template: `
    <div class="p-6">
      <app-page-header title="Subject Details"  ></app-page-header>
      
      <div *ngIf="subject()" class="mt-6 bg-white shadow rounded-lg overflow-hidden">
        <div class="px-4 py-5 sm:px-6 flex justify-between items-center border-b border-gray-200">
          <div><h3 class="text-lg leading-6 font-medium text-gray-900">{{ subject()?.name }}</h3><p class="mt-1 max-w-2xl text-sm text-gray-500">Code: {{ subject()?.code }} | Dept: {{ subject()?.departmentName }}</p></div>
          <app-status-badge [status]="subject()!.isActive ? 'ACTIVE' : 'INACTIVE'"></app-status-badge>
        </div>
        <div class="border-t border-gray-200 px-4 py-5 sm:p-0">
          <dl class="sm:divide-y sm:divide-gray-200">
            <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"><dt class="text-sm font-medium text-gray-500">Description</dt><dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ subject()?.description }}</dd></div>
            <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"><dt class="text-sm font-medium text-gray-500">Course</dt><dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ subject()?.courseName }}</dd></div>
            <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"><dt class="text-sm font-medium text-gray-500">Semester</dt><dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ subject()?.semester }}</dd></div>
            <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"><dt class="text-sm font-medium text-gray-500">Credits</dt><dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ subject()?.credits }}</dd></div>
            <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"><dt class="text-sm font-medium text-gray-500">Subject Type</dt><dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ subject()?.subjectType }}</dd></div>
          </dl>
        </div>
      </div>
    </div>
  `
})
export class SubjectDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private subjectService = inject(SubjectService);

  subject = signal<SubjectResponse | null>(null);

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.subjectService.getById(id).subscribe(s => this.subject.set(s));
    }
  }
}
