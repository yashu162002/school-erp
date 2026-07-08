package com.school.service;

import com.school.dto.TeacherRequest;
import com.school.dto.TeacherResponse;

import java.util.List;

public interface TeacherService {

    TeacherResponse createTeacher(TeacherRequest request);

    List<TeacherResponse> getAllTeachers();

    TeacherResponse getTeacher(Long id);

    TeacherResponse updateTeacher(Long id, TeacherRequest request);

    void deleteTeacher(Long id);
}