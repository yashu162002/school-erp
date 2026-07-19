import { apiClient } from "@/api/client";

export const hallTicketsApi = {
  list: (params) => apiClient.get("/admin/hall-tickets", { params }).then((r) => r.data),
  generate: (payload) => apiClient.post("/admin/hall-tickets/generate", payload).then((r) => r.data),
  updateStatus: (id, status) => apiClient.post(`/admin/hall-tickets/${id}/status?status=${status}`).then((r) => r.data),
  regenerate: (id) => apiClient.post(`/admin/hall-tickets/${id}/regenerate`).then((r) => r.data),
  toggle: (payload) => apiClient.post("/admin/hall-tickets/toggle", payload).then((r) => r.data),
  bulkStatus: (payload) => apiClient.post("/admin/hall-tickets/bulk-status", payload).then((r) => r.data),
};
