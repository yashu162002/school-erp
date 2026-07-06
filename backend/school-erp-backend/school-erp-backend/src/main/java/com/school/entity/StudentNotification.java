package com.school.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "student_notifications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentNotification extends BaseEntity {

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    private String title;

    @Column(columnDefinition = "TEXT")
    private String message;

    private String type; // ANNOUNCEMENT, EXAM, HALL_TICKET, FEE, ATTENDANCE, HOMEWORK, HOLIDAY, CIRCULAR, BIRTHDAY, EMERGENCY

    @Builder.Default
    private Boolean isRead = false;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
