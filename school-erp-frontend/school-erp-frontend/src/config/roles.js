// src/config/roles.js
export const ROLES = {
  SUPER_ADMIN: "super_admin",
  ADMIN: "admin",
  TEACHER: "teacher",
  STUDENT: "student",
  PARENT: "parent",
  STAFF: "staff",
};

export const ROLE_HOME_ROUTE = {
  [ROLES.SUPER_ADMIN]: "/admin/dashboard",
  [ROLES.ADMIN]: "/admin/dashboard",
  [ROLES.TEACHER]: "/teacher/dashboard",
  [ROLES.STUDENT]: "/student/dashboard",
  [ROLES.PARENT]: "/parent/dashboard",
  [ROLES.STAFF]: "/staff/dashboard",
};

export const ROLE_LABELS = {
  [ROLES.SUPER_ADMIN]: "Super Admin",
  [ROLES.ADMIN]: "Administrator",
  [ROLES.TEACHER]: "Teacher",
  [ROLES.STUDENT]: "Student",
  [ROLES.PARENT]: "Parent",
  [ROLES.STAFF]: "Staff",
};

export const ROLE_PERMISSIONS = {
  [ROLES.SUPER_ADMIN]: ["*"],
  [ROLES.ADMIN]: [
    "manage_students",
    "manage_teachers",
    "manage_parents",
    "manage_attendance",
    "manage_results",
    "manage_announcements",
    "view_reports",
  ],
  [ROLES.TEACHER]: [
    "manage_students",
    "manage_attendance",
    "manage_results",
    "view_announcements",
  ],
  [ROLES.STUDENT]: [
    "view_results",
    "view_attendance",
    "view_announcements",
  ],
  [ROLES.PARENT]: [
    "view_student_results",
    "view_student_attendance",
    "view_announcements",
  ],
  [ROLES.STAFF]: [
    "manage_attendance",
    "view_announcements",
  ],
};