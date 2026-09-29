-- professors table
CREATE TABLE professors (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    employee_id VARCHAR(20) NOT NULL,
    department_id BIGINT NOT NULL,
    designation VARCHAR(50) NOT NULL,
    specialization VARCHAR(200),
    qualification VARCHAR(200),
    joining_date DATE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    version BIGINT NOT NULL DEFAULT 0,
    CONSTRAINT uk_professors_user_id UNIQUE (user_id),
    CONSTRAINT uk_professors_employee_id UNIQUE (employee_id),
    CONSTRAINT fk_professors_user FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_professors_department FOREIGN KEY (department_id) REFERENCES departments(id)
);
CREATE INDEX idx_professors_department_id ON professors(department_id);
CREATE INDEX idx_professors_status ON professors(status);

-- Add HOD FK to departments now that professors table exists
ALTER TABLE departments
    ADD CONSTRAINT fk_departments_hod FOREIGN KEY (hod_id) REFERENCES professors(id);

-- courses table
CREATE TABLE courses (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20) NOT NULL,
    description TEXT,
    department_id BIGINT NOT NULL,
    duration_years INT NOT NULL,
    total_semesters INT NOT NULL,
    degree_type VARCHAR(50) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    version BIGINT NOT NULL DEFAULT 0,
    CONSTRAINT uk_courses_code UNIQUE (code),
    CONSTRAINT fk_courses_department FOREIGN KEY (department_id) REFERENCES departments(id)
);
CREATE INDEX idx_courses_department_id ON courses(department_id);

-- subjects table
CREATE TABLE subjects (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20) NOT NULL,
    description TEXT,
    department_id BIGINT NOT NULL,
    course_id BIGINT NULL,
    semester INT NOT NULL,
    credits INT NOT NULL,
    subject_type VARCHAR(20) NOT NULL DEFAULT 'THEORY',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    version BIGINT NOT NULL DEFAULT 0,
    CONSTRAINT uk_subjects_code UNIQUE (code),
    CONSTRAINT fk_subjects_department FOREIGN KEY (department_id) REFERENCES departments(id),
    CONSTRAINT fk_subjects_course FOREIGN KEY (course_id) REFERENCES courses(id)
);
CREATE INDEX idx_subjects_department_id ON subjects(department_id);
CREATE INDEX idx_subjects_course_id ON subjects(course_id);
CREATE INDEX idx_subjects_semester ON subjects(semester);

-- subject_assignments (professor-subject relationship)
CREATE TABLE subject_assignments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    professor_id BIGINT NOT NULL,
    subject_id BIGINT NOT NULL,
    academic_year VARCHAR(9) NOT NULL,
    semester INT NOT NULL,
    assigned_date DATE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT uk_subject_assignments UNIQUE (professor_id, subject_id, academic_year, semester),
    CONSTRAINT fk_subject_assignments_professor FOREIGN KEY (professor_id) REFERENCES professors(id),
    CONSTRAINT fk_subject_assignments_subject FOREIGN KEY (subject_id) REFERENCES subjects(id)
);
CREATE INDEX idx_subject_assignments_professor ON subject_assignments(professor_id);
CREATE INDEX idx_subject_assignments_subject ON subject_assignments(subject_id);

-- students table
CREATE TABLE students (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    roll_number VARCHAR(20) NOT NULL,
    registration_number VARCHAR(30) NOT NULL,
    department_id BIGINT NOT NULL,
    course_id BIGINT NOT NULL,
    current_semester INT NOT NULL DEFAULT 1,
    admission_date DATE NOT NULL,
    admission_type VARCHAR(30) NOT NULL DEFAULT 'REGULAR',
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    batch_year INT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    version BIGINT NOT NULL DEFAULT 0,
    CONSTRAINT uk_students_user_id UNIQUE (user_id),
    CONSTRAINT uk_students_roll_number UNIQUE (roll_number),
    CONSTRAINT uk_students_registration_number UNIQUE (registration_number),
    CONSTRAINT fk_students_user FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_students_department FOREIGN KEY (department_id) REFERENCES departments(id),
    CONSTRAINT fk_students_course FOREIGN KEY (course_id) REFERENCES courses(id)
);
CREATE INDEX idx_students_department_id ON students(department_id);
CREATE INDEX idx_students_course_id ON students(course_id);
CREATE INDEX idx_students_status ON students(status);
CREATE INDEX idx_students_batch_year ON students(batch_year);

-- student_profiles table
CREATE TABLE student_profiles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT NOT NULL,
    date_of_birth DATE,
    gender VARCHAR(10),
    blood_group VARCHAR(5),
    nationality VARCHAR(50) DEFAULT 'Indian',
    religion VARCHAR(50),
    category VARCHAR(20),
    permanent_address TEXT,
    current_address TEXT,
    photo_url VARCHAR(500),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT uk_student_profiles_student_id UNIQUE (student_id),
    CONSTRAINT fk_student_profiles_student FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

-- guardians table
CREATE TABLE guardians (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT NOT NULL,
    name VARCHAR(100) NOT NULL,
    relationship VARCHAR(30) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(100),
    occupation VARCHAR(100),
    address TEXT,
    is_primary BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_guardians_student FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);
CREATE INDEX idx_guardians_student_id ON guardians(student_id);

-- student_documents table
CREATE TABLE student_documents (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT NOT NULL,
    document_type VARCHAR(50) NOT NULL,
    document_name VARCHAR(200) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size BIGINT,
    mime_type VARCHAR(100),
    uploaded_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    verified BOOLEAN NOT NULL DEFAULT FALSE,
    verified_by BIGINT NULL,
    verified_at TIMESTAMP NULL,
    CONSTRAINT fk_student_documents_student FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    CONSTRAINT fk_student_documents_verified_by FOREIGN KEY (verified_by) REFERENCES users(id)
);
CREATE INDEX idx_student_documents_student_id ON student_documents(student_id);

-- enrollments table  
CREATE TABLE enrollments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT NOT NULL,
    subject_id BIGINT NOT NULL,
    academic_year VARCHAR(9) NOT NULL,
    semester INT NOT NULL,
    enrolled_date DATE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    dropped_date DATE NULL,
    drop_reason VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT uk_enrollments UNIQUE (student_id, subject_id, academic_year, semester),
    CONSTRAINT fk_enrollments_student FOREIGN KEY (student_id) REFERENCES students(id),
    CONSTRAINT fk_enrollments_subject FOREIGN KEY (subject_id) REFERENCES subjects(id)
);
CREATE INDEX idx_enrollments_student_id ON enrollments(student_id);
CREATE INDEX idx_enrollments_subject_id ON enrollments(subject_id);
CREATE INDEX idx_enrollments_status ON enrollments(status);
