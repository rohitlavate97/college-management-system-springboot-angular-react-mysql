package com.cms.module.student.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class GuardianRequest {
    @NotBlank(message = "Guardian name is required")
    private String name;
    
    @NotBlank(message = "Relationship is required")
    private String relationship;
    
    private String phone;
    private String email;
    private String occupation;
    private String address;
    private Boolean isPrimary;
}
