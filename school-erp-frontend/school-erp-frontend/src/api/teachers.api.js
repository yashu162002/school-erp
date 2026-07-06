import { apiClient } from "@/api/client";
import { ENDPOINTS } from "@/api/endpoints";

/**
 * Matches the PLANNED TeacherController (see "Role-Based Login &
 * Teacher CRUD" plan) — not yet verified against real code. Request
 * body mirrors the existing TeacherRequest DTO:
 *   { employeeId, firstName, lastName, email, phone, subject, qualification, experience }
 * Response is assumed to mirror StudentResponse's pattern (adds id,
 * createdAt). Verify field names here once TeacherResponse.java and
 * the rewired TeacherController.java exist.
 */
export const teachersApi = {
  list: () => apiClient.get(ENDPOINTS.teachers.list).then((r) => r.data),
  create: (payload) => apiClient.post(ENDPOINTS.teachers.create, payload).then((r) => r.data),
  update: (id, payload) => apiClient.put(ENDPOINTS.teachers.update(id), payload).then((r) => r.data),
  remove: (id) => apiClient.delete(ENDPOINTS.teachers.remove(id)).then((r) => r.data),
};
