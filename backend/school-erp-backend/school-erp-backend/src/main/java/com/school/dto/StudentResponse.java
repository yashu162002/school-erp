package com.school.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class StudentResponse {

    private Long id;

    private String admissionNo;

    private String firstName;

    private String lastName;

    private String className;

    private String section;

    private String studentPhone;

    private String email;

    private String photoPath;

    private String bloodGroup;

    private String address;

    private String dob;

    private String gender;

    private String studentId;

    private String rollNo;

    private String religion;

    private String category;

    private String guardian;

    private String academicYear;

    private String admissionDate;

    private String transport;

    private String hostel;

    private String house;

    private String emergencyContact;

    private String medicalInfo;

    private String status;

    private Double attendancePercentage;

    private Double currentGpa;

    private Integer currentRank;

    private String generatedPassword; // Only filled on create/reset

    private Long parentId;

    private String fatherName;

    private String motherName;

    private Boolean active; // maps to user.enabled

    private Boolean locked; // maps to user.locked

    private String createdAt;
}