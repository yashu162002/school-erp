import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { resultsApi } from "@/api/results.api";
import { studentsApi } from "@/api/students.api";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from "@/components/ui/select";
import { resultSchema } from "../schemas/result.schema";
import { ResultForm } from "../components/ResultForm";
import { ResultsTable } from "../components/ResultsTable";

export function ResultsPage() {
  const queryClient = useQueryClient();
  const [selectedStudentId, setSelectedStudentId] = useState("");

  const studentsQuery = useQuery({ queryKey: ["students"], queryFn: studentsApi.list });
  const resultsQuery = useQuery({
    queryKey: ["results", selectedStudentId],
    queryFn: () => resultsApi.byStudent(selectedStudentId),
    enabled: Boolean(selectedStudentId),
  });

  const form = useForm({
    resolver: zodResolver(resultSchema),
    defaultValues: { studentId: "", examId: "", subjectId: "", marksObtained: "", maxMarks: "" },
  });

  const saveMutation = useMutation({
    mutationFn: (values) => resultsApi.save({ ...values, studentId: Number(values.studentId) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["results"] });
      toast.success("Result saved");
      form.reset({ studentId: "", examId: "", subjectId: "", marksObtained: "", maxMarks: "" });
    },
    onError: (err) => toast.error(err.message || "Couldn't save result"),
  });

  const students = studentsQuery.data ?? [];
  const results = resultsQuery.data ?? [];

  return (
    <div className="space-y-6">
      <PageHeader title="Results" description="Record and review exam results." />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Add result</CardTitle>
          </CardHeader>
          <CardContent>
            <ResultForm
              form={form}
              students={students}
              onSubmit={(v) => saveMutation.mutate(v)}
              isPending={saveMutation.isPending}
            />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>View results by student</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={selectedStudentId} onValueChange={setSelectedStudentId}>
              <SelectTrigger className="mb-4 max-w-xs">
                <SelectValue placeholder="Choose a student" />
              </SelectTrigger>
              <SelectContent>
                {students.map((s) => (
                  <SelectItem key={s.id} value={String(s.id)}>
                    {s.firstName} {s.lastName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <ResultsTable
              selectedStudentId={selectedStudentId}
              isLoading={resultsQuery.isLoading}
              isError={resultsQuery.isError}
              error={resultsQuery.error}
              refetch={resultsQuery.refetch}
              results={results}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
