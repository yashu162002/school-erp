import { apiClient } from "@/api/client";

export const teacherPortalApi = {
  getProfile: () => apiClient.get("/teacher/profile").then((r) => r.data),
  getDashboard: () => apiClient.get("/teacher/dashboard").then((r) => r.data),
  getAssignedClasses: () => apiClient.get("/teacher/classes").then((r) => r.data),
  getAssignedSubjects: () => apiClient.get("/teacher/subjects").then((r) => r.data),
  getStudents: (className, section) =>
    apiClient.get("/teacher/students", { params: { className, section } }).then((r) => r.data),
  getAttendance: (className, section, subjectName, date) =>
    apiClient.get("/teacher/attendance", { params: { className, section, subjectName, date } }).then((r) => r.data),
  submitAttendance: (payload, subjectName) =>
    apiClient.post("/teacher/attendance/bulk", payload, { params: { subjectName } }).then((r) => r.data),

  getPublishedExams: () =>
    apiClient.get("/teacher/exams").then((r) => r.data),
  getResults: (examId, subjectName, className, section) =>
    apiClient.get("/teacher/results", { params: { examId, subjectName, className, section } }).then((r) => r.data),
  submitResults: (examId, subjectName, className, section, payload) =>
    apiClient.post("/teacher/results/bulk", payload, { params: { examId, subjectName, className, section } }).then((r) => r.data),

  getLeaves: () =>
    apiClient.get("/teacher/leaves").then((r) => r.data),
  applyLeave: (payload) =>
    apiClient.post("/teacher/leaves", payload).then((r) => r.data),
  updateProfilePhoto: (photoUrl) =>
    apiClient.post("/teacher/profile/photo", { photoUrl }).then((r) => r.data),
};
