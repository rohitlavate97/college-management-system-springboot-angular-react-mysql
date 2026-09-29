package com.cms.module.student.dto;

import lombok.Data;

@Data
public class GuardianResponse {
    private Long id;
    private String name;
    private String relationship;
    private String phone;
    private String email;
    private String occupation;
    private String address;
    private Boolean isPrimary;
}
