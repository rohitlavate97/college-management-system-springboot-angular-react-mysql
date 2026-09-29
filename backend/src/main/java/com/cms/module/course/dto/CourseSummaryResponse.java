package com.cms.module.course.dto;

import lombok.Data;

@Data
public class CourseSummaryResponse {
    private Long id;
    private String code;
    private String name;
    private String departmentName;
    private Boolean isActive;
}
