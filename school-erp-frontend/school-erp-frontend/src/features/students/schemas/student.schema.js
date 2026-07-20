import { z } from "zod";

/**
 * Preprocessor that coerses empty strings to undefined (satisfying .optional())
 * and numeric strings to actual numbers, so that text inputs bind correctly.
 */
const numericCoercible = z.preprocess((val) => {
  if (val === "" || val === undefined || val === null) return undefined;
  const num = Number(val);
  return isNaN(num) ? val : num;
}, z.number().optional());

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
  attendancePercentage: numericCoercible,
  currentGpa: numericCoercible,
  currentRank: numericCoercible,
  photoPath: z.string().optional().or(z.literal("")),
  gender: z.string().optional().or(z.literal("")),
  dob: z.string().optional().or(z.literal("")),
  bloodGroup: z.string().optional().or(z.literal("")),
  address: z.string().optional().or(z.literal("")),
});
