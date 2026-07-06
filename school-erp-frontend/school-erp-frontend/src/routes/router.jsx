// src/routes/router.jsx
import { createBrowserRouter, Navigate } from "react-router-dom";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ProtectedRoute } from "@/auth/ProtectedRoute";
import { RoleGuard } from "@/auth/RoleGuard";
import { ROLES } from "@/config/roles";

import { LoginPage } from "@/features/auth/pages/LoginPage";
import { AdminDashboard } from "@/features/dashboard/pages/AdminDashboard";
import { StudentsPage } from "@/features/students/pages/StudentsPage";
import { StudentDashboard } from "@/features/students/pages/StudentDashboard";
import { StudentProfile } from "@/features/students/pages/StudentProfile";
import { StudentAttendance } from "@/features/students/pages/StudentAttendance";
import { StudentTimetable } from "@/features/students/pages/StudentTimetable";
import { StudentHallTicket } from "@/features/students/pages/StudentHallTicket";
import { StudentResults } from "@/features/students/pages/StudentResults";
import { StudentFees } from "@/features/students/pages/StudentFees";
import { StudentDocuments } from "@/features/students/pages/StudentDocuments";
import { StudentNotifications } from "@/features/students/pages/StudentNotifications";
import { ParentsPage } from "@/features/parents/pages/ParentsPage";
import { SubjectsPage } from "@/features/subjects/pages/SubjectsPage";
import { TeachersPage } from "@/features/teachers/pages/TeachersPage";
import { AttendancePage } from "@/features/attendance/pages/AttendancePage";
import { ResultsPage } from "@/features/results/pages/ResultsPage";
import { ExamsPage } from "@/features/exams/pages/ExamsPage";
import { AnnouncementsPage } from "@/features/announcements/pages/AnnouncementsPage";
import { NotificationsPage } from "@/features/notifications/pages/NotificationsPage";
import { VoiceCallsPage } from "@/features/voiceCalls/pages/VoiceCallsPage";
import { FeesPage } from "@/features/fees/pages/FeesPage";
import LandingPage from "@/features/landing/pages/LandingPage";

export const router = createBrowserRouter([
  {
    // Landing page - public root
    path: "/",
    element: <LandingPage />,
  },
  {
    // Auth routes (login)
    element: <AuthLayout />,
    children: [{ path: "/login", element: <LoginPage /> }],
  },
  {
    // Protected routes - require authentication
    element: <ProtectedRoute />,
    children: [
      // Admin routes
      {
        element: <RoleGuard allow={[ROLES.SUPER_ADMIN, ROLES.ADMIN]} />,
        children: [
          {
            element: <DashboardLayout />,
            children: [
              { path: "/admin/dashboard", element: <AdminDashboard /> },
              { path: "/admin/students", element: <StudentsPage /> },
              { path: "/admin/parents", element: <ParentsPage /> },
              { path: "/admin/subjects", element: <SubjectsPage /> },
              { path: "/admin/teachers", element: <TeachersPage /> },
              { path: "/admin/attendance", element: <AttendancePage /> },
              { path: "/admin/results", element: <ResultsPage /> },
              { path: "/admin/exams", element: <ExamsPage /> },
              { path: "/admin/announcements", element: <AnnouncementsPage /> },
              { path: "/admin/notifications", element: <NotificationsPage /> },
              { path: "/admin/voice-calls", element: <VoiceCallsPage /> },
              { path: "/admin/fees", element: <FeesPage /> },
            ],
          },
        ],
      },
      // For now, redirect other roles to admin dashboard
      // Later you can add teacher/student/parent routes
      // Student Specific Routes
      {
        element: <RoleGuard allow={[ROLES.STUDENT]} />,
        children: [
          {
            element: <DashboardLayout />,
            children: [
              { path: "/student/dashboard", element: <StudentDashboard /> },
              { path: "/student/profile", element: <StudentProfile /> },
              { path: "/student/attendance", element: <StudentAttendance /> },
              { path: "/student/timetable", element: <StudentTimetable /> },
              { path: "/student/hall-ticket", element: <StudentHallTicket /> },
              { path: "/student/results", element: <StudentResults /> },
              { path: "/student/fees", element: <StudentFees /> },
              { path: "/student/documents", element: <StudentDocuments /> },
              { path: "/student/notifications", element: <StudentNotifications /> },
            ],
          },
        ],
      },
      // Teacher / Parent Redirect / Guards
      {
        element: <RoleGuard allow={[ROLES.TEACHER, ROLES.PARENT]} />,
        children: [
          {
            element: <DashboardLayout />,
            children: [
              { path: "/teacher/*", element: <Navigate to="/admin/dashboard" replace /> },
              { path: "/parent/*", element: <Navigate to="/admin/dashboard" replace /> },
            ],
          },
        ],
      },
    ],
  },
  // Fallback route - redirect to landing page
  { path: "*", element: <Navigate to="/" replace /> },
]);