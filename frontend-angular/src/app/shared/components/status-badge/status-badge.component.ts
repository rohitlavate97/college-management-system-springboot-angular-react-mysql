import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" [ngClass]="getBadgeClasses()">
      {{ status }}
    </span>
  `
})
export class StatusBadgeComponent {
  @Input() status: string = '';

  getBadgeClasses() {
    switch (this.status?.toUpperCase()) {
      case 'ACTIVE': return 'bg-green-100 text-green-800';
      case 'INACTIVE': return 'bg-gray-100 text-gray-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'REJECTED': return 'bg-red-100 text-red-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  }
}
