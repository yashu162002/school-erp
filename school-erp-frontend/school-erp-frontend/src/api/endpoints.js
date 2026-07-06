/**
 * Endpoint path registry — generated directly from the real
 * controllers in bk.zip (com.school.controller.*). baseURL already
 * includes "/api" (see src/config/env.js / src/api/client.js), so
 * paths here start after "/api".
 *
 * Status key per module:
 *   LIVE  = controller has real, working logic
 *   STUB  = controller class exists but handlers return placeholder
 *           strings / have no persistence (do not build real CRUD
 *           UI against these yet)
 *   EMPTY = controller class exists with @RequestMapping but has
 *           ZERO endpoints defined yet
 */
export const ENDPOINTS = {
  // LIVE — AuthController
  auth: {
    login: "/auth/login", // POST { username, password } -> { token }
    // No logout / refresh-token / change-password / forgot-password /
    // reset-password / profile endpoints exist. Per the "Role-Based
    // Login & Teacher CRUD" plan, the token is expected to gain a
    // "role" claim — see src/lib/jwt.js and AuthContext for how it's
    // decoded once that's live.
  },

  // LIVE — StudentController (@RequestMapping /api/admin/students)
  students: {
    create: "/admin/students", // POST
    list: "/admin/students", // GET
    getOne: (id) => `/admin/students/${id}`, // GET
    update: (id) => `/admin/students/${id}`, // PUT
    remove: (id) => `/admin/students/${id}`, // DELETE
    uploadPhoto: "/admin/students/upload-photo", // POST multipart "photo"
    search: "/admin/students/search", // GET ?name=
    page: "/admin/students/page", // GET ?page=&size=
    profile: (id) => `/admin/students/${id}/profile`, // GET
    attendance: (id) => `/admin/students/${id}/attendance`, // GET
    results: (id) => `/admin/students/${id}/results`, // GET
    announcements: "/admin/students/announcements", // GET
    fees: (id) => `/admin/students/${id}/fees`, // GET
    timetable: (id) => `/admin/students/${id}/timetable`, // GET
  },

  // PLANNED LIVE — TeacherController (@RequestMapping /api/admin/teachers)
  // Per your "Role-Based Login & Teacher CRUD" implementation plan: the
  // dummy string handlers are being replaced with real JPA-backed CRUD
  // using TeacherRequest / TeacherResponse. Same shape as students —
  // no GET /{id} endpoint is planned (list/create/update/remove only).
  teachers: {
    list: "/admin/teachers", // GET -> TeacherResponse[]
    create: "/admin/teachers", // POST TeacherRequest -> TeacherResponse
    update: (id) => `/admin/teachers/${id}`, // PUT TeacherRequest -> TeacherResponse
    remove: (id) => `/admin/teachers/${id}`, // DELETE
  },

  // LIVE — ParentController (@RequestMapping /api/admin/parents)
  parents: {
    create: "/admin/parents", // POST (raw Parent entity body)
    list: "/admin/parents", // GET
    update: (id) => `/admin/parents/${id}`, // PUT (raw Parent entity body)
    remove: (id) => `/admin/parents/${id}`, // DELETE
    leaveRequest: "/admin/parents/leave", // POST LeaveRequestDto -> string
    dashboard: (parentId) => `/admin/parents/${parentId}/dashboard`, // GET
    attendance: (parentId) => `/admin/parents/${parentId}/attendance`, // GET
    results: (parentId) => `/admin/parents/${parentId}/results`, // GET
    fees: (parentId) => `/admin/parents/${parentId}/fees`, // GET
  },

  // EMPTY — ParentPortalController (@RequestMapping /api/parent) — no routes yet
  parentPortal: {},

  // EMPTY — StudentPortalController (@RequestMapping /api/student) — no routes yet
  studentPortal: {},

  // LIVE — AttendanceController (@RequestMapping /api/admin/attendance)
  attendance: {
    mark: "/admin/attendance", // POST AttendanceRequest
    byDate: (date) => `/admin/attendance/date/${date}`, // GET (ISO date)
    byStudent: (studentId) => `/admin/attendance/student/${studentId}`, // GET
    analytics: (studentId) => `/admin/attendance/analytics/${studentId}`, // GET
  },

  // LIVE — ResultController (@RequestMapping /api/results)
  results: {
    save: "/results", // POST ResultRequest
    byStudent: (studentId) => `/results/student/${studentId}`, // GET
  },

  // LIVE — AnnouncementController (@RequestMapping /api/announcements)
  announcements: {
    list: "/announcements", // GET
    create: "/announcements", // POST (raw Announcement entity body)
  },

  // LIVE — NotificationController (@RequestMapping /api/notifications)
  notifications: {
    list: "/notifications", // GET
    create: "/notifications", // POST NotificationRequest
    // No mark-read endpoint exists despite Notification.isRead field.
  },

  // LIVE — DashboardController (@RequestMapping /api/admin/dashboard)
  adminDashboard: {
    stats: "/admin/dashboard", // GET -> DashboardResponse
  },

  // LIVE (hardcoded on backend) — VoiceCallController
  voiceCalls: {
    stats: "/admin/voice/stats", // GET -> VoiceCallStatsResponse (currently hardcoded values)
  },

  // LIVE — FeeController (@RequestMapping /api/admin/fees)
  fees: {
    classes: "/admin/fees/classes", // GET
    classFees: (className) => `/admin/fees/class/${className}`, // GET
    create: "/admin/fees", // POST
    update: (id) => `/admin/fees/${id}`, // PUT
    remove: (id) => `/admin/fees/${id}`, // DELETE
  },
};
