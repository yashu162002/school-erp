import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge conditional class names and resolve Tailwind conflicts.
 * Used by every shadcn/ui primitive.
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function getStudentPhotoUrl(photoPath) {
  if (!photoPath) return "";
  const cleaned = photoPath.trim().replace(/^["']|["']$/g, "");
  if (cleaned.startsWith("http")) {
    return cleaned;
  }
  return `http://localhost:8080/${cleaned}`;
}
