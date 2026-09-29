CREATE TABLE attendances (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT NOT NULL,
    subject_id BIGINT NOT NULL,
    professor_id BIGINT NOT NULL,
    attendance_date DATE NOT NULL,
    status VARCHAR(10) NOT NULL,
    remarks VARCHAR(255),
    marked_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT uk_attendances UNIQUE (student_id, subject_id, attendance_date),
    CONSTRAINT fk_attendances_student FOREIGN KEY (student_id) REFERENCES students(id),
    CONSTRAINT fk_attendances_subject FOREIGN KEY (subject_id) REFERENCES subjects(id),
    CONSTRAINT fk_attendances_professor FOREIGN KEY (professor_id) REFERENCES professors(id)
);
CREATE INDEX idx_attendances_student_id ON attendances(student_id);
CREATE INDEX idx_attendances_subject_id ON attendances(subject_id);
CREATE INDEX idx_attendances_date ON attendances(attendance_date);
CREATE INDEX idx_attendances_student_subject ON attendances(student_id, subject_id);
