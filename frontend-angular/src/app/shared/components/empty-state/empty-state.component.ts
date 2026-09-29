import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="text-center py-12 bg-white rounded-lg border border-gray-200 border-dashed">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900">{{ title }}</h3>
      <p class="mt-1 text-sm text-gray-500">{{ message }}</p>
      <div class="mt-6" *ngIf="actionLabel">
        <button type="button" (click)="action.emit()" class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
          {{ actionLabel }}
        </button>
      </div>
    </div>
  `
})
export class EmptyStateComponent {
  @Input() title = 'No Data';
  @Input() message = 'Get started by creating a new record.';
  @Input() actionLabel = '';
  @Output() action = new EventEmitter<void>();
}
