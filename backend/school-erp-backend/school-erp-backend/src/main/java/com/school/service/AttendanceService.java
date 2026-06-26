package com.school.service;

import com.school.dto.AttendanceAnalyticsResponse;
import com.school.dto.AttendanceRequest;
import com.school.entity.Attendance;

import java.time.LocalDate;
import java.util.List;

public interface AttendanceService {

    Attendance markAttendance(
            AttendanceRequest request);

    List<Attendance> getAttendanceByDate(
            LocalDate date);

    List<Attendance> getStudentAttendance(
            Long studentId);

    AttendanceAnalyticsResponse getAttendanceAnalytics(
            Long studentId);
}