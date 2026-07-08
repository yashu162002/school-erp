package com.school.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User extends BaseEntity {

    @Column(unique = true, nullable = false)
    private String username;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Builder.Default
    private Boolean enabled = true;

    @Builder.Default
    private Boolean locked = false;

    @Builder.Default
    private Boolean passwordChanged = true;

    @Builder.Default
    private Integer failedLoginAttempts = 0;

    private java.time.LocalDateTime lastLoginAt;

    private String displayName;

    private java.time.LocalDateTime lastPasswordResetDate;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private java.util.List<LoginHistory> loginHistories = new java.util.ArrayList<>();
}