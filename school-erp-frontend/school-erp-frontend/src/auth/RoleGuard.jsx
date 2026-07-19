import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/auth/AuthContext";
import { ROLE_HOME_ROUTE } from "@/config/roles";
import { GearsLoader } from "@/components/ui/GearsLoader";

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
      <div className="min-h-screen flex items-center justify-center bg-[#F5F6F8]">
        <div className="flex flex-col items-center space-y-4">
          <GearsLoader className="w-24 h-24" />
          <p className="text-gray-500 text-[10px] font-bold tracking-[0.2em] uppercase">Guarding Portal Access...</p>
        </div>
      </div>
    );
  }

  if (!role || !allow.includes(role)) {
    const fallback = ROLE_HOME_ROUTE[role] || "/login";
    return <Navigate to={fallback} replace />;
  }

  return <Outlet />;
}