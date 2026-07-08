package com.school.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class TeacherResponse {

    private Long id;

    private String employeeId;

    private String firstName;

    private String lastName;

    private String email;

    private String phone;

    private String subject;

    private String qualification;

    private String experience;

    private String photoPath;

    private String assignedClasses;

    private String assignedSections;

    private String assignedSubjects;

    private String department;

    private String dob;

    private String gender;

    private String address;

    private String joiningDate;

    private Double salary;

    private String employmentType;

    private String status;

    private Boolean active; // maps to user.enabled

    private Boolean locked; // maps to user.locked

    private String createdAt;
}
