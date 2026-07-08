package com.school.service.impl;

import com.school.dto.response.DashboardResponse;
import com.school.entity.Attendance;
import com.school.entity.Student;
import com.school.entity.Teacher;
import com.school.entity.Subject;
import com.school.repository.ParentRepository;
import com.school.repository.StudentRepository;
import com.school.repository.TeacherRepository;
import com.school.repository.SubjectRepository;
import com.school.repository.AttendanceRepository;
import com.school.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final StudentRepository studentRepository;
    private final TeacherRepository teacherRepository;
    private final ParentRepository parentRepository;
    private final AttendanceRepository attendanceRepository;
    private final SubjectRepository subjectRepository;

    @Override
    public DashboardResponse getDashboardStats() {
        return DashboardResponse.builder()
                .totalStudents(studentRepository.count())
                .totalTeachers(teacherRepository.count())
                .totalParents(parentRepository.count())
                .totalAttendance(attendanceRepository.count())
                .build();
    }

    @Override
    public Map<String, Object> getAttendanceDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        List<Attendance> all = attendanceRepository.findAll();
        LocalDate today = LocalDate.now();

        // 1. Daily Attendance (Today)
        List<Attendance> todayRecords = all.stream()
                .filter(a -> today.equals(a.getAttendanceDate()))
                .toList();

        long presentToday = todayRecords.stream().filter(a -> "PRESENT".equalsIgnoreCase(a.getStatus())).count();
        long absentToday = todayRecords.stream().filter(a -> "ABSENT".equalsIgnoreCase(a.getStatus())).count();
        long lateToday = todayRecords.stream().filter(a -> "LATE".equalsIgnoreCase(a.getStatus())).count();
        long leaveToday = todayRecords.stream().filter(a -> "LEAVE".equalsIgnoreCase(a.getStatus())).count();
        long totalToday = todayRecords.size();

        Map<String, Object> daily = new HashMap<>();
        daily.put("date", today.toString());
        daily.put("total", totalToday);
        daily.put("present", presentToday);
        daily.put("absent", absentToday);
        daily.put("late", lateToday);
        daily.put("leave", leaveToday);
        daily.put("rate", totalToday > 0 ? (double) (presentToday + lateToday) / totalToday * 100 : 100.0);
        stats.put("dailyAttendance", daily);

        // 2. Class-wise Attendance
        Map<String, List<Attendance>> byClass = all.stream()
                .filter(a -> a.getStudent() != null && a.getStudent().getClassName() != null)
                .collect(Collectors.groupingBy(a -> a.getStudent().getClassName()));

        List<Map<String, Object>> classStats = new ArrayList<>();
        byClass.forEach((className, list) -> {
            long present = list.stream().filter(a -> "PRESENT".equalsIgnoreCase(a.getStatus()) || "LATE".equalsIgnoreCase(a.getStatus())).count();
            double pct = list.isEmpty() ? 100.0 : (double) present / list.size() * 100.0;
            Map<String, Object> map = new HashMap<>();
            map.put("className", className);
            map.put("percentage", Math.round(pct * 10.0) / 10.0);
            map.put("total", list.size());
            classStats.add(map);
        });
        stats.put("classWise", classStats);

        // 3. Subject-wise Attendance
        Map<String, List<Attendance>> bySubject = all.stream()
                .filter(a -> a.getSubjectName() != null && !a.getSubjectName().isBlank())
                .collect(Collectors.groupingBy(Attendance::getSubjectName));

        List<Map<String, Object>> subjectStats = new ArrayList<>();
        bySubject.forEach((subjName, list) -> {
            long present = list.stream().filter(a -> "PRESENT".equalsIgnoreCase(a.getStatus()) || "LATE".equalsIgnoreCase(a.getStatus())).count();
            double pct = list.isEmpty() ? 100.0 : (double) present / list.size() * 100.0;
            Map<String, Object> map = new HashMap<>();
            map.put("subjectName", subjName);
            map.put("percentage", Math.round(pct * 10.0) / 10.0);
            map.put("total", list.size());
            subjectStats.add(map);
        });
        stats.put("subjectWise", subjectStats);

        // 4. Teacher-wise Attendance (which teachers took attendance for their assigned subjects)
        List<Teacher> teachers = teacherRepository.findAll();
        List<Map<String, Object>> teacherStats = new ArrayList<>();
        teachers.forEach(t -> {
            // Find attendance records matching subjects assigned to this teacher
            String assignedSubjs = t.getAssignedSubjects();
            List<String> subjectsList = assignedSubjs != null
                    ? Arrays.stream(assignedSubjs.split(",")).map(String::trim).filter(s -> !s.isEmpty()).toList()
                    : Collections.emptyList();

            List<Attendance> tAttendance = all.stream()
                    .filter(a -> subjectsList.contains(a.getSubjectName()))
                    .toList();

            long present = tAttendance.stream().filter(a -> "PRESENT".equalsIgnoreCase(a.getStatus()) || "LATE".equalsIgnoreCase(a.getStatus())).count();
            double pct = tAttendance.isEmpty() ? 100.0 : (double) present / tAttendance.size() * 100.0;

            Map<String, Object> map = new HashMap<>();
            map.put("teacherName", t.getFirstName() + " " + (t.getLastName() != null ? t.getLastName() : ""));
            map.put("employeeId", t.getEmployeeId());
            map.put("percentage", Math.round(pct * 10.0) / 10.0);
            map.put("sessionsCount", tAttendance.stream().map(Attendance::getAttendanceDate).distinct().count());
            teacherStats.add(map);
        });
        stats.put("teacherWise", teacherStats);

        // 5. Student Attendance Percentage Alert (below 75%)
        List<Student> students = studentRepository.findAll();
        List<Map<String, Object>> studentAlerts = new ArrayList<>();
        students.forEach(s -> {
            List<Attendance> sAtt = all.stream().filter(a -> a.getStudent() != null && s.getId().equals(a.getStudent().getId())).toList();
            long present = sAtt.stream().filter(a -> "PRESENT".equalsIgnoreCase(a.getStatus()) || "LATE".equalsIgnoreCase(a.getStatus())).count();
            double pct = sAtt.isEmpty() ? 100.0 : (double) present / sAtt.size() * 100.0;
            if (pct < 75.0 && !sAtt.isEmpty()) {
                Map<String, Object> map = new HashMap<>();
                map.put("studentId", s.getStudentId());
                map.put("name", s.getFirstName() + " " + (s.getLastName() != null ? s.getLastName() : ""));
                map.put("className", s.getClassName());
                map.put("section", s.getSection());
                map.put("percentage", Math.round(pct * 10.0) / 10.0);
                studentAlerts.add(map);
            }
        });
        stats.put("lowAttendanceAlerts", studentAlerts);

        return stats;
    }
}