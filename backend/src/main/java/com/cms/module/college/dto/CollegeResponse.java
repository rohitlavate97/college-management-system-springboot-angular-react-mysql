package com.cms.module.college.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class CollegeResponse {
    private Long id;
    private String name;
    private String code;
    private String address;
    private String city;
    private String state;
    private String country;
    private String pincode;
    private String phone;
    private String email;
    private String website;
    private Integer establishedYear;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
