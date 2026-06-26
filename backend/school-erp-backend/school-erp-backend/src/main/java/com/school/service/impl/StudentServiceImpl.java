package com.school.service.impl;

import com.school.dto.StudentRequest;
import com.school.dto.StudentResponse;
import com.school.entity.Student;
import com.school.exception.ResourceNotFoundException;
import com.school.repository.StudentRepository;
import com.school.service.StudentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StudentServiceImpl implements StudentService {

    private final StudentRepository repository;

    @Override
    public List<StudentResponse> getAllStudents() {

        return repository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public StudentResponse getStudent(Long id) {

        Student student = repository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Student Not Found"));

        return mapToResponse(student);
    }

    @Override
    public StudentResponse createStudent(
            StudentRequest request) {

        Student student = Student.builder()
                .admissionNo(request.getAdmissionNo())
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .className(request.getClassName())
                .section(request.getSection())
                .studentPhone(request.getStudentPhone())
                .email(request.getEmail())
                .build();

        return mapToResponse(
                repository.save(student));
    }

    @Override
    public StudentResponse updateStudent(
            Long id,
            StudentRequest request) {

        Student student = repository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Student Not Found"));

        student.setAdmissionNo(request.getAdmissionNo());
        student.setFirstName(request.getFirstName());
        student.setLastName(request.getLastName());
        student.setClassName(request.getClassName());
        student.setSection(request.getSection());
        student.setStudentPhone(request.getStudentPhone());
        student.setEmail(request.getEmail());

        return mapToResponse(
                repository.save(student));
    }

    @Override
    public void deleteStudent(Long id) {

        repository.deleteById(id);
    }

    private StudentResponse mapToResponse(
            Student student) {

        return StudentResponse.builder()
                .id(student.getId())
                .admissionNo(student.getAdmissionNo())
                .firstName(student.getFirstName())
                .lastName(student.getLastName())
                .className(student.getClassName())
                .section(student.getSection())
                .studentPhone(student.getStudentPhone())
                .email(student.getEmail())
                .createdAt(
                        student.getCreatedAt() != null
                                ? student.getCreatedAt().toString()
                                : null)
                .build();
    }
}