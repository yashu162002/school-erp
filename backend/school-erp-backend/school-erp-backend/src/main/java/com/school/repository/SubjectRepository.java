package com.school.repository;

import com.school.entity.Subject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface SubjectRepository
        extends JpaRepository<Subject, Long> {

    List<Subject> findByClassName(String className);
    List<Subject> findByClassNameAndSection(String className, String section);

    @Modifying
    @Transactional
    @Query(value = "INSERT INTO subjects (id, subject_name, created_at, updated_at) VALUES (:id, :name, NOW(), NOW()) ON CONFLICT (id) DO NOTHING", nativeQuery = true)
    void insertPlaceholder(@Param("id") Long id, @Param("name") String name);
}