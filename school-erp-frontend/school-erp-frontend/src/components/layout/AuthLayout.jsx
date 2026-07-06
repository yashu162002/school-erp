import { Outlet, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/auth/AuthContext";
import { GraduationCap } from "lucide-react";

export function AuthLayout() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return (
    <div className="flex min-h-screen bg-background">
      <div className="flex w-full flex-col items-center justify-center px-6 py-12 lg:w-1/2">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="w-full max-w-sm"
        >
          <div className="mb-8 flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <GraduationCap className="h-5 w-5" />
            </div>
            <span className="font-display text-lg font-semibold">Trishul High School</span>
          </div>
          <Outlet />
        </motion.div>
      </div>

      <div className="relative hidden w-1/2 overflow-hidden bg-primary lg:block">
        <div className="absolute inset-0 flex flex-col justify-between p-12">
          <div />
          <div>
            <p className="font-display text-2xl font-semibold text-primary-foreground">
              One system for every desk in the school.
            </p>
            <p className="mt-2 max-w-sm text-sm text-primary-foreground/70">
              Admissions, attendance, results, and fees — connected end to end.
            </p>
          </div>
          <div className="flex gap-1.5">
            {["Admin", "Teacher", "Student", "Parent"].map((role, i) => (
              <div
                key={role}
                className="h-1 flex-1 rounded-full bg-primary-foreground/20"
                style={{ opacity: 0.3 + i * 0.15 }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
