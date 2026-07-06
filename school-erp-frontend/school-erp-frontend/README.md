# School ERP — Frontend

React 19 + Vite + Tailwind v4 + shadcn/ui + React Router + Axios + TanStack Query +
React Hook Form + Zod + Framer Motion + Recharts.

## Setup

```bash
npm install
cp .env.example .env   # already done; edit VITE_API_BASE_URL if your backend isn't on :8080
npm run dev
```

The Spring Boot backend must run with CORS allowing `http://localhost:5173` exactly, so
keep the frontend on port 5173 (default in `vite.config.js`) or update the backend's CORS
config to match.

## What's real vs. scaffolded

Endpoint paths, request bodies, and response shapes in `src/api/*.api.js` and
`src/api/endpoints.js` are copied from the actual controllers/DTOs in the backend source
you provided — nothing is guessed, **except where explicitly marked "planned" below.**

**Fully wired to confirmed working backend code:**
- Auth (login only — see role caveat below)
- Students (full CRUD, search, photo upload)
- Parents (list/create/delete, linked to a student)
- Attendance (mark + view by date)
- Results (save + view by student)
- Announcements (list/create)
- Notifications (list/create)
- Admin dashboard stats + voice call stats
- Global search (students), notification bell, dark/light mode, collapsible sidebar

**Wired against the "Role-Based Login & Teacher CRUD" plan — NOT yet verified against real code:**
- **Role claim in the JWT.** `src/lib/jwt.js` / `AuthContext.jsx` assume the token now
  carries a `role` claim. All four roles are selectable on login; picking the wrong
  portal for an account blocks sign-in. If `JwtService.java` ends up using a different
  claim key/shape, the only place to fix is `deriveUserFromToken()` in `AuthContext.jsx`.
- **Teachers (full CRUD).** `src/api/teachers.api.js` and `TeachersPage` assume
  `TeacherController` now does real JPA-backed CRUD via `TeacherRequest`/`TeacherResponse`,
  with `TeacherResponse` mirroring `StudentResponse` (id, the 8 `TeacherRequest` fields,
  createdAt). Last confirmed state of `TeacherServiceImpl` worked against the raw
  `Teacher` entity instead (no DTOs, no `experience` field) — if the finished backend
  keeps that approach, this needs adjusting.
- Seeded accounts referenced in the UI copy: `admin/admin123`, `teacher/teacher123`,
  `student/student123`, `parent/parent123`.

**Scaffolded, waiting on backend work:**
- Student portal / Parent portal (`/api/student`, `/api/parent`) — controllers exist,
  zero endpoints defined. Not routed yet.
- Exam/Subject management — no controller provided, so Results takes raw numeric IDs.
- Teacher/Student/Parent dashboards — only the Admin shell exists; other roles land on
  it too after login until dedicated dashboards are built.

## Known gaps that need a decision, not more frontend code

1. `SecurityConfig` still has `.anyRequest().permitAll()` — nothing enforces auth
   server-side yet. The frontend already attaches the JWT and guards routes client-side,
   so nothing changes here once enforcement is added.
2. No CAPTCHA implemented — needs either a real provider (reCAPTCHA/hCaptcha site key)
   or an explicit decision to use a simple client-side challenge instead.
3. No forgot-password endpoint — the login page explains this rather than faking it.
