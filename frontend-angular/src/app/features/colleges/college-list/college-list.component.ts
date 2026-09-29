import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CollegeService } from '../../../core/services/college.service';
import { AuthService } from '../../../core/services/auth.service';
import { CollegeResponse } from '../../../core/models/models';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { DataTableComponent } from '../../../shared/components/data-table/data-table.component';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-college-list',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, PageHeaderComponent, DataTableComponent, ModalComponent, ConfirmDialogComponent, StatusBadgeComponent],
  template: `
    <div class="p-6">
      <app-page-header title="Colleges"   (actionClicked)="openCreateModal()"></app-page-header>
      
      <div class="mt-6 bg-white rounded-lg shadow">
        <app-data-table
          [columns]="columns"
          [data]="colleges()"
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
                <a [routerLink]="['/colleges', item.id]" class="text-blue-600 hover:text-blue-900">View</a>
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

      <app-modal [isOpen]="isModalOpen()" [title]="isEditing() ? 'Edit College' : 'Add College'" (close)="closeModal()">
        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-4 p-4">
          <div><label class="block text-sm font-medium text-gray-700">Name</label><input type="text" formControlName="name" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"></div>
          <div><label class="block text-sm font-medium text-gray-700">Code</label><input type="text" formControlName="code" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"></div>
          <div><label class="block text-sm font-medium text-gray-700">Address</label><input type="text" formControlName="address" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"></div>
          <div class="grid grid-cols-2 gap-4">
            <div><label class="block text-sm">City</label><input type="text" formControlName="city" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"></div>
            <div><label class="block text-sm">State</label><input type="text" formControlName="state" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"></div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div><label class="block text-sm">Country</label><input type="text" formControlName="country" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"></div>
            <div><label class="block text-sm">Pincode</label><input type="text" formControlName="pincode" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"></div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div><label class="block text-sm">Phone</label><input type="text" formControlName="phone" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"></div>
            <div><label class="block text-sm">Email</label><input type="email" formControlName="email" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"></div>
          </div>
          <div><label class="block text-sm">Website</label><input type="text" formControlName="website" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"></div>
          <div><label class="block text-sm">Established Year</label><input type="number" formControlName="establishedYear" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"></div>
          <div class="flex items-center"><input type="checkbox" formControlName="isActive" class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"><label class="ml-2 block text-sm text-gray-900">Active</label></div>
          <div class="mt-5 sm:mt-6 sm:flex sm:flex-row-reverse">
            <button type="submit" [disabled]="form.invalid || submitting()" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm">Save</button>
            <button type="button" (click)="closeModal()" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:w-auto sm:text-sm">Cancel</button>
          </div>
        </form>
      </app-modal>

      <app-confirm-dialog [isOpen]="isConfirmOpen()" title="Delete College" message="Are you sure you want to delete this college? This action cannot be undone." confirmText="Delete" cancelText="Cancel" (confirm)="deleteCollege()" (cancel)="closeConfirm()"></app-confirm-dialog>
    </div>
  `
})
export class CollegeListComponent implements OnInit {
  private collegeService = inject(CollegeService);
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);

  colleges = signal<CollegeResponse[]>([]);
  totalElements = signal<number>(0);
  loading = signal<boolean>(false);
  submitting = signal<boolean>(false);
  
  isModalOpen = signal<boolean>(false);
  isConfirmOpen = signal<boolean>(false);
  isEditing = signal<boolean>(false);
  selectedCollege = signal<CollegeResponse | null>(null);

  currentPage = 0;
  pageSize = 10;
  searchQuery = '';

  columns = [
    { key: 'name', label: 'Name' },
    { key: 'code', label: 'Code' },
    { key: 'city', label: 'City' },
    { key: 'state', label: 'State' },
    { key: 'status', label: 'Status' },
    { key: 'actions', label: 'Actions' }
  ];

  form: FormGroup = this.fb.group({
    name: ['', Validators.required],
    code: ['', Validators.required],
    address: [''],
    city: [''],
    state: [''],
    country: [''],
    pincode: [''],
    phone: [''],
    email: [''],
    website: [''],
    establishedYear: [''],
    isActive: [true]
  });

  isAdmin = signal<boolean>(false);

  ngOnInit() {
    this.isAdmin.set(this.authService.hasAnyRole(['ROLE_SUPER_ADMIN', 'ROLE_ADMIN']));
    this.loadData();
  }

  loadData() {
    this.loading.set(true);
    this.collegeService.getAll(this.currentPage, this.pageSize).pipe(
      finalize(() => this.loading.set(false))
    ).subscribe({
      next: (response) => {
        let content = response.content;
        if (this.searchQuery) {
          content = content.filter(c => c.name.toLowerCase().includes(this.searchQuery.toLowerCase()) || c.code.toLowerCase().includes(this.searchQuery.toLowerCase()));
        }
        this.colleges.set(content as any);
        this.totalElements.set(response.totalElements);
      }
    });
  }

  onPageChange(page: number) { this.currentPage = page; this.loadData(); }
  onSearch(query: string) { this.searchQuery = query; this.currentPage = 0; this.loadData(); }

  openCreateModal() { this.isEditing.set(false); this.form.reset({isActive: true}); this.isModalOpen.set(true); }
  openEditModal(college: CollegeResponse) { this.isEditing.set(true); this.selectedCollege.set(college); this.form.patchValue(college); this.isModalOpen.set(true); }
  closeModal() { this.isModalOpen.set(false); }

  openDeleteConfirm(college: CollegeResponse) { this.selectedCollege.set(college); this.isConfirmOpen.set(true); }
  closeConfirm() { this.isConfirmOpen.set(false); }

  onSubmit() {
    if (this.form.invalid) return;
    this.submitting.set(true);
    const request = this.form.value;
    
    const obs = this.isEditing() ? this.collegeService.update(this.selectedCollege()!.id, request) : this.collegeService.create(request);
    obs.pipe(finalize(() => this.submitting.set(false))).subscribe({
      next: () => { this.closeModal(); this.loadData(); }
    });
  }

  deleteCollege() {
    const id = this.selectedCollege()?.id;
    if (id) {
      this.collegeService.delete(id).subscribe({ next: () => { this.closeConfirm(); this.loadData(); } });
    }
  }
}
