import { apiClient } from "@/api/client";
import { ENDPOINTS } from "@/api/endpoints";

/**
 * Matches VoiceCallController -> VoiceCallStatsResponse:
 *   { totalCallsToday, successfulCalls, failedCalls, scheduledCalls }
 * NOTE: backend currently returns hardcoded values (25/22/2/1), not
 * real data from voice_call_logs — display it, but don't be surprised
 * it never changes until the backend wires up the real query.
 */
export const voiceCallsApi = {
  getStats: () => apiClient.get(ENDPOINTS.voiceCalls.stats).then((r) => r.data),
};
