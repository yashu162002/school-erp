import { z } from "zod";

/**
 * Mirrors ResultRequest (com.school.dto.ResultRequest) exactly.
 */
export const resultSchema = z.object({
  studentId: z.string().min(1, "Select a student"),
  examId: z.coerce.number().int().positive("Enter a valid exam ID"),
  subjectId: z.coerce.number().int().positive("Enter a valid subject ID"),
  marksObtained: z.coerce.number().min(0, "Enter marks obtained"),
  maxMarks: z.coerce.number().positive("Enter max marks"),
});
