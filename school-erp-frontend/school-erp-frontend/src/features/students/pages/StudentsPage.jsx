import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Plus, Search, Pencil, Trash2, Users, Key, History, 
  Shuffle, Filter, RefreshCw, Lock, Unlock, Eye, FileDown
} from "lucide-react";
import { toast } from "sonner";
import { studentsApi } from "@/api/students.api";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { LoadingBlock } from "@/components/common/LoadingBlock";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { StudentFormDialog } from "@/features/students/components/StudentFormDialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export function StudentsPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  
  // Filters
  const [classFilter, setClassFilter] = useState("all");
  const [sectionFilter, setSectionFilter] = useState("all");
  const [yearFilter, setYearFilter] = useState("all");

  // Modals state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  
  const [credOpen, setCredOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [transferOpen, setTransferOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Password reset cache
  const [resetPwdResult, setResetPwdResult] = useState(null);

  // Class/Section/Year lists
  const classOptions = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "PUC 1", "PUC 2"];
  const sectionOptions = ["A", "B", "C", "D"];
  const academicYears = ["2026", "2027", "2028"];

  const studentsQuery = useQuery({
    queryKey: ["students"],
    queryFn: studentsApi.list,
  });

  const historyQuery = useQuery({
    queryKey: ["login-history", selectedStudent?.id],
    queryFn: () => studentsApi.getLoginHistory(selectedStudent.id),
    enabled: Boolean(historyOpen && selectedStudent?.id),
  });

  const createMutation = useMutation({
    mutationFn: studentsApi.create,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      toast.success("Student added successfully");
      setDialogOpen(false);
      
      // Auto display generated credentials
      if (data && data.generatedPassword) {
        setSelectedStudent(data);
        setResetPwdResult({ username: data.studentId, password: data.generatedPassword });
        setCredOpen(true);
      }
    },
    onError: (err) => toast.error(err.message || "Couldn't add student"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => studentsApi.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      toast.success("Student updated");
      setDialogOpen(false);
      setEditingStudent(null);
    },
    onError: (err) => toast.error(err.message || "Couldn't update student"),
  });

  const deleteMutation = useMutation({
    mutationFn: studentsApi.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      toast.success("Student removed");
    },
    onError: (err) => toast.error(err.message || "Couldn't remove student"),
  });

  const resetPasswordMutation = useMutation({
    mutationFn: ({ id }) => studentsApi.resetPassword(id),
    onSuccess: (data) => {
      setResetPwdResult(data);
      toast.success("Password reset successfully");
    },
    onError: (err) => toast.error(err.message || "Could not reset password"),
  });

  const toggleLoginMutation = useMutation({
    mutationFn: ({ id }) => studentsApi.toggleLogin(id),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      if (selectedStudent && selectedStudent.id === updated.id) {
        setSelectedStudent(updated);
      }
      toast.success(updated.active ? "Login enabled" : "Login disabled");
    },
    onError: (err) => toast.error(err.message || "Failed to update status"),
  });

  const toggleLockMutation = useMutation({
    mutationFn: ({ id }) => studentsApi.toggleLock(id),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      if (selectedStudent && selectedStudent.id === updated.id) {
        setSelectedStudent(updated);
      }
      toast.success(updated.locked ? "Account locked" : "Account unlocked");
    },
    onError: (err) => toast.error(err.message || "Failed to update lock"),
  });

  const transferMutation = useMutation({
    mutationFn: ({ id, payload }) => studentsApi.transfer(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      toast.success("Student class/section transferred successfully");
      setTransferOpen(false);
    },
    onError: (err) => toast.error(err.message || "Could not transfer student"),
  });

  const students = studentsQuery.data ?? [];
  const filtered = students.filter((s) => {
    const matchesSearch = !search || `${s.firstName} ${s.lastName} ${s.admissionNo} ${s.studentId}`.toLowerCase().includes(search.toLowerCase());
    const matchesClass = classFilter === "all" || s.className === classFilter;
    const matchesSection = sectionFilter === "all" || s.section === sectionFilter;
    const matchesYear = yearFilter === "all" || s.academicYear === yearFilter;
    return matchesSearch && matchesClass && matchesSection && matchesYear;
  });

  function handleSubmit(values) {
    if (editingStudent) {
      updateMutation.mutate({ id: editingStudent.id, payload: values });
    } else {
      createMutation.mutate(values);
    }
  }

  function openCreate() {
    setEditingStudent(null);
    setDialogOpen(true);
  }

  function openEdit(student) {
    setEditingStudent(student);
    setDialogOpen(true);
  }

  const exportCSV = () => {
    const headers = "Admission No,Student ID,Roll No,Name,Class,Section,Phone,Parent,Status\n";
    const rows = filtered
      .map(
        (s) =>
          `"${s.admissionNo}","${s.studentId}","${s.rollNo || ""}","${s.firstName} ${s.lastName}","${
            s.className || ""
          }","${s.section || ""}","${s.studentPhone || ""}","${s.fatherName || ""}","${s.status || "ACTIVE"}"`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "students_export.csv";
    link.click();
  };

  return (
    <>
      <PageHeader
        title="Students"
        description="Manage student admissions, credentials, and portals."
        actions={
          <div className="flex gap-2">
            <Button onClick={exportCSV} variant="outline">
              <FileDown className="h-4 w-4" /> Export CSV
            </Button>
            <Button onClick={openCreate}>
              <Plus className="h-4 w-4" /> Add student
            </Button>
          </div>
        }
      />

      {/* Filter and Search Bar */}
      <div className="mb-6 flex flex-wrap items-center gap-4 bg-muted/30 p-4 rounded-lg border border-border">
        {/* Search */}
        <div className="relative max-w-xs flex-1">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search students…"
            className="pl-8 bg-background"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Academic Year Filter */}
        <div className="w-[140px]">
          <Select value={yearFilter} onValueChange={setYearFilter}>
            <SelectTrigger className="bg-background">
              <SelectValue placeholder="Academic Year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Years</SelectItem>
              {academicYears.map((y) => (
                <SelectItem key={y} value={y}>{y}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Class Filter */}
        <div className="w-[140px]">
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
        <div className="w-[140px]">
          <Select value={sectionFilter} onValueChange={setSectionFilter}>
            <SelectTrigger className="bg-background">
              <SelectValue placeholder="Section" />
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

      {studentsQuery.isLoading ? (
        <LoadingBlock rows={6} />
      ) : studentsQuery.isError ? (
        <ErrorState message={studentsQuery.error?.message} onRetry={studentsQuery.refetch} />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Users}
          title={search ? "No students match your search" : "No students yet"}
          description={search ? "Try a different name or admission number." : "Add your first student to get started."}
          action={
            !search && (
              <Button size="sm" onClick={openCreate}>
                <Plus className="h-4 w-4" />
                Add student
              </Button>
            )
          }
        />
      ) : (
        <div className="rounded-lg border border-border bg-card overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Admission No</TableHead>
                <TableHead>Student ID</TableHead>
                <TableHead>Roll No</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Parent Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-44 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="font-mono text-xs">{s.admissionNo}</TableCell>
                  <TableCell className="font-mono text-xs">{s.studentId}</TableCell>
                  <TableCell className="text-xs">{s.rollNo || "—"}</TableCell>
                  <TableCell className="font-medium text-foreground">
                    {s.firstName} {s.lastName}
                  </TableCell>
                  <TableCell>
                    {s.className ? (
                      <Badge variant="secondary">
                        Class {s.className}
                        {s.section ? `-${s.section}` : ""}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {s.email || s.studentPhone || "—"}
                  </TableCell>
                  <TableCell className="text-xs">{s.fatherName || "—"}</TableCell>
                  <TableCell>
                    <Badge variant={s.status === "ACTIVE" ? "success" : "secondary"}>
                      {s.status || "ACTIVE"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      {/* Manage Credentials */}
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Credentials"
                        onClick={() => {
                          setSelectedStudent(s);
                          setResetPwdResult(null);
                          setCredOpen(true);
                        }}
                      >
                        <Key className="h-4 w-4 text-primary" />
                      </Button>

                      {/* Login History */}
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Login History"
                        onClick={() => {
                          setSelectedStudent(s);
                          setHistoryOpen(true);
                        }}
                      >
                        <History className="h-4 w-4" />
                      </Button>

                      {/* Promote/Transfer */}
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Promote/Transfer"
                        onClick={() => {
                          setSelectedStudent(s);
                          setTransferOpen(true);
                        }}
                      >
                        <Shuffle className="h-4 w-4" />
                      </Button>

                      {/* Edit */}
                      <Button variant="ghost" size="icon" onClick={() => openEdit(s)}>
                        <Pencil className="h-4 w-4" />
                      </Button>

                      {/* Delete */}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => {
                          if (confirm(`Remove ${s.firstName} ${s.lastName}? This will also delete their login account.`)) {
                            deleteMutation.mutate(s.id);
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

      {/* Edit/Create Form Dialog */}
      <StudentFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        student={editingStudent}
        onSubmit={handleSubmit}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      />

      {/* Manage Credentials Modal */}
      {selectedStudent && (
        <Dialog open={credOpen} onOpenChange={setCredOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Manage Credentials - {selectedStudent.firstName}</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-4 text-sm">
              <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground">Username (Student ID):</span>
                <span className="font-mono font-semibold">{selectedStudent.studentId}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground">Login Capability:</span>
                <Badge variant={selectedStudent.active ? "success" : "secondary"}>
                  {selectedStudent.active ? "Enabled" : "Disabled"}
                </Badge>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground">Account Status:</span>
                <Badge variant={selectedStudent.locked ? "destructive" : "success"}>
                  {selectedStudent.locked ? "Locked" : "Unlocked"}
                </Badge>
              </div>

              {resetPwdResult && (
                <div className="p-3 bg-primary/10 rounded-lg space-y-1">
                  <p className="font-semibold text-xs text-primary">New Temporary Credentials</p>
                  <p className="text-xs">Username: <span className="font-mono font-bold">{resetPwdResult.username}</span></p>
                  <p className="text-xs">Password: <span className="font-mono font-bold select-all bg-background px-1 border rounded">{resetPwdResult.password}</span></p>
                  <p className="text-[10px] text-muted-foreground">Copy and provide this password to the student.</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2 pt-2">
                <Button 
                  variant="outline" 
                  onClick={() => toggleLoginMutation.mutate({ id: selectedStudent.id })}
                  disabled={toggleLoginMutation.isPending}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  {selectedStudent.active ? "Disable Login" : "Enable Login"}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => toggleLockMutation.mutate({ id: selectedStudent.id })}
                  disabled={toggleLockMutation.isPending}
                >
                  {selectedStudent.locked ? <Unlock className="h-4 w-4 mr-2" /> : <Lock className="h-4 w-4 mr-2" />}
                  {selectedStudent.locked ? "Unlock Account" : "Lock Account"}
                </Button>
              </div>
            </div>

            <DialogFooter>
              <Button 
                variant="destructive" 
                onClick={() => resetPasswordMutation.mutate({ id: selectedStudent.id })}
                disabled={resetPasswordMutation.isPending}
              >
                <RefreshCw className="h-4 w-4 mr-2 animate-spin-hover" />
                Generate New Password
              </Button>
              <Button variant="outline" onClick={() => setCredOpen(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Login History Modal */}
      {selectedStudent && (
        <Dialog open={historyOpen} onOpenChange={setHistoryOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Login History - {selectedStudent.firstName}</DialogTitle>
            </DialogHeader>

            <div className="py-4 overflow-y-auto max-h-[300px]">
              {historyQuery.isLoading ? (
                <div className="py-8 text-center text-xs text-muted-foreground">Loading login attempts...</div>
              ) : historyQuery.data?.length === 0 ? (
                <div className="py-8 text-center text-xs text-muted-foreground">No login attempts recorded.</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Time</TableHead>
                      <TableHead>IP Address</TableHead>
                      <TableHead className="text-right">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {historyQuery.data?.map((h) => (
                      <TableRow key={h.id}>
                        <TableCell className="text-xs">
                          {h.attemptedAt ? new Date(h.attemptedAt).toLocaleString() : ""}
                        </TableCell>
                        <TableCell className="font-mono text-xs">{h.ipAddress || "—"}</TableCell>
                        <TableCell className="text-right">
                          <Badge variant={h.status === "SUCCESS" ? "success" : "destructive"}>
                            {h.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setHistoryOpen(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Promote / Transfer Modal */}
      {selectedStudent && (
        <TransferDialog
          open={transferOpen}
          onOpenChange={setTransferOpen}
          student={selectedStudent}
          onConfirm={(payload) => transferMutation.mutate({ id: selectedStudent.id, payload })}
          isSubmitting={transferMutation.isPending}
          classOptions={classOptions}
          sectionOptions={sectionOptions}
          academicYears={academicYears}
        />
      )}
    </>
  );
}

// Local helper component for student transfer/promotion
function TransferDialog({ 
  open, onOpenChange, student, onConfirm, isSubmitting, 
  classOptions, sectionOptions, academicYears 
}) {
  const [className, setClassName] = useState(student.className || "");
  const [section, setSection] = useState(student.section || "");
  const [academicYear, setAcademicYear] = useState(student.academicYear || "");
  const [status, setStatus] = useState(student.status || "ACTIVE");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Transfer / Promote Student</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <p className="text-sm text-muted-foreground">
            Move <strong>{student.firstName} {student.lastName}</strong> to a different class, section, academic year, or update their registration status.
          </p>

          <div className="space-y-3">
            <div>
              <Label>Academic Year</Label>
              <Select value={academicYear} onValueChange={setAcademicYear}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Academic Year" />
                </SelectTrigger>
                <SelectContent>
                  {academicYears.map((y) => (
                    <SelectItem key={y} value={y}>{y}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Class Name</Label>
              <Select value={className} onValueChange={setClassName}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Class" />
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
              <Select value={section} onValueChange={setSection}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Section" />
                </SelectTrigger>
                <SelectContent>
                  {sectionOptions.map((s) => (
                    <SelectItem key={s} value={s}>Section {s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Registration Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Registration Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="INACTIVE">Inactive</SelectItem>
                  <SelectItem value="DEACTIVATED">Deactivated</SelectItem>
                  <SelectItem value="TRANSFERRED">Transferred</SelectItem>
                  <SelectItem value="PROMOTED">Promoted</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button 
            onClick={() => onConfirm({ className, section, academicYear, status })}
            disabled={isSubmitting}
          >
            Confirm Transfer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
