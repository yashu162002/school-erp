import { apiClient } from "@/api/client";
import { ENDPOINTS } from "@/api/endpoints";

/**
 * Matches StudentController exactly (com.school.controller.StudentController).
 * Request body for create/update = StudentRequest:
 *   { admissionNo, firstName, lastName, className, section, studentPhone, email }
 * Response = StudentResponse:
 *   { id, admissionNo, firstName, lastName, className, section, studentPhone, email, createdAt }
 */
export const studentsApi = {
  list: () => apiClient.get(ENDPOINTS.students.list).then((r) => r.data),
  getOne: (id) => apiClient.get(ENDPOINTS.students.getOne(id)).then((r) => r.data),
  create: (payload) => apiClient.post(ENDPOINTS.students.create, payload).then((r) => r.data),
  update: (id, payload) => apiClient.put(ENDPOINTS.students.update(id), payload).then((r) => r.data),
  remove: (id) => apiClient.delete(ENDPOINTS.students.remove(id)).then((r) => r.data),

  // multipart/form-data upload, field name must be "photo"
  uploadPhoto: (file) => {
    const formData = new FormData();
    formData.append("photo", file);
    return apiClient
      .post(ENDPOINTS.students.uploadPhoto, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((r) => r.data); // returns a plain string (stored path/URL)
  },

  search: (name) =>
    apiClient.get(ENDPOINTS.students.search, { params: { name } }).then((r) => r.data),

  // returns a Spring Page<Student> object: { content, totalElements, totalPages, number, size, ... }
  getPage: (page = 0, size = 10) =>
    apiClient.get(ENDPOINTS.students.page, { params: { page, size } }).then((r) => r.data),

  getProfile: (id) => apiClient.get(ENDPOINTS.students.profile(id)).then((r) => r.data),
  getAttendance: (id) => apiClient.get(ENDPOINTS.students.attendance(id)).then((r) => r.data),
  getResults: (id) => apiClient.get(ENDPOINTS.students.results(id)).then((r) => r.data),
  getAnnouncements: () => apiClient.get(ENDPOINTS.students.announcements).then((r) => r.data),
  getFees: (id) => apiClient.get(ENDPOINTS.students.fees(id)).then((r) => r.data),
  getTimetable: (id) => apiClient.get(ENDPOINTS.students.timetable(id)).then((r) => r.data),

  resetPassword: (id, payload) => apiClient.post(`${ENDPOINTS.students.getOne(id)}/reset-password`, payload).then((r) => r.data),
  toggleLogin: (id) => apiClient.post(`${ENDPOINTS.students.getOne(id)}/toggle-login`).then((r) => r.data),
  toggleLock: (id) => apiClient.post(`${ENDPOINTS.students.getOne(id)}/toggle-lock`).then((r) => r.data),
  getLoginHistory: (id) => apiClient.get(`${ENDPOINTS.students.getOne(id)}/login-history`).then((r) => r.data),
  transfer: (id, payload) => apiClient.post(`${ENDPOINTS.students.getOne(id)}/transfer`, payload).then((r) => r.data),
};
