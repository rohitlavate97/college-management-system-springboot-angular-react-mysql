import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProfessorService } from '../../../core/services/professor.service';
import { ProfessorResponse } from '../../../core/models/models';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';

@Component({
  selector: 'app-professor-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, PageHeaderComponent, StatusBadgeComponent],
  template: `
    <div class="p-6">
      <app-page-header title="Professor Details"  ></app-page-header>
      
      <div *ngIf="professor()" class="mt-6 bg-white shadow rounded-lg overflow-hidden">
        <div class="px-4 py-5 sm:px-6 flex justify-between items-center border-b border-gray-200">
          <div><h3 class="text-lg leading-6 font-medium text-gray-900">{{ professor()?.firstName }} {{ professor()?.lastName }}</h3><p class="mt-1 max-w-2xl text-sm text-gray-500">Employee ID: {{ professor()?.employeeId }}</p></div>
          <app-status-badge [status]="professor()!.status"></app-status-badge>
        </div>
        <div class="border-t border-gray-200 px-4 py-5 sm:p-0">
          <dl class="sm:divide-y sm:divide-gray-200">
            <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"><dt class="text-sm font-medium text-gray-500">Department</dt><dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ professor()?.departmentName }}</dd></div>
            <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"><dt class="text-sm font-medium text-gray-500">Designation</dt><dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ professor()?.designation }}</dd></div>
            <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"><dt class="text-sm font-medium text-gray-500">Email</dt><dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ professor()?.email }}</dd></div>
            <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"><dt class="text-sm font-medium text-gray-500">Phone</dt><dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ professor()?.phone }}</dd></div>
            <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"><dt class="text-sm font-medium text-gray-500">Qualification</dt><dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ professor()?.qualification }}</dd></div>
            <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"><dt class="text-sm font-medium text-gray-500">Specialization</dt><dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ professor()?.specialization }}</dd></div>
            <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"><dt class="text-sm font-medium text-gray-500">Joining Date</dt><dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ professor()?.joiningDate }}</dd></div>
          </dl>
        </div>
      </div>
    </div>
  `
})
export class ProfessorDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private profService = inject(ProfessorService);

  professor = signal<ProfessorResponse | null>(null);

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.profService.getById(id).subscribe(p => this.professor.set(p));
    }
  }
}
