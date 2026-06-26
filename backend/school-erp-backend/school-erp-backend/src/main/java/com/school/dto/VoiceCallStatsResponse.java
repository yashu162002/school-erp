
package com.school.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VoiceCallStatsResponse {

    private Long totalCallsToday;
    private Long successfulCalls;
    private Long failedCalls;
    private Long scheduledCalls;

}
