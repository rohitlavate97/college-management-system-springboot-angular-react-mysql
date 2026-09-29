package com.cms.module.student.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class StudentRequest {
    
    @NotBlank(message = "First name is required")
    private String firstName;
    
    @NotBlank(message = "Last name is required")
    private String lastName;
    
    @Email(message = "Invalid email format")
    @NotBlank(message = "Email is required")
    private String email;
    
    private String phone;
    
    @NotNull(message = "Department ID is required")
    private Long departmentId;
    
    @NotNull(message = "Course ID is required")
    private Long courseId;
    
    @NotNull(message = "Current semester is required")
    private Integer currentSemester;
    
    @NotBlank(message = "Roll number is required")
    private String rollNumber;
    
    @NotBlank(message = "Registration number is required")
    private String registrationNumber;
    
    @NotNull(message = "Admission date is required")
    private LocalDate admissionDate;
    
    @NotBlank(message = "Admission type is required")
    private String admissionType;
    
    @NotBlank(message = "Batch year is required")
    private String batchYear;
    
    private StudentProfileRequest profile;
    
    private List<GuardianRequest> guardians;
}
