package com.cms.module.professor.dto;

import lombok.Data;

@Data
public class ProfessorSummaryResponse {
    private Long id;
    private String employeeId;
    private String fullName;
    private String email;
    private String departmentName;
    private String designation;
    private String status;
}
