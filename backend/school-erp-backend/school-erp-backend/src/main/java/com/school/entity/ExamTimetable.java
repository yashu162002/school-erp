package com.school.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "exam_timetables")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExamTimetable extends BaseEntity {

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "exam_id", nullable = false)
    private Exam exam;

    private String className;

    private String section;

    private String subjectName;

    private LocalDate examDate;

    private String dayName;

    private String startTime;

    private String endTime;

    private String roomNumber;

    private String invigilator;

    private String instructions;
}
