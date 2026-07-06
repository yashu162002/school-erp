package com.school.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "hall_tickets")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HallTicket extends BaseEntity {

    @Column(unique = true, nullable = false)
    private String hallTicketNumber;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "exam_id", nullable = false)
    private Exam exam;

    private String examCentre;

    @Column(columnDefinition = "TEXT")
    private String instructions;

    private String status; // PENDING, APPROVED, REJECTED, LOCKED

    private LocalDate issueDate;
}
