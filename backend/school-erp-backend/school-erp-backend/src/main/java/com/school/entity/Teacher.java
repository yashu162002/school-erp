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
@Table(name = "teachers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Teacher extends BaseEntity {

    @Column(name = "employee_id", unique = true)
    private String employeeId;

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "last_name")
    private String lastName;

    @Column(name = "phone")
    private String phone;

    @Column(name = "email")
    private String email;

    @Column(name = "qualification")
    private String qualification;

    @Column(name = "subject_specialization")
    private String subject;

    @Column(name = "experience")
    private String experience;

    @Column(name = "photo_path")
    private String photoPath;

    @Column(name = "assigned_classes")
    private String assignedClasses;

    @Column(name = "assigned_sections")
    private String assignedSections;

    @Column(name = "assigned_subjects")
    private String assignedSubjects;
}