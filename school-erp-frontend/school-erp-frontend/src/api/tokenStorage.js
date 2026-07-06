/**
 * Token persistence. The real backend issues a single JWT (24h expiry,
 * no refresh token), so there is only one token to store.
 */
const ACCESS_TOKEN_KEY = "erp_access_token";

export const tokenStorage = {
  getAccessToken: () => localStorage.getItem(ACCESS_TOKEN_KEY),
  setAccessToken: (token) => localStorage.setItem(ACCESS_TOKEN_KEY, token),
  clear: () => localStorage.removeItem(ACCESS_TOKEN_KEY),
};
