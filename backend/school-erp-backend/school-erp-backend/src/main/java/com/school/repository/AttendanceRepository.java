package com.school.repository;

import com.school.entity.Attendance;
import com.school.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface AttendanceRepository
        extends JpaRepository<Attendance, Long> {

    List<Attendance> findByStudent(Student student);

    // Get attendance by student
    List<Attendance> findByStudentId(Long studentId);

    // Get attendance by date
    List<Attendance> findByAttendanceDate(LocalDate attendanceDate);

    // Check if attendance already exists
    boolean existsByStudentIdAndAttendanceDate(
            Long studentId,
            LocalDate attendanceDate);

    // Analytics Methods
    long countByStudentId(Long studentId);

    long countByStudentIdAndStatus(
            Long studentId,
            String status);
}