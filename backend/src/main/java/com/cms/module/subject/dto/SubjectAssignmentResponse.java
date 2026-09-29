package com.cms.module.subject.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class SubjectAssignmentResponse {
    private Long id;
    private Long professorId;
    private String professorName;
    private Long subjectId;
    private String subjectName;
    private String academicYear;
    private Integer semester;
    private LocalDate assignedDate;
    private String status;
}
