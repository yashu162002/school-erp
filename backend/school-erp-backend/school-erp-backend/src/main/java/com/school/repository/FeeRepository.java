package com.school.repository;

import com.school.entity.Fee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FeeRepository extends JpaRepository<Fee, Long> {

    // Get all fee records of a student
    List<Fee> findByStudentId(Long studentId);

    void deleteByStudentId(Long studentId);
}