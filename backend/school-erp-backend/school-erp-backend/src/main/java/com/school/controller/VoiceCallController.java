
package com.school.controller;

import com.school.dto.VoiceCallStatsResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/voice")
public class VoiceCallController {

    @GetMapping("/stats")
    public VoiceCallStatsResponse getVoiceStats() {

        return new VoiceCallStatsResponse(
                25L, // total calls today
                22L, // successful
                2L,  // failed
                1L   // scheduled
        );
    }
}

