package com.school.service.impl;

import com.school.dto.AttendanceAnalyticsResponse;
import com.school.dto.AttendanceRequest;
import com.school.entity.Attendance;
import com.school.entity.Student;
import com.school.exception.BadRequestException;
import com.school.exception.ResourceNotFoundException;
import com.school.repository.AttendanceRepository;
import com.school.repository.StudentRepository;
import com.school.service.AttendanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AttendanceServiceImpl implements AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final StudentRepository studentRepository;

    @Override
    public Attendance markAttendance(AttendanceRequest request) {

        Student student = studentRepository.findById(
                request.getStudentId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Student not found"));

        boolean alreadyMarked =
                attendanceRepository
                        .existsByStudentIdAndAttendanceDate(
                                request.getStudentId(),
                                request.getAttendanceDate());

        if (alreadyMarked) {
            throw new BadRequestException(
                    "Attendance already marked for this date");
        }

        Attendance attendance = Attendance.builder()
                .student(student)
                .attendanceDate(request.getAttendanceDate())
                .status(request.getStatus())
                .remarks(request.getRemarks())
                .build();

        return attendanceRepository.save(attendance);
    }

    @Override
    public List<Attendance> getAttendanceByDate(LocalDate date) {
        return attendanceRepository.findByAttendanceDate(date);
    }

    @Override
    public List<Attendance> getStudentAttendance(Long studentId) {
        return attendanceRepository.findByStudentId(studentId);
    }

    @Override
    public AttendanceAnalyticsResponse getAttendanceAnalytics(
            Long studentId) {

        Student student = studentRepository.findById(studentId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Student not found"));

        long totalDays =
                attendanceRepository.countByStudentId(studentId);

        long presentDays =
                attendanceRepository.countByStudentIdAndStatus(
                        studentId,
                        "PRESENT");

        long absentDays = totalDays - presentDays;

        double attendancePercentage = 0.0;

        if (totalDays > 0) {
            attendancePercentage =
                    ((double) presentDays / totalDays) * 100;
        }

        String studentName = student.getFirstName();

        if (student.getLastName() != null &&
                !student.getLastName().isBlank()) {
            studentName += " " + student.getLastName();
        }

        return new AttendanceAnalyticsResponse(
                student.getId(),
                studentName,
                totalDays,
                presentDays,
                absentDays,
                Math.round(attendancePercentage * 100.0) / 100.0
        );
    }
}