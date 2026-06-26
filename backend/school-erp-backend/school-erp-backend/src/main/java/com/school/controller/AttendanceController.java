package com.school.controller;

import com.school.dto.AttendanceAnalyticsResponse;
import com.school.dto.AttendanceRequest;
import com.school.entity.Attendance;
import com.school.service.AttendanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/admin/attendance")
@RequiredArgsConstructor
public class AttendanceController {

    private final AttendanceService service;

    @PostMapping
    public ResponseEntity<Attendance> markAttendance(
            @RequestBody AttendanceRequest request) {

        return ResponseEntity.ok(
                service.markAttendance(request));
    }

    @GetMapping("/date/{date}")
    public ResponseEntity<List<Attendance>> byDate(
            @PathVariable LocalDate date) {

        return ResponseEntity.ok(
                service.getAttendanceByDate(date));
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<Attendance>> studentAttendance(
            @PathVariable Long studentId) {

        return ResponseEntity.ok(
                service.getStudentAttendance(studentId));
    }

    @GetMapping("/analytics/{studentId}")
    public ResponseEntity<AttendanceAnalyticsResponse>
    getAttendanceAnalytics(
            @PathVariable Long studentId) {

        return ResponseEntity.ok(
                service.getAttendanceAnalytics(studentId));
    }
}