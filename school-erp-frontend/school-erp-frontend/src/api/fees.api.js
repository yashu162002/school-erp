import { apiClient } from "@/api/client";
import { ENDPOINTS } from "@/api/endpoints";

export const feesApi = {
  getClasses: () => apiClient.get(ENDPOINTS.fees.classes).then((r) => r.data),
  getClassFees: (className) => apiClient.get(ENDPOINTS.fees.classFees(className)).then((r) => r.data),
  createFee: (payload) => apiClient.post(ENDPOINTS.fees.create, payload).then((r) => r.data),
  updateFee: (id, payload) => apiClient.put(ENDPOINTS.fees.update(id), payload).then((r) => r.data),
  deleteFee: (id) => apiClient.delete(ENDPOINTS.fees.remove(id)).then((r) => r.data),
};
