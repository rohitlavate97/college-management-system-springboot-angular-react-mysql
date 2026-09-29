package com.cms.module.professor.dto;

import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class ProfessorResponse {
    private Long id;
    private String employeeId;
    private Long userId;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private Long departmentId;
    private String departmentName;
    private String designation;
    private String specialization;
    private String qualification;
    private LocalDate joiningDate;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
