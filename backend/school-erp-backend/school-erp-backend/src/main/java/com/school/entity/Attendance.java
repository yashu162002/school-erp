package com.school.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "attendance")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Attendance extends BaseEntity {

    @ManyToOne
    @JoinColumn(name = "student_id")
    private Student student;

    private LocalDate attendanceDate;

    private String status;

    private String remarks;

    private String subjectName;
}


