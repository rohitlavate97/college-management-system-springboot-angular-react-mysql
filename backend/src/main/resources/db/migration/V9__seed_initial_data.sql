-- Insert default roles
INSERT INTO roles (name, description) VALUES
('SUPER_ADMIN', 'Super Administrator with full system access'),
('ADMIN', 'Administrator with college management access'),
('HOD', 'Head of Department'),
('PROFESSOR', 'Professor/Faculty member'),
('STUDENT', 'Student'),
('ACCOUNTANT', 'Finance/Accounts staff'),
('LIBRARIAN', 'Library staff');

-- Insert default permissions
INSERT INTO permissions (name, description, module) VALUES
('USER_CREATE', 'Create users', 'USER'),
('USER_READ', 'View users', 'USER'),
('USER_UPDATE', 'Update users', 'USER'),
('USER_DELETE', 'Delete users', 'USER'),
('DEPARTMENT_CREATE', 'Create departments', 'DEPARTMENT'),
('DEPARTMENT_READ', 'View departments', 'DEPARTMENT'),
('DEPARTMENT_UPDATE', 'Update departments', 'DEPARTMENT'),
('DEPARTMENT_DELETE', 'Delete departments', 'DEPARTMENT'),
('STUDENT_CREATE', 'Create students', 'STUDENT'),
('STUDENT_READ', 'View students', 'STUDENT'),
('STUDENT_UPDATE', 'Update students', 'STUDENT'),
('STUDENT_DELETE', 'Delete students', 'STUDENT'),
('PROFESSOR_CREATE', 'Create professors', 'PROFESSOR'),
('PROFESSOR_READ', 'View professors', 'PROFESSOR'),
('PROFESSOR_UPDATE', 'Update professors', 'PROFESSOR'),
('PROFESSOR_DELETE', 'Delete professors', 'PROFESSOR'),
('ATTENDANCE_MARK', 'Mark attendance', 'ATTENDANCE'),
('ATTENDANCE_READ', 'View attendance', 'ATTENDANCE'),
('ATTENDANCE_UPDATE', 'Update attendance', 'ATTENDANCE'),
('EXAM_CREATE', 'Create examinations', 'EXAMINATION'),
('EXAM_READ', 'View examinations', 'EXAMINATION'),
('EXAM_UPDATE', 'Update examinations', 'EXAMINATION'),
('RESULT_CREATE', 'Enter results', 'RESULT'),
('RESULT_READ', 'View results', 'RESULT'),
('RESULT_UPDATE', 'Update results', 'RESULT'),
('RESULT_PUBLISH', 'Publish results', 'RESULT'),
('FEE_CREATE', 'Create fee structures', 'FEE'),
('FEE_READ', 'View fees', 'FEE'),
('FEE_UPDATE', 'Update fees', 'FEE'),
('PAYMENT_CREATE', 'Record payments', 'PAYMENT'),
('PAYMENT_READ', 'View payments', 'PAYMENT'),
('NOTIFICATION_SEND', 'Send notifications', 'NOTIFICATION'),
('AUDIT_READ', 'View audit logs', 'AUDIT'),
('DASHBOARD_ADMIN', 'View admin dashboard', 'DASHBOARD'),
('DASHBOARD_PROFESSOR', 'View professor dashboard', 'DASHBOARD'),
('DASHBOARD_STUDENT', 'View student dashboard', 'DASHBOARD');

-- Assign permissions to SUPER_ADMIN (all permissions)
INSERT INTO role_permissions (role_id, permission_id)
SELECT 
    (SELECT id FROM roles WHERE name = 'SUPER_ADMIN'),
    id
FROM permissions;

-- Assign permissions to ADMIN
INSERT INTO role_permissions (role_id, permission_id)
SELECT 
    (SELECT id FROM roles WHERE name = 'ADMIN'),
    id
FROM permissions
WHERE name NOT IN ('AUDIT_READ');

-- Insert default grades
INSERT INTO grades (grade, min_marks, max_marks, grade_point, description) VALUES
('O', 90.00, 100.00, 10.0, 'Outstanding'),
('A+', 80.00, 89.99, 9.0, 'Excellent'),
('A', 70.00, 79.99, 8.0, 'Very Good'),
('B+', 60.00, 69.99, 7.0, 'Good'),
('B', 55.00, 59.99, 6.0, 'Above Average'),
('C', 50.00, 54.99, 5.0, 'Average'),
('P', 40.00, 49.99, 4.0, 'Pass'),
('F', 0.00, 39.99, 0.0, 'Fail');
