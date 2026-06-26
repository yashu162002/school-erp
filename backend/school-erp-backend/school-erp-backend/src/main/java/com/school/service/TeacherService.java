package com.school.service;

import com.school.entity.Teacher;

import java.util.List;

public interface TeacherService {

    Teacher createTeacher(Teacher teacher);

    List<Teacher> getAllTeachers();

    Teacher updateTeacher(Long id, Teacher teacher);

    void deleteTeacher(Long id);
}