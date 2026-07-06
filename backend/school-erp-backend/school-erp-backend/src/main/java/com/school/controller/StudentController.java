package com.school.controller;

import com.school.dto.StudentRequest;
import com.school.dto.StudentResponse;
import com.school.entity.Announcement;
import com.school.entity.Attendance;
import com.school.entity.Fee;
import com.school.entity.Result;
import com.school.entity.Student;
import com.school.entity.Timetable;
import com.school.entity.User;
import com.school.entity.LoginHistory;
import com.school.repository.AnnouncementRepository;
import com.school.repository.AttendanceRepository;
import com.school.repository.FeeRepository;
import com.school.repository.ResultRepository;
import com.school.repository.StudentRepository;
import com.school.repository.TimetableRepository;
import com.school.repository.UserRepository;
import com.school.repository.LoginHistoryRepository;
import com.school.service.FileUploadService;
import com.school.exception.ResourceNotFoundException;
import com.school.service.StudentService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/admin/students")
@RequiredArgsConstructor
public class StudentController {

    private final StudentService service;
    private final StudentRepository repository;
    private final FileUploadService fileUploadService;

    private final AttendanceRepository attendanceRepository;
    private final ResultRepository resultRepository;
    private final AnnouncementRepository announcementRepository;
    private final FeeRepository feeRepository;
    private final TimetableRepository timetableRepository;
    private final UserRepository userRepository;
    private final LoginHistoryRepository loginHistoryRepository;
    private final PasswordEncoder passwordEncoder;

    @PostMapping
    public StudentResponse create(
            @RequestBody StudentRequest request) {

        return service.createStudent(request);
    }

    @GetMapping
    public List<StudentResponse> getAll() {

        return service.getAllStudents();
    }

    @GetMapping("/{id}")
    public StudentResponse getOne(
            @PathVariable Long id) {

        return service.getStudent(id);
    }

    @PutMapping("/{id}")
    public StudentResponse update(
            @PathVariable Long id,
            @RequestBody StudentRequest request) {

        return service.updateStudent(id, request);
    }

    @DeleteMapping("/{id}")
    public void delete(
            @PathVariable Long id) {

        service.deleteStudent(id);
    }

    @PostMapping("/upload-photo")
    public String uploadPhoto(
            @RequestParam("photo") MultipartFile photo) {

        return fileUploadService.uploadStudentPhoto(photo);
    }

    @GetMapping("/search")
    public List<Student> search(
            @RequestParam String name) {

        return repository.findByFirstNameContainingIgnoreCase(name);
    }

    @GetMapping("/page")
    public Page<Student> getStudents(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        return repository.findAll(
                PageRequest.of(page, size));
    }

    @GetMapping("/{id}/profile")
    public Student getProfile(
            @PathVariable Long id) {

        return repository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Student not found with ID: " + id));
    }

    @GetMapping("/{id}/attendance")
    public List<Attendance> getAttendance(
            @PathVariable Long id) {

        return attendanceRepository.findByStudentId(id);
    }

    @GetMapping("/{id}/results")
    public List<Result> getResults(
            @PathVariable Long id) {

        return resultRepository.findByStudent_Id(id);
    }

    @GetMapping("/announcements")
    public List<Announcement> announcements() {

        return announcementRepository.findAll();
    }

    @GetMapping("/{id}/fees")
    public List<Fee> fees(
            @PathVariable Long id) {

        return feeRepository.findByStudentId(id);
    }

    @GetMapping("/{id}/timetable")
    public List<Timetable> timetable(
            @PathVariable Long id) {

        Student student = repository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Student not found with ID: " + id));

        return timetableRepository.findByClassNameAndSection(
                student.getClassName(),
                student.getSection());
    }

    @PostMapping("/{id}/reset-password")
    public java.util.Map<String, String> resetPassword(
            @PathVariable Long id,
            @RequestBody(required = false) java.util.Map<String, String> body) {

        Student student = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));

        String plainPassword = (body != null && body.containsKey("password") && !body.get("password").trim().isEmpty())
                ? body.get("password")
                : java.util.UUID.randomUUID().toString().substring(0, 8);

        User user = userRepository.findByUsername(student.getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException("Student login user account not found"));

        user.setPassword(passwordEncoder.encode(plainPassword));
        userRepository.save(user);

        java.util.Map<String, String> response = new java.util.HashMap<>();
        response.put("username", student.getStudentId());
        response.put("password", plainPassword);
        return response;
    }

    @PostMapping("/{id}/toggle-login")
    public StudentResponse toggleLogin(@PathVariable Long id) {
        Student student = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));

        User user = userRepository.findByUsername(student.getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException("Student login user account not found"));

        user.setEnabled(!Boolean.TRUE.equals(user.getEnabled()));
        userRepository.save(user);

        return service.getStudent(id);
    }

    @PostMapping("/{id}/toggle-lock")
    public StudentResponse toggleLock(@PathVariable Long id) {
        Student student = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));

        User user = userRepository.findByUsername(student.getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException("Student login user account not found"));

        user.setLocked(!Boolean.TRUE.equals(user.getLocked()));
        if (Boolean.FALSE.equals(user.getLocked())) {
            user.setFailedLoginAttempts(0);
        }
        userRepository.save(user);

        return service.getStudent(id);
    }

    @GetMapping("/{id}/login-history")
    public List<LoginHistory> getLoginHistory(@PathVariable Long id) {
        Student student = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));

        return loginHistoryRepository.findByUsernameOrderByAttemptedAtDesc(student.getStudentId());
    }

    @PostMapping("/{id}/transfer")
    public StudentResponse transferStudent(
            @PathVariable Long id,
            @RequestBody java.util.Map<String, String> params) {

        Student student = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));

        if (params.containsKey("className")) {
            student.setClassName(params.get("className"));
        }
        if (params.containsKey("section")) {
            student.setSection(params.get("section"));
        }
        if (params.containsKey("academicYear")) {
            student.setAcademicYear(params.get("academicYear"));
        }
        if (params.containsKey("status")) {
            student.setStatus(params.get("status"));
        }

        repository.save(student);
        return service.getStudent(id);
    }
}