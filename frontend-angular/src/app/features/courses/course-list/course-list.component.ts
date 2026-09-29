import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CourseService } from '../../../core/services/course.service';
import { DepartmentService } from '../../../core/services/department.service';
import { AuthService } from '../../../core/services/auth.service';
import { CourseResponse, DepartmentSummaryResponse } from '../../../core/models/models';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { DataTableComponent } from '../../../shared/components/data-table/data-table.component';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-course-list',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, PageHeaderComponent, DataTableComponent, ModalComponent, ConfirmDialogComponent, StatusBadgeComponent],
  template: `
    <div class="p-6">
      <app-page-header title="Courses"   (actionClicked)="openCreateModal()"></app-page-header>
      
      <div class="mt-6 bg-white rounded-lg shadow">
        <app-data-table [columns]="columns" [data]="courses()" [totalElements]="0" [loading]="loading()" (pageChange)="onPageChange($event)" >
          <ng-template #cellTemplate let-col let-item>
            <ng-container *ngIf="col.key === 'status'"><app-status-badge [status]="item.isActive ? 'ACTIVE' : 'INACTIVE'"></app-status-badge></ng-container>
            <ng-container *ngIf="col.key === 'actions'">
              <div class="flex space-x-2">
                <a [routerLink]="['/courses', item.id]" class="text-blue-600 hover:text-blue-900">View</a>
                <button *ngIf="isAdminOrDean()" (click)="openEditModal(item)" class="text-indigo-600 hover:text-indigo-900 ml-2">Edit</button>
                <button *ngIf="isAdminOrDean()" (click)="openDeleteConfirm(item)" class="text-red-600 hover:text-red-900 ml-2">Delete</button>
              </div>
            </ng-container>
            <ng-container *ngIf="col.key !== 'status' && col.key !== 'actions'">{{ item[col.key] }}</ng-container>
          </ng-template>
        </app-data-table>
      </div>

      <app-modal [isOpen]="isModalOpen()" [title]="isEditing() ? 'Edit Course' : 'Add Course'" (close)="closeModal()">
        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-4 p-4">
          <div><label class="block text-sm font-medium text-gray-700">Code</label><input type="text" formControlName="code" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"></div>
          <div><label class="block text-sm font-medium text-gray-700">Name</label><input type="text" formControlName="name" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"></div>
          <div><label class="block text-sm font-medium text-gray-700">Description</label><textarea formControlName="description" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"></textarea></div>
          <div><label class="block text-sm font-medium text-gray-700">Department</label>
            <select formControlName="departmentId" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm">
              <option *ngFor="let dept of departments()" [value]="dept.id">{{ dept.name }}</option>
            </select>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div><label class="block text-sm">Duration (Years)</label><input type="number" formControlName="durationYears" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"></div>
            <div><label class="block text-sm">Total Semesters</label><input type="number" formControlName="totalSemesters" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"></div>
          </div>
          <div><label class="block text-sm font-medium text-gray-700">Degree Type</label>
            <select formControlName="degreeType" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm">
              <option value="BACHELOR">BACHELOR</option><option value="MASTER">MASTER</option><option value="DIPLOMA">DIPLOMA</option><option value="DOCTORATE">DOCTORATE</option>
            </select>
          </div>
          <div class="flex items-center"><input type="checkbox" formControlName="isActive" class="h-4 w-4 text-indigo-600 border-gray-300 rounded"><label class="ml-2 block text-sm text-gray-900">Active</label></div>
          <div class="mt-5 sm:mt-6 sm:flex sm:flex-row-reverse">
            <button type="submit" [disabled]="form.invalid || submitting()" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm">Save</button>
            <button type="button" (click)="closeModal()" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:w-auto sm:text-sm">Cancel</button>
          </div>
        </form>
      </app-modal>

      <app-confirm-dialog [isOpen]="isConfirmOpen()" title="Delete Course" message="Are you sure you want to delete this course?" confirmText="Delete" cancelText="Cancel" (confirm)="deleteCourse()" (cancel)="closeConfirm()"></app-confirm-dialog>
    </div>
  `
})
export class CourseListComponent implements OnInit {
  private courseService = inject(CourseService);
  private deptService = inject(DepartmentService);
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);

  courses = signal<CourseResponse[]>([]);
  departments = signal<DepartmentSummaryResponse[]>([]);
  totalElements = signal<number>(0);
  loading = signal<boolean>(false);
  submitting = signal<boolean>(false);
  
  isModalOpen = signal<boolean>(false);
  isConfirmOpen = signal<boolean>(false);
  isEditing = signal<boolean>(false);
  selectedCourse = signal<CourseResponse | null>(null);

  currentPage = 0;
  pageSize = 10;
  searchQuery = '';

  columns = [
    { key: 'code', label: 'Code' },
    { key: 'name', label: 'Name' },
    { key: 'departmentName', label: 'Department' },
    { key: 'status', label: 'Status' },
    { key: 'actions', label: 'Actions' }
  ];

  form: FormGroup = this.fb.group({
    code: ['', Validators.required],
    name: ['', Validators.required],
    description: [''],
    departmentId: [null, Validators.required],
    durationYears: [null, Validators.required],
    totalSemesters: [null, Validators.required],
    degreeType: ['BACHELOR', Validators.required],
    isActive: [true]
  });

  isAdminOrDean = signal<boolean>(false);

  ngOnInit() {
    this.isAdminOrDean.set(this.authService.hasAnyRole(['ROLE_SUPER_ADMIN', 'ROLE_ADMIN', 'ROLE_DEAN']));
    this.loadData();
    this.deptService.getAll(0, 100).subscribe(res => this.departments.set(res.content));
  }

  loadData() {
    this.loading.set(true);
    this.courseService.getAll(this.currentPage, this.pageSize).pipe(
      finalize(() => this.loading.set(false))
    ).subscribe({
      next: (response) => {
        let content = response.content;
        if (this.searchQuery) {
          content = content.filter(c => c.name.toLowerCase().includes(this.searchQuery.toLowerCase()) || c.code.toLowerCase().includes(this.searchQuery.toLowerCase()));
        }
        this.courses.set(content as any);
        this.totalElements.set(response.totalElements);
      }
    });
  }

  onPageChange(page: number) { this.currentPage = page; this.loadData(); }
  onSearch(query: string) { this.searchQuery = query; this.currentPage = 0; this.loadData(); }

  openCreateModal() { this.isEditing.set(false); this.form.reset({degreeType: 'BACHELOR', isActive: true}); this.isModalOpen.set(true); }
  openEditModal(course: CourseResponse) { this.isEditing.set(true); this.selectedCourse.set(course); this.form.patchValue(course); this.isModalOpen.set(true); }
  closeModal() { this.isModalOpen.set(false); }

  openDeleteConfirm(course: CourseResponse) { this.selectedCourse.set(course); this.isConfirmOpen.set(true); }
  closeConfirm() { this.isConfirmOpen.set(false); }

  onSubmit() {
    if (this.form.invalid) return;
    this.submitting.set(true);
    const request = this.form.value;
    
    const obs = this.isEditing() ? this.courseService.update(this.selectedCourse()!.id, request) : this.courseService.create(request);
    obs.pipe(finalize(() => this.submitting.set(false))).subscribe({
      next: () => { this.closeModal(); this.loadData(); }
    });
  }

  deleteCourse() {
    const id = this.selectedCourse()?.id;
    if (id) {
      this.courseService.delete(id).subscribe({ next: () => { this.closeConfirm(); this.loadData(); } });
    }
  }
}
