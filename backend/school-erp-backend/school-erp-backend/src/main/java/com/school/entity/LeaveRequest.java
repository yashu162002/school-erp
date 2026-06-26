package com.school.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "leave_requests")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LeaveRequest extends BaseEntity {

    @ManyToOne
    @JoinColumn(name = "student_id")
    private Student student;

    private LocalDate fromDate;

    private LocalDate toDate;

    private String reason;

    private String status;
}