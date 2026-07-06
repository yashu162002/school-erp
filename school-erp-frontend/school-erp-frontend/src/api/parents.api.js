import { apiClient } from "@/api/client";
import { ENDPOINTS } from "@/api/endpoints";

/**
 * Matches ParentController. create/update take the RAW Parent entity
 * body, not a DTO:
 *   { fatherName, motherName, fatherPhone, motherPhone, email, student: { id } }
 */
export const parentsApi = {
  list: () => apiClient.get(ENDPOINTS.parents.list).then((r) => r.data),
  create: (payload) => apiClient.post(ENDPOINTS.parents.create, payload).then((r) => r.data),
  update: (id, payload) => apiClient.put(ENDPOINTS.parents.update(id), payload).then((r) => r.data),
  remove: (id) => apiClient.delete(ENDPOINTS.parents.remove(id)).then((r) => r.data),

  // LeaveRequestDto: { studentId, reason, fromDate, toDate } -> returns a plain string
  submitLeaveRequest: (payload) =>
    apiClient.post(ENDPOINTS.parents.leaveRequest, payload).then((r) => r.data),

  getDashboard: (parentId) => apiClient.get(ENDPOINTS.parents.dashboard(parentId)).then((r) => r.data),
  getAttendance: (parentId) => apiClient.get(ENDPOINTS.parents.attendance(parentId)).then((r) => r.data),
  getResults: (parentId) => apiClient.get(ENDPOINTS.parents.results(parentId)).then((r) => r.data),
  getFees: (parentId) => apiClient.get(ENDPOINTS.parents.fees(parentId)).then((r) => r.data),
};
