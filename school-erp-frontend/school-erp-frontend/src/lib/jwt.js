import { jwtDecode } from "jwt-decode";

/**
 * Reads JWT claims. Per the "Role-Based Login & Teacher CRUD" plan,
 * JwtService.generateToken will start including a "role" claim
 * alongside subject/iat/exp. ASSUMPTION (unverified against real
 * code): the claim key is exactly "role" and its value is one of the
 * Role enum names (ADMIN/TEACHER/STUDENT/PARENT). Confirm this once
 * JwtService.java is actually updated — if the key or value shape
 * differs, update the `role` line in AuthContext.jsx accordingly.
 */
export function decodeToken(token) {
  try {
    return jwtDecode(token); // { sub, role?, iat, exp }
  } catch {
    return null;
  }
}

export function isTokenExpired(token) {
  const claims = decodeToken(token);
  if (!claims?.exp) return true;
  return claims.exp * 1000 < Date.now();
}
