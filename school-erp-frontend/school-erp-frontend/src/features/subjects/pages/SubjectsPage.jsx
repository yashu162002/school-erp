import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PageHeader } from "@/components/common/PageHeader";
import { LoadingBlock } from "@/components/common/LoadingBlock";
import { ErrorState } from "@/components/common/ErrorState";
import { EmptyState } from "@/components/common/EmptyState";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { BookOpen, Plus, Trash2, Pencil, User, Users, Filter } from "lucide-react";
import { toast } from "sonner";
import { subjectsApi } from "@/api/subjects.api";
import { teachersApi } from "@/api/teachers.api";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

export function SubjectsPage() {
  const queryClient = useQueryClient();
  const [classFilter, setClassFilter] = useState("all");
  const [sectionFilter, setSectionFilter] = useState("all");

  // Form State (New / Edit)
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  
  const [subjectName, setSubjectName] = useState("");
  const [subjectCode, setSubjectCode] = useState("");
  const [subjectClass, setSubjectClass] = useState("");
  const [subjectSection, setSubjectSection] = useState("");
  const [subjectTeacherId, setSubjectTeacherId] = useState("");
  const [classTeacherId, setClassTeacherId] = useState("");

  const classOptions = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "PUC 1", "PUC 2"];
  const sectionOptions = ["A", "B", "C", "D"];

  // Queries
  const subjectsQuery = useQuery({
    queryKey: ["admin-subjects"],
    queryFn: () => subjectsApi.list(),
  });

  const teachersQuery = useQuery({
    queryKey: ["admin-teachers"],
    queryFn: teachersApi.list,
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: subjectsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-subjects"] });
      toast.success("Subject created successfully");
      closeForm();
    },
    onError: (err) => toast.error(err.message || "Failed to create subject"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => subjectsApi.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-subjects"] });
      toast.success("Subject updated successfully");
      closeForm();
    },
    onError: (err) => toast.error(err.message || "Failed to update subject"),
  });

  const deleteMutation = useMutation({
    mutationFn: subjectsApi.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-subjects"] });
      toast.success("Subject deleted");
    },
    onError: (err) => toast.error(err.message || "Failed to delete subject"),
  });

  const openAdd = () => {
    setEditingSubject(null);
    setSubjectName("");
    setSubjectCode("");
    setSubjectClass("10");
    setSubjectSection("A");
    setSubjectTeacherId("none");
    setClassTeacherId("none");
    setModalOpen(true);
  };

  const openEdit = (sub) => {
    setEditingSubject(sub);
    setSubjectName(sub.subjectName || "");
    setSubjectCode(sub.subjectCode || "");
    setSubjectClass(sub.className || "");
    setSubjectSection(sub.section || "");
    setSubjectTeacherId(sub.subjectTeacher?.id ? sub.subjectTeacher.id.toString() : "none");
    setClassTeacherId(sub.classTeacher?.id ? sub.classTeacher.id.toString() : "none");
    setModalOpen(true);
  };

  const closeForm = () => {
    setModalOpen(false);
    setEditingSubject(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      subjectName,
      subjectCode,
      className: subjectClass,
      section: subjectSection,
      subjectTeacherId: subjectTeacherId === "none" ? null : Number(subjectTeacherId),
      classTeacherId: classTeacherId === "none" ? null : Number(classTeacherId),
    };

    if (editingSubject) {
      updateMutation.mutate({ id: editingSubject.id, payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  if (subjectsQuery.isLoading || teachersQuery.isLoading) {
    return <LoadingBlock rows={6} />;
  }

  if (subjectsQuery.isError || teachersQuery.isError) {
    return (
      <ErrorState
        message="Could not load subjects metadata"
        onRetry={() => {
          subjectsQuery.refetch();
          teachersQuery.refetch();
        }}
      />
    );
  }

  const subjects = subjectsQuery.data ?? [];
  const teachers = teachersQuery.data ?? [];

  const filtered = subjects.filter((s) => {
    const matchesClass = classFilter === "all" || s.className === classFilter;
    const matchesSection = sectionFilter === "all" || s.section === sectionFilter;
    return matchesClass && matchesSection;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Subjects & Teachers"
        description="Configure class-wise subjects (typically 6-8 core subjects) and link Subject & Class Teachers."
        actions={
          <Button onClick={openAdd}>
            <Plus className="h-4 w-4 mr-1.5" /> Add Subject
          </Button>
        }
      />

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center gap-4 bg-muted/30 p-4 rounded-lg border border-border">
        <Filter className="h-4 w-4 text-muted-foreground shrink-0" />
        
        {/* Class Filter */}
        <div className="w-[160px]">
          <Select value={classFilter} onValueChange={setClassFilter}>
            <SelectTrigger className="bg-background">
              <SelectValue placeholder="Select Class" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Classes</SelectItem>
              {classOptions.map((c) => (
                <SelectItem key={c} value={c}>Class {c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Section Filter */}
        <div className="w-[160px]">
          <Select value={sectionFilter} onValueChange={setSectionFilter}>
            <SelectTrigger className="bg-background">
              <SelectValue placeholder="Select Section" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sections</SelectItem>
              {sectionOptions.map((s) => (
                <SelectItem key={s} value={s}>Section {s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No subjects matching the filters"
          description="Use 'Add Subject' to configure school subjects class-wise."
        />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Subject Matrix</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Class & Section</TableHead>
                  <TableHead>Subject Code</TableHead>
                  <TableHead>Subject Name</TableHead>
                  <TableHead>Subject Teacher</TableHead>
                  <TableHead>Class Teacher</TableHead>
                  <TableHead className="w-24 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((sub) => (
                  <TableRow key={sub.id} className="hover:bg-muted/10 transition-colors">
                    <TableCell className="py-3.5">
                      <Badge variant="secondary">
                        Class {sub.className} - {sub.section || "Any"}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-xs py-3.5">{sub.subjectCode}</TableCell>
                    <TableCell className="font-semibold text-foreground py-3.5">{sub.subjectName}</TableCell>
                    <TableCell className="py-3.5">
                      {sub.subjectTeacher ? (
                        <span className="flex items-center gap-1.5 text-xs text-foreground font-medium">
                          <User className="h-3.5 w-3.5 text-primary shrink-0" />
                          {sub.subjectTeacher.firstName} {sub.subjectTeacher.lastName}
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground italic">Not Assigned</span>
                      )}
                    </TableCell>
                    <TableCell className="py-3.5">
                      {sub.classTeacher ? (
                        <span className="flex items-center gap-1.5 text-xs text-foreground font-medium">
                          <Users className="h-3.5 w-3.5 text-success shrink-0" />
                          {sub.classTeacher.firstName} {sub.classTeacher.lastName}
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground italic">Not Assigned</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right py-3.5">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(sub)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => {
                            if (confirm(`Remove subject ${sub.subjectName}?`)) {
                              deleteMutation.mutate(sub.id);
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
          </CardContent>
        </Card>
      )}

      {/* Add / Edit Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingSubject ? "Edit Subject" : "Add Subject"}</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            <div className="space-y-3">
              <div>
                <Label>Subject Name</Label>
                <Input
                  required
                  placeholder="e.g. Mathematics"
                  value={subjectName}
                  onChange={(e) => setSubjectName(e.target.value)}
                />
              </div>

              <div>
                <Label>Subject Code</Label>
                <Input
                  required
                  placeholder="e.g. MATH101"
                  value={subjectCode}
                  onChange={(e) => setSubjectCode(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Class Name</Label>
                  <Select value={subjectClass} onValueChange={setSubjectClass}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {classOptions.map((c) => (
                        <SelectItem key={c} value={c}>Class {c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Section</Label>
                  <Select value={subjectSection} onValueChange={setSubjectSection}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {sectionOptions.map((s) => (
                        <SelectItem key={s} value={s}>Section {s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Subject Teacher</Label>
                <Select value={subjectTeacherId} onValueChange={setSubjectTeacherId}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Choose Subject Teacher (None)</SelectItem>
                    {teachers.map((t) => (
                      <SelectItem key={t.id} value={t.id.toString()}>
                        {t.firstName} {t.lastName} ({t.employeeId})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Class Teacher</Label>
                <Select value={classTeacherId} onValueChange={setClassTeacherId}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Choose Class Teacher (None)</SelectItem>
                    {teachers.map((t) => (
                      <SelectItem key={t.id} value={t.id.toString()}>
                        {t.firstName} {t.lastName} ({t.employeeId})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={closeForm}>
                Cancel
              </Button>
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                {editingSubject ? "Save changes" : "Create Subject"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
