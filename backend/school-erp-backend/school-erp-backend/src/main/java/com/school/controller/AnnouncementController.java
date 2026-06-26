package com.school.controller;

import com.school.entity.Announcement;
import com.school.repository.AnnouncementRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/announcements")
@RequiredArgsConstructor
public class AnnouncementController {

    private final AnnouncementRepository repository;

    @GetMapping
    public List<Announcement> getAll(){

        return repository.findAll();
    }

    @PostMapping
    public Announcement create(
            @RequestBody Announcement announcement){

        return repository.save(announcement);
    }
}