-- Truncate new tables first to ensure clean state
TRUNCATE TABLE school_erp_schema.results CASCADE;
TRUNCATE TABLE school_erp_schema.attendance CASCADE;
TRUNCATE TABLE school_erp_schema.fees CASCADE;
TRUNCATE TABLE school_erp_schema.parents CASCADE;
TRUNCATE TABLE school_erp_schema.announcements CASCADE;
TRUNCATE TABLE school_erp_schema.exams CASCADE;
TRUNCATE TABLE school_erp_schema.subjects CASCADE;
TRUNCATE TABLE school_erp_schema.students CASCADE;
TRUNCATE TABLE school_erp_schema.teachers CASCADE;
TRUNCATE TABLE school_erp_schema.users CASCADE;

-- Insert users
INSERT INTO school_erp_schema.users (id, username, email, password, role, enabled, locked, password_changed, failed_login_attempts, last_login_at, display_name, created_at, updated_at)
SELECT id, username, email, password, role, enabled, false, true, 0, null, username, created_at, updated_at FROM public.users;

-- Insert students
INSERT INTO school_erp_schema.students (id, admission_no, first_name, last_name, class_name, section, student_phone, email, photo_path, blood_group, address, dob, gender, created_at, updated_at)
SELECT id, admission_no, first_name, last_name, class_name, section, student_phone, email, photo_url, blood_group, address, dob::varchar, gender, created_at, updated_at FROM public.students;

-- Insert teachers
INSERT INTO school_erp_schema.teachers (id, employee_id, first_name, last_name, phone, email, qualification, subject_specialization, experience, photo_path, assigned_classes, assigned_sections, assigned_subjects, created_at, updated_at)
SELECT id, employee_id, first_name, last_name, phone, email, qualification, subject_specialization, experience, null, null, null, null, created_at, updated_at FROM public.teachers;

-- Insert subjects
INSERT INTO school_erp_schema.subjects (id, subject_name, created_at, updated_at)
SELECT id, subject_name, created_at, updated_at FROM public.subjects;

-- Insert exams
INSERT INTO school_erp_schema.exams (id, exam_name, class_name, start_date, end_date, created_at, updated_at)
SELECT id, exam_name, class_name, start_date, end_date, created_at, updated_at FROM public.exams;

-- Insert parents
INSERT INTO school_erp_schema.parents (id, father_name, mother_name, father_phone, mother_phone, email, student_id, created_at, updated_at)
SELECT id, father_name, mother_name, father_phone, mother_phone, email, student_id, created_at, updated_at FROM public.parents;

-- Insert fees
INSERT INTO school_erp_schema.fees (id, amount, due_date, fee_type, paid_amount, payment_status, remarks, student_id)
SELECT id, amount, due_date, fee_type, paid_amount, payment_status, remarks, student_id FROM public.fees;

-- Insert results
INSERT INTO school_erp_schema.results (id, student_id, exam_id, subject_id, marks_obtained, max_marks, percentage, grade, created_at, updated_at)
SELECT id, student_id, exam_id, subject_id, marks_obtained, max_marks, (marks_obtained / max_marks * 100), null, created_at, updated_at FROM public.results;

-- Insert attendance
INSERT INTO school_erp_schema.attendance (id, attendance_date, remarks, status, student_id, created_at, updated_at)
SELECT id, attendance_date, remarks, status, student_id, created_at, updated_at FROM public.attendance;

-- Insert announcements
INSERT INTO school_erp_schema.announcements (id, title, description, target_audience, created_at, updated_at)
SELECT id, title, description, target_audience, created_at, updated_at FROM public.announcements;

-- Update sequences so auto-increment IDs don't conflict later
SELECT setval('school_erp_schema.users_id_seq', coalesce(max(id), 1)) FROM school_erp_schema.users;
SELECT setval('school_erp_schema.students_id_seq', coalesce(max(id), 1)) FROM school_erp_schema.students;
SELECT setval('school_erp_schema.teachers_id_seq', coalesce(max(id), 1)) FROM school_erp_schema.teachers;
SELECT setval('school_erp_schema.subjects_id_seq', coalesce(max(id), 1)) FROM school_erp_schema.subjects;
SELECT setval('school_erp_schema.exams_id_seq', coalesce(max(id), 1)) FROM school_erp_schema.exams;
SELECT setval('school_erp_schema.parents_id_seq', coalesce(max(id), 1)) FROM school_erp_schema.parents;
SELECT setval('school_erp_schema.fees_id_seq', coalesce(max(id), 1)) FROM school_erp_schema.fees;
SELECT setval('school_erp_schema.results_id_seq', coalesce(max(id), 1)) FROM school_erp_schema.results;
SELECT setval('school_erp_schema.attendance_id_seq', coalesce(max(id), 1)) FROM school_erp_schema.attendance;
SELECT setval('school_erp_schema.announcements_id_seq', coalesce(max(id), 1)) FROM school_erp_schema.announcements;
