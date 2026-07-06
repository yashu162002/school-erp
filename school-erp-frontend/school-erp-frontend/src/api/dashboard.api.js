import { apiClient } from "@/api/client";
import { ENDPOINTS } from "@/api/endpoints";

/**
 * Matches DashboardController -> DashboardResponse:
 *   { totalStudents, totalTeachers, totalParents, totalAttendance }
 */
export const adminDashboardApi = {
  getStats: () => apiClient.get(ENDPOINTS.adminDashboard.stats).then((r) => r.data),
};
