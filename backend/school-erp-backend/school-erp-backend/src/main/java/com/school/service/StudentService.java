package com.school.service;

import com.school.dto.StudentRequest;
import com.school.dto.StudentResponse;

import java.util.List;

public interface StudentService {

    List<StudentResponse> getAllStudents();

    StudentResponse getStudent(Long id);

    StudentResponse createStudent(
            StudentRequest request);

    StudentResponse updateStudent(
            Long id,
            StudentRequest request);

    void deleteStudent(Long id);
}