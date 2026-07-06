import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Search, Pencil, Trash2, UserRound } from "lucide-react";
import { toast } from "sonner";
import { teachersApi } from "@/api/teachers.api";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { LoadingBlock } from "@/components/common/LoadingBlock";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from "@/components/ui/table";
import { TeacherFormDialog } from "@/features/teachers/components/TeacherFormDialog";

/**
 * Wired to the PLANNED TeacherController per the "Role-Based Login &
 * Teacher CRUD" implementation plan. If you're seeing errors here,
 * the backend hasn't actually been rewired to real JPA-backed
 * endpoints yet (it may still be returning placeholder strings) —
 * that's a backend-side task, not a frontend bug.
 */
export function TeachersPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);

  const teachersQuery = useQuery({
    queryKey: ["teachers"],
    queryFn: teachersApi.list,
  });

  const createMutation = useMutation({
    mutationFn: teachersApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
      toast.success("Teacher added");
      setDialogOpen(false);
    },
    onError: (err) => toast.error(err.message || "Couldn't add teacher"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => teachersApi.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
      toast.success("Teacher updated");
      setDialogOpen(false);
      setEditingTeacher(null);
    },
    onError: (err) => toast.error(err.message || "Couldn't update teacher"),
  });

  const deleteMutation = useMutation({
    mutationFn: teachersApi.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
      toast.success("Teacher removed");
    },
    onError: (err) => toast.error(err.message || "Couldn't remove teacher"),
  });

  const teachers = Array.isArray(teachersQuery.data) ? teachersQuery.data : [];
  const filtered = search
    ? teachers.filter((t) =>
        `${t.firstName} ${t.lastName} ${t.employeeId}`.toLowerCase().includes(search.toLowerCase())
      )
    : teachers;

  function handleSubmit(values) {
    if (editingTeacher) {
      updateMutation.mutate({ id: editingTeacher.id, payload: values });
    } else {
      createMutation.mutate(values);
    }
  }

  function openCreate() {
    setEditingTeacher(null);
    setDialogOpen(true);
  }

  function openEdit(teacher) {
    setEditingTeacher(teacher);
    setDialogOpen(true);
  }

  return (
    <>
      <PageHeader
        title="Teachers"
        description="Manage teaching staff."
        actions={
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4" />
            Add teacher
          </Button>
        }
      />

      <div className="mb-4 relative max-w-xs">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search teachers…"
          className="pl-8"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {teachersQuery.isLoading ? (
        <LoadingBlock rows={6} />
      ) : teachersQuery.isError ? (
        <ErrorState message={teachersQuery.error?.message} onRetry={teachersQuery.refetch} />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={UserRound}
          title={search ? "No teachers match your search" : "No teachers yet"}
          description={search ? "Try a different name or employee ID." : "Add your first teacher to get started."}
          action={
            !search && (
              <Button size="sm" onClick={openCreate}>
                <Plus className="h-4 w-4" />
                Add teacher
              </Button>
            )
          }
        />
      ) : (
        <div className="rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead className="w-24 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((t) => (
                <TableRow key={t.id}>
                  <TableCell className="font-mono text-xs">{t.employeeId}</TableCell>
                  <TableCell className="font-medium">{t.firstName} {t.lastName}</TableCell>
                  <TableCell>
                    {t.subject ? <Badge variant="secondary">{t.subject}</Badge> : <span className="text-muted-foreground">—</span>}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{t.email || t.phone || "—"}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(t)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => {
                          if (confirm(`Remove ${t.firstName} ${t.lastName}?`)) {
                            deleteMutation.mutate(t.id);
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <TeacherFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        teacher={editingTeacher}
        onSubmit={handleSubmit}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      />
    </>
  );
}
