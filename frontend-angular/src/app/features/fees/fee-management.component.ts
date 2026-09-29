import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PageHeaderComponent } from '@app/shared/components/page-header/page-header.component';
import { DataTableComponent } from '@app/shared/components/data-table/data-table.component';
import { LoadingSpinnerComponent } from '@app/shared/components/loading-spinner/loading-spinner.component';
import { StatusBadgeComponent } from '@app/shared/components/status-badge/status-badge.component';
import { ModalComponent } from '@app/shared/components/modal/modal.component';
import { AuthService } from '@app/core/services/auth.service';
import { FeeService } from '@app/core/services/fee.service';

@Component({
  selector: 'app-fee-management',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    PageHeaderComponent, 
    DataTableComponent, 
    LoadingSpinnerComponent, 
    StatusBadgeComponent,
    ModalComponent
  ],
  template: `
    <div class="p-6">
      <app-page-header title="Fee Management" description="Manage fee structures, invoices, and payments"></app-page-header>
      
      <div class="mb-4 border-b border-gray-200">
        <ul class="flex flex-wrap -mb-px text-sm font-medium text-center" id="myTab" role="tablist">
          <li class="mr-2" role="presentation" *ngIf="canManageFees()">
            <button class="inline-block p-4 border-b-2 rounded-t-lg" [class.border-blue-600]="activeTab() === 'structures'" [class.text-blue-600]="activeTab() === 'structures'" [class.border-transparent]="activeTab() !== 'structures'" (click)="activeTab.set('structures')">Fee Structures</button>
          </li>
          <li class="mr-2" role="presentation" *ngIf="canManageFees()">
            <button class="inline-block p-4 border-b-2 rounded-t-lg" [class.border-blue-600]="activeTab() === 'invoices'" [class.text-blue-600]="activeTab() === 'invoices'" [class.border-transparent]="activeTab() !== 'invoices'" (click)="activeTab.set('invoices')">Invoices</button>
          </li>
          <li class="mr-2" role="presentation" *ngIf="!canManageFees()">
            <button class="inline-block p-4 border-b-2 rounded-t-lg" [class.border-blue-600]="activeTab() === 'summary'" [class.text-blue-600]="activeTab() === 'summary'" [class.border-transparent]="activeTab() !== 'summary'" (click)="activeTab.set('summary')">My Summary</button>
          </li>
        </ul>
      </div>

      <div *ngIf="isLoading()" class="flex justify-center p-8">
        <app-loading-spinner></app-loading-spinner>
      </div>

      <!-- Structures Tab -->
      <div *ngIf="activeTab() === 'structures' && !isLoading()">
        <div class="mb-4 flex justify-end">
          <button (click)="showCreateModal.set(true)" class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">Create Fee Structure</button>
        </div>
        <app-data-table
          [columns]="structureColumns"
          [data]="structuresData()"
          [pageSize]="10"
          [totalElements]="0">
          <ng-template #cellTemplate let-col="column" let-row="row">
            <ng-container [ngSwitch]="col.key">
              <ng-container *ngSwitchCase="'amount'">
                {{ row.amount | currency }}
              </ng-container>
              <ng-container *ngSwitchCase="'isActive'">
                <app-status-badge [status]="row.isActive ? 'ACTIVE' : 'INACTIVE'"></app-status-badge>
              </ng-container>
              <ng-container *ngSwitchDefault>
                {{ row[col.key] }}
              </ng-container>
            </ng-container>
          </ng-template>
        </app-data-table>
      </div>

      <!-- Invoices Tab -->
      <div *ngIf="activeTab() === 'invoices' && !isLoading()">
        <app-data-table
          [columns]="invoiceColumns"
          [data]="invoicesData()"
          [pageSize]="10"
          [totalElements]="0">
          <ng-template #cellTemplate let-col="column" let-row="row">
            <ng-container [ngSwitch]="col.key">
              <ng-container *ngSwitchCase="'amount'">
                {{ row.totalAmount | currency }}
              </ng-container>
              <ng-container *ngSwitchCase="'status'">
                <app-status-badge [status]="row.status"></app-status-badge>
              </ng-container>
              <ng-container *ngSwitchDefault>
                {{ row[col.key] }}
              </ng-container>
            </ng-container>
          </ng-template>
        </app-data-table>
      </div>

      <!-- Summary Tab -->
      <div *ngIf="activeTab() === 'summary' && !isLoading()">
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-6">
          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="px-4 py-5 sm:p-6">
              <dt class="text-sm font-medium text-gray-500 truncate">Total Fees</dt>
              <dd class="mt-1 text-3xl font-semibold text-gray-900">{{ summary()?.totalFees | currency }}</dd>
            </div>
          </div>
          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="px-4 py-5 sm:p-6">
              <dt class="text-sm font-medium text-gray-500 truncate">Total Paid</dt>
              <dd class="mt-1 text-3xl font-semibold text-green-600">{{ summary()?.totalPaid | currency }}</dd>
            </div>
          </div>
          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="px-4 py-5 sm:p-6">
              <dt class="text-sm font-medium text-gray-500 truncate">Pending Balance</dt>
              <dd class="mt-1 text-3xl font-semibold text-red-600">{{ summary()?.pendingBalance | currency }}</dd>
            </div>
          </div>
        </div>

        <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">My Invoices</h3>
        <app-data-table
          [columns]="invoiceColumns"
          [data]="invoicesData()"
          [pageSize]="10"
          [totalElements]="0">
          <ng-template #cellTemplate let-col="column" let-row="row">
            <ng-container [ngSwitch]="col.key">
              <ng-container *ngSwitchCase="'amount'">
                {{ row.totalAmount | currency }}
              </ng-container>
              <ng-container *ngSwitchCase="'status'">
                <app-status-badge [status]="row.status"></app-status-badge>
              </ng-container>
              <ng-container *ngSwitchCase="'actions'">
                <button *ngIf="row.status !== 'PAID'" (click)="openPaymentModal(row)" class="text-indigo-600 hover:text-indigo-900 text-sm">Pay Now</button>
              </ng-container>
              <ng-container *ngSwitchDefault>
                {{ row[col.key] }}
              </ng-container>
            </ng-container>
          </ng-template>
        </app-data-table>
      </div>

      <!-- Create Structure Modal -->
      <app-modal *ngIf="showCreateModal()" title="Create Fee Structure" (close)="showCreateModal.set(false)">
        <form [formGroup]="structureForm" (ngSubmit)="createStructure()">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Name</label>
              <input type="text" formControlName="name" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Amount</label>
              <input type="number" formControlName="amount" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Fee Type</label>
              <select formControlName="feeType" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                <option value="TUITION">Tuition</option>
                <option value="EXAM">Examination</option>
                <option value="HOSTEL">Hostel</option>
                <option value="LIBRARY">Library</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Due Date</label>
              <input type="date" formControlName="dueDate" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
            </div>
            <div class="flex items-center">
              <input type="checkbox" formControlName="isActive" class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded">
              <label class="ml-2 block text-sm text-gray-900">Active</label>
            </div>
          </div>
          <div class="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3">
            <button type="submit" [disabled]="structureForm.invalid || isSubmitting()" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 sm:col-start-2 sm:text-sm disabled:opacity-50">Save</button>
            <button type="button" (click)="showCreateModal.set(false)" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:col-start-1 sm:text-sm">Cancel</button>
          </div>
        </form>
      </app-modal>

      <!-- Pay Modal -->
      <app-modal *ngIf="selectedInvoice()" title="Make Payment" (close)="selectedInvoice.set(null)">
        <form [formGroup]="paymentForm" (ngSubmit)="processPayment()">
          <div class="space-y-4">
            <div>
              <p class="text-sm text-gray-500">Paying for Invoice #{{selectedInvoice()?.invoiceNumber}}</p>
              <p class="text-lg font-medium">Amount: {{selectedInvoice()?.totalAmount | currency}}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Amount to Pay</label>
              <input type="number" formControlName="amount" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Payment Method</label>
              <select formControlName="paymentMethod" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                <option value="CREDIT_CARD">Credit Card</option>
                <option value="BANK_TRANSFER">Bank Transfer</option>
                <option value="CASH">Cash</option>
                <option value="UPI">UPI</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Remarks</label>
              <textarea formControlName="remarks" rows="2" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"></textarea>
            </div>
          </div>
          <div class="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3">
            <button type="submit" [disabled]="paymentForm.invalid || isSubmitting()" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 sm:col-start-2 sm:text-sm disabled:opacity-50">Pay</button>
            <button type="button" (click)="selectedInvoice.set(null)" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:col-start-1 sm:text-sm">Cancel</button>
          </div>
        </form>
      </app-modal>
    </div>
  `
})
export class FeeManagementComponent implements OnInit {
  authService = inject(AuthService);
  feeService = inject(FeeService);
  fb = inject(FormBuilder);

  activeTab = signal<'structures'|'invoices'|'summary'>('summary');
  structuresData = signal<any[]>([]);
  invoicesData = signal<any[]>([]);
  summary = signal<any>(null);
  
  isLoading = signal(false);
  isSubmitting = signal(false);
  showCreateModal = signal(false);
  selectedInvoice = signal<any>(null);

  structureForm: FormGroup;
  paymentForm: FormGroup;

  structureColumns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'feeType', label: 'Type', sortable: true },
    { key: 'amount', label: 'Amount', sortable: true },
    { key: 'dueDate', label: 'Due Date', sortable: true },
    { key: 'isActive', label: 'Status', sortable: false }
  ];

  invoiceColumns = [
    { key: 'invoiceNumber', label: 'Invoice #', sortable: true },
    { key: 'studentName', label: 'Student', sortable: true },
    { key: 'amount', label: 'Total', sortable: true },
    { key: 'dueDate', label: 'Due Date', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'actions', label: 'Actions', sortable: false }
  ];

  constructor() {
    this.structureForm = this.fb.group({
      name: ['', Validators.required],
      amount: [0, [Validators.required, Validators.min(1)]],
      feeType: ['TUITION', Validators.required],
      dueDate: ['', Validators.required],
      isActive: [true]
    });

    this.paymentForm = this.fb.group({
      amount: [0, [Validators.required, Validators.min(1)]],
      paymentMethod: ['CREDIT_CARD', Validators.required],
      remarks: ['']
    });
  }

  ngOnInit() {
    if (this.canManageFees()) {
      this.activeTab.set('structures');
      this.loadStructures();
      this.loadInvoices();
    } else {
      this.activeTab.set('summary');
      this.loadStudentSummary();
      this.loadMyInvoices();
    }
  }

  canManageFees(): boolean {
    const role: string = this.authService.currentUser()?.roles?.[0] || "";
    return role === 'ROLE_ADMIN' || role === 'ROLE_ACCOUNTANT';
  }

  loadStructures() {
    this.feeService.getStructures().subscribe((res: any) => {
      this.structuresData.set(res || []);
    });
  }

  loadInvoices() {
    this.feeService.getStructures() /* Should be getInvoices but missing in API, mock it for now */.subscribe(res => {
      this.invoicesData.set(res || []);
    });
  }

  loadStudentSummary() {
    this.isLoading.set(true);
    this.feeService.getStudentSummary(this.authService.currentUser()?.id || 0).subscribe({
      next: (res) => {
        this.summary.set(res);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  loadMyInvoices() {
    this.feeService.getStudentSummary(this.authService.currentUser()?.id || 0).subscribe(res => {
      this.invoicesData.set(res.invoices || []);
    });
  }

  createStructure() {
    if (this.structureForm.invalid) return;
    this.isSubmitting.set(true);
    this.feeService.createStructure(this.structureForm.value).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.showCreateModal.set(false);
        this.structureForm.reset({ feeType: 'TUITION', isActive: true });
        this.loadStructures();
      },
      error: () => {
        this.isSubmitting.set(false);
        alert('Error creating fee structure');
      }
    });
  }

  openPaymentModal(invoice: any) {
    this.selectedInvoice.set(invoice);
    this.paymentForm.patchValue({
      amount: invoice.totalAmount, // simplistic assuming full payment
      paymentMethod: 'CREDIT_CARD',
      remarks: ''
    });
  }

  processPayment() {
    if (this.paymentForm.invalid || !this.selectedInvoice()) return;
    this.isSubmitting.set(true);
    
    const paymentReq = {
      invoiceId: this.selectedInvoice().id,
      ...this.paymentForm.value
    };

    this.feeService.recordPayment(paymentReq).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.selectedInvoice.set(null);
        alert('Payment processed successfully');
        this.loadStudentSummary();
        this.loadMyInvoices();
      },
      error: () => {
        this.isSubmitting.set(false);
        alert('Error processing payment');
      }
    });
  }
}
