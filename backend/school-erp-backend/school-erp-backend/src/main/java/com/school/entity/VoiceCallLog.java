
package com.school.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.*;

@Entity
@Table(name = "voice_call_logs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VoiceCallLog extends BaseEntity {

    @Column(name = "phone_number")
    private String phoneNumber;

    @Column(name = "call_type")
    private String callType;

    @Column(columnDefinition = "TEXT")
    private String message;

    private String status;

    @Column(name = "provider_reference")
    private String providerReference;
}

