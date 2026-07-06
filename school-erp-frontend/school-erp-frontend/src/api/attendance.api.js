import { apiClient } from "@/api/client";
import { ENDPOINTS } from "@/api/endpoints";

/**
 * Matches AttendanceController. AttendanceRequest body:
 *   { studentId, attendanceDate ("YYYY-MM-DD"), status, remarks }
 * status is a free string on the wire (AttendanceRequest/Attendance
 * entity use String, not the AttendanceStatus enum) — send one of
 * "PRESENT" | "ABSENT" | "LEAVE" to match entity.AttendanceStatus values.
 */
export const attendanceApi = {
  mark: (payload) => apiClient.post(ENDPOINTS.attendance.mark, payload).then((r) => r.data),
  byDate: (isoDate) => apiClient.get(ENDPOINTS.attendance.byDate(isoDate)).then((r) => r.data),
  byStudent: (studentId) => apiClient.get(ENDPOINTS.attendance.byStudent(studentId)).then((r) => r.data),
  analytics: (studentId) => apiClient.get(ENDPOINTS.attendance.analytics(studentId)).then((r) => r.data),
};
