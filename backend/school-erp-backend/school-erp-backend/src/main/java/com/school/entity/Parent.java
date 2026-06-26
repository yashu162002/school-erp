package com.school.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "parents")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Parent extends BaseEntity {

private String fatherName;

private String motherName;

private String fatherPhone;

private String motherPhone;

private String email;

@OneToOne
@JoinColumn(name = "student_id", referencedColumnName = "id")
private Student student;


}
