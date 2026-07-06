import { ClipboardList } from "lucide-react";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { LoadingBlock } from "@/components/common/LoadingBlock";
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from "@/components/ui/table";

export function ResultsTable({
  selectedStudentId,
  isLoading,
  isError,
  error,
  refetch,
  results,
}) {
  if (!selectedStudentId) {
    return <EmptyState icon={ClipboardList} title="Choose a student to view results" />;
  }

  if (isLoading) {
    return <LoadingBlock rows={3} />;
  }

  if (isError) {
    return <ErrorState message={error?.message} onRetry={refetch} />;
  }

  if (results.length === 0) {
    return <EmptyState icon={ClipboardList} title="No results recorded yet" />;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Exam</TableHead>
          <TableHead>Subject</TableHead>
          <TableHead>Marks</TableHead>
          <TableHead>Grade</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {results.map((r) => (
          <TableRow key={r.id}>
            <TableCell>{r.exam?.examName || "—"}</TableCell>
            <TableCell>{r.subject?.subjectName || "—"}</TableCell>
            <TableCell>{r.marksObtained} / {r.maxMarks}</TableCell>
            <TableCell>{r.grade || "—"}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
