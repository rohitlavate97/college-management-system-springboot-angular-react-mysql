import axiosClient from './axiosClient';
import { FeeStructureRequest, FeeStructureResponse, FeeInvoiceRequest, FeeInvoiceResponse, PaymentRequest, PaymentResponse, StudentFeeSummaryResponse, PageResponse } from '@/types';

export const feeService = {
  createStructure: (data: FeeStructureRequest) => axiosClient.post<FeeStructureResponse>('/fees/structures', data),
  getStructures: (params?: { courseId?: number; academicYear?: string }) => axiosClient.get<FeeStructureResponse[]>('/fees/structures', { params }),
  createInvoice: (data: FeeInvoiceRequest) => axiosClient.post<FeeInvoiceResponse>('/fees/invoices', data),
  getStudentInvoices: (studentId: number) => axiosClient.get<FeeInvoiceResponse[]>(`/fees/students/${studentId}/invoices`),
  processPayment: (data: PaymentRequest) => axiosClient.post<PaymentResponse>('/fees/payments', data),
  getPaymentByReceipt: (receiptNumber: string) => axiosClient.get<PaymentResponse>(`/fees/payments/receipt/${receiptNumber}`),
  getStudentSummary: (studentId: number) => axiosClient.get<StudentFeeSummaryResponse>(`/fees/students/${studentId}/summary`),
};
