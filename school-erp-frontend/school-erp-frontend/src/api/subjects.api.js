import { apiClient } from "@/api/client";

export const subjectsApi = {
  list: (params) => apiClient.get("/admin/subjects", { params }).then((r) => r.data),
  create: (payload) => apiClient.post("/admin/subjects", payload).then((r) => r.data),
  update: (id, payload) => apiClient.put(`/admin/subjects/${id}`, payload).then((r) => r.data),
  remove: (id) => apiClient.delete(`/admin/subjects/${id}`).then((r) => r.data),
};
