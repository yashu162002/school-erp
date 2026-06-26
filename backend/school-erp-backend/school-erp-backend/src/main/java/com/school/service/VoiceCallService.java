package com.school.service;

public interface VoiceCallService {

    void makeBirthdayCall(
            String phoneNumber,
            String studentName);

    void makeAbsentCall(
            String phoneNumber,
            String studentName);

    void makeTestReminderCall(
            String phoneNumber,
            String examName);
}