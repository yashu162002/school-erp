package com.school.controller;

import com.school.entity.*;
import com.school.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/parent")
@RequiredArgsConstructor
public class ParentPortalController {

    private final ParentRepository parentRepository;
    private final AttendanceRepository attendanceRepository;
    private final ResultRepository resultRepository;
    private final FeeRepository feeRepository;
    private final AnnouncementRepository announcementRepository;

}