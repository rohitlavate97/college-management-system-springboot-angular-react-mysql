package com.cms.module.student.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class StudentProfileRequest {
    private LocalDate dateOfBirth;
    private String gender;
    private String bloodGroup;
    private String nationality;
    private String religion;
    private String category;
    private String permanentAddress;
    private String currentAddress;
    private String photoUrl;
}
