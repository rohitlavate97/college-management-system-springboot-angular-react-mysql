package com.cms.module.student.dto;

import com.cms.module.student.entity.StudentStatus;
import lombok.Data;

@Data
public class StudentSummaryResponse {
    private Long id;
    private String firstName;
    private String lastName;
    private String rollNumber;
    private String registrationNumber;
    private String departmentName;
    private String courseName;
    private Integer currentSemester;
    private StudentStatus status;
}
