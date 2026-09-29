package com.cms.module.subject.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class SubjectResponse {
    private Long id;
    private String code;
    private String name;
    private String description;
    private Long departmentId;
    private String departmentName;
    private Long courseId;
    private String courseName;
    private Integer semester;
    private Integer credits;
    private String subjectType;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
