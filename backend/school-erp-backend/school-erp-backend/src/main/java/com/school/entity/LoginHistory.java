package com.school.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "login_history")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginHistory extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(nullable = false)
    private String username;

    private String ipAddress;

    @Column(nullable = false)
    private String status; // SUCCESS, FAILED

    @Builder.Default
    private LocalDateTime attemptedAt = LocalDateTime.now();
}
