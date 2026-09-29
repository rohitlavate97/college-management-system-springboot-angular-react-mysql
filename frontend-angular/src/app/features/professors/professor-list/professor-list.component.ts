import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProfessorService } from '../../../core/services/professor.service';
import { DepartmentService } from '../../../core/services/department.service';
import { AuthService } from '../../../core/services/auth.service';
import { ProfessorResponse, DepartmentSummaryResponse } from '../../../core/models/models';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { DataTableComponent } from '../../../shared/components/data-table/data-table.component';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-professor-list',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, PageHeaderComponent, DataTableComponent, ModalComponent, ConfirmDialogComponent, StatusBadgeComponent],
  template: `
    <div class="p-6">
      <app-page-header title="Professors"   (actionClicked)="openCreateModal()"></app-page-header>
      
      <div class="mt-6 bg-white rounded-lg shadow">
        <app-data-table
          [columns]="columns"
          [data]="professors()"
          [totalElements]="0"
          [loading]="loading()"
          (pageChange)="onPageChange($event)"
          >
          <ng-template #cellTemplate let-col let-item>
            <ng-container *ngIf="col.key === 'fullName'">{{ item.firstName }} {{ item.lastName }}</ng-container>
            <ng-container *ngIf="col.key === 'status'"><app-status-badge [status]="item.status"></app-status-badge></ng-container>
            <ng-container *ngIf="col.key === 'actions'">
              <div class="flex space-x-2">
                <a [routerLink]="['/professors', item.id]" class="text-blue-600 hover:text-blue-900">View</a>
                <button *ngIf="isAdminOrDean()" (click)="openEditModal(item)" class="text-indigo-600 hover:text-indigo-900 ml-2">Edit</button>
                <button *ngIf="isAdminOrDean()" (click)="openDeleteConfirm(item)" class="text-red-600 hover:text-red-900 ml-2">Delete</button>
              </div>
            </ng-container>
            <ng-container *ngIf="col.key !== 'fullName' && col.key !== 'status' && col.key !== 'actions'">{{ item[col.key] }}</ng-container>
          </ng-template>
        </app-data-table>
      </div>

      <app-modal [isOpen]="isModalOpen()" [title]="isEditing() ? 'Edit Professor' : 'Add Professor'" (close)="closeModal()">
        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-4 p-4">
          <div><label class="block text-sm font-medium text-gray-700">Employee ID</label><input type="text" formControlName="employeeId" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"></div>
          <div class="grid grid-cols-2 gap-4">
            <div><label class="block text-sm">First Name</label><input type="text" formControlName="firstName" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"></div>
            <div><label class="block text-sm">Last Name</label><input type="text" formControlName="lastName" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"></div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div><label class="block text-sm">Email</label><input type="email" formControlName="email" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"></div>
            <div><label class="block text-sm">Phone</label><input type="text" formControlName="phone" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"></div>
          </div>
          <div><label class="block text-sm">Department</label>
            <select formControlName="departmentId" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
              <option *ngFor="let dept of departments()" [value]="dept.id">{{ dept.name }}</option>
            </select>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div><label class="block text-sm">Designation</label><input type="text" formControlName="designation" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"></div>
            <div><label class="block text-sm">Specialization</label><input type="text" formControlName="specialization" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"></div>
          </div>
          <div><label class="block text-sm">Qualification</label><input type="text" formControlName="qualification" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"></div>
          <div class="grid grid-cols-2 gap-4">
            <div><label class="block text-sm">Joining Date</label><input type="date" formControlName="joiningDate" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"></div>
            <div><label class="block text-sm">Status</label>
              <select formControlName="status" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                <option value="ACTIVE">ACTIVE</option><option value="INACTIVE">INACTIVE</option><option value="ON_LEAVE">ON_LEAVE</option><option value="RETIRED">RETIRED</option>
              </select>
            </div>
          </div>
          <div class="mt-5 sm:mt-6 sm:flex sm:flex-row-reverse">
            <button type="submit" [disabled]="form.invalid || submitting()" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm">Save</button>
            <button type="button" (click)="closeModal()" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:w-auto sm:text-sm">Cancel</button>
          </div>
        </form>
      </app-modal>

      <app-confirm-dialog [isOpen]="isConfirmOpen()" title="Delete Professor" message="Are you sure you want to delete this professor?" confirmText="Delete" cancelText="Cancel" (confirm)="deleteProfessor()" (cancel)="closeConfirm()"></app-confirm-dialog>
    </div>
  `
})
export class ProfessorListComponent implements OnInit {
  private profService = inject(ProfessorService);
  private deptService = inject(DepartmentService);
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);

  professors = signal<ProfessorResponse[]>([]);
  departments = signal<DepartmentSummaryResponse[]>([]);
  totalElements = signal<number>(0);
  loading = signal<boolean>(false);
  submitting = signal<boolean>(false);
  
  isModalOpen = signal<boolean>(false);
  isConfirmOpen = signal<boolean>(false);
  isEditing = signal<boolean>(false);
  selectedProf = signal<ProfessorResponse | null>(null);

  currentPage = 0;
  pageSize = 10;
  searchQuery = '';

  columns = [
    { key: 'employeeId', label: 'Emp ID' },
    { key: 'fullName', label: 'Full Name' },
    { key: 'email', label: 'Email' },
    { key: 'departmentName', label: 'Department' },
    { key: 'designation', label: 'Designation' },
    { key: 'status', label: 'Status' },
    { key: 'actions', label: 'Actions' }
  ];

  form: FormGroup = this.fb.group({
    employeeId: ['', Validators.required],
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    departmentId: [null, Validators.required],
    designation: [''],
    specialization: [''],
    qualification: [''],
    joiningDate: [''],
    status: ['ACTIVE']
  });

  isAdminOrDean = signal<boolean>(false);

  ngOnInit() {
    this.isAdminOrDean.set(this.authService.hasAnyRole(['ROLE_SUPER_ADMIN', 'ROLE_ADMIN', 'ROLE_DEAN']));
    this.loadData();
    this.deptService.getAll(0, 100).subscribe(res => this.departments.set(res.content));
  }

  loadData() {
    this.loading.set(true);
    this.profService.getAll(this.currentPage, this.pageSize).pipe(
      finalize(() => this.loading.set(false))
    ).subscribe({
      next: (response) => {
        let content = response.content;
        if (this.searchQuery) {
          content = content.filter(p => (p as any).firstName.toLowerCase().includes(this.searchQuery.toLowerCase()) || (p as any).lastName.toLowerCase().includes(this.searchQuery.toLowerCase()) || p.employeeId.includes(this.searchQuery));
        }
        this.professors.set(content as any[]);
        this.totalElements.set(response.totalElements);
      }
    });
  }

  onPageChange(page: number) { this.currentPage = page; this.loadData(); }
  onSearch(query: string) { this.searchQuery = query; this.currentPage = 0; this.loadData(); }

  openCreateModal() { this.isEditing.set(false); this.form.reset({status: 'ACTIVE'}); this.isModalOpen.set(true); }
  openEditModal(prof: ProfessorResponse) { this.isEditing.set(true); this.selectedProf.set(prof); this.form.patchValue(prof); this.isModalOpen.set(true); }
  closeModal() { this.isModalOpen.set(false); }

  openDeleteConfirm(prof: ProfessorResponse) { this.selectedProf.set(prof); this.isConfirmOpen.set(true); }
  closeConfirm() { this.isConfirmOpen.set(false); }

  onSubmit() {
    if (this.form.invalid) return;
    this.submitting.set(true);
    const request = this.form.value;
    
    const obs = this.isEditing() ? this.profService.update(this.selectedProf()!.id, request) : this.profService.create(request);
    obs.pipe(finalize(() => this.submitting.set(false))).subscribe({
      next: () => { this.closeModal(); this.loadData(); }
    });
  }

  deleteProfessor() {
    const id = this.selectedProf()?.id;
    if (id) {
      this.profService.delete(id).subscribe({ next: () => { this.closeConfirm(); this.loadData(); } });
    }
  }
}
