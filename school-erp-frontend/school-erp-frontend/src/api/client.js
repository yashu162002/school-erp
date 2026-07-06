import axios from "axios";
import { env } from "@/config/env";
import { tokenStorage } from "@/api/tokenStorage";

/**
 * Shared axios instance for all backend calls.
 *
 * NOTE on auth, confirmed from the real backend (bk.zip):
 * - POST /api/auth/login is the ONLY auth endpoint. It returns a
 *   single { token } — no refreshToken, no user/role info.
 * - The JWT carries only the username as subject + issuedAt/expiration
 *   (24h). It has NO role claim.
 * - There is no logout endpoint (JWT is stateless) and no
 *   refresh-token endpoint, so this client does NOT attempt silent
 *   token refresh — there is nothing to refresh against.
 * - SecurityConfig currently has `.anyRequest().permitAll()`, so no
 *   endpoint actually enforces authentication yet. The Authorization
 *   header is still attached below so the app behaves correctly once
 *   the backend adds enforcement.
 */
export const apiClient = axios.create({
  baseURL: env.apiBaseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Set by AuthProvider so the interceptor can force a logout/redirect
 * when a request comes back 401 (e.g. once the backend starts
 * enforcing auth, or if the token expires client-side).
 */
let onAuthExpired = () => {};
export function registerAuthExpiredHandler(handler) {
  onAuthExpired = handler;
}

// Attach the access token to every outgoing request.
apiClient.interceptors.request.use((config) => {
  const token = tokenStorage.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const isAuthEndpoint = error.config?.url?.includes("/auth/");

    if (status === 401 && !isAuthEndpoint) {
      tokenStorage.clear();
      onAuthExpired();
    }

    return Promise.reject(normalizeApiError(error));
  }
);

/**
 * Normalizes errors to the shape the backend's GlobalExceptionHandler
 * actually returns: { timestamp, status, error, message, path }.
 */
export function normalizeApiError(error) {
  if (error.response?.data) {
    const data = error.response.data;
    return {
      status: error.response.status,
      message: data.message || data.error || "Something went wrong. Please try again.",
      timestamp: data.timestamp,
      path: data.path,
      raw: data,
    };
  }

  if (error.request) {
    return {
      status: 0,
      message: "Unable to reach the server. Check your connection.",
      raw: error,
    };
  }

  return { status: -1, message: error.message || "Unexpected error.", raw: error };
}
