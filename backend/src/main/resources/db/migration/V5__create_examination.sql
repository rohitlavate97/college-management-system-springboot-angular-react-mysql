CREATE TABLE examinations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    academic_year VARCHAR(9) NOT NULL,
    semester INT NOT NULL,
    exam_type VARCHAR(30) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'SCHEDULED',
    description TEXT,
    created_by BIGINT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    version BIGINT NOT NULL DEFAULT 0,
    CONSTRAINT fk_examinations_created_by FOREIGN KEY (created_by) REFERENCES users(id)
);
CREATE INDEX idx_examinations_academic_year ON examinations(academic_year);
CREATE INDEX idx_examinations_status ON examinations(status);

CREATE TABLE exam_subjects (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    examination_id BIGINT NOT NULL,
    subject_id BIGINT NOT NULL,
    exam_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    room VARCHAR(50),
    max_marks DECIMAL(5,2) NOT NULL,
    passing_marks DECIMAL(5,2) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_exam_subjects UNIQUE (examination_id, subject_id),
    CONSTRAINT fk_exam_subjects_examination FOREIGN KEY (examination_id) REFERENCES examinations(id) ON DELETE CASCADE,
    CONSTRAINT fk_exam_subjects_subject FOREIGN KEY (subject_id) REFERENCES subjects(id)
);
CREATE INDEX idx_exam_subjects_examination ON exam_subjects(examination_id);
CREATE INDEX idx_exam_subjects_subject ON exam_subjects(subject_id);

CREATE TABLE grades (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    grade VARCHAR(5) NOT NULL,
    min_marks DECIMAL(5,2) NOT NULL,
    max_marks DECIMAL(5,2) NOT NULL,
    grade_point DECIMAL(3,1) NOT NULL,
    description VARCHAR(50),
    CONSTRAINT uk_grades_grade UNIQUE (grade)
);

CREATE TABLE results (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT NOT NULL,
    exam_subject_id BIGINT NOT NULL,
    marks_obtained DECIMAL(5,2),
    grade_id BIGINT,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    remarks VARCHAR(255),
    entered_by BIGINT NOT NULL,
    published BOOLEAN NOT NULL DEFAULT FALSE,
    published_at TIMESTAMP NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT uk_results UNIQUE (student_id, exam_subject_id),
    CONSTRAINT fk_results_student FOREIGN KEY (student_id) REFERENCES students(id),
    CONSTRAINT fk_results_exam_subject FOREIGN KEY (exam_subject_id) REFERENCES exam_subjects(id),
    CONSTRAINT fk_results_grade FOREIGN KEY (grade_id) REFERENCES grades(id),
    CONSTRAINT fk_results_entered_by FOREIGN KEY (entered_by) REFERENCES users(id)
);
CREATE INDEX idx_results_student_id ON results(student_id);
CREATE INDEX idx_results_exam_subject_id ON results(exam_subject_id);
CREATE INDEX idx_results_status ON results(status);
