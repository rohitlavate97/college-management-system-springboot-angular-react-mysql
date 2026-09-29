import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeaderComponent } from '@app/shared/components/page-header/page-header.component';
import { DataTableComponent } from '@app/shared/components/data-table/data-table.component';
import { LoadingSpinnerComponent } from '@app/shared/components/loading-spinner/loading-spinner.component';
import { AuditLogService } from '@app/core/services/audit-log.service';

@Component({
  selector: 'app-audit-logs',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent, DataTableComponent, LoadingSpinnerComponent],
  template: `
    <div class="p-6">
      <app-page-header title="Audit Logs" description="System wide activity logs (Read-only)"></app-page-header>

      <div *ngIf="isLoading()" class="flex justify-center p-8">
        <app-loading-spinner></app-loading-spinner>
      </div>

      <div *ngIf="!isLoading()" class="bg-white rounded-lg shadow">
        <app-data-table
          [columns]="columns"
          [data]="logs()"
          [pageSize]="20"
          [totalElements]="logs().length">
          <ng-template #cellTemplate let-col="column" let-row="row">
            <ng-container [ngSwitch]="col.key">
              <ng-container *ngSwitchCase="'timestamp'">
                {{ row.timestamp | date:'medium' }}
              </ng-container>
              <ng-container *ngSwitchCase="'action'">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      [ngClass]="getActionClass(row.action)">
                  {{ row.action }}
                </span>
              </ng-container>
              <ng-container *ngSwitchDefault>
                {{ row[col.key] }}
              </ng-container>
            </ng-container>
          </ng-template>
        </app-data-table>
      </div>
    </div>
  `
})
export class AuditLogsComponent implements OnInit {
  auditLogService = inject(AuditLogService);

  logs = signal<any[]>([]);
  isLoading = signal(true);

  columns = [
    { key: 'timestamp', label: 'Timestamp', sortable: true },
    { key: 'userEmail', label: 'User', sortable: true },
    { key: 'action', label: 'Action', sortable: true },
    { key: 'entityType', label: 'Entity', sortable: true },
    { key: 'entityId', label: 'Entity ID', sortable: false },
    { key: 'details', label: 'Details', sortable: false },
    { key: 'ipAddress', label: 'IP Address', sortable: false }
  ];

  ngOnInit() {
    this.loadLogs();
  }

  loadLogs() {
    this.isLoading.set(true);
    this.auditLogService.getAll().subscribe({
      next: (res) => {
        this.logs.set(res.content || []);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  getActionClass(action: string): string {
    switch (action?.toUpperCase()) {
      case 'CREATE': return 'bg-green-100 text-green-800';
      case 'UPDATE': return 'bg-blue-100 text-blue-800';
      case 'DELETE': return 'bg-red-100 text-red-800';
      case 'LOGIN': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }
}
