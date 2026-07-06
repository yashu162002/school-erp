import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CalendarCheck, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { attendanceApi } from "@/api/attendance.api";
import { studentsApi } from "@/api/students.api";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { LoadingBlock } from "@/components/common/LoadingBlock";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from "@/components/ui/table";
import {
  Form, FormField, FormItem, FormLabel, FormControl, FormMessage,
} from "@/components/ui/form";
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from "@/components/ui/select";

// Mirrors AttendanceRequest. status is a free string on the wire —
// use the values from entity.AttendanceStatus (PRESENT/ABSENT/LEAVE).
const attendanceSchema = z.object({
  studentId: z.string().min(1, "Select a student"),
  attendanceDate: z.string().min(1, "Pick a date"),
  status: z.string().min(1, "Select a status"),
  remarks: z.string().optional().or(z.literal("")),
});

const STATUS_OPTIONS = ["PRESENT", "ABSENT", "LEAVE"];

export function AttendancePage() {
  const queryClient = useQueryClient();
  const today = format(new Date(), "yyyy-MM-dd");
  const [viewDate, setViewDate] = useState(today);

  const studentsQuery = useQuery({ queryKey: ["students"], queryFn: studentsApi.list });
  const attendanceQuery = useQuery({
    queryKey: ["attendance", "date", viewDate],
    queryFn: () => attendanceApi.byDate(viewDate),
    enabled: Boolean(viewDate),
  });

  const form = useForm({
    resolver: zodResolver(attendanceSchema),
    defaultValues: { studentId: "", attendanceDate: today, status: "", remarks: "" },
  });

  const markMutation = useMutation({
    mutationFn: (values) =>
      attendanceApi.mark({ ...values, studentId: Number(values.studentId) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendance"] });
      toast.success("Attendance marked");
      form.reset({ studentId: "", attendanceDate: viewDate, status: "", remarks: "" });
    },
    onError: (err) => toast.error(err.message || "Couldn't mark attendance"),
  });

  const students = studentsQuery.data ?? [];
  const records = attendanceQuery.data ?? [];

  const statusVariant = { PRESENT: "success", ABSENT: "destructive", LEAVE: "warning" };

  return (
    <>
      <PageHeader title="Attendance" description="Mark daily attendance and review records." />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Mark attendance</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit((v) => markMutation.mutate(v))} className="space-y-4">
                <FormField
                  control={form.control}
                  name="studentId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Student</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a student" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {students.map((s) => (
                            <SelectItem key={s.id} value={String(s.id)}>
                              {s.firstName} {s.lastName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="attendanceDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {STATUS_OPTIONS.map((s) => (
                            <SelectItem key={s} value={s}>{s}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="remarks"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Remarks (optional)</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={markMutation.isPending}>
                  {markMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                  Mark attendance
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle>Records for a date</CardTitle>
            <Input
              type="date"
              className="w-auto"
              value={viewDate}
              onChange={(e) => setViewDate(e.target.value)}
            />
          </CardHeader>
          <CardContent>
            {attendanceQuery.isLoading ? (
              <LoadingBlock rows={4} />
            ) : attendanceQuery.isError ? (
              <ErrorState message={attendanceQuery.error?.message} onRetry={attendanceQuery.refetch} />
            ) : records.length === 0 ? (
              <EmptyState icon={CalendarCheck} title="No records for this date" />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Remarks</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {records.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell>
                        {r.student ? `${r.student.firstName} ${r.student.lastName}` : "—"}
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusVariant[r.status] || "secondary"}>{r.status}</Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{r.remarks || "—"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
