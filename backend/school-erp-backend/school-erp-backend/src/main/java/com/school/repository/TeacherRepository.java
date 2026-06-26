package com.school.repository;

import com.school.entity.Teacher;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TeacherRepository
        extends JpaRepository<Teacher, Long> {
}