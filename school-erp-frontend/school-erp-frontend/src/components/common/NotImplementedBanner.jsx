import { AlertTriangle } from "lucide-react";

/**
 * Shown on pages whose backend controller is a stub or empty
 * (TeacherController, ParentPortalController, StudentPortalController).
 * Keeps the UI honest instead of quietly calling endpoints that don't
 * do anything real yet.
 */
export function NotImplementedBanner({ children }) {
  return (
    <div className="mb-4 flex items-start gap-2.5 rounded-md border border-warning/30 bg-warning/10 p-3 text-sm text-warning">
      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
      <p>{children}</p>
    </div>
  );
}
