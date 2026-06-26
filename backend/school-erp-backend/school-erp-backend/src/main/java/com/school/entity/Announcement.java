package com.school.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "announcements")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Announcement extends BaseEntity {

    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String targetAudience;
}