import { z } from "zod";

/**
 * Mirrors the existing TeacherRequest DTO (com.school.dto.TeacherRequest)
 * exactly — those 8 fields already exist in bk.zip today:
 *   { employeeId, firstName, lastName, email, phone, subject, qualification, experience }
 * None are @NotBlank on the DTO, so only employeeId/firstName/lastName
 * are required here to match the Student pattern; loosen/tighten once
 * the real controller enforces validation.
 */
export const teacherSchema = z.object({
  employeeId: z.string().min(1, "Employee ID is required"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Enter a valid email").optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  subject: z.string().optional().or(z.literal("")),
  qualification: z.string().optional().or(z.literal("")),
  experience: z.string().optional().or(z.literal("")),
});
