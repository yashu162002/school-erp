package com.school.repository;

import com.school.entity.HallTicket;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface HallTicketRepository extends JpaRepository<HallTicket, Long> {
    Optional<HallTicket> findByStudentIdAndExamId(Long studentId, Long examId);
    Optional<HallTicket> findByStudentStudentIdAndExamId(String studentId, Long examId);
    List<HallTicket> findByStudentId(Long studentId);
    List<HallTicket> findByStudentClassNameAndStudentSection(String className, String section);
    Page<HallTicket> findByStudentClassNameAndStudentSection(String className, String section, Pageable pageable);
    boolean existsByHallTicketNumber(String hallTicketNumber);
}
