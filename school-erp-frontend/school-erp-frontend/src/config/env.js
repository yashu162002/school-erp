/**
 * Centralized environment access. Vite only exposes variables
 * prefixed with VITE_ to client code.
 *
 * Set these in a local .env file (see .env.example):
 *   VITE_API_BASE_URL=http://localhost:8080/api
 */
export const env = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api",
};
