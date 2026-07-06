package com.school.controller;

import com.school.entity.*;
import com.school.exception.ResourceNotFoundException;
import com.school.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDate;
import java.util.*;

@RestController
@RequestMapping("/api/student")
@RequiredArgsConstructor
public class StudentPortalController {

    private final StudentRepository studentRepository;
    private final AttendanceRepository attendanceRepository;
    private final ResultRepository resultRepository;
    private final FeeRepository feeRepository;
    private final ExamTimetableRepository examTimetableRepository;
    private final HallTicketRepository hallTicketRepository;
    private final StudentDocumentRepository studentDocumentRepository;
    private final StudentNotificationRepository studentNotificationRepository;
    private final AnnouncementRepository announcementRepository;
    private final TeacherRepository teacherRepository;

    private Student getLoggedInStudent(Principal principal) {
        if (principal == null) {
            throw new IllegalArgumentException("User not authenticated");
        }
        return studentRepository.findByStudentId(principal.getName())
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found for: " + principal.getName()));
    }

    @GetMapping("/profile")
    public Student getProfile(Principal principal) {
        return getLoggedInStudent(principal);
    }

    @GetMapping("/dashboard")
    public Map<String, Object> getDashboardData(Principal principal) {
        Student student = getLoggedInStudent(principal);
        Map<String, Object> data = new HashMap<>();

        // Profile Summary
        data.put("firstName", student.getFirstName());
        data.put("lastName", student.getLastName());
        data.put("studentId", student.getStudentId());
        data.put("className", student.getClassName());
        data.put("section", student.getSection());
        data.put("photoPath", student.getPhotoPath());

        // Birthday Wish Check
        boolean isBirthday = false;
        if (student.getDob() != null) {
            try {
                LocalDate dob = LocalDate.parse(student.getDob());
                LocalDate today = LocalDate.now();
                if (dob.getMonth() == today.getMonth() && dob.getDayOfMonth() == today.getDayOfMonth()) {
                    isBirthday = true;
                }
            } catch (Exception e) {
                // Ignore parsing errors
            }
        }
        data.put("isBirthday", isBirthday);

        // Attendance stats
        long total = attendanceRepository.countByStudentId(student.getId());
        long present = attendanceRepository.countByStudentIdAndStatus(student.getId(), "PRESENT");
        long absent = attendanceRepository.countByStudentIdAndStatus(student.getId(), "ABSENT");
        long leave = attendanceRepository.countByStudentIdAndStatus(student.getId(), "LEAVE");
        long late = attendanceRepository.countByStudentIdAndStatus(student.getId(), "LATE"); // Support LATE

        double percentage = total > 0 ? ((double) present / total) * 100.0 : 100.0;
        if (student.getAttendancePercentage() != null) {
            percentage = student.getAttendancePercentage();
        }

        Map<String, Object> att = new HashMap<>();
        att.put("total", total);
        att.put("present", present);
        att.put("absent", absent);
        att.put("leave", leave);
        att.put("late", late);
        att.put("percentage", percentage);
        data.put("attendance", att);

        // Fee Summary
        List<Fee> studentFees = feeRepository.findByStudentId(student.getId());
        double totalFees = 0;
        double paidFees = 0;
        LocalDate nextDueDate = null;
        for (Fee f : studentFees) {
            if (f.getAmount() != null) totalFees += f.getAmount().doubleValue();
            if (f.getPaidAmount() != null) paidFees += f.getPaidAmount().doubleValue();
            if ("PENDING".equals(f.getPaymentStatus()) || "PARTIAL".equals(f.getPaymentStatus())) {
                if (nextDueDate == null || (f.getDueDate() != null && f.getDueDate().isBefore(nextDueDate))) {
                    nextDueDate = f.getDueDate();
                }
            }
        }
        Map<String, Object> feeInfo = new HashMap<>();
        feeInfo.put("total", totalFees);
        feeInfo.put("paid", paidFees);
        feeInfo.put("pending", totalFees - paidFees);
        feeInfo.put("dueDate", nextDueDate != null ? nextDueDate.toString() : null);
        data.put("fees", feeInfo);

        // Recent Results
        List<Result> results = resultRepository.findByStudent_Id(student.getId());
        data.put("recentResults", results.size() > 5 ? results.subList(0, 5) : results);

        // Announcements
        List<Announcement> announcements = announcementRepository.findAll();
        data.put("announcements", announcements.size() > 5 ? announcements.subList(0, 5) : announcements);

        // Teachers List for this Class
        List<Teacher> teachers = teacherRepository.findAll();
        List<Teacher> classTeachers = new ArrayList<>();
        if (student.getClassName() != null) {
            for (Teacher t : teachers) {
                // If teacher is assigned or default fallback
                classTeachers.add(t);
            }
        }
        data.put("teachers", classTeachers.size() > 3 ? classTeachers.subList(0, 3) : classTeachers);

        // Exam Timetables (Upcoming)
        List<ExamTimetable> examTimetables = examTimetableRepository.findByClassName(student.getClassName());
        List<ExamTimetable> enabledTimetables = new ArrayList<>();
        for (ExamTimetable t : examTimetables) {
            boolean sectionMatches = t.getSection() == null || t.getSection().isEmpty() || t.getSection().equalsIgnoreCase("ALL") || t.getSection().equalsIgnoreCase(student.getSection());
            if (sectionMatches && t.getExam() != null && Boolean.TRUE.equals(t.getExam().getEnabled())) {
                enabledTimetables.add(t);
            }
        }
        data.put("upcomingExams", enabledTimetables);

        // Rank & GPA
        data.put("currentRank", student.getCurrentRank() != null ? student.getCurrentRank() : 0);
        data.put("currentGpa", student.getCurrentGpa() != null ? student.getCurrentGpa() : 0.0);

        return data;
    }

    @GetMapping("/attendance")
    public List<Attendance> getAttendance(Principal principal) {
        Student student = getLoggedInStudent(principal);
        return attendanceRepository.findByStudentId(student.getId());
    }

    @GetMapping("/fees")
    public List<Fee> getFees(Principal principal) {
        Student student = getLoggedInStudent(principal);
        return feeRepository.findByStudentId(student.getId());
    }

    @GetMapping("/exams/timetable")
    public List<ExamTimetable> getExamTimetable(Principal principal) {
        Student student = getLoggedInStudent(principal);
        List<ExamTimetable> timetables = examTimetableRepository.findByClassName(student.getClassName());
        List<ExamTimetable> enabledTimetables = new ArrayList<>();
        for (ExamTimetable t : timetables) {
            boolean sectionMatches = t.getSection() == null || t.getSection().isEmpty() || t.getSection().equalsIgnoreCase("ALL") || t.getSection().equalsIgnoreCase(student.getSection());
            if (sectionMatches && t.getExam() != null && Boolean.TRUE.equals(t.getExam().getEnabled())) {
                enabledTimetables.add(t);
            }
        }
        return enabledTimetables;
    }

    @GetMapping("/hall-tickets/my-ticket")
    public List<HallTicket> getHallTickets(Principal principal) {
        Student student = getLoggedInStudent(principal);
        return hallTicketRepository.findByStudentId(student.getId());
    }

    @GetMapping("/results")
    public List<Result> getResults(Principal principal) {
        Student student = getLoggedInStudent(principal);
        return resultRepository.findByStudent_Id(student.getId());
    }

    @GetMapping("/documents")
    public List<StudentDocument> getDocuments(Principal principal) {
        Student student = getLoggedInStudent(principal);
        return studentDocumentRepository.findByStudentStudentId(student.getStudentId());
    }

    @GetMapping("/notifications")
    public List<StudentNotification> getNotifications(Principal principal) {
        Student student = getLoggedInStudent(principal);
        return studentNotificationRepository.findByStudentStudentIdOrderByCreatedAtDesc(student.getStudentId());
    }

    @PostMapping("/notifications/{id}/read")
    public StudentNotification readNotification(@PathVariable Long id, Principal principal) {
        Student student = getLoggedInStudent(principal);
        StudentNotification notif = studentNotificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found"));

        if (!notif.getStudent().getId().equals(student.getId())) {
            throw new IllegalArgumentException("Unauthorized to read this notification");
        }

        notif.setIsRead(true);
        return studentNotificationRepository.save(notif);
    }
}