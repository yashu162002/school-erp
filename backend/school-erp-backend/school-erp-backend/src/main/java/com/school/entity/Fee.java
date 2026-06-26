package com.school.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "fees")
@Data
public class Fee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long studentId;

    private Double amount;

    private Double paidAmount;

    private Double balanceAmount;

    private String status;
}