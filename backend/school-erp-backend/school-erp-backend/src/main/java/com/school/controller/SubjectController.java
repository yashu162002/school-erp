package com.school.controller;

import com.school.entity.Subject;
import com.school.entity.Teacher;
import com.school.exception.ResourceNotFoundException;
import com.school.repository.SubjectRepository;
import com.school.repository.TeacherRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/subjects")
@RequiredArgsConstructor
public class SubjectController {

    private final SubjectRepository subjectRepository;
    private final TeacherRepository teacherRepository;

    @GetMapping
    public List<Subject> getAll(
            @RequestParam(required = false) String className,
            @RequestParam(required = false) String section) {

        if (className != null && section != null) {
            return subjectRepository.findByClassNameAndSection(className, section);
        } else if (className != null) {
            return subjectRepository.findByClassName(className);
        }
        return subjectRepository.findAll();
    }

    @PostMapping
    public Subject create(@RequestBody Map<String, Object> payload) {
        String subjectName = payload.get("subjectName").toString();
        String subjectCode = payload.get("subjectCode").toString();
        String className = payload.get("className").toString();
        String section = payload.containsKey("section") && payload.get("section") != null 
                ? payload.get("section").toString() 
                : null;

        Subject subject = Subject.builder()
                .subjectName(subjectName)
                .subjectCode(subjectCode)
                .className(className)
                .section(section)
                .build();

        if (payload.containsKey("subjectTeacherId") && payload.get("subjectTeacherId") != null) {
            Long teacherId = Long.valueOf(payload.get("subjectTeacherId").toString());
            Teacher teacher = teacherRepository.findById(teacherId)
                    .orElseThrow(() -> new ResourceNotFoundException("Subject Teacher not found"));
            subject.setSubjectTeacher(teacher);
        }

        if (payload.containsKey("classTeacherId") && payload.get("classTeacherId") != null) {
            Long teacherId = Long.valueOf(payload.get("classTeacherId").toString());
            Teacher teacher = teacherRepository.findById(teacherId)
                    .orElseThrow(() -> new ResourceNotFoundException("Class Teacher not found"));
            subject.setClassTeacher(teacher);
        }

        return subjectRepository.save(subject);
    }

    @PutMapping("/{id}")
    public Subject update(@PathVariable Long id, @RequestBody Map<String, Object> payload) {
        Subject subject = subjectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Subject not found"));

        if (payload.containsKey("subjectName")) {
            subject.setSubjectName(payload.get("subjectName").toString());
        }
        if (payload.containsKey("subjectCode")) {
            subject.setSubjectCode(payload.get("subjectCode").toString());
        }
        if (payload.containsKey("className")) {
            subject.setClassName(payload.get("className").toString());
        }
        if (payload.containsKey("section")) {
            subject.setSection(payload.get("section") != null ? payload.get("section").toString() : null);
        }

        if (payload.containsKey("subjectTeacherId")) {
            if (payload.get("subjectTeacherId") != null) {
                Long teacherId = Long.valueOf(payload.get("subjectTeacherId").toString());
                Teacher teacher = teacherRepository.findById(teacherId)
                        .orElseThrow(() -> new ResourceNotFoundException("Subject Teacher not found"));
                subject.setSubjectTeacher(teacher);
            } else {
                subject.setSubjectTeacher(null);
            }
        }

        if (payload.containsKey("classTeacherId")) {
            if (payload.get("classTeacherId") != null) {
                Long teacherId = Long.valueOf(payload.get("classTeacherId").toString());
                Teacher teacher = teacherRepository.findById(teacherId)
                        .orElseThrow(() -> new ResourceNotFoundException("Class Teacher not found"));
                subject.setClassTeacher(teacher);
            } else {
                subject.setClassTeacher(null);
            }
        }

        return subjectRepository.save(subject);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        subjectRepository.deleteById(id);
    }
}
