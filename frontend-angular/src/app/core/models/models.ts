export interface User {
  id: number;
  username: string;
  role: string;
}

export interface Student {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  enrollmentDate: string;
}

export interface Professor {
  id: number;
  firstName: string;
  lastName: string;
  departmentId: number;
}
