package com.school.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "student_documents")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentDocument extends BaseEntity {

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    private String documentType; // TRANSFER_CERTIFICATE, BONAFIDE, STUDY_CERTIFICATE, FEE_RECEIPT, HALL_TICKET, RESULT, MARKSHEET, ID_CARD, CHARACTER_CERTIFICATE

    private String documentName;

    private String filePath;

    private LocalDate uploadDate;
}
