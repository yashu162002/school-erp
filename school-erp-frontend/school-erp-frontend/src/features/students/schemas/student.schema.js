import { z } from "zod";

/**
 * Mirrors StudentRequest (com.school.dto.StudentRequest) exactly.
 * Only admissionNo, firstName, lastName are @NotBlank on the backend;
 * everything else is optional there, so it's optional here too.
 */
export const studentSchema = z.object({
  admissionNo: z.string().optional().or(z.literal("")),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  className: z.string().optional().or(z.literal("")),
  section: z.string().optional().or(z.literal("")),
  studentPhone: z.string().optional().or(z.literal("")),
  email: z.string().optional().or(z.literal("")),
  rollNo: z.string().optional().or(z.literal("")),
  religion: z.string().optional().or(z.literal("")),
  category: z.string().optional().or(z.literal("")),
  fatherName: z.string().optional().or(z.literal("")),
  motherName: z.string().optional().or(z.literal("")),
  guardian: z.string().optional().or(z.literal("")),
  academicYear: z.string().optional().or(z.literal("")),
  admissionDate: z.string().optional().or(z.literal("")),
  transport: z.string().optional().or(z.literal("")),
  hostel: z.string().optional().or(z.literal("")),
  house: z.string().optional().or(z.literal("")),
  emergencyContact: z.string().optional().or(z.literal("")),
  medicalInfo: z.string().optional().or(z.literal("")),
  status: z.string().optional().or(z.literal("")),
  attendancePercentage: z.number().optional().or(z.literal("")),
  currentGpa: z.number().optional().or(z.literal("")),
  currentRank: z.number().optional().or(z.literal("")),
});
