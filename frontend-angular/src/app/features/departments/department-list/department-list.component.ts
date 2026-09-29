import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DepartmentService } from '../../../core/services/department.service';
import { CollegeService } from '../../../core/services/college.service';
import { AuthService } from '../../../core/services/auth.service';
import { DepartmentResponse, CollegeSummaryResponse } from '../../../core/models/models';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { DataTableComponent } from '../../../shared/components/data-table/data-table.component';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-department-list',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, PageHeaderComponent, DataTableComponent, ModalComponent, ConfirmDialogComponent, StatusBadgeComponent],
  template: `
    <div class="p-6">
      <app-page-header title="Departments"   (actionClicked)="openCreateModal()"></app-page-header>
      
      <div class="mt-6 bg-white rounded-lg shadow">
        <app-data-table
          [columns]="columns"
          [data]="departments()"
          [totalElements]="0"
          [loading]="loading()"
          (pageChange)="onPageChange($event)"
          >
          <ng-template #cellTemplate let-col let-item>
            <ng-container *ngIf="col.key === 'status'">
              <app-status-badge [status]="item.isActive ? 'ACTIVE' : 'INACTIVE'"></app-status-badge>
            </ng-container>
            <ng-container *ngIf="col.key === 'actions'">
              <div class="flex space-x-2">
                <a [routerLink]="['/departments', item.id]" class="text-blue-600 hover:text-blue-900">View</a>
                <button *ngIf="isAdmin()" (click)="openEditModal(item)" class="text-indigo-600 hover:text-indigo-900 ml-2">Edit</button>
                <button *ngIf="isAdmin()" (click)="openDeleteConfirm(item)" class="text-red-600 hover:text-red-900 ml-2">Delete</button>
              </div>
            </ng-container>
            <ng-container *ngIf="col.key !== 'status' && col.key !== 'actions'">
              {{ item[col.key] }}
            </ng-container>
          </ng-template>
        </app-data-table>
      </div>

      <app-modal [isOpen]="isModalOpen()" [title]="isEditing() ? 'Edit Department' : 'Add Department'" (close)="closeModal()">
        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-4 p-4">
          <div><label class="block text-sm font-medium text-gray-700">Name</label><input type="text" formControlName="name" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"></div>
          <div><label class="block text-sm font-medium text-gray-700">Code</label><input type="text" formControlName="code" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"></div>
          <div><label class="block text-sm font-medium text-gray-700">Description</label><textarea formControlName="description" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"></textarea></div>
          <div><label class="block text-sm font-medium text-gray-700">College</label>
            <select formControlName="collegeId" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm">
              <option *ngFor="let col of colleges()" [value]="col.id">{{ col.name }}</option>
            </select>
          </div>
          <div class="flex items-center"><input type="checkbox" formControlName="isActive" class="h-4 w-4 text-indigo-600 border-gray-300 rounded"><label class="ml-2 block text-sm text-gray-900">Active</label></div>
          <div class="mt-5 sm:mt-6 sm:flex sm:flex-row-reverse">
            <button type="submit" [disabled]="form.invalid || submitting()" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm">Save</button>
            <button type="button" (click)="closeModal()" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:w-auto sm:text-sm">Cancel</button>
          </div>
        </form>
      </app-modal>

      <app-confirm-dialog [isOpen]="isConfirmOpen()" title="Delete Department" message="Are you sure you want to delete this department?" confirmText="Delete" cancelText="Cancel" (confirm)="deleteDepartment()" (cancel)="closeConfirm()"></app-confirm-dialog>
    </div>
  `
})
export class DepartmentListComponent implements OnInit {
  private deptService = inject(DepartmentService);
  private collegeService = inject(CollegeService);
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);

  departments = signal<DepartmentResponse[]>([]);
  colleges = signal<CollegeSummaryResponse[]>([]);
  totalElements = signal<number>(0);
  loading = signal<boolean>(false);
  submitting = signal<boolean>(false);
  
  isModalOpen = signal<boolean>(false);
  isConfirmOpen = signal<boolean>(false);
  isEditing = signal<boolean>(false);
  selectedDept = signal<DepartmentResponse | null>(null);

  currentPage = 0;
  pageSize = 10;
  searchQuery = '';

  columns = [
    { key: 'name', label: 'Name' },
    { key: 'code', label: 'Code' },
    { key: 'collegeName', label: 'College' },
    { key: 'status', label: 'Status' },
    { key: 'actions', label: 'Actions' }
  ];

  form: FormGroup = this.fb.group({
    name: ['', Validators.required],
    code: ['', Validators.required],
    description: [''],
    collegeId: [null, Validators.required],
    isActive: [true]
  });

  isAdmin = signal<boolean>(false);

  ngOnInit() {
    this.isAdmin.set(this.authService.hasAnyRole(['ROLE_SUPER_ADMIN', 'ROLE_ADMIN']));
    this.loadData();
    // Preload colleges for dropdown
    this.collegeService.getAll(0, 100).subscribe(res => this.colleges.set(res.content));
  }

  loadData() {
    this.loading.set(true);
    this.deptService.getAll(this.currentPage, this.pageSize).pipe(
      finalize(() => this.loading.set(false))
    ).subscribe({
      next: (response) => {
        let content = response.content;
        if (this.searchQuery) {
          content = content.filter(d => d.name.toLowerCase().includes(this.searchQuery.toLowerCase()) || d.code.toLowerCase().includes(this.searchQuery.toLowerCase()));
        }
        this.departments.set(content as any);
        this.totalElements.set(response.totalElements);
      }
    });
  }

  onPageChange(page: number) { this.currentPage = page; this.loadData(); }
  onSearch(query: string) { this.searchQuery = query; this.currentPage = 0; this.loadData(); }

  openCreateModal() { this.isEditing.set(false); this.form.reset({isActive: true}); this.isModalOpen.set(true); }
  openEditModal(dept: DepartmentResponse) { this.isEditing.set(true); this.selectedDept.set(dept); this.form.patchValue(dept); this.isModalOpen.set(true); }
  closeModal() { this.isModalOpen.set(false); }

  openDeleteConfirm(dept: DepartmentResponse) { this.selectedDept.set(dept); this.isConfirmOpen.set(true); }
  closeConfirm() { this.isConfirmOpen.set(false); }

  onSubmit() {
    if (this.form.invalid) return;
    this.submitting.set(true);
    const request = this.form.value;
    
    const obs = this.isEditing() ? this.deptService.update(this.selectedDept()!.id, request) : this.deptService.create(request);
    obs.pipe(finalize(() => this.submitting.set(false))).subscribe({
      next: () => { this.closeModal(); this.loadData(); }
    });
  }

  deleteDepartment() {
    const id = this.selectedDept()?.id;
    if (id) {
      this.deptService.delete(id).subscribe({ next: () => { this.closeConfirm(); this.loadData(); } });
    }
  }
}
