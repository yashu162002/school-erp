import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, UsersRound, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { parentsApi } from "@/api/parents.api";
import { studentsApi } from "@/api/students.api";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { LoadingBlock } from "@/components/common/LoadingBlock";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  Form, FormField, FormItem, FormLabel, FormControl, FormMessage,
} from "@/components/ui/form";
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from "@/components/ui/select";

// Mirrors the raw Parent entity body used by ParentController create/update
const parentSchema = z.object({
  fatherName: z.string().optional().or(z.literal("")),
  motherName: z.string().optional().or(z.literal("")),
  fatherPhone: z.string().optional().or(z.literal("")),
  motherPhone: z.string().optional().or(z.literal("")),
  email: z.string().email("Enter a valid email").optional().or(z.literal("")),
  studentId: z.string().min(1, "Link a student"),
});

export function ParentsPage() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const parentsQuery = useQuery({ queryKey: ["parents"], queryFn: parentsApi.list });
  const studentsQuery = useQuery({ queryKey: ["students"], queryFn: studentsApi.list });

  const form = useForm({
    resolver: zodResolver(parentSchema),
    defaultValues: {
      fatherName: "", motherName: "", fatherPhone: "", motherPhone: "", email: "", studentId: "",
    },
  });

  const createMutation = useMutation({
    mutationFn: (values) => {
      const { studentId, ...rest } = values;
      // Parent entity has a @OneToOne to Student, referenced by student.id
      return parentsApi.create({ ...rest, student: { id: Number(studentId) } });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["parents"] });
      toast.success("Parent added");
      setOpen(false);
      form.reset();
    },
    onError: (err) => toast.error(err.message || "Couldn't add parent"),
  });

  const deleteMutation = useMutation({
    mutationFn: parentsApi.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["parents"] });
      toast.success("Parent removed");
    },
    onError: (err) => toast.error(err.message || "Couldn't remove parent"),
  });

  const parents = parentsQuery.data ?? [];
  const students = studentsQuery.data ?? [];

  return (
    <>
      <PageHeader
        title="Parents"
        description="Link parents/guardians to student records."
        actions={
          <Button onClick={() => setOpen(true)}>
            <Plus className="h-4 w-4" />
            Add parent
          </Button>
        }
      />

      {parentsQuery.isLoading ? (
        <LoadingBlock rows={4} />
      ) : parentsQuery.isError ? (
        <ErrorState message={parentsQuery.error?.message} onRetry={parentsQuery.refetch} />
      ) : parents.length === 0 ? (
        <EmptyState
          icon={UsersRound}
          title="No parents yet"
          description="Add a parent and link them to a student."
          action={
            <Button size="sm" onClick={() => setOpen(true)}>
              <Plus className="h-4 w-4" />
              Add parent
            </Button>
          }
        />
      ) : (
        <div className="rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Father</TableHead>
                <TableHead>Mother</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Student</TableHead>
                <TableHead className="w-16 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {parents.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>{p.fatherName || "—"}</TableCell>
                  <TableCell>{p.motherName || "—"}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {p.email || p.fatherPhone || p.motherPhone || "—"}
                  </TableCell>
                  <TableCell>
                    {p.student ? `${p.student.firstName} ${p.student.lastName}` : "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive"
                      onClick={() => {
                        if (confirm("Remove this parent record?")) deleteMutation.mutate(p.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add parent</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit((v) => createMutation.mutate(v))} className="space-y-4">
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
                            {s.firstName} {s.lastName} ({s.admissionNo})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="fatherName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Father's name</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="motherName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mother's name</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="fatherPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Father's phone</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="motherPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mother's phone</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Email</FormLabel>
                      <FormControl><Input type="email" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createMutation.isPending}>
                  {createMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                  Add parent
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
