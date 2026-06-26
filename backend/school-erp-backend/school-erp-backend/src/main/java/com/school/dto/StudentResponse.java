package com.school.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class StudentResponse {

    private Long id;

    private String admissionNo;

    private String firstName;

    private String lastName;

    private String className;

    private String section;

    private String studentPhone;

    private String email;

    private String createdAt;
}