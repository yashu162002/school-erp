import { useAuth } from "@/auth/AuthContext";
import { ROLE_LABELS } from "@/config/roles";
import { NotImplementedBanner } from "@/components/common/NotImplementedBanner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Construction } from "lucide-react";

const PORTAL_NOTE = {
  TEACHER:
    "There's no teacher-facing controller yet — TeacherController only supports Admin managing teacher records, not a teacher's own view of their classes, attendance, or marks entry.",
  STUDENT:
    "StudentPortalController (@RequestMapping /api/student) exists but has zero endpoints defined yet.",
  PARENT:
    "ParentPortalController (@RequestMapping /api/parent) exists but has zero endpoints defined yet.",
};

/**
 * Landing page for Teacher/Student/Parent after login. Login and
 * role detection work, but there's genuinely nothing behind these
 * portals in the backend yet — this says so instead of pretending.
 */
export function RolePendingDashboard() {
  const { user } = useAuth();
  const roleLabel = ROLE_LABELS[user?.role] || "Your";

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-foreground">
        Welcome, {user?.username}
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">{roleLabel} portal</p>

      <NotImplementedBanner>
        {PORTAL_NOTE[user?.role] || "This portal's backend isn't built out yet."}
      </NotImplementedBanner>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Construction className="h-4 w-4 text-muted-foreground" />
            Under construction
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            You're signed in and your role was read correctly from the JWT — the login and
            routing work. This page is a placeholder for the {roleLabel.toLowerCase()}
            {" "}dashboard, which will come together once the corresponding backend endpoints
            are provided.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
