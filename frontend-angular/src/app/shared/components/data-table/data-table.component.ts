import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white shadow rounded-lg overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th *ngFor="let col of columns" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  (click)="onSort(col.key)">
                {{ col.label }}
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200" *ngIf="!loading && data.length > 0">
            <tr *ngFor="let row of data" class="hover:bg-gray-50">
              <td *ngFor="let col of columns" class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ row[col.key] }}
              </td>
            </tr>
          </tbody>
          <tbody *ngIf="loading">
            <tr *ngFor="let i of [1,2,3,4,5]">
              <td *ngFor="let col of columns" class="px-6 py-4 whitespace-nowrap">
                <div class="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div *ngIf="!loading && data.length === 0" class="py-8 text-center text-gray-500">
        No data available
      </div>
      <!-- Pagination Controls omitted for brevity but would go here -->
    </div>
  `
})
export class DataTableComponent {
  @Input() columns: {key: string, label: string}[] = [];
  @Input() data: any[] = [];
  @Input() loading = false;
  @Input() totalElements = 0;
  @Input() pageSize = 10;
  @Input() currentPage = 0;
  
  @Output() sortChange = new EventEmitter<string>();
  @Output() pageChange = new EventEmitter<number>();

  onSort(key: string) {
    this.sortChange.emit(key);
  }
}
