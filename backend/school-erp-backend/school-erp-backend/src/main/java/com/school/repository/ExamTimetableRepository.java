package com.school.repository;

import com.school.entity.ExamTimetable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ExamTimetableRepository extends JpaRepository<ExamTimetable, Long> {
    List<ExamTimetable> findByClassNameAndSection(String className, String section);
    List<ExamTimetable> findByClassName(String className);
    List<ExamTimetable> findByExamId(Long examId);
    List<ExamTimetable> findByExamIdAndClassNameAndSection(Long examId, String className, String section);
}
