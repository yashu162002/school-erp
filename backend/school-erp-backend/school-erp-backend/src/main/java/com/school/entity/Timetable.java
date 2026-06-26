package com.school.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name="timetables")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Timetable extends BaseEntity {

    private String className;

    private String section;

    private String dayName;

    private String subjectName;

    private String startTime;

    private String endTime;
}