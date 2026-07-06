import { apiClient } from "@/api/client";
import { ENDPOINTS } from "@/api/endpoints";

/**
 * Matches ResultController. ResultRequest body:
 *   { studentId, examId, subjectId, marksObtained, maxMarks }
 * GET returns raw Result entities (nested student/exam/subject objects).
 */
export const resultsApi = {
  save: (payload) => apiClient.post(ENDPOINTS.results.save, payload).then((r) => r.data),
  byStudent: (studentId) => apiClient.get(ENDPOINTS.results.byStudent(studentId)).then((r) => r.data),
};
