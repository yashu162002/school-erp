package com.school.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "teachers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Teacher extends BaseEntity {

    @Column(unique = true)
    private String employeeId;

    private String firstName;

    private String lastName;

    private String phone;

    private String email;

    private String qualification;

    private String subjectSpecialization;
}