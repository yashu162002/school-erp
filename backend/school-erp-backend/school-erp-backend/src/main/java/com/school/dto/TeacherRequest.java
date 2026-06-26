package com.school.dto;

import lombok.Data;

@Data
public class TeacherRequest {

    private String employeeId;

    private String firstName;

    private String lastName;

    private String email;

    private String phone;

    private String subject;

    private String qualification;

    private String experience;
}