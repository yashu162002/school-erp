package com.school.controller;

import com.school.entity.Exam;
import com.school.entity.ExamTimetable;
import com.school.exception.ResourceNotFoundException;
import com.school.repository.ExamRepository;
import com.school.repository.ExamTimetableRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/exams")
@RequiredArgsConstructor
public class ExamController {

    private final ExamRepository examRepository;
    private final ExamTimetableRepository examTimetableRepository;

    @PostMapping
    public Exam createExam(@RequestBody Exam exam) {
        if (exam.getStatus() == null) {
            exam.setStatus("SCHEDULED");
        }
        return examRepository.save(exam);
    }

    @GetMapping
    public List<Exam> getAllExams() {
        return examRepository.findAll();
    }

    @GetMapping("/{id}")
    public Exam getExam(@PathVariable Long id) {
        return examRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Exam not found"));
    }

    @PutMapping("/{id}")
    public Exam updateExam(@PathVariable Long id, @RequestBody Exam examDetails) {
        Exam exam = examRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Exam not found"));

        exam.setExamName(examDetails.getExamName());
        exam.setClassName(examDetails.getClassName());
        exam.setStartDate(examDetails.getStartDate());
        exam.setEndDate(examDetails.getEndDate());
        exam.setAcademicYear(examDetails.getAcademicYear());
        exam.setExamType(examDetails.getExamType());
        exam.setDescription(examDetails.getDescription());
        exam.setSection(examDetails.getSection());
        exam.setResultDate(examDetails.getResultDate());
        if (examDetails.getStatus() != null) {
            exam.setStatus(examDetails.getStatus());
        }

        return examRepository.save(exam);
    }

    @DeleteMapping("/{id}")
    public void deleteExam(@PathVariable Long id) {
        examRepository.deleteById(id);
    }

    @PostMapping("/{id}/publish")
    public Exam publishExamResults(@PathVariable Long id) {
        Exam exam = examRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Exam not found"));
        exam.setStatus("PUBLISHED");
        return examRepository.save(exam);
    }

    @PostMapping("/{id}/toggle-enable")
    public Exam toggleEnable(@PathVariable Long id) {
        Exam exam = examRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Exam not found"));
        exam.setEnabled(!Boolean.TRUE.equals(exam.getEnabled()));
        return examRepository.save(exam);
    }

    // --- Exam Timetable APIs ---

    @PostMapping("/timetables")
    public ExamTimetable createTimetable(@RequestBody ExamTimetable timetable) {
        if (timetable.getExam() != null && timetable.getExam().getId() != null) {
            Exam exam = examRepository.findById(timetable.getExam().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Exam not found"));
            timetable.setExam(exam);
        }
        return examTimetableRepository.save(timetable);
    }

    @GetMapping("/timetables")
    public List<ExamTimetable> getAllTimetables(
            @RequestParam(required = false) Long examId,
            @RequestParam(required = false) String className,
            @RequestParam(required = false) String section) {

        if (examId != null && className != null && section != null) {
            return examTimetableRepository.findByExamIdAndClassNameAndSection(examId, className, section);
        } else if (examId != null) {
            return examTimetableRepository.findByExamId(examId);
        } else if (className != null && section != null) {
            return examTimetableRepository.findByClassNameAndSection(className, section);
        }
        return examTimetableRepository.findAll();
    }

    @PutMapping("/timetables/{id}")
    public ExamTimetable updateTimetable(@PathVariable Long id, @RequestBody ExamTimetable details) {
        ExamTimetable timetable = examTimetableRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Timetable entry not found"));

        timetable.setClassName(details.getClassName());
        timetable.setSection(details.getSection());
        timetable.setSubjectName(details.getSubjectName());
        timetable.setExamDate(details.getExamDate());
        timetable.setDayName(details.getDayName());
        timetable.setStartTime(details.getStartTime());
        timetable.setEndTime(details.getEndTime());
        timetable.setRoomNumber(details.getRoomNumber());
        timetable.setInvigilator(details.getInvigilator());
        timetable.setInstructions(details.getInstructions());

        if (details.getExam() != null && details.getExam().getId() != null) {
            Exam exam = examRepository.findById(details.getExam().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Exam not found"));
            timetable.setExam(exam);
        }

        return examTimetableRepository.save(timetable);
    }

    @DeleteMapping("/timetables/{id}")
    public void deleteTimetable(@PathVariable Long id) {
        examTimetableRepository.deleteById(id);
    }
}
