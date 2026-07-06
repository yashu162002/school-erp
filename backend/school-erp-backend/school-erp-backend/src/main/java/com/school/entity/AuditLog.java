package com.school.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "audit_logs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuditLog extends BaseEntity {

    @Column(nullable = false)
    private String username;

    private String role;

    @Column(nullable = false)
    private String action;

    @Column(length = 1000)
    private String details;

    @Builder.Default
    private LocalDateTime timestamp = LocalDateTime.now();
}
