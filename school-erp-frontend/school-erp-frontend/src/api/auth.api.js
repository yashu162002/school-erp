import { apiClient } from "@/api/client";
import { ENDPOINTS } from "@/api/endpoints";

/**
 * Auth API — matches the real AuthController exactly.
 *
 * login() is the ONLY real endpoint. It takes { username, password }
 * and returns { token }. There is no logout, refresh, profile, or
 * password-reset endpoint in the backend right now.
 */
export const authApi = {
  login: ({ username, password }) =>
    apiClient
      .post(ENDPOINTS.auth.login, { username, password })
      .then((res) => res.data), // { token }
};
