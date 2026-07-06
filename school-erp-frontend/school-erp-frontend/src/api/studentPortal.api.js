import { apiClient } from "@/api/client";

export const studentPortalApi = {
  getProfile: () => apiClient.get("/student/profile").then((r) => r.data),
  getDashboard: () => apiClient.get("/student/dashboard").then((r) => r.data),
  getAttendance: () => apiClient.get("/student/attendance").then((r) => r.data),
  getFees: () => apiClient.get("/student/fees").then((r) => r.data),
  getTimetable: () => apiClient.get("/student/exams/timetable").then((r) => r.data),
  getHallTickets: () => apiClient.get("/student/hall-tickets/my-ticket").then((r) => r.data),
  getResults: () => apiClient.get("/student/results").then((r) => r.data),
  getDocuments: () => apiClient.get("/student/documents").then((r) => r.data),
  getNotifications: () => apiClient.get("/student/notifications").then((r) => r.data),
  readNotification: (id) => apiClient.post(`/student/notifications/${id}/read`).then((r) => r.data),
};
