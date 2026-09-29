package com.cms.module.student.dto;

import com.cms.module.student.entity.StudentStatus;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class StudentResponse {
    private Long id;
    private Long userId;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    
    private Long departmentId;
    private String departmentName;
    
    private Long courseId;
    private String courseName;
    
    private String rollNumber;
    private String registrationNumber;
    private Integer currentSemester;
    private LocalDate admissionDate;
    private String admissionType;
    private StudentStatus status;
    private String batchYear;
    
    private StudentProfileResponse profile;
    private List<GuardianResponse> guardians;
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
