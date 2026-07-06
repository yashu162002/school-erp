package com.school.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "students")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Student extends BaseEntity {

    @Column(unique = true, nullable = false)
    private String admissionNo;

    @Column(unique = true, nullable = false)
    private String studentId;

    @Column(nullable = false)
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

    private String rollNo;

    private String religion;

    private String category;

    private String fatherName;

    private String motherName;

    private String guardian;

    private String academicYear;

    private java.time.LocalDate admissionDate;

    private String transport;

    private String hostel;

    private String house;

    private String emergencyContact;

    private String medicalInfo;

    private String status; // ACTIVE, INACTIVE, DEACTIVATED, TRANSFERRED, PROMOTED

    private Double attendancePercentage;

    private Double currentGpa;

    private Integer currentRank;
}
