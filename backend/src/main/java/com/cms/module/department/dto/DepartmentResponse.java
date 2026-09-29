package com.cms.module.department.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class DepartmentResponse {
    private Long id;
    private String name;
    private String code;
    private String description;
    private Long collegeId;
    private String collegeName;
    private Long hodId;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
