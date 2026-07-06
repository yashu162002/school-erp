package com.school.service.impl;

import com.school.dto.ParentDashboardResponse;
import com.school.entity.Attendance;
import com.school.entity.Parent;
import com.school.entity.Student;
import com.school.exception.ResourceNotFoundException;
import com.school.repository.AttendanceRepository;
import com.school.repository.ParentRepository;
import com.school.repository.StudentRepository;
import com.school.service.ParentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ParentServiceImpl implements ParentService {

    private final ParentRepository repository;
    private final AttendanceRepository attendanceRepository;
    private final StudentRepository studentRepository;

    @Override
    public Parent createParent(Parent parent) {

        if (parent.getStudent() == null || parent.getStudent().getId() == null) {
            throw new RuntimeException("Student is required");
        }

        Student student = studentRepository.findById(parent.getStudent().getId())
                .orElseThrow(() -> new ResourceNotFoundException("Student Not Found"));

        parent.setStudent(student);

        return repository.save(parent);
    }

    @Override
    public List<Parent> getAllParents() {
        return repository.findAll();
    }

    @Override
    public Parent updateParent(Long id, Parent parent) {

        Parent existing = repository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Parent Not Found"));

        existing.setFatherName(parent.getFatherName());
        existing.setMotherName(parent.getMotherName());
        existing.setFatherPhone(parent.getFatherPhone());
        existing.setMotherPhone(parent.getMotherPhone());
        existing.setEmail(parent.getEmail());

        if (parent.getStudent() != null && parent.getStudent().getId() != null) {
            Student student = studentRepository.findById(parent.getStudent().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Student Not Found"));
            existing.setStudent(student);
        }

        return repository.save(existing);
    }

    @Override
    public void deleteParent(Long id) {
        repository.deleteById(id);
    }

    @Override
    public ParentDashboardResponse getDashboard(Long parentId) {

        Parent parent = repository.findById(parentId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Parent Not Found"));

        Student student = parent.getStudent();

        if (student == null) {
            throw new RuntimeException("No student is linked to this parent");
        }

        return ParentDashboardResponse.builder()
                .parentId(parent.getId())
                .parentName(parent.getFatherName())
                .studentId(student.getId())
                .studentName(student.getFirstName())
                .className(student.getClassName())
                .attendancePercentage(95.0)
                .unreadNotifications(3L)
                .build();
    }

    @Override
    public List<Attendance> getChildAttendance(Long parentId) {

        Parent parent = repository.findById(parentId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Parent Not Found"));

        if (parent.getStudent() == null) {
            throw new RuntimeException("No student is linked to this parent");
        }

        return attendanceRepository.findByStudent(parent.getStudent());
    }
}