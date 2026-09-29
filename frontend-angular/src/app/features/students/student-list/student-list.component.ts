import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { StudentService } from '../../../core/services/student.service';
import { DepartmentService } from '../../../core/services/department.service';
import { CourseService } from '../../../core/services/course.service';
import { AuthService } from '../../../core/services/auth.service';
import { StudentResponse, DepartmentSummaryResponse, CourseSummaryResponse } from '../../../core/models/models';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { DataTableComponent } from '../../../shared/components/data-table/data-table.component';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, PageHeaderComponent, DataTableComponent, ModalComponent, ConfirmDialogComponent, StatusBadgeComponent],
  template: `
    <div class="p-6">
      <app-page-header title="Students"   (actionClicked)="openCreateModal()"></app-page-header>
      
      <div class="mt-6 bg-white rounded-lg shadow">
        <app-data-table [columns]="columns" [data]="students()" [totalElements]="0" [loading]="loading()" (pageChange)="onPageChange($event)" >
          <ng-template #cellTemplate let-col let-item>
            <ng-container *ngIf="col.key === 'fullName'">{{ item.firstName }} {{ item.lastName }}</ng-container>
            <ng-container *ngIf="col.key === 'status'"><app-status-badge [status]="item.status"></app-status-badge></ng-container>
            <ng-container *ngIf="col.key === 'actions'">
              <div class="flex space-x-2">
                <a [routerLink]="['/students', item.id]" class="text-blue-600 hover:text-blue-900">View</a>
                <button *ngIf="isAdmin()" (click)="openEditModal(item)" class="text-indigo-600 hover:text-indigo-900 ml-2">Edit</button>
                <button *ngIf="isAdmin()" (click)="openDeleteConfirm(item)" class="text-red-600 hover:text-red-900 ml-2">Delete</button>
              </div>
            </ng-container>
            <ng-container *ngIf="col.key !== 'fullName' && col.key !== 'status' && col.key !== 'actions'">{{ item[col.key] }}</ng-container>
          </ng-template>
        </app-data-table>
      </div>

      <app-modal [isOpen]="isModalOpen()" [title]="isEditing() ? 'Edit Student' : 'Add Student'" (close)="closeModal()">
        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-4 p-4">
          <div class="grid grid-cols-2 gap-4">
            <div><label class="block text-sm">First Name</label><input type="text" formControlName="firstName" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"></div>
            <div><label class="block text-sm">Last Name</label><input type="text" formControlName="lastName" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"></div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div><label class="block text-sm">Email</label><input type="email" formControlName="email" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"></div>
            <div><label class="block text-sm">Phone</label><input type="text" formControlName="phone" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"></div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div><label class="block text-sm">Roll Number</label><input type="text" formControlName="rollNumber" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"></div>
            <div><label class="block text-sm">Registration Number</label><input type="text" formControlName="registrationNumber" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"></div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div><label class="block text-sm font-medium text-gray-700">Department</label>
              <select formControlName="departmentId" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm">
                <option *ngFor="let dept of departments()" [value]="dept.id">{{ dept.name }}</option>
              </select>
            </div>
            <div><label class="block text-sm font-medium text-gray-700">Course</label>
              <select formControlName="courseId" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm">
                <option *ngFor="let c of courses()" [value]="c.id">{{ c.name }}</option>
              </select>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div><label class="block text-sm">Current Semester</label><input type="number" formControlName="currentSemester" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"></div>
            <div><label class="block text-sm">Batch Year</label><input type="text" formControlName="batchYear" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"></div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div><label class="block text-sm">Admission Date</label><input type="date" formControlName="admissionDate" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"></div>
            <div><label class="block text-sm">Admission Type</label><input type="text" formControlName="admissionType" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"></div>
          </div>
          <div class="mt-5 sm:mt-6 sm:flex sm:flex-row-reverse">
            <button type="submit" [disabled]="form.invalid || submitting()" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm">Save</button>
            <button type="button" (click)="closeModal()" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:w-auto sm:text-sm">Cancel</button>
          </div>
        </form>
      </app-modal>

      <app-confirm-dialog [isOpen]="isConfirmOpen()" title="Delete Student" message="Are you sure you want to delete this student?" confirmText="Delete" cancelText="Cancel" (confirm)="deleteStudent()" (cancel)="closeConfirm()"></app-confirm-dialog>
    </div>
  `
})
export class StudentListComponent implements OnInit {
  private studentService = inject(StudentService);
  private deptService = inject(DepartmentService);
  private courseService = inject(CourseService);
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);

  students = signal<StudentResponse[]>([]);
  departments = signal<DepartmentSummaryResponse[]>([]);
  courses = signal<CourseSummaryResponse[]>([]);
  totalElements = signal<number>(0);
  loading = signal<boolean>(false);
  submitting = signal<boolean>(false);
  
  isModalOpen = signal<boolean>(false);
  isConfirmOpen = signal<boolean>(false);
  isEditing = signal<boolean>(false);
  selectedStudent = signal<StudentResponse | null>(null);

  currentPage = 0;
  pageSize = 10;
  searchQuery = '';

  columns = [
    { key: 'rollNumber', label: 'Roll No.' },
    { key: 'fullName', label: 'Name' },
    { key: 'departmentName', label: 'Department' },
    { key: 'courseName', label: 'Course' },
    { key: 'currentSemester', label: 'Sem' },
    { key: 'status', label: 'Status' },
    { key: 'actions', label: 'Actions' }
  ];

  form: FormGroup = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    departmentId: [null, Validators.required],
    courseId: [null, Validators.required],
    currentSemester: [null, Validators.required],
    rollNumber: ['', Validators.required],
    registrationNumber: ['', Validators.required],
    admissionDate: ['', Validators.required],
    admissionType: ['', Validators.required],
    batchYear: ['', Validators.required]
  });

  isAdmin = signal<boolean>(false);

  ngOnInit() {
    this.isAdmin.set(this.authService.hasAnyRole(['ROLE_SUPER_ADMIN', 'ROLE_ADMIN']));
    this.loadData();
    this.deptService.getAll(0, 100).subscribe(res => this.departments.set(res.content));
    this.courseService.getAll(0, 100).subscribe(res => this.courses.set(res.content));
  }

  loadData() {
    this.loading.set(true);
    this.studentService.getAll(this.currentPage, this.pageSize).pipe(
      finalize(() => this.loading.set(false))
    ).subscribe({
      next: (response) => {
        let content = response.content;
        if (this.searchQuery) {
          content = content.filter(s => s.firstName.toLowerCase().includes(this.searchQuery.toLowerCase()) || s.rollNumber.includes(this.searchQuery));
        }
        this.students.set(content as any);
        this.totalElements.set(response.totalElements);
      }
    });
  }

  onPageChange(page: number) { this.currentPage = page; this.loadData(); }
  onSearch(query: string) { this.searchQuery = query; this.currentPage = 0; this.loadData(); }

  openCreateModal() { this.isEditing.set(false); this.form.reset(); this.isModalOpen.set(true); }
  openEditModal(student: StudentResponse) { this.isEditing.set(true); this.selectedStudent.set(student); this.form.patchValue(student); this.isModalOpen.set(true); }
  closeModal() { this.isModalOpen.set(false); }

  openDeleteConfirm(student: StudentResponse) { this.selectedStudent.set(student); this.isConfirmOpen.set(true); }
  closeConfirm() { this.isConfirmOpen.set(false); }

  onSubmit() {
    if (this.form.invalid) return;
    this.submitting.set(true);
    const request = this.form.value;
    
    const obs = this.isEditing() ? this.studentService.update(this.selectedStudent()!.id, request) : this.studentService.create(request);
    obs.pipe(finalize(() => this.submitting.set(false))).subscribe({
      next: () => { this.closeModal(); this.loadData(); }
    });
  }

  deleteStudent() {
    const id = this.selectedStudent()?.id;
    if (id) {
      this.studentService.delete(id).subscribe({ next: () => { this.closeConfirm(); this.loadData(); } });
    }
  }
}
