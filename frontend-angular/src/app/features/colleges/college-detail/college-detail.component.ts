import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CollegeService } from '../../../core/services/college.service';
import { DepartmentService } from '../../../core/services/department.service';
import { CollegeResponse, DepartmentSummaryResponse } from '../../../core/models/models';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';

@Component({
  selector: 'app-college-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, PageHeaderComponent, StatusBadgeComponent],
  template: `
    <div class="p-6">
      <app-page-header title="College Details"  ></app-page-header>
      
      <div *ngIf="college()" class="mt-6 bg-white shadow rounded-lg overflow-hidden">
        <div class="px-4 py-5 sm:px-6 flex justify-between items-center border-b border-gray-200">
          <div><h3 class="text-lg leading-6 font-medium text-gray-900">{{ college()?.name }}</h3><p class="mt-1 max-w-2xl text-sm text-gray-500">Code: {{ college()?.code }}</p></div>
          <app-status-badge [status]="college()!.isActive ? 'ACTIVE' : 'INACTIVE'"></app-status-badge>
        </div>
        <div class="border-t border-gray-200 px-4 py-5 sm:p-0">
          <dl class="sm:divide-y sm:divide-gray-200">
            <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"><dt class="text-sm font-medium text-gray-500">Address</dt><dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ college()?.address }}, {{ college()?.city }}, {{ college()?.state }}, {{ college()?.country }} - {{ college()?.pincode }}</dd></div>
            <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"><dt class="text-sm font-medium text-gray-500">Contact</dt><dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">Phone: {{ college()?.phone }}<br>Email: {{ college()?.email }}</dd></div>
            <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"><dt class="text-sm font-medium text-gray-500">Website</dt><dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2"><a [href]="college()?.website" target="_blank" class="text-indigo-600">{{ college()?.website }}</a></dd></div>
            <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"><dt class="text-sm font-medium text-gray-500">Established</dt><dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ college()?.establishedYear }}</dd></div>
          </dl>
        </div>
      </div>
      
      <div class="mt-8">
        <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">Departments</h3>
        <div class="bg-white shadow overflow-hidden sm:rounded-md">
          <ul role="list" class="divide-y divide-gray-200">
            <li *ngFor="let dept of departments()">
              <a [routerLink]="['/departments', dept.id]" class="block hover:bg-gray-50"><div class="px-4 py-4 sm:px-6"><div class="flex items-center justify-between"><p class="text-sm font-medium text-indigo-600 truncate">{{ dept.name }}</p><div class="ml-2 flex-shrink-0 flex"><p class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">{{ dept.code }}</p></div></div></div></a>
            </li>
            <li *ngIf="departments().length === 0" class="px-4 py-4 sm:px-6 text-sm text-gray-500">No departments found.</li>
          </ul>
        </div>
      </div>
    </div>
  `
})
export class CollegeDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private collegeService = inject(CollegeService);
  private departmentService = inject(DepartmentService);

  college = signal<CollegeResponse | null>(null);
  departments = signal<DepartmentSummaryResponse[]>([]);

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.collegeService.getById(id).subscribe(c => this.college.set(c));
      (this.departmentService as any).getByCollege(id).subscribe((d: any) => this.departments.set(d));
    }
  }
}
