package com.cms.module.subject.dto;

import lombok.Data;

@Data
public class SubjectSummaryResponse {
    private Long id;
    private String code;
    private String name;
    private String departmentName;
    private String courseName;
    private Integer semester;
    private Integer credits;
    private Boolean isActive;
}
