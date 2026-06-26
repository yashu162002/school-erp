package com.school.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "notifications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notification extends BaseEntity {

    private String title;

    @Column(columnDefinition = "TEXT")
    private String message;

    private String notificationType;

    private String targetAudience;

    private Boolean isRead;
}