package com.cms.module.department.dto;

import lombok.Data;

@Data
public class DepartmentSummaryResponse {
    private Long id;
    private String name;
    private String code;
    private Long collegeId;
    private String collegeName;
    private Boolean isActive;
}
