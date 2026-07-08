package com.school.controller;

import com.school.dto.AttendanceRequest;
import com.school.entity.*;
import com.school.exception.ResourceNotFoundException;
import com.school.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/teacher")
@RequiredArgsConstructor
public class TeacherPortalController {

    private final TeacherRepository teacherRepository;
    private final StudentRepository studentRepository;
    private final AttendanceRepository attendanceRepository;
    private final SubjectRepository subjectRepository;
    private final AnnouncementRepository announcementRepository;
    private final ExamRepository examRepository;
    private final ResultRepository resultRepository;
    private final com.school.service.AuditLogService auditLogService;
    private final LeaveRequestRepository leaveRequestRepository;

    private Teacher getLoggedInTeacher(Principal principal) {
        if (principal == null) {
            throw new IllegalArgumentException("User not authenticated");
        }
        return teacherRepository.findByEmployeeId(principal.getName())
                .orElseThrow(() -> new ResourceNotFoundException("Teacher profile not found for: " + principal.getName()));
    }

    @GetMapping("/profile")
    public Teacher getProfile(Principal principal) {
        return getLoggedInTeacher(principal);
    }

    @GetMapping("/classes")
    public List<Map<String, String>> getAssignedClasses(Principal principal) {
        Teacher teacher = getLoggedInTeacher(principal);
        List<Map<String, String>> classes = new ArrayList<>();

        String assignedCls = teacher.getAssignedClasses();
        String assignedSec = teacher.getAssignedSections();

        if (assignedCls != null && !assignedCls.isBlank() && assignedSec != null && !assignedSec.isBlank()) {
            String[] clsArr = assignedCls.split(",");
            String[] secArr = assignedSec.split(",");
            for (String c : clsArr) {
                for (String s : secArr) {
                    Map<String, String> item = new HashMap<>();
                    item.put("className", c.trim());
                    item.put("section", s.trim());
                    classes.add(item);
                }
            }
        } else {
            // Fallback: list all classes from student records so they can select any class if not assigned
            List<String> distinctClasses = studentRepository.findDistinctClassNames();
            for (String c : distinctClasses) {
                for (String s : List.of("A", "B", "C", "D")) {
                    Map<String, String> item = new HashMap<>();
                    item.put("className", c);
                    item.put("section", s);
                    classes.add(item);
                }
            }
        }
        return classes;
    }

    @GetMapping("/subjects")
    public List<String> getAssignedSubjects(Principal principal) {
        Teacher teacher = getLoggedInTeacher(principal);
        List<String> subjects = new ArrayList<>();

        if (teacher.getAssignedSubjects() != null && !teacher.getAssignedSubjects().isBlank()) {
            Arrays.stream(teacher.getAssignedSubjects().split(","))
                    .map(String::trim)
                    .filter(s -> !s.isEmpty())
                    .forEach(subjects::add);
        } else if (teacher.getSubject() != null && !teacher.getSubject().isBlank()) {
            subjects.add(teacher.getSubject().trim());
        }

        if (subjects.isEmpty()) {
            return subjectRepository.findAll().stream()
                    .map(Subject::getSubjectName)
                    .distinct()
                    .toList();
        }
        return subjects;
    }

    @GetMapping("/students")
    public List<Student> getStudents(
            @RequestParam String className,
            @RequestParam String section,
            Principal principal) {
        // Teacher is authenticated, verify class access if strictly needed
        // (For maximum flexibility we load the students from repository)
        return studentRepository.findByClassNameAndSection(className, section);
    }

    @GetMapping("/attendance")
    public List<Attendance> getAttendance(
            @RequestParam String className,
            @RequestParam String section,
            @RequestParam String subjectName,
            @RequestParam String date,
            Principal principal) {
        LocalDate localDate = LocalDate.parse(date);
        List<Student> students = studentRepository.findByClassNameAndSection(className, section);
        List<Long> studentIds = students.stream().map(Student::getId).toList();

        return attendanceRepository.findAll().stream()
                .filter(a -> a.getStudent() != null && studentIds.contains(a.getStudent().getId()))
                .filter(a -> localDate.equals(a.getAttendanceDate()))
                .filter(a -> subjectName.equalsIgnoreCase(a.getSubjectName()))
                .toList();
    }

    @PostMapping("/attendance/bulk")
    public ResponseEntity<String> saveBulkAttendance(
            @RequestBody List<AttendanceRequest> requests,
            @RequestParam(required = false) String subjectName,
            Principal principal) {

        Teacher teacher = getLoggedInTeacher(principal);
        List<String> allowedSubjects = new ArrayList<>();
        if (teacher.getAssignedSubjects() != null && !teacher.getAssignedSubjects().trim().isEmpty()) {
            Arrays.stream(teacher.getAssignedSubjects().split(","))
                    .map(String::trim)
                    .filter(s -> !s.isEmpty())
                    .forEach(allowedSubjects::add);
        }
        if (allowedSubjects.isEmpty() && teacher.getSubject() != null && !teacher.getSubject().trim().isEmpty()) {
            allowedSubjects.add(teacher.getSubject().trim());
        }

        if (subjectName != null && !subjectName.trim().isEmpty() && !allowedSubjects.isEmpty()) {
            boolean matched = allowedSubjects.stream().anyMatch(s -> s.equalsIgnoreCase(subjectName.trim()));
            if (!matched) {
                throw new com.school.exception.BadRequestException("You are not authorized to mark attendance for subject: " + subjectName);
            }
        }

        for (AttendanceRequest req : requests) {
            String activeSubject = subjectName != null ? subjectName : req.getRemarks(); // or use a dedicated DTO field
            if (activeSubject == null || activeSubject.isEmpty()) {
                activeSubject = "Daily";
            }

            Optional<Attendance> existing = attendanceRepository.findByStudentIdAndAttendanceDateAndSubjectName(
                    req.getStudentId(),
                    req.getAttendanceDate(),
                    activeSubject
            );

            if (existing.isPresent()) {
                Attendance att = existing.get();
                att.setStatus(req.getStatus());
                att.setRemarks(req.getRemarks());
                attendanceRepository.save(att);
            } else {
                Student student = studentRepository.findById(req.getStudentId())
                        .orElseThrow(() -> new ResourceNotFoundException("Student not found: " + req.getStudentId()));

                Attendance att = Attendance.builder()
                        .student(student)
                        .attendanceDate(req.getAttendanceDate())
                        .status(req.getStatus())
                        .remarks(req.getRemarks())
                        .subjectName(activeSubject)
                        .build();
                attendanceRepository.save(att);
            }
        }

        return ResponseEntity.ok("Attendance saved successfully");
    }

    @GetMapping("/dashboard")
    public Map<String, Object> getDashboardData(Principal principal) {
        Teacher teacher = getLoggedInTeacher(principal);
        Map<String, Object> data = new HashMap<>();

        data.put("id", teacher.getId());
        data.put("employeeId", teacher.getEmployeeId());
        data.put("firstName", teacher.getFirstName());
        data.put("lastName", teacher.getLastName());
        data.put("email", teacher.getEmail());
        data.put("phone", teacher.getPhone());
        data.put("photoPath", teacher.getPhotoPath());
        data.put("subject", teacher.getSubject());
        data.put("qualification", teacher.getQualification());
        data.put("experience", teacher.getExperience());

        // Parse assigned classes count
        List<Map<String, String>> assignedClasses = getAssignedClasses(principal);
        data.put("assignedClassesCount", assignedClasses.size());

        // Count students in assigned classes
        long totalStudents = 0;
        Set<String> classSectionPairs = assignedClasses.stream()
                .map(m -> m.get("className") + "-" + m.get("section"))
                .collect(Collectors.toSet());

        List<Student> allStudents = studentRepository.findAll();
        for (Student s : allStudents) {
            String key = s.getClassName() + "-" + s.getSection();
            if (classSectionPairs.contains(key)) {
                totalStudents++;
            }
        }
        data.put("totalStudents", totalStudents == 0 ? allStudents.size() : totalStudents); // fallback to all students if no classes assigned

        // Timetable mock details (Today's classes schedule)
        List<Map<String, String>> todaySchedule = new ArrayList<>();
        int timeIdx = 9;
        for (Map<String, String> cls : assignedClasses.size() > 3 ? assignedClasses.subList(0, 3) : assignedClasses) {
            Map<String, String> entry = new HashMap<>();
            entry.put("time", String.format("%02d:00 AM", timeIdx++));
            entry.put("class", "Class " + cls.get("className") + "-" + cls.get("section"));
            entry.put("subject", teacher.getSubject() != null ? teacher.getSubject() : "General");
            todaySchedule.add(entry);
        }
        data.put("todayTimetable", todaySchedule);

        // Circulars / Announcements
        List<Announcement> announcements = announcementRepository.findAll();
        data.put("announcements", announcements.size() > 5 ? announcements.subList(0, 5) : announcements);

        // Attendance stats for teacher portal
        List<Attendance> allAttendance = attendanceRepository.findAll();
        String assignedSubjs = teacher.getAssignedSubjects();
        List<String> subjectsList = assignedSubjs != null
                ? Arrays.stream(assignedSubjs.split(",")).map(String::trim).filter(s -> !s.isEmpty()).toList()
                : Collections.emptyList();

        List<Attendance> tAttendance = allAttendance.stream()
                .filter(a -> subjectsList.contains(a.getSubjectName()))
                .toList();

        long present = tAttendance.stream().filter(a -> "PRESENT".equalsIgnoreCase(a.getStatus()) || "LATE".equalsIgnoreCase(a.getStatus())).count();
        double pct = tAttendance.isEmpty() ? 100.0 : (double) present / tAttendance.size() * 100.0;

        data.put("classesConducted", tAttendance.stream().map(Attendance::getAttendanceDate).distinct().count());
        data.put("attendancePercentage", Math.round(pct * 10.0) / 10.0);

        // Leave Stats
        Map<String, Integer> leaveStats = new HashMap<>();
        leaveStats.put("casualSpent", 4);
        leaveStats.put("casualTotal", 12);
        leaveStats.put("sickSpent", 3);
        leaveStats.put("sickTotal", 10);
        leaveStats.put("earnedSpent", 2);
        leaveStats.put("earnedTotal", 15);
        data.put("leaveStats", leaveStats);

        // Salary info
        double basic = teacher.getSalary() != null ? teacher.getSalary() : 45000.00;
        double hra = Math.round((basic * 0.1) * 100.0) / 100.0;
        double da = Math.round((basic * 0.05) * 100.0) / 100.0;
        double deductions = Math.round((basic * 0.08) * 100.0) / 100.0;
        double net = basic + hra + da - deductions;

        Map<String, Double> salaryDetails = new HashMap<>();
        salaryDetails.put("basic", basic);
        salaryDetails.put("hra", hra);
        salaryDetails.put("da", da);
        salaryDetails.put("deductions", deductions);
        salaryDetails.put("net", net);
        data.put("salaryDetails", salaryDetails);

        return data;
    }

    @GetMapping("/exams")
    public List<Exam> getPublishedExams() {
        return examRepository.findAll().stream()
                .filter(e -> "PUBLISHED".equalsIgnoreCase(e.getStatus()) || Boolean.TRUE.equals(e.getEnabled()))
                .toList();
    }

    @GetMapping("/results")
    public List<Result> getResults(
            @RequestParam Long examId,
            @RequestParam String subjectName,
            @RequestParam String className,
            @RequestParam String section,
            Principal principal) {
        
        List<Student> students = studentRepository.findByClassNameAndSection(className, section);
        List<Long> studentIds = students.stream().map(Student::getId).toList();

        return resultRepository.findAll().stream()
                .filter(r -> r.getExam() != null && examId.equals(r.getExam().getId()))
                .filter(r -> r.getSubject() != null && subjectName.equalsIgnoreCase(r.getSubject().getSubjectName()))
                .filter(r -> r.getStudent() != null && studentIds.contains(r.getStudent().getId()))
                .toList();
    }

    @PostMapping("/results/bulk")
    public ResponseEntity<String> saveBulkResults(
            @RequestParam Long examId,
            @RequestParam String subjectName,
            @RequestParam String className,
            @RequestParam String section,
            @RequestBody List<Map<String, Object>> requests,
            Principal principal) {

        Teacher teacher = getLoggedInTeacher(principal);

        List<String> allowedSubjects = new ArrayList<>();
        if (teacher.getAssignedSubjects() != null && !teacher.getAssignedSubjects().trim().isEmpty()) {
            Arrays.stream(teacher.getAssignedSubjects().split(","))
                    .map(String::trim)
                    .filter(s -> !s.isEmpty())
                    .forEach(allowedSubjects::add);
        }
        if (allowedSubjects.isEmpty() && teacher.getSubject() != null && !teacher.getSubject().trim().isEmpty()) {
            allowedSubjects.add(teacher.getSubject().trim());
        }

        if (!allowedSubjects.isEmpty() && allowedSubjects.stream().noneMatch(s -> s.equalsIgnoreCase(subjectName.trim()))) {
            throw new com.school.exception.BadRequestException("You are not authorized to upload marks for subject: " + subjectName);
        }

        Exam exam = examRepository.findById(examId)
                .orElseThrow(() -> new ResourceNotFoundException("Exam not found with ID: " + examId));

        List<Subject> subjects = subjectRepository.findByClassNameAndSectionAndSubjectName(className, section, subjectName);
        Subject subject;
        if (!subjects.isEmpty()) {
            subject = subjects.get(0);
        } else {
            subject = Subject.builder()
                    .subjectName(subjectName)
                    .className(className)
                    .section(section)
                    .subjectCode(subjectName.substring(0, Math.min(subjectName.length(), 4)).toUpperCase())
                    .build();
            subjectRepository.save(subject);
        }

        for (Map<String, Object> req : requests) {
            Long studentId = Long.valueOf(req.get("studentId").toString());
            Double marksObtained = Double.valueOf(req.get("marksObtained").toString());
            Double maxMarks = Double.valueOf(req.get("maxMarks").toString());
            String grade = req.containsKey("grade") ? req.get("grade").toString() : null;

            Student student = studentRepository.findById(studentId)
                    .orElseThrow(() -> new ResourceNotFoundException("Student not found: " + studentId));

            Optional<Result> existing = resultRepository.findByStudentIdAndExamIdAndSubjectId(studentId, examId, subject.getId());

            double percentage = (marksObtained / maxMarks) * 100.0;
            if (grade == null || grade.trim().isEmpty()) {
                if (percentage >= 90) grade = "A+";
                else if (percentage >= 80) grade = "A";
                else if (percentage >= 70) grade = "B";
                else if (percentage >= 60) grade = "C";
                else if (percentage >= 50) grade = "D";
                else grade = "F";
            }

            if (existing.isPresent()) {
                Result res = existing.get();
                res.setMarksObtained(marksObtained);
                res.setMaxMarks(maxMarks);
                res.setPercentage(Math.round(percentage * 10.0) / 10.0);
                res.setGrade(grade);
                resultRepository.save(res);
            } else {
                Result res = Result.builder()
                        .student(student)
                        .exam(exam)
                        .subject(subject)
                        .marksObtained(marksObtained)
                        .maxMarks(maxMarks)
                        .percentage(Math.round(percentage * 10.0) / 10.0)
                        .grade(grade)
                        .build();
                resultRepository.save(res);
            }
        }

        auditLogService.log(
                teacher.getEmployeeId(),
                "TEACHER",
                "RESULT_UPLOADED",
                "RESULTS",
                "0.0.0.0",
                "Bulk result uploaded for Exam: " + exam.getExamName() + ", Subject: " + subjectName
        );

        return ResponseEntity.ok("Marks saved successfully");
    }

    @GetMapping("/leaves")
    public List<LeaveRequest> getMyLeaves(Principal principal) {
        Teacher teacher = getLoggedInTeacher(principal);
        return leaveRequestRepository.findByTeacherId(teacher.getId());
    }

    @PostMapping("/leaves")
    public LeaveRequest applyForLeave(
            @RequestBody com.school.dto.LeaveRequestDto dto,
            Principal principal) {
        Teacher teacher = getLoggedInTeacher(principal);
        LeaveRequest leave = LeaveRequest.builder()
                .teacher(teacher)
                .fromDate(LocalDate.parse(dto.getFromDate()))
                .toDate(LocalDate.parse(dto.getToDate()))
                .reason(dto.getReason())
                .status("PENDING")
                .build();
        LeaveRequest saved = leaveRequestRepository.save(leave);

        auditLogService.log(
                teacher.getEmployeeId(),
                "TEACHER",
                "LEAVE_APPLIED",
                "LEAVES",
                "0.0.0.0",
                "Applied for leave from " + dto.getFromDate() + " to " + dto.getToDate()
        );
        
        return saved;
    }

    @PostMapping("/profile/photo")
    public Map<String, String> updatePhoto(
            @RequestBody Map<String, String> body,
            Principal principal) {
        Teacher teacher = getLoggedInTeacher(principal);
        String photoUrl = body.get("photoUrl");
        teacher.setPhotoPath(photoUrl);
        teacherRepository.save(teacher);

        Map<String, String> response = new HashMap<>();
        response.put("photoPath", photoUrl);
        return response;
    }
}
