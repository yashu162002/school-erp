package com.school.repository;

import com.school.entity.Timetable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TimetableRepository
        extends JpaRepository<Timetable, Long> {

    List<Timetable> findByClassNameAndSection(
            String className,
            String section);
}