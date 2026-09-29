import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeaderComponent } from '@app/shared/components/page-header/page-header.component';
import { LoadingSpinnerComponent } from '@app/shared/components/loading-spinner/loading-spinner.component';
import { NotificationService } from '@app/core/services/notification.service';
import { AuthService } from '@app/core/services/auth.service';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent, LoadingSpinnerComponent],
  template: `
    <div class="p-6">
      <app-page-header title="Notifications" description="View and manage your alerts">
        <button *ngIf="notifications().length > 0" (click)="markAllRead()" class="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200">
          Mark All Read
        </button>
      </app-page-header>

      <div *ngIf="isLoading()" class="flex justify-center p-8">
        <app-loading-spinner></app-loading-spinner>
      </div>

      <div *ngIf="!isLoading()">
        <div *ngIf="notifications().length === 0" class="text-center py-12 bg-white rounded-lg shadow">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">No notifications</h3>
          <p class="mt-1 text-sm text-gray-500">You're all caught up.</p>
        </div>

        <ul class="space-y-4" *ngIf="notifications().length > 0">
          <li *ngFor="let note of notifications()" 
              class="bg-white shadow rounded-lg p-4 cursor-pointer transition-colors duration-150"
              [class.bg-blue-50]="!note.read"
              [class.border-l-4]="!note.read"
              [class.border-blue-500]="!note.read"
              (click)="markAsRead(note)">
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <div class="flex items-center">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mr-2" 
                        [ngClass]="getBadgeClass(note.type)">
                    {{note.type}}
                  </span>
                  <h4 class="text-sm font-bold text-gray-900">{{note.title}}</h4>
                </div>
                <p class="mt-1 text-sm text-gray-600">{{note.message}}</p>
                <p class="mt-1 text-xs text-gray-400">{{note.createdAt | date:'medium'}}</p>
              </div>
              <div *ngIf="!note.read" class="ml-4 flex-shrink-0">
                <span class="h-3 w-3 rounded-full bg-blue-600 inline-block"></span>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  `
})
export class NotificationsComponent implements OnInit {
  notificationService = inject(NotificationService);
  authService = inject(AuthService);

  notifications = signal<any[]>([]);
  isLoading = signal(true);

  ngOnInit() {
    this.loadNotifications();
  }

  loadNotifications() {
    this.isLoading.set(true);
    this.notificationService.getList().subscribe({
      next: (res) => {
        this.notifications.set(res.content || []);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  markAsRead(note: any) {
    if (note.read) return;
    this.notificationService.markRead(note.id).subscribe(() => {
      note.read = true;
      this.notifications.update(notes => [...notes]);
    });
  }

  markAllRead() {
    this.notificationService.markAllRead().subscribe(() => {
      this.notifications.update(notes => 
        notes.map(n => ({ ...n, read: true }))
      );
    });
  }

  getBadgeClass(type: string): string {
    switch (type) {
      case 'EXAM': return 'bg-purple-100 text-purple-800';
      case 'FEE': return 'bg-green-100 text-green-800';
      case 'ATTENDANCE': return 'bg-yellow-100 text-yellow-800';
      case 'SYSTEM': return 'bg-gray-100 text-gray-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  }
}
