package com.school.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class StudentRequest {

    @NotBlank
    private String admissionNo;

    @NotBlank
    private String firstName;

    @NotBlank
    private String lastName;

    private String className;

    private String section;

    private String studentPhone;

    @Email
    private String email;
}