package com.school.controller;

import com.school.dto.StudentRequest;
import com.school.dto.StudentResponse;
import com.school.entity.Announcement;
import com.school.entity.Attendance;
import com.school.entity.Fee;
import com.school.entity.Result;
import com.school.entity.Student;
import com.school.entity.Timetable;
import com.school.repository.AnnouncementRepository;
import com.school.repository.AttendanceRepository;
import com.school.repository.FeeRepository;
import com.school.repository.ResultRepository;
import com.school.repository.StudentRepository;
import com.school.repository.TimetableRepository;
import com.school.service.FileUploadService;
import com.school.exception.ResourceNotFoundException;
import com.school.service.StudentService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
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
}