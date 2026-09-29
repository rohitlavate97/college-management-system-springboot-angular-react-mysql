package com.cms.module.college.dto;

import lombok.Data;

@Data
public class CollegeSummaryResponse {
    private Long id;
    private String name;
    private String code;
    private String city;
    private String state;
    private Boolean isActive;
}
