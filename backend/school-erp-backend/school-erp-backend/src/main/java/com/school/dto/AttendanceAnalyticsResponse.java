package com.school.dto;

public class AttendanceAnalyticsResponse {

    private Long studentId;
    private String studentName;
    private long totalDays;
    private long presentDays;
    private long absentDays;
    private double attendancePercentage;

    public AttendanceAnalyticsResponse() {
    }

    public AttendanceAnalyticsResponse(
            Long studentId,
            String studentName,
            long totalDays,
            long presentDays,
            long absentDays,
            double attendancePercentage) {
        this.studentId = studentId;
        this.studentName = studentName;
        this.totalDays = totalDays;
        this.presentDays = presentDays;
        this.absentDays = absentDays;
        this.attendancePercentage = attendancePercentage;
    }

    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public long getTotalDays() {
        return totalDays;
    }

    public void setTotalDays(long totalDays) {
        this.totalDays = totalDays;
    }

    public long getPresentDays() {
        return presentDays;
    }

    public void setPresentDays(long presentDays) {
        this.presentDays = presentDays;
    }

    public long getAbsentDays() {
        return absentDays;
    }

    public void setAbsentDays(long absentDays) {
        this.absentDays = absentDays;
    }

    public double getAttendancePercentage() {
        return attendancePercentage;
    }

    public void setAttendancePercentage(double attendancePercentage) {
        this.attendancePercentage = attendancePercentage;
    }
}