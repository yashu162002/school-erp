package com.school.controller;

import com.school.entity.Exam;
import com.school.entity.HallTicket;
import com.school.entity.Student;
import com.school.exception.ResourceNotFoundException;
import com.school.repository.ExamRepository;
import com.school.repository.HallTicketRepository;
import com.school.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/hall-tickets")
@RequiredArgsConstructor
public class HallTicketController {

    private final HallTicketRepository hallTicketRepository;
    private final StudentRepository studentRepository;
    private final ExamRepository examRepository;

    @GetMapping
    public List<HallTicket> getAllHallTickets(
            @RequestParam(required = false) String className,
            @RequestParam(required = false) String section) {

        if (className != null && section != null) {
            return hallTicketRepository.findByStudentClassNameAndStudentSection(className, section);
        }
        return hallTicketRepository.findAll();
    }

    @PostMapping("/generate")
    public List<HallTicket> generateHallTickets(@RequestBody Map<String, Object> payload) {
        Long examId = Long.valueOf(payload.get("examId").toString());
        Exam exam = examRepository.findById(examId)
                .orElseThrow(() -> new ResourceNotFoundException("Exam not found"));

        List<Student> targetStudents = new ArrayList<>();

        if (payload.containsKey("studentId") && payload.get("studentId") != null) {
            Long studentId = Long.valueOf(payload.get("studentId").toString());
            Student student = studentRepository.findById(studentId)
                    .orElseThrow(() -> new ResourceNotFoundException("Student not found"));
            targetStudents.add(student);
        } else if (payload.containsKey("className") && payload.get("className") != null) {
            String className = payload.get("className").toString();
            String section = payload.containsKey("section") && payload.get("section") != null
                    ? payload.get("section").toString()
                    : null;

            List<Student> allStudents = studentRepository.findAll();
            for (Student s : allStudents) {
                if (className.equals(s.getClassName()) && (section == null || section.equals(s.getSection()))) {
                    targetStudents.add(s);
                }
            }
        }

        List<HallTicket> generated = new ArrayList<>();
        String yearStr = String.valueOf(LocalDate.now().getYear());

        for (Student s : targetStudents) {
            // Check if hall ticket already exists
            HallTicket ticket = hallTicketRepository.findByStudentIdAndExamId(s.getId(), examId)
                    .orElse(null);

            if (ticket == null) {
                // Generate a unique hall ticket number
                String ticketNo;
                int seq = 1;
                do {
                    ticketNo = "HT" + yearStr + String.format("%06d", seq++);
                } while (hallTicketRepository.existsByHallTicketNumber(ticketNo));

                ticket = HallTicket.builder()
                        .hallTicketNumber(ticketNo)
                        .student(s)
                        .exam(exam)
                        .examCentre("Main Campus Exam Hall")
                        .instructions("1. Report 30 minutes before exam.\n2. Carry ID Card and printed Hall Ticket.\n3. Electronic devices are strictly prohibited.")
                        .status("PENDING")
                        .issueDate(LocalDate.now())
                        .build();

                generated.add(hallTicketRepository.save(ticket));
            } else {
                generated.add(ticket);
            }
        }

        return generated;
    }

    @PostMapping("/{id}/status")
    public HallTicket updateStatus(
            @PathVariable Long id,
            @RequestParam String status) {

        HallTicket ticket = hallTicketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Hall Ticket not found"));

        ticket.setStatus(status.toUpperCase());
        return hallTicketRepository.save(ticket);
    }

    @PostMapping("/{id}/regenerate")
    public HallTicket regenerateHallTicket(@PathVariable Long id) {
        HallTicket ticket = hallTicketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Hall Ticket not found"));

        String yearStr = String.valueOf(LocalDate.now().getYear());
        String ticketNo;
        int seq = 1;
        do {
            ticketNo = "HT" + yearStr + String.format("%06d", seq++);
        } while (hallTicketRepository.existsByHallTicketNumber(ticketNo));

        ticket.setHallTicketNumber(ticketNo);
        ticket.setStatus("PENDING");
        ticket.setIssueDate(LocalDate.now());

        return hallTicketRepository.save(ticket);
    }

    @PostMapping("/toggle")
    public HallTicket toggleHallTicket(@RequestBody Map<String, Object> payload) {
        Long examId = Long.valueOf(payload.get("examId").toString());
        Long studentId = Long.valueOf(payload.get("studentId").toString());
        String status = payload.get("status").toString().toUpperCase(); // APPROVED or PENDING

        Exam exam = examRepository.findById(examId)
                .orElseThrow(() -> new ResourceNotFoundException("Exam not found"));
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));

        HallTicket ticket = hallTicketRepository.findByStudentIdAndExamId(studentId, examId).orElse(null);
        if (ticket == null) {
            String yearStr = String.valueOf(LocalDate.now().getYear());
            String ticketNo;
            int seq = 1;
            do {
                ticketNo = "HT" + yearStr + String.format("%06d", seq++);
            } while (hallTicketRepository.existsByHallTicketNumber(ticketNo));

            ticket = HallTicket.builder()
                    .hallTicketNumber(ticketNo)
                    .student(student)
                    .exam(exam)
                    .examCentre("Main Campus Exam Hall")
                    .instructions("1. Report 30 minutes before exam.\n2. Carry ID Card and printed Hall Ticket.\n3. Electronic devices are strictly prohibited.")
                    .status(status)
                    .issueDate(LocalDate.now())
                    .build();
        } else {
            ticket.setStatus(status);
        }
        return hallTicketRepository.save(ticket);
    }

    @PostMapping("/bulk-status")
    public List<HallTicket> bulkStatus(@RequestBody Map<String, Object> payload) {
        Long examId = Long.valueOf(payload.get("examId").toString());
        String status = payload.get("status").toString().toUpperCase(); // APPROVED or PENDING

        List<Long> studentIds = new ArrayList<>();
        if (payload.containsKey("studentIds")) {
            Object idsObj = payload.get("studentIds");
            if (idsObj instanceof List) {
                for (Object id : (List<?>) idsObj) {
                    studentIds.add(Long.valueOf(id.toString()));
                }
            }
        }

        Exam exam = examRepository.findById(examId)
                .orElseThrow(() -> new ResourceNotFoundException("Exam not found"));

        List<HallTicket> updated = new ArrayList<>();
        for (Long studentId : studentIds) {
            Student student = studentRepository.findById(studentId).orElse(null);
            if (student == null) continue;

            HallTicket ticket = hallTicketRepository.findByStudentIdAndExamId(studentId, examId).orElse(null);
            if (ticket == null) {
                String yearStr = String.valueOf(LocalDate.now().getYear());
                String ticketNo;
                int seq = 1;
                do {
                    ticketNo = "HT" + yearStr + String.format("%06d", seq++);
                } while (hallTicketRepository.existsByHallTicketNumber(ticketNo));

                ticket = HallTicket.builder()
                        .hallTicketNumber(ticketNo)
                        .student(student)
                        .exam(exam)
                        .examCentre("Main Campus Exam Hall")
                        .instructions("1. Report 30 minutes before exam.\n2. Carry ID Card and printed Hall Ticket.\n3. Electronic devices are strictly prohibited.")
                        .status(status)
                        .issueDate(LocalDate.now())
                        .build();
            } else {
                ticket.setStatus(status);
            }
            updated.add(hallTicketRepository.save(ticket));
        }
        return updated;
    }
}
