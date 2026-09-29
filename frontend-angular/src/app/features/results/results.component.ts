import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormArray } from '@angular/forms';
import { PageHeaderComponent } from '@app/shared/components/page-header/page-header.component';
import { DataTableComponent } from '@app/shared/components/data-table/data-table.component';
import { LoadingSpinnerComponent } from '@app/shared/components/loading-spinner/loading-spinner.component';
import { AuthService } from '@app/core/services/auth.service';
import { ResultService } from '@app/core/services/result.service';
import { ExaminationService } from '@app/core/services/examination.service';
import { StudentService } from '@app/core/services/student.service';
import { SubjectService } from '@app/core/services/subject.service';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    PageHeaderComponent, 
    DataTableComponent, 
    LoadingSpinnerComponent
  ],
  template: `
    <div class="p-6">
      <app-page-header title="Results & Grading" description="Manage academic results and view report cards"></app-page-header>
      
      <div class="mb-4 border-b border-gray-200">
        <ul class="flex flex-wrap -mb-px text-sm font-medium text-center" id="myTab" role="tablist">
          <li class="mr-2" role="presentation" *ngIf="canEnterGrades()">
            <button class="inline-block p-4 border-b-2 rounded-t-lg" [class.border-blue-600]="activeTab() === 'entry'" [class.text-blue-600]="activeTab() === 'entry'" [class.border-transparent]="activeTab() !== 'entry'" (click)="activeTab.set('entry')">Grade Entry</button>
          </li>
          <li class="mr-2" role="presentation">
            <button class="inline-block p-4 border-b-2 rounded-t-lg" [class.border-blue-600]="activeTab() === 'reports'" [class.text-blue-600]="activeTab() === 'reports'" [class.border-transparent]="activeTab() !== 'reports'" (click)="activeTab.set('reports')">Report Cards</button>
          </li>
        </ul>
      </div>

      <div *ngIf="activeTab() === 'entry' && canEnterGrades()">
        <div class="bg-white p-4 shadow rounded-lg mb-4">
          <form [formGroup]="filterForm" (ngSubmit)="loadStudentsForGrading()" class="flex gap-4 items-end">
            <div class="flex-1">
              <label class="block text-sm font-medium text-gray-700">Examination</label>
              <select formControlName="examinationId" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                <option value="">Select Examination</option>
                <option *ngFor="let exam of exams()" [value]="exam.id">{{exam.name}}</option>
              </select>
            </div>
            <div class="flex-1">
              <label class="block text-sm font-medium text-gray-700">Subject</label>
              <select formControlName="subjectId" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                <option value="">Select Subject</option>
                <option *ngFor="let sub of subjects()" [value]="sub.id">{{sub.name}}</option>
              </select>
            </div>
            <div>
              <button type="submit" [disabled]="!filterForm.valid" class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50">Load Students</button>
            </div>
          </form>
        </div>

        <div class="bg-white shadow rounded-lg overflow-hidden" *ngIf="studentsToGrade().length > 0">
          <form [formGroup]="gradingForm" (ngSubmit)="submitGrades()">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Marks Obtained</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Marks</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remarks</th>
                </tr>
              </thead>
              <tbody formArrayName="records" class="bg-white divide-y divide-gray-200">
                <tr *ngFor="let record of gradingRecords.controls; let i = index" [formGroupName]="i">
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{studentsToGrade()[i].firstName}} {{studentsToGrade()[i].lastName}}</td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <input type="number" formControlName="marksObtained" class="block w-24 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <input type="number" formControlName="totalMarks" class="block w-24 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <input type="text" formControlName="remarks" class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                  </td>
                </tr>
              </tbody>
            </table>
            <div class="p-4 border-t border-gray-200 flex justify-end">
              <button type="submit" [disabled]="!gradingForm.valid || isSubmitting()" class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50">
                {{ isSubmitting() ? 'Saving...' : 'Save Grades' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div *ngIf="activeTab() === 'reports'">
        <div *ngIf="isLoading()" class="flex justify-center p-8">
          <app-loading-spinner></app-loading-spinner>
        </div>

        <div *ngIf="!isLoading()">
          <app-data-table
            [columns]="columns"
            [data]="reportData()"
            [pageSize]="10"
            [totalElements]="reportData().length">
          </app-data-table>
        </div>
      </div>
    </div>
  `
})
export class ResultsComponent implements OnInit {
  authService = inject(AuthService);
  resultService = inject(ResultService);
  examinationService = inject(ExaminationService);
  studentService = inject(StudentService);
  subjectService = inject(SubjectService);
  fb = inject(FormBuilder);

  activeTab = signal<'entry'|'reports'>('reports');
  exams = signal<any[]>([]);
  subjects = signal<any[]>([]);
  studentsToGrade = signal<any[]>([]);
  reportData = signal<any[]>([]);
  isLoading = signal(false);
  isSubmitting = signal(false);

  filterForm: FormGroup;
  gradingForm: FormGroup;

  columns = [
    { key: 'examinationName', label: 'Examination', sortable: true },
    { key: 'subjectName', label: 'Subject', sortable: true },
    { key: 'marksObtained', label: 'Marks', sortable: true },
    { key: 'totalMarks', label: 'Total', sortable: true },
    { key: 'grade', label: 'Grade', sortable: true },
    { key: 'status', label: 'Status', sortable: true }
  ];

  constructor() {
    this.filterForm = this.fb.group({
      examinationId: ['', Validators.required],
      subjectId: ['', Validators.required]
    });

    this.gradingForm = this.fb.group({
      records: this.fb.array([])
    });
  }

  ngOnInit() {
    if (this.canEnterGrades()) {
      this.activeTab.set('entry');
      this.loadExamsAndSubjects();
    } else {
      this.loadMyReports();
    }
  }

  canEnterGrades(): boolean {
    const role: string = this.authService.currentUser()?.roles?.[0] || "";
    return role === 'ROLE_ADMIN' || role === 'ROLE_PROFESSOR' || role === 'ROLE_HOD';
  }

  loadExamsAndSubjects() {
    this.examinationService.getAll().subscribe((res: any) => {
      this.exams.set(res.content || []);
    });
    this.subjectService.getAll().subscribe((res: any) => {
      this.subjects.set(res.content || []);
    });
  }

  loadStudentsForGrading() {
    if (this.filterForm.invalid) return;
    this.studentService.getAll().subscribe((res: any) => {
      const students = res.content || [];
      this.studentsToGrade.set(students);
      
      const recordsArray = this.gradingForm.get('records') as FormArray;
      recordsArray.clear();
      
      students.forEach((s: any) => {
        recordsArray.push(this.fb.group({
          studentId: [s.id],
          marksObtained: [0, [Validators.required, Validators.min(0)]],
          totalMarks: [100, [Validators.required, Validators.min(1)]],
          remarks: ['']
        }));
      });
    });
  }

  get gradingRecords() {
    return this.gradingForm.get('records') as FormArray;
  }

  submitGrades() {
    if (this.gradingForm.invalid) return;
    
    this.isSubmitting.set(true);
    const formVal = this.filterForm.value;
    const records = this.gradingForm.value.records.map((r: any) => ({
      ...r,
      examinationId: formVal.examinationId,
      subjectId: formVal.subjectId
    }));

    // assuming resultService.saveResultsBatch exists
    this.resultService.entry({ examSubjectId: this.filterForm.value.subjectId, marks: records.map((r: any) => ({ studentId: r.studentId, marksObtained: r.marksObtained, remarks: r.remarks })) }).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.studentsToGrade.set([]);
        alert('Grades saved successfully');
      },
      error: () => {
        this.isSubmitting.set(false);
        alert('Error saving grades');
      }
    });
  }

  loadMyReports() {
    this.isLoading.set(true);
    this.resultService.getReportCard(this.authService.currentUser()?.id || 0, 0) /* 0 is placeholder for examId if not provided in UI */.subscribe({
      next: (res) => {
        this.reportData.set(res.results || []);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }
}
