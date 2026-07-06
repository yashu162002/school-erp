package com.school.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "subjects")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Subject extends BaseEntity {

    private String subjectName;

    private String subjectCode;

    private String className;

    private String section;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "subject_teacher_id")
    private Teacher subjectTeacher;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "class_teacher_id")
    private Teacher classTeacher;
}