package com.cms.module.student.dto;

import com.cms.module.student.entity.EnrollmentStatus;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class EnrollmentResponse {
    private Long id;
    
    private Long studentId;
    private String studentName;
    private String rollNumber;
    
    private Long subjectId;
    private String subjectName;
    private String subjectCode;
    
    private String academicYear;
    private Integer semester;
    private LocalDate enrolledDate;
    private EnrollmentStatus status;
    private LocalDate droppedDate;
    private String dropReason;
    
    private LocalDateTime createdAt;
}
