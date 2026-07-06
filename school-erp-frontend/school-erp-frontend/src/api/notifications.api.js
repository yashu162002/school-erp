import { apiClient } from "@/api/client";
import { ENDPOINTS } from "@/api/endpoints";

/**
 * Matches NotificationController. NotificationRequest body:
 *   { title, message, notificationType, targetAudience }
 * NOTE: there is no mark-read endpoint even though Notification has
 * an isRead field — don't build a "mark as read" action against this
 * API until that's added.
 */
export const notificationsApi = {
  list: () => apiClient.get(ENDPOINTS.notifications.list).then((r) => r.data),
  create: (payload) => apiClient.post(ENDPOINTS.notifications.create, payload).then((r) => r.data),
};
