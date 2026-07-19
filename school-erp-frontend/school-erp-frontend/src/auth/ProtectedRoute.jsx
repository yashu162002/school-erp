// src/auth/ProtectedRoute.jsx
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/auth/AuthContext";
import { GearsLoader } from "@/components/ui/GearsLoader";

/**
 * Guards a route subtree behind authentication only.
 * Role-based guarding lives in RoleGuard.jsx, kept separate because
 * the backend doesn't expose role yet — see AuthContext.jsx.
 */
export function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F6F8]">
        <div className="flex flex-col items-center space-y-4">
          <GearsLoader className="w-24 h-24" />
          <p className="text-gray-500 text-[10px] font-bold tracking-[0.2em] uppercase">Checking Authorization...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Render child routes if authenticated
  return <Outlet />;
}