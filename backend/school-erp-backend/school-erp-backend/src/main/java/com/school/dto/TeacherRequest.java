package com.school.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class TeacherRequest {

    private String employeeId; // Optional, auto-generated if blank

    @NotBlank(message = "First name is required")
    private String firstName;

    @NotBlank(message = "Last name is required")
    private String lastName;

    @Email(message = "Invalid email format")
    private String email;

    private String phone;

    private String subject;

    private String qualification;

    private String experience;

    private String photoPath;

    private String assignedClasses;

    private String assignedSections;

    private String assignedSubjects;

    private String password; // Optional, auto-generated if blank
}