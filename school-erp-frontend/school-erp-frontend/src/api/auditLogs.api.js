import { apiClient } from "@/api/client";

export const auditLogsApi = {
  list: (page = 0, size = 15, search = "", action = "") =>
    apiClient
      .get("/admin/audit-logs", { params: { page, size, search, action } })
      .then((r) => r.data),
};
