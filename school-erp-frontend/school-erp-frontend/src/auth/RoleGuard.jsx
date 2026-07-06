// src/auth/RoleGuard.jsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/auth/AuthContext";
import { ROLE_HOME_ROUTE } from "@/config/roles";

/**
 * Restricts a route subtree to specific roles. Must be nested inside
 * ProtectedRoute (assumes the user is already authenticated).
 *
 * If the logged-in user's role isn't in `allow`, they're redirected to
 * their own role's home route instead of seeing a blank/forbidden page.
 */
export function RoleGuard({ allow }) {
  const { user, isLoading } = useAuth();
  const role = user?.role;

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!role || !allow.includes(role)) {
    const fallback = ROLE_HOME_ROUTE[role] || "/login";
    return <Navigate to={fallback} replace />;
  }

  return <Outlet />;
}