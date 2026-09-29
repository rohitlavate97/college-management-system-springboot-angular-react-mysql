import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PageHeaderComponent } from '@app/shared/components/page-header/page-header.component';
import { DataTableComponent } from '@app/shared/components/data-table/data-table.component';
import { LoadingSpinnerComponent } from '@app/shared/components/loading-spinner/loading-spinner.component';
import { StatusBadgeComponent } from '@app/shared/components/status-badge/status-badge.component';
import { AuthService } from '@app/core/services/auth.service';
import { ExaminationService } from '@app/core/services/examination.service';
import { ModalComponent } from '@app/shared/components/modal/modal.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-examination-list',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule,
    ReactiveFormsModule,
    PageHeaderComponent, 
    DataTableComponent, 
    LoadingSpinnerComponent, 
    StatusBadgeComponent,
    ModalComponent
  ],
  template: `
    <div class="p-6">
      <app-page-header 
        title="Examinations" 
        description="Manage academic examinations">
        <button *ngIf="canManageExams()" (click)="showCreateModal.set(true)" class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
          Create Exam
        </button>
      </app-page-header>
      
      <div *ngIf="isLoading()" class="flex justify-center p-8">
        <app-loading-spinner></app-loading-spinner>
      </div>

      <div *ngIf="!isLoading()" class="bg-white rounded-lg shadow">
        <app-data-table
          [columns]="columns"
          [data]="exams()"
          [pageSize]="10"
          [totalElements]="exams().length">
          <ng-template #cellTemplate let-col="column" let-row="row">
            <ng-container [ngSwitch]="col.key">
              <ng-container *ngSwitchCase="'status'">
                <app-status-badge [status]="row.status"></app-status-badge>
              </ng-container>
              <ng-container *ngSwitchCase="'startDate'">
                {{ row.startDate | date }} - {{ row.endDate | date }}
              </ng-container>
              <ng-container *ngSwitchCase="'actions'">
                <div class="flex gap-2">
                  <a [routerLink]="['/examinations', row.id]" class="text-indigo-600 hover:text-indigo-900 text-sm">View</a>
                </div>
              </ng-container>
              <ng-container *ngSwitchDefault>
                {{ row[col.key] }}
              </ng-container>
            </ng-container>
          </ng-template>
        </app-data-table>
      </div>

      <app-modal *ngIf="showCreateModal()" title="Create Examination" (close)="showCreateModal.set(false)">
        <form [formGroup]="examForm" (ngSubmit)="createExam()">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Name</label>
              <input type="text" formControlName="name" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Academic Year</label>
                <input type="text" formControlName="academicYear" placeholder="e.g. 2023-2024" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Semester</label>
                <input type="number" formControlName="semester" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Type</label>
              <select formControlName="examType" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                <option value="MIDTERM">Midterm</option>
                <option value="FINAL">Final</option>
                <option value="INTERNAL">Internal</option>
                <option value="PRACTICAL">Practical</option>
              </select>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Start Date</label>
                <input type="date" formControlName="startDate" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">End Date</label>
                <input type="date" formControlName="endDate" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Description</label>
              <textarea formControlName="description" rows="3" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"></textarea>
            </div>
          </div>
          <div class="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
            <button type="submit" [disabled]="examForm.invalid || isSubmitting()" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none sm:col-start-2 sm:text-sm disabled:opacity-50">
              Save
            </button>
            <button type="button" (click)="showCreateModal.set(false)" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:col-start-1 sm:text-sm">
              Cancel
            </button>
          </div>
        </form>
      </app-modal>
    </div>
  `
})
export class ExaminationListComponent implements OnInit {
  authService = inject(AuthService);
  examinationService = inject(ExaminationService);
  fb = inject(FormBuilder);

  exams = signal<any[]>([]);
  isLoading = signal(true);
  showCreateModal = signal(false);
  isSubmitting = signal(false);

  examForm: FormGroup;

  columns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'academicYear', label: 'Academic Year', sortable: true },
    { key: 'semester', label: 'Semester', sortable: true },
    { key: 'examType', label: 'Type', sortable: true },
    { key: 'startDate', label: 'Duration', sortable: false },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'actions', label: 'Actions', sortable: false }
  ];

  constructor() {
    this.examForm = this.fb.group({
      name: ['', Validators.required],
      academicYear: ['', Validators.required],
      semester: [1, [Validators.required, Validators.min(1)]],
      examType: ['FINAL', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      description: ['']
    });
  }

  ngOnInit() {
    this.loadExams();
  }

  canManageExams(): boolean {
    const role: string = this.authService.currentUser()?.roles?.[0] || "";
    return role === 'ROLE_ADMIN' || role === 'ROLE_HOD';
  }

  loadExams() {
    this.isLoading.set(true);
    this.examinationService.getAll().subscribe({
      next: (res) => {
        this.exams.set(res.content || []);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }

  createExam() {
    if (this.examForm.invalid) return;
    this.isSubmitting.set(true);
    this.examinationService.create(this.examForm.value).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.showCreateModal.set(false);
        this.examForm.reset({ examType: 'FINAL', semester: 1 });
        this.loadExams();
      },
      error: () => {
        this.isSubmitting.set(false);
        alert('Error creating examination');
      }
    });
  }
}
