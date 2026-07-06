import { apiClient } from "@/api/client";
import { ENDPOINTS } from "@/api/endpoints";

/**
 * Matches AnnouncementController. POST body is the raw Announcement
 * entity: { title, description, targetAudience }.
 */
export const announcementsApi = {
  list: () => apiClient.get(ENDPOINTS.announcements.list).then((r) => r.data),
  create: (payload) => apiClient.post(ENDPOINTS.announcements.create, payload).then((r) => r.data),
};
