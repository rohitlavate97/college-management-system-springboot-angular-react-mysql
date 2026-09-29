package com.cms.module.professor.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class ProfessorRequest {
    @NotBlank
    private String employeeId;

    @NotBlank
    private String firstName;

    @NotBlank
    private String lastName;

    @NotBlank
    @Email
    private String email;

    private String phone;

    @NotNull
    private Long departmentId;

    @NotBlank
    private String designation;

    private String specialization;

    private String qualification;

    @NotNull
    private LocalDate joiningDate;

    @NotBlank
    private String status;
}
