package com.school.controller;

import com.school.dto.ParentDashboardResponse;
import com.school.entity.Attendance;
import com.school.entity.Parent;
import com.school.entity.Student;
import com.school.repository.AttendanceRepository;
import com.school.repository.ParentRepository;
import com.school.service.ParentService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/parents")
@RequiredArgsConstructor
public class ParentController {

    private final ParentService service;
    private final ParentRepository parentRepository;
    private final AttendanceRepository attendanceRepository;

    @PostMapping
    public Parent create(
            @RequestBody Parent parent) {

        return service.createParent(parent);
    }

    @GetMapping
    public List<Parent> getAll() {

        return service.getAllParents();
    }

    @PutMapping("/{id}")
    public Parent update(
            @PathVariable Long id,
            @RequestBody Parent parent) {

        return service.updateParent(id, parent);
    }

    @DeleteMapping("/{id}")
    public void delete(
            @PathVariable Long id) {

        service.deleteParent(id);
    }

    // ==========================
    // Parent Dashboard API
    // ==========================
    @GetMapping("/{parentId}/dashboard")
    public ParentDashboardResponse dashboard(
            @PathVariable Long parentId) {

        Parent parent = parentRepository.findById(parentId)
                .orElseThrow(() ->
                        new RuntimeException("Parent not found"));

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

    // ==========================
    // Child Attendance API
    // ==========================
    @GetMapping("/{parentId}/attendance")
    public List<Attendance> attendance(
            @PathVariable Long parentId) {

        Parent parent = parentRepository.findById(parentId)
                .orElseThrow(() ->
                        new RuntimeException("Parent not found"));

        return attendanceRepository.findByStudent(
                parent.getStudent());
    }
}