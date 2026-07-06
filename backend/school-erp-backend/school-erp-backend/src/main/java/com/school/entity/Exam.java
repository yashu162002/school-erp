package com.school.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "exams")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Exam extends BaseEntity {

    private String examName;

    private String className;

    private LocalDate startDate;

    private LocalDate endDate;

    private String academicYear;

    private String examType; // e.g. UNIT_TEST, MID_TERM, FINAL_EXAM

    private String description;

    private String section;

    private LocalDate resultDate;

    private String status; // e.g. DRAFT, SCHEDULED, PUBLISHED

    @Builder.Default
    private Boolean enabled = false;
}