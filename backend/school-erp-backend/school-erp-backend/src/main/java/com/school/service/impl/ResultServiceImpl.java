package com.school.service.impl;

import com.school.dto.ResultRequest;
import com.school.entity.Exam;
import com.school.entity.Result;
import com.school.entity.Student;
import com.school.entity.Subject;
import com.school.repository.ExamRepository;
import com.school.repository.ResultRepository;
import com.school.repository.StudentRepository;
import com.school.repository.SubjectRepository;
import com.school.service.ResultService;
import com.school.util.GradeUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ResultServiceImpl implements ResultService {

    private final ResultRepository resultRepository;
    private final StudentRepository studentRepository;
    private final ExamRepository examRepository;
    private final SubjectRepository subjectRepository;

    @Override
    public Result saveResult(ResultRequest request) {

        Student student = studentRepository.findById(request.getStudentId())
                .orElseThrow(() -> new RuntimeException("Student not found"));

        Exam exam = examRepository.findById(request.getExamId())
                .orElseThrow(() -> new RuntimeException("Exam not found"));

        Subject subject = subjectRepository.findById(request.getSubjectId())
                .orElseThrow(() -> new RuntimeException("Subject not found"));

        double percentage =
                (request.getMarksObtained() / request.getMaxMarks()) * 100;

        String grade =
                GradeUtil.calculateGrade(percentage);

        Result result = Result.builder()
                .student(student)
                .exam(exam)
                .subject(subject)
                .marksObtained(request.getMarksObtained())
                .maxMarks(request.getMaxMarks())
                .percentage(percentage)
                .grade(grade)
                .build();

        return resultRepository.save(result);
    }

    @Override
    public List<Result> getStudentResults(Long studentId) {
        return resultRepository.findByStudent_Id(studentId);
    }
}