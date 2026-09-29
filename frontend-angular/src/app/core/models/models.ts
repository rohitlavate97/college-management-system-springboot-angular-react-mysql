// === Auth ===
export interface LoginRequest { usernameOrEmail: string; password: string; }
export interface RefreshTokenRequest { refreshToken: string; }
export interface AuthResponse { accessToken: string; refreshToken: string; tokenType: string; expiresIn: number; userId: number; username: string; email: string; roles: string[]; }
export interface UserProfile { id: number; username: string; email: string; firstName: string; lastName: string; phone: string; roles: string[]; permissions: string[]; }

// === Pagination ===
export interface PageResponse<T> { content: T[]; pageNo: number; pageSize: number; totalElements: number; totalPages: number; last: boolean; }
export interface SpringPage<T> { content: T[]; totalElements: number; totalPages: number; size: number; number: number; last: boolean; first: boolean; }

// === College ===
export interface CollegeRequest { name: string; code: string; address?: string; city?: string; state?: string; country?: string; pincode?: string; phone?: string; email?: string; website?: string; establishedYear?: number; isActive?: boolean; }
export interface CollegeResponse { id: number; name: string; code: string; address: string; city: string; state: string; country: string; pincode: string; phone: string; email: string; website: string; establishedYear: number; isActive: boolean; createdAt: string; updatedAt: string; }
export interface CollegeSummaryResponse { id: number; name: string; code: string; city: string; state: string; isActive: boolean; }

// === Department ===
export interface DepartmentRequest { name: string; code: string; description?: string; collegeId: number; hodId?: number; isActive?: boolean; }
export interface DepartmentResponse { id: number; name: string; code: string; description: string; collegeId: number; collegeName: string; hodId: number; isActive: boolean; createdAt: string; updatedAt: string; }
export interface DepartmentSummaryResponse { id: number; name: string; code: string; collegeId: number; collegeName: string; isActive: boolean; }

// === Professor ===
export interface ProfessorRequest { employeeId: string; firstName: string; lastName: string; email: string; phone?: string; departmentId: number; designation: string; specialization?: string; qualification?: string; joiningDate: string; status: string; }
export interface ProfessorResponse { id: number; employeeId: string; userId: number; firstName: string; lastName: string; email: string; phone: string; departmentId: number; departmentName: string; designation: string; specialization: string; qualification: string; joiningDate: string; status: string; createdAt: string; updatedAt: string; }
export interface ProfessorSummaryResponse { id: number; employeeId: string; fullName: string; email: string; departmentName: string; designation: string; status: string; }

// === Course ===
export interface CourseRequest { code: string; name: string; description?: string; departmentId: number; durationYears: number; totalSemesters: number; degreeType: string; isActive?: boolean; }
export interface CourseResponse { id: number; code: string; name: string; description: string; departmentId: number; departmentName: string; durationYears: number; totalSemesters: number; degreeType: string; isActive: boolean; createdAt: string; updatedAt: string; }
export interface CourseSummaryResponse { id: number; code: string; name: string; departmentName: string; isActive: boolean; }

// === Subject ===
export interface SubjectRequest { code: string; name: string; description?: string; departmentId: number; courseId?: number; semester: number; credits: number; subjectType: string; isActive?: boolean; }
export interface SubjectResponse { id: number; code: string; name: string; description: string; departmentId: number; departmentName: string; courseId: number; courseName: string; semester: number; credits: number; subjectType: string; isActive: boolean; createdAt: string; updatedAt: string; }
export interface SubjectSummaryResponse { id: number; code: string; name: string; departmentName: string; courseName: string; semester: number; credits: number; isActive: boolean; }
export interface SubjectAssignmentRequest { professorId: number; subjectId: number; academicYear: string; semester: number; assignedDate: string; status: string; }
export interface SubjectAssignmentResponse { id: number; professorId: number; professorName: string; subjectId: number; subjectName: string; academicYear: string; semester: number; assignedDate: string; status: string; }

// === Student ===
export interface StudentRequest { firstName: string; lastName: string; email: string; phone?: string; departmentId: number; courseId: number; currentSemester: number; rollNumber: string; registrationNumber: string; admissionDate: string; admissionType: string; batchYear: string; profile?: StudentProfileRequest; guardians?: GuardianRequest[]; }
export interface StudentProfileRequest { dateOfBirth?: string; gender?: string; bloodGroup?: string; nationality?: string; religion?: string; category?: string; permanentAddress?: string; currentAddress?: string; photoUrl?: string; }
export interface GuardianRequest { name: string; relationship: string; phone?: string; email?: string; occupation?: string; address?: string; isPrimary?: boolean; }
export interface StudentResponse { id: number; userId: number; firstName: string; lastName: string; email: string; phone: string; departmentId: number; departmentName: string; courseId: number; courseName: string; rollNumber: string; registrationNumber: string; currentSemester: number; admissionDate: string; admissionType: string; status: string; batchYear: string; profile: StudentProfileResponse; guardians: GuardianResponse[]; createdAt: string; updatedAt: string; }
export interface StudentProfileResponse { id: number; dateOfBirth: string; gender: string; bloodGroup: string; nationality: string; religion: string; category: string; permanentAddress: string; currentAddress: string; photoUrl: string; }
export interface GuardianResponse { id: number; name: string; relationship: string; phone: string; email: string; occupation: string; address: string; isPrimary: boolean; }
export interface StudentSummaryResponse { id: number; firstName: string; lastName: string; rollNumber: string; registrationNumber: string; departmentName: string; courseName: string; currentSemester: number; status: string; }
export interface EnrollmentRequest { subjectId: number; academicYear: string; semester: number; enrolledDate: string; }
export interface EnrollmentResponse { id: number; studentId: number; studentName: string; rollNumber: string; subjectId: number; subjectName: string; subjectCode: string; academicYear: string; semester: number; enrolledDate: string; status: string; droppedDate: string; dropReason: string; createdAt: string; }

// === Attendance ===
export interface BatchAttendanceRequest { subjectId: number; professorId: number; attendanceDate: string; records: AttendanceRecordRequest[]; }
export interface AttendanceRecordRequest { studentId: number; status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED'; remarks?: string; }
export interface AttendanceResponse { id: number; studentId: number; studentName: string; rollNumber: string; subjectId: number; subjectName: string; professorId: number; professorName: string; attendanceDate: string; status: string; remarks: string; markedAt: string; }
export interface AttendanceStatsResponse { studentId: number; studentName: string; subjectId: number; subjectName: string; totalClasses: number; attendedClasses: number; attendancePercentage: number; }

// === Examination ===
export interface ExaminationRequest { name: string; academicYear: string; semester: number; examType: string; startDate: string; endDate: string; description?: string; }
export interface ExaminationResponse { id: number; name: string; academicYear: string; semester: number; examType: string; startDate: string; endDate: string; status: string; description: string; createdAt: string; updatedAt: string; }
export interface ExamSubjectRequest { subjectId: number; examDate: string; startTime: string; endTime: string; room?: string; maxMarks: number; passingMarks: number; }
export interface ExamSubjectResponse { id: number; examinationId: number; subjectId: number; subjectName: string; subjectCode: string; examDate: string; startTime: string; endTime: string; room: string; maxMarks: number; passingMarks: number; }

// === Results ===
export interface ResultEntryRequest { examSubjectId: number; marks: StudentMark[]; }
export interface StudentMark { studentId: number; marksObtained: number; remarks?: string; }
export interface ResultResponse { id: number; studentId: number; studentName: string; rollNumber: string; examSubjectId: number; subjectName: string; marksObtained: number; grade: string; gradePoint: number; status: string; remarks: string; published: boolean; publishedAt: string; }
export interface StudentReportCardResponse { studentId: number; studentName: string; rollNumber: string; examinationId: number; examinationName: string; academicYear: string; semester: number; results: ResultResponse[]; totalMarks: number; obtainedMarks: number; gpa: number; }

// === Fee ===
export interface FeeStructureRequest { courseId: number; name: string; academicYear: string; semester?: number; feeType: string; amount: number; dueDate?: string; isActive?: boolean; }
export interface FeeStructureResponse { id: number; courseId: number; courseName: string; name: string; academicYear: string; semester: number; feeType: string; amount: number; dueDate: string; isActive: boolean; createdAt: string; updatedAt: string; }
export interface FeeInvoiceRequest { studentId?: number; courseId?: number; feeStructureId: number; discountAmount?: number; }
export interface FeeInvoiceResponse { id: number; studentId: number; studentName: string; feeStructureId: number; feeStructureName: string; invoiceNumber: string; totalAmount: number; paidAmount: number; discountAmount: number; status: string; dueDate: string; issuedDate: string; createdAt: string; }
export interface PaymentRequest { invoiceId: number; amount: number; paymentMethod: string; remarks?: string; }
export interface PaymentResponse { id: number; feeInvoiceId: number; invoiceNumber: string; amount: number; paymentMethod: string; paymentDate: string; transactionReference: string; status: string; receiptNumber: string; remarks: string; }
export interface StudentFeeSummaryResponse { totalFees: number; paidFees: number; pendingFees: number; invoices: FeeInvoiceResponse[]; }

// === Notification ===
export interface SendNotificationRequest { userId?: number; title: string; message: string; type: string; referenceType?: string; referenceId?: number; }
export interface NotificationResponse { id: number; title: string; message: string; type: string; referenceType: string; referenceId: number; isRead: boolean; readAt: string; createdAt: string; }
export interface NotificationPreferenceRequest { notificationType: string; emailEnabled: boolean; inAppEnabled: boolean; }
export interface NotificationPreferenceResponse { id: number; notificationType: string; emailEnabled: boolean; inAppEnabled: boolean; }

// === Dashboard ===
export interface AdminDashboardResponse { totalStudents: number; totalProfessors: number; totalDepartments: number; activeCourses: number; pendingFeesCount: number; attendanceRate: number; }
export interface ProfessorDashboardResponse { assignedSubjects: number; totalStudentsTaught: number; recentAttendances: number; }
export interface StudentDashboardResponse { currentEnrolledCourses: number; attendancePercentage: number; pendingFeeAmount: number; recentExamResults: number; }

// === Audit ===
export interface AuditLogResponse { id: number; userId: number; userEmail: string; action: string; entityType: string; entityId: number; details: string; ipAddress: string; traceId: string; createdAt: string; }
