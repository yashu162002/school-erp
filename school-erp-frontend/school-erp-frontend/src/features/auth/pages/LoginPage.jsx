import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/auth/AuthContext";
import { ROLES, ROLE_LABELS, ROLE_HOME_ROUTE } from "@/config/roles";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from "@/components/ui/select";
import {
  Form, FormField, FormItem, FormLabel, FormControl, FormMessage,
} from "@/components/ui/form";

const REMEMBERED_USERNAME_KEY = "erp_remembered_username";

const loginSchema = z.object({
  role: z.string().min(1, "Select a role"),
  username: z.string().min(1, "User ID is required"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
});

// All four roles are now selectable. Seeded accounts per the
// "Role-Based Login & Teacher CRUD" plan: admin/admin123,
// teacher/teacher123, student/student123, parent/parent123.
const ROLE_OPTIONS = [
  { value: ROLES.ADMIN, label: ROLE_LABELS[ROLES.ADMIN] },
  { value: ROLES.TEACHER, label: ROLE_LABELS[ROLES.TEACHER] },
  { value: ROLES.STUDENT, label: ROLE_LABELS[ROLES.STUDENT] },
  { value: ROLES.PARENT, label: ROLE_LABELS[ROLES.PARENT] },
];

export function LoginPage() {
  const { login, logout, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      role: ROLES.ADMIN,
      username: localStorage.getItem(REMEMBERED_USERNAME_KEY) || "",
      password: "",
      rememberMe: Boolean(localStorage.getItem(REMEMBERED_USERNAME_KEY)),
    },
  });

  async function onSubmit(values) {
    try {
      const user = await login(values);

      // The role picker is a UX guard, not what authorizes the user —
      // the JWT's "role" claim is the source of truth. If they exist
      // (backend now embeds a role claim), catch a mismatched portal.
      if (user.role && user.role !== values.role) {
        logout();
        toast.error(
          `This account is registered as ${ROLE_LABELS[user.role] || user.role}, not ${ROLE_LABELS[values.role]}.`
        );
        return;
      }

      if (values.rememberMe) {
        localStorage.setItem(REMEMBERED_USERNAME_KEY, values.username);
      } else {
        localStorage.removeItem(REMEMBERED_USERNAME_KEY);
      }

      const defaultRoute = ROLE_HOME_ROUTE[user.role] || "/admin/dashboard";
      const redirectTo = location.state?.from?.pathname || defaultRoute;
      navigate(redirectTo, { replace: true });
    } catch (err) {
      toast.error(err.message || "Invalid username or password");
    }
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-foreground">Sign in</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Use your Trishul High School account to continue.
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {ROLE_OPTIONS.map((r) => (
                      <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>User ID</FormLabel>
                <FormControl>
                  <Input placeholder="admin" autoComplete="username" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" autoComplete="current-password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-muted-foreground">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-border accent-primary"
                {...form.register("rememberMe")}
              />
              Remember me
            </label>
            <button
              type="button"
              className="text-muted-foreground underline decoration-dotted underline-offset-2 cursor-not-allowed"
              title="Not available — no forgot-password endpoint exists on the backend yet"
              onClick={() =>
                toast.info("Forgot password isn't available yet — the backend has no reset-password endpoint.")
              }
            >
              Forgot password?
            </button>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            Sign in
          </Button>
        </form>
      </Form>

      <p className="mt-6 text-xs text-muted-foreground">
        Seeded accounts: <code className="rounded bg-muted px-1 py-0.5">admin/admin123</code>{" "}
        <code className="rounded bg-muted px-1 py-0.5">teacher/teacher123</code>{" "}
        <code className="rounded bg-muted px-1 py-0.5">student/student123</code>{" "}
        <code className="rounded bg-muted px-1 py-0.5">parent/parent123</code>
      </p>
    </div>
  );
}
