package com.school.controller;

import com.school.dto.StudentFeeDetailsResponse;
import com.school.entity.Fee;
import com.school.entity.Student;
import com.school.repository.FeeRepository;
import com.school.repository.StudentRepository;
import com.school.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/fees")
@RequiredArgsConstructor
public class FeeController {

    private final FeeRepository feeRepository;
    private final StudentRepository studentRepository;

    @GetMapping("/classes")
    public List<String> getClasses() {
        return studentRepository.findDistinctClassNames();
    }

    @GetMapping("/class/{className}")
    public List<StudentFeeDetailsResponse> getClassFees(@PathVariable String className) {
        List<Student> students = studentRepository.findByClassName(className);
        return students.stream().map(student -> {
            List<Fee> fees = feeRepository.findByStudentId(student.getId());
            return StudentFeeDetailsResponse.builder()
                    .id(student.getId())
                    .admissionNo(student.getAdmissionNo())
                    .firstName(student.getFirstName())
                    .lastName(student.getLastName())
                    .className(student.getClassName())
                    .section(student.getSection())
                    .fees(fees)
                    .build();
        }).collect(Collectors.toList());
    }

    @PostMapping
    public Fee createFee(@RequestBody Fee fee) {
        return feeRepository.save(fee);
    }

    @PutMapping("/{id}")
    public Fee updateFee(@PathVariable Long id, @RequestBody Fee feeDetails) {
        Fee fee = feeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Fee record not found with id: " + id));

        fee.setFeeType(feeDetails.getFeeType());
        fee.setAmount(feeDetails.getAmount());
        fee.setPaidAmount(feeDetails.getPaidAmount());
        fee.setDueDate(feeDetails.getDueDate());
        fee.setPaymentStatus(feeDetails.getPaymentStatus());
        fee.setRemarks(feeDetails.getRemarks());

        return feeRepository.save(fee);
    }

    @DeleteMapping("/{id}")
    public void deleteFee(@PathVariable Long id) {
        Fee fee = feeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Fee record not found with id: " + id));
        feeRepository.delete(fee);
    }
}
