package com.school.service.impl;

import com.school.dto.response.DashboardResponse;
import com.school.repository.ParentRepository;
import com.school.repository.StudentRepository;
import com.school.repository.TeacherRepository;
import com.school.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final StudentRepository studentRepository;
    private final TeacherRepository teacherRepository;
    private final ParentRepository parentRepository;

    @Override
    public DashboardResponse getDashboardStats() {

        return DashboardResponse.builder()
                .totalStudents(studentRepository.count())
                .totalTeachers(teacherRepository.count())
                .totalParents(parentRepository.count())
                .totalAttendance(0L)
                .build();
    }
}