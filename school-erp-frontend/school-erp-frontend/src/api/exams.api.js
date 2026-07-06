import { apiClient } from "@/api/client";

export const examsApi = {
  list: () => apiClient.get("/admin/exams").then((r) => r.data),
  getOne: (id) => apiClient.get(`/admin/exams/${id}`).then((r) => r.data),
  create: (payload) => apiClient.post("/admin/exams", payload).then((r) => r.data),
  update: (id, payload) => apiClient.put(`/admin/exams/${id}`, payload).then((r) => r.data),
  publish: (id) => apiClient.post(`/admin/exams/${id}/publish`).then((r) => r.data),
  toggleEnable: (id) => apiClient.post(`/admin/exams/${id}/toggle-enable`).then((r) => r.data),

  listTimetable: (params) => apiClient.get("/admin/exams/timetables", { params }).then((r) => r.data),
  createTimetable: (payload) => apiClient.post("/admin/exams/timetables", payload).then((r) => r.data),
  updateTimetable: (id, payload) => apiClient.put(`/admin/exams/timetables/${id}`, payload).then((r) => r.data),
  deleteTimetable: (id) => apiClient.delete(`/admin/exams/timetables/${id}`).then((r) => r.data),
};
