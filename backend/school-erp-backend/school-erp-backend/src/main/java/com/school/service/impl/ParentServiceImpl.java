package com.school.service.impl;

import com.school.dto.ParentDashboardResponse;
import com.school.entity.Attendance;
import com.school.entity.Parent;
import com.school.entity.Student;
import com.school.exception.ResourceNotFoundException;
import com.school.repository.AttendanceRepository;
import com.school.repository.ParentRepository;
import com.school.service.ParentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ParentServiceImpl implements ParentService {

    private final ParentRepository repository;
    private final AttendanceRepository attendanceRepository;

    @Override
    public Parent createParent(Parent parent) {
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
                        new ResourceNotFoundException(
                                "Parent Not Found"));

        existing.setFatherName(parent.getFatherName());
        existing.setMotherName(parent.getMotherName());
        existing.setFatherPhone(parent.getFatherPhone());
        existing.setMotherPhone(parent.getMotherPhone());
        existing.setEmail(parent.getEmail());

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
                        new ResourceNotFoundException(
                                "Parent Not Found"));

        Student student = parent.getStudent();

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
                        new ResourceNotFoundException(
                                "Parent Not Found"));

        return attendanceRepository.findByStudent(
                parent.getStudent());
    }
}