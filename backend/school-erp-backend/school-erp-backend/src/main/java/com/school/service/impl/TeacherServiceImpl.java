package com.school.service.impl;

import com.school.entity.Teacher;
import com.school.exception.ResourceNotFoundException;
import com.school.repository.TeacherRepository;
import com.school.service.TeacherService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TeacherServiceImpl implements TeacherService {

    private final TeacherRepository repository;

    @Override
    public Teacher createTeacher(Teacher teacher) {
        return repository.save(teacher);
    }

    @Override
    public List<Teacher> getAllTeachers() {
        return repository.findAll();
    }

    @Override
    public Teacher updateTeacher(
            Long id,
            Teacher teacher) {

        Teacher existing = repository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Teacher Not Found"));

        existing.setEmployeeId(
                teacher.getEmployeeId());
        existing.setFirstName(
                teacher.getFirstName());
        existing.setLastName(
                teacher.getLastName());
        existing.setEmail(
                teacher.getEmail());
        existing.setPhone(
                teacher.getPhone());
        existing.setQualification(
                teacher.getQualification());
        existing.setSubject(
                teacher.getSubject());
        existing.setExperience(
                teacher.getExperience());

        return repository.save(existing);
    }

    @Override
    public void deleteTeacher(Long id) {
        repository.deleteById(id);
    }
}