package com.school.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class StudentRequest {

    private String admissionNo; // Optional, auto-generated if blank

    @NotBlank(message = "First name is required")
    private String firstName;

    @NotBlank(message = "Last name is required")
    private String lastName;

    private String className;

    private String section;

    private String studentPhone;

    @Email(message = "Invalid email format")
    private String email;

    private String photoPath;

    private String bloodGroup;

    private String address;

    private String dob;

    private String gender;

    private String rollNo;

    private String religion;

    private String category;

    private String fatherName;

    private String motherName;

    private String guardian;

    private String academicYear;

    private String admissionDate; // ISO string format

    private String transport;

    private String hostel;

    private String house;

    private String emergencyContact;

    private String medicalInfo;

    private String status;

    private Double attendancePercentage;

    private Double currentGpa;

    private Integer currentRank;

    private String password; // Optional, auto-generated if blank

    private Long parentId; // Optional, to link student to a parent
}