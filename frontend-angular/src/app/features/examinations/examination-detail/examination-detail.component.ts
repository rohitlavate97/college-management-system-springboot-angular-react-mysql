import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { PageHeaderComponent } from '@app/shared/components/page-header/page-header.component';
import { DataTableComponent } from '@app/shared/components/data-table/data-table.component';
import { LoadingSpinnerComponent } from '@app/shared/components/loading-spinner/loading-spinner.component';
import { StatusBadgeComponent } from '@app/shared/components/status-badge/status-badge.component';
import { AuthService } from '@app/core/services/auth.service';
import { ExaminationService } from '@app/core/services/examination.service';

@Component({
  selector: 'app-examination-detail',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule,
    PageHeaderComponent, 
    DataTableComponent, 
    LoadingSpinnerComponent, 
    StatusBadgeComponent
  ],
  template: `
    <div class="p-6">
      <div class="mb-4">
        <a routerLink="/examinations" class="text-indigo-600 hover:text-indigo-900 font-medium text-sm">&larr; Back to Examinations</a>
      </div>
      
      <div *ngIf="isLoading()" class="flex justify-center p-8">
        <app-loading-spinner></app-loading-spinner>
      </div>

      <div *ngIf="!isLoading() && exam()">
        <div class="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
          <div class="px-4 py-5 sm:px-6 flex justify-between items-center">
            <div>
              <h3 class="text-lg leading-6 font-medium text-gray-900">{{ exam()?.name }}</h3>
              <p class="mt-1 max-w-2xl text-sm text-gray-500">{{ exam()?.academicYear }} - Semester {{ exam()?.semester }}</p>
            </div>
            <div>
              <app-status-badge [status]="exam()?.status"></app-status-badge>
            </div>
          </div>
          <div class="border-t border-gray-200 px-4 py-5 sm:p-0">
            <dl class="sm:divide-y sm:divide-gray-200">
              <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt class="text-sm font-medium text-gray-500">Exam Type</dt>
                <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ exam()?.examType }}</dd>
              </div>
              <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt class="text-sm font-medium text-gray-500">Duration</dt>
                <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ exam()?.startDate | date }} to {{ exam()?.endDate | date }}</dd>
              </div>
              <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt class="text-sm font-medium text-gray-500">Description</dt>
                <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ exam()?.description || 'N/A' }}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ExaminationDetailComponent implements OnInit {
  route = inject(ActivatedRoute);
  authService = inject(AuthService);
  examinationService = inject(ExaminationService);

  examId = '';
  exam = signal<any>(null);
  isLoading = signal(true);

  ngOnInit() {
    this.examId = this.route.snapshot.paramMap.get('id') || '';
    if (this.examId) {
      this.loadExam();
    }
  }

  loadExam() {
    this.isLoading.set(true);
    this.examinationService.getById(Number(this.examId)).subscribe({
      next: (res) => {
        this.exam.set(res);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }
}
