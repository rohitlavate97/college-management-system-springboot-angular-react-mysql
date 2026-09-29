import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FeeStructureRequest, FeeStructureResponse, FeeInvoiceRequest, FeeInvoiceResponse, PaymentRequest, PaymentResponse, StudentFeeSummaryResponse, PageResponse } from '../models/models';

@Injectable({ providedIn: 'root' })
export class FeeService {
  private http = inject(HttpClient);
  private apiUrl = '/api/v1/fees';

  createStructure(data: FeeStructureRequest): Observable<FeeStructureResponse> { return this.http.post<FeeStructureResponse>(`${this.apiUrl}/structures`, data); }
  getStructures(courseId?: number): Observable<FeeStructureResponse[]> {
    let params = new HttpParams();
    if(courseId) params = params.set('courseId', courseId);
    return this.http.get<FeeStructureResponse[]>(`${this.apiUrl}/structures`, { params });
  }

  createInvoice(data: FeeInvoiceRequest): Observable<FeeInvoiceResponse> { return this.http.post<FeeInvoiceResponse>(`${this.apiUrl}/invoices`, data); }
  getStudentSummary(studentId: number): Observable<StudentFeeSummaryResponse> { return this.http.get<StudentFeeSummaryResponse>(`${this.apiUrl}/student/${studentId}/summary`); }

  recordPayment(data: PaymentRequest): Observable<PaymentResponse> { return this.http.post<PaymentResponse>(`${this.apiUrl}/payments`, data); }
}
