import { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";
import { authApi } from "@/api/auth.api";
import { tokenStorage } from "@/api/tokenStorage";
import { registerAuthExpiredHandler } from "@/api/client";
import { decodeToken, isTokenExpired } from "@/lib/jwt";

const AuthContext = createContext(null);

/**
 * Per the "Role-Based Login & Teacher CRUD" plan, JwtService now embeds
 * a "role" claim in the token. This context decodes it into
 * user.role. UNVERIFIED ASSUMPTION: claim key is "role", value is the
 * Role enum name (e.g. "ADMIN"). If the real backend uses a different
 * key/shape, adjust `deriveUserFromToken` below — nowhere else needs
 * to change.
 */
function deriveUserFromToken(token) {
  const claims = decodeToken(token);
  if (!claims) return null;
  return {
    username: claims.sub,
    role: claims.role ? claims.role.toLowerCase() : null,
  };
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => {
    const existing = tokenStorage.getAccessToken();
    if (existing && !isTokenExpired(existing)) {
      const derived = deriveUserFromToken(existing);
      if (derived && derived.role) {
        return existing;
      }
    }
    if (existing) {
      tokenStorage.clear();
    }
    return null;
  });
  const [user, setUser] = useState(() => {
    const existing = tokenStorage.getAccessToken();
    if (existing && !isTokenExpired(existing)) {
      const derived = deriveUserFromToken(existing);
      if (derived && derived.role) {
        return derived;
      }
    }
    return null;
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const logout = useCallback(() => {
    tokenStorage.clear();
    setToken(null);
    setUser(null);
  }, []);

  useEffect(() => {
    registerAuthExpiredHandler(logout);
  }, [logout]);

  useEffect(() => {
    if (token && isTokenExpired(token)) {
      logout();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const login = useCallback(async ({ username, password }) => {
    setIsLoading(true);
    setError(null);
    try {
      const { token: newToken } = await authApi.login({ username, password });
      tokenStorage.setAccessToken(newToken);
      setToken(newToken);
      const derived = deriveUserFromToken(newToken) ?? { username, role: null };
      setUser(derived);
      return derived;
    } catch (err) {
      setError(err.message || "Login failed");
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token && !isTokenExpired(token) && user?.role),
      isLoading,
      error,
      login,
      logout,
    }),
    [token, user, isLoading, error, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
