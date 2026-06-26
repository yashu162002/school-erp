package com.school.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "students")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Student extends BaseEntity {

@Column(unique = true, nullable = false)
private String admissionNo;

@Column(nullable = false)
private String firstName;

private String lastName;

private String className;

private String section;

private String studentPhone;

private String email;

}
