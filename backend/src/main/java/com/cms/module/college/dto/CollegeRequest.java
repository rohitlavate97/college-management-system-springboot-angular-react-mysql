package com.cms.module.college.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CollegeRequest {

    @NotBlank(message = "College name is required")
    @Size(max = 200, message = "Name must not exceed 200 characters")
    private String name;

    @NotBlank(message = "College code is required")
    @Size(max = 20, message = "Code must not exceed 20 characters")
    private String code;

    private String address;

    @Size(max = 100, message = "City must not exceed 100 characters")
    private String city;

    @Size(max = 100, message = "State must not exceed 100 characters")
    private String state;

    @Size(max = 100, message = "Country must not exceed 100 characters")
    private String country;

    @Size(max = 10, message = "Pincode must not exceed 10 characters")
    private String pincode;

    @Size(max = 20, message = "Phone must not exceed 20 characters")
    @Pattern(regexp = "^\\+?[0-9]*$", message = "Invalid phone number format")
    private String phone;

    @Email(message = "Email should be valid")
    @Size(max = 100, message = "Email must not exceed 100 characters")
    private String email;

    @Size(max = 200, message = "Website must not exceed 200 characters")
    private String website;

    private Integer establishedYear;

    private Boolean isActive;
}
