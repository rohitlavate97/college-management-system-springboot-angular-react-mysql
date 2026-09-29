import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="sm:flex sm:items-center sm:justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">{{ title }}</h1>
      </div>
      <div class="mt-4 sm:mt-0" *ngIf="buttonLabel">
        <button type="button" (click)="action.emit()" class="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
          {{ buttonLabel }}
        </button>
      </div>
    </div>
  `
})
export class PageHeaderComponent {
  @Input() title = '';
  @Input() buttonLabel = '';
  @Output() action = new EventEmitter<void>();
}
