import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormArray } from '@angular/forms';
import { PageHeaderComponent } from '@app/shared/components/page-header/page-header.component';
import { DataTableComponent } from '@app/shared/components/data-table/data-table.component';
import { LoadingSpinnerComponent } from '@app/shared/components/loading-spinner/loading-spinner.component';
import { StatusBadgeComponent } from '@app/shared/components/status-badge/status-badge.component';
import { AuthService } from '@app/core/services/auth.service';
import { AttendanceService } from '@app/core/services/attendance.service';
import { SubjectService } from '@app/core/services/subject.service';
import { StudentService } from '@app/core/services/student.service';

@Component({
  selector: 'app-attendance',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    PageHeaderComponent, 
    DataTableComponent, 
    LoadingSpinnerComponent, 
    StatusBadgeComponent
  ],
  template: `
    <div class="p-6">
      <app-page-header title="Attendance Management" description="Manage and view student attendance"></app-page-header>
      
      <div class="mb-4 border-b border-gray-200">
        <ul class="flex flex-wrap -mb-px text-sm font-medium text-center" id="myTab" role="tablist">
          <li class="mr-2" role="presentation" *ngIf="canMarkAttendance()">
            <button class="inline-block p-4 border-b-2 rounded-t-lg" [class.border-blue-600]="activeTab() === 'mark'" [class.text-blue-600]="activeTab() === 'mark'" [class.border-transparent]="activeTab() !== 'mark'" (click)="activeTab.set('mark')">Mark Attendance</button>
          </li>
          <li class="mr-2" role="presentation">
            <button class="inline-block p-4 border-b-2 rounded-t-lg" [class.border-blue-600]="activeTab() === 'view'" [class.text-blue-600]="activeTab() === 'view'" [class.border-transparent]="activeTab() !== 'view'" (click)="activeTab.set('view')">View Attendance</button>
          </li>
        </ul>
      </div>

      <div *ngIf="activeTab() === 'mark' && canMarkAttendance()">
        <div class="bg-white p-4 shadow rounded-lg mb-4">
          <form [formGroup]="filterForm" (ngSubmit)="loadStudentsForAttendance()" class="flex gap-4 items-end">
            <div class="flex-1">
              <label class="block text-sm font-medium text-gray-700">Subject</label>
              <select formControlName="subjectId" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                <option value="">Select Subject</option>
                <option *ngFor="let subject of subjects()" [value]="subject.id">{{subject.name}}</option>
              </select>
            </div>
            <div class="flex-1">
              <label class="block text-sm font-medium text-gray-700">Date</label>
              <input type="date" formControlName="date" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
            </div>
            <div>
              <button type="submit" [disabled]="!filterForm.valid" class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50">Load Students</button>
            </div>
          </form>
        </div>

        <div class="bg-white shadow rounded-lg overflow-hidden" *ngIf="studentsToMark().length > 0">
          <form [formGroup]="attendanceForm" (ngSubmit)="submitAttendance()">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remarks</th>
                </tr>
              </thead>
              <tbody formArrayName="records" class="bg-white divide-y divide-gray-200">
                <tr *ngFor="let record of attendanceRecords.controls; let i = index" [formGroupName]="i">
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{studentsToMark()[i].firstName}} {{studentsToMark()[i].lastName}}</td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex gap-4">
                      <label class="inline-flex items-center">
                        <input type="radio" formControlName="status" value="PRESENT" class="form-radio text-green-600">
                        <span class="ml-2 text-sm">Present</span>
                      </label>
                      <label class="inline-flex items-center">
                        <input type="radio" formControlName="status" value="ABSENT" class="form-radio text-red-600">
                        <span class="ml-2 text-sm">Absent</span>
                      </label>
                      <label class="inline-flex items-center">
                        <input type="radio" formControlName="status" value="LATE" class="form-radio text-yellow-600">
                        <span class="ml-2 text-sm">Late</span>
                      </label>
                      <label class="inline-flex items-center">
                        <input type="radio" formControlName="status" value="EXCUSED" class="form-radio text-blue-600">
                        <span class="ml-2 text-sm">Excused</span>
                      </label>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <input type="text" formControlName="remarks" class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                  </td>
                </tr>
              </tbody>
            </table>
            <div class="p-4 border-t border-gray-200 flex justify-end">
              <button type="submit" [disabled]="!attendanceForm.valid || isSubmitting()" class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50">
                {{ isSubmitting() ? 'Submitting...' : 'Save Attendance' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div *ngIf="activeTab() === 'view'">
        <div class="bg-white p-4 shadow rounded-lg mb-4 flex gap-4 items-end" *ngIf="canMarkAttendance()">
           <div class="flex-1">
              <label class="block text-sm font-medium text-gray-700">Student ID / Name</label>
              <input type="text" [formControl]="searchControl" placeholder="Search student..." class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
           </div>
        </div>

        <div *ngIf="isLoading()" class="flex justify-center p-8">
          <app-loading-spinner></app-loading-spinner>
        </div>

        <div *ngIf="!isLoading()">
          <app-data-table
            [columns]="columns"
            [data]="attendanceData()"
            [pageSize]="10"
            [totalElements]="attendanceData().length">
            <ng-template #cellTemplate let-col="column" let-row="row">
              <ng-container [ngSwitch]="col.key">
                <ng-container *ngSwitchCase="'status'">
                  <app-status-badge [status]="row.status"></app-status-badge>
                </ng-container>
                <ng-container *ngSwitchCase="'date'">
                  {{ row.date | date:'mediumDate' }}
                </ng-container>
                <ng-container *ngSwitchDefault>
                  {{ row[col.key] }}
                </ng-container>
              </ng-container>
            </ng-template>
          </app-data-table>
        </div>
      </div>
    </div>
  `
})
export class AttendanceComponent implements OnInit {
  authService = inject(AuthService);
  attendanceService = inject(AttendanceService);
  subjectService = inject(SubjectService);
  studentService = inject(StudentService);
  fb = inject(FormBuilder);

  activeTab = signal<'mark'|'view'>('view');
  subjects = signal<any[]>([]);
  studentsToMark = signal<any[]>([]);
  attendanceData = signal<any[]>([]);
  isLoading = signal(false);
  isSubmitting = signal(false);

  filterForm: FormGroup;
  attendanceForm: FormGroup;
  searchControl = this.fb.control('');

  columns = [
    { key: 'date', label: 'Date', sortable: true },
    { key: 'subjectName', label: 'Subject', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'remarks', label: 'Remarks', sortable: false }
  ];

  constructor() {
    this.filterForm = this.fb.group({
      subjectId: ['', Validators.required],
      date: [new Date().toISOString().split('T')[0], Validators.required]
    });

    this.attendanceForm = this.fb.group({
      records: this.fb.array([])
    });
  }

  ngOnInit() {
    if (this.canMarkAttendance()) {
      this.activeTab.set('mark');
      this.loadSubjects();
    } else {
      this.columns = [
         { key: 'date', label: 'Date', sortable: true },
         { key: 'subjectName', label: 'Subject', sortable: true },
         { key: 'status', label: 'Status', sortable: true },
         { key: 'remarks', label: 'Remarks', sortable: false }
      ];
      this.loadMyAttendance();
    }
  }

  canMarkAttendance(): boolean {
    const role: string = this.authService.currentUser()?.roles?.[0] || "";
    return role === 'ROLE_ADMIN' || role === 'ROLE_PROFESSOR' || role === 'ROLE_HOD';
  }

  loadSubjects() {
    this.subjectService.getAll().subscribe((res: any) => {
      this.subjects.set(res.content || []);
    });
  }

  loadStudentsForAttendance() {
    if (this.filterForm.invalid) return;
    this.studentService.getAll().subscribe(res => {
      const students = res.content || [];
      this.studentsToMark.set(students);
      
      const recordsArray = this.attendanceForm.get('records') as FormArray;
      recordsArray.clear();
      
      students.forEach((s: any) => {
        recordsArray.push(this.fb.group({
          studentId: [s.id],
          status: ['PRESENT', Validators.required],
          remarks: ['']
        }));
      });
    });
  }

  get attendanceRecords() {
    return this.attendanceForm.get('records') as FormArray;
  }

  submitAttendance() {
    if (this.attendanceForm.invalid) return;
    
    this.isSubmitting.set(true);
    const formVal = this.filterForm.value;
    const records = this.attendanceForm.value.records.map((r: any) => ({
      ...r,
      subjectId: formVal.subjectId,
      date: formVal.date
    }));

    this.attendanceService.markBatch({ subjectId: formVal.subjectId, professorId: this.authService.currentUser()?.id || 0, attendanceDate: formVal.date, records: records.map((r: any) => ({ studentId: r.studentId, status: r.status, remarks: r.remarks })) }).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.studentsToMark.set([]);
        alert('Attendance marked successfully');
      },
      error: () => {
        this.isSubmitting.set(false);
        alert('Error marking attendance');
      }
    });
  }

  loadMyAttendance() {
    this.isLoading.set(true);
    this.attendanceService.getByStudent(this.authService.currentUser()?.id || 0).subscribe({
      next: (res) => {
        this.attendanceData.set(res || []);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }
}
