import { z } from "zod";

export const teacherSchema = z.object({
  employeeId: z.string().min(1, "Employee ID is required"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Enter a valid email").optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  subject: z.string().optional().or(z.literal("")),
  qualification: z.string().optional().or(z.literal("")),
  experience: z.string().optional().or(z.literal("")),
  department: z.string().optional().or(z.literal("")),
  dob: z.string().optional().or(z.literal("")),
  gender: z.string().optional().or(z.literal("")),
  address: z.string().optional().or(z.literal("")),
  joiningDate: z.string().optional().or(z.literal("")),
  salary: z.preprocess((val) => (val === "" ? undefined : Number(val)), z.number().optional()),
  employmentType: z.string().optional().or(z.literal("")),
  status: z.string().optional().or(z.literal("")),
  assignedClasses: z.string().optional().or(z.literal("")),
  assignedSections: z.string().optional().or(z.literal("")),
  assignedSubjects: z.string().optional().or(z.literal("")),
});
