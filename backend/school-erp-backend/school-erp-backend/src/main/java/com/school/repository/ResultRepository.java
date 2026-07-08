package com.school.repository;

import com.school.entity.Result;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ResultRepository extends JpaRepository<Result, Long> {

    List<Result> findByStudent_Id(Long studentId);
    List<Result> findByExamIdAndSubjectId(Long examId, Long subjectId);
    java.util.Optional<Result> findByStudentIdAndExamIdAndSubjectId(Long studentId, Long examId, Long subjectId);
    boolean existsByStudentIdAndExamIdAndSubjectId(Long studentId, Long examId, Long subjectId);
}