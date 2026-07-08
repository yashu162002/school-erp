import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Plus, Search, Pencil, Trash2, UserRound, Key, History, 
  RefreshCw, Eye, Lock, Unlock, FileDown, CheckCircle, ShieldAlert, AlertCircle
} from "lucide-react";
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export function TeachersPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);

  // Modals state
  const [credOpen, setCredOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [resetPwdResult, setResetPwdResult] = useState(null);
  const [forceChange, setForceChange] = useState(false);

  const teachersQuery = useQuery({
    queryKey: ["teachers"],
    queryFn: teachersApi.list,
  });

  const historyQuery = useQuery({
    queryKey: ["teacher-login-history", selectedTeacher?.id],
    queryFn: () => teachersApi.getLoginHistory(selectedTeacher.id),
    enabled: Boolean(historyOpen && selectedTeacher?.id),
  });

  const createMutation = useMutation({
    mutationFn: teachersApi.create,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
      toast.success("Teacher added successfully");
      setDialogOpen(false);

      // Auto display generated temporary credentials
      if (data && data.createdAt) { // Backend returns plain password in createdAt during creation mapping
        setSelectedTeacher(data);
        setResetPwdResult({ username: data.employeeId, password: data.createdAt });
        setCredOpen(true);
      }
    },
    onError: (err) => toast.error(err.message || "Couldn't add teacher"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => teachersApi.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
      toast.success("Teacher updated successfully");
      setDialogOpen(false);
      setEditingTeacher(null);
    },
    onError: (err) => toast.error(err.message || "Couldn't update teacher"),
  });

  const deleteMutation = useMutation({
    mutationFn: teachersApi.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
      toast.success("Teacher removed successfully");
    },
    onError: (err) => toast.error(err.message || "Couldn't remove teacher"),
  });

  const resetPasswordMutation = useMutation({
    mutationFn: ({ id, forceChange }) => teachersApi.resetPassword(id, { forceChange: String(forceChange) }),
    onSuccess: (data) => {
      setResetPwdResult(data);
      toast.success("Password reset successfully");
    },
    onError: (err) => toast.error(err.message || "Could not reset password"),
  });

  const toggleLoginMutation = useMutation({
    mutationFn: ({ id }) => teachersApi.toggleLogin(id),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
      if (selectedTeacher && selectedTeacher.id === updated.id) {
        setSelectedTeacher(updated);
      }
      toast.success(updated.active ? "Login enabled" : "Login disabled");
    },
    onError: (err) => toast.error(err.message || "Failed to update status"),
  });

  const toggleLockMutation = useMutation({
    mutationFn: ({ id }) => teachersApi.toggleLock(id),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
      if (selectedTeacher && selectedTeacher.id === updated.id) {
        setSelectedTeacher(updated);
      }
      toast.success(updated.locked ? "Teacher account Suspended / Locked" : "Teacher account Reinstated / Unlocked");
    },
    onError: (err) => toast.error(err.message || "Failed to update lock"),
  });

  const teachers = Array.isArray(teachersQuery.data) ? teachersQuery.data : [];
  const filtered = search
    ? teachers.filter((t) =>
        `${t.firstName} ${t.lastName} ${t.employeeId} ${t.department || ""} ${t.subject || ""}`.toLowerCase().includes(search.toLowerCase())
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

  const exportCSV = () => {
    const headers = "Employee ID,First Name,Last Name,Department,Subject Spec.,Qualification,Experience,Phone,Email,Status\n";
    const rows = filtered
      .map(
        (t) =>
          `"${t.employeeId}","${t.firstName}","${t.lastName}","${t.department || ""}","${t.subject || ""}","${
            t.qualification || ""
          }","${t.experience || ""}","${t.phone || ""}","${t.email || ""}","${t.status || "ACTIVE"}"`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "teachers_export.csv";
    link.click();
  };

  return (
    <>
      <PageHeader
        title="Teachers"
        description="Manage teaching staff credentials, portals, and system access."
        actions={
          <div className="flex gap-2">
            <Button onClick={exportCSV} variant="outline">
              <FileDown className="h-4 w-4" /> Export CSV
            </Button>
            <Button onClick={openCreate}>
              <Plus className="h-4 w-4" />
              Add teacher
            </Button>
          </div>
        }
      />

      <div className="mb-4 relative max-w-xs">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search teachers by name, dept, ID…"
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
          description={search ? "Try a different name or department." : "Add your first teacher to get started."}
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
        <div className="rounded-lg border border-border bg-card overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Photo</TableHead>
                <TableHead>Employee ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Department / Subject</TableHead>
                <TableHead>Qualification / Exp</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-44 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((t) => {
                let badgeVariant = "success";
                if (t.status === "INACTIVE") badgeVariant = "secondary";
                if (t.status === "SUSPENDED") badgeVariant = "destructive";
                if (t.status === "ON_LEAVE") badgeVariant = "warning";

                return (
                  <TableRow key={t.id}>
                    <TableCell>
                      <div className="h-8 w-8 rounded-full overflow-hidden border border-border bg-muted flex items-center justify-center">
                        {t.photoPath ? (
                          <img src={t.photoPath} alt={`${t.firstName}`} className="h-full w-full object-cover" />
                        ) : (
                          <span className="text-[10px] font-bold text-muted-foreground uppercase">
                            {t.firstName?.[0]}{t.lastName?.[0]}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-xs">{t.employeeId}</TableCell>
                    <TableCell className="font-medium text-foreground">{t.firstName} {t.lastName}</TableCell>
                    <TableCell>
                      <div className="space-y-0.5">
                        <span className="text-xs font-semibold block">{t.department || "General"}</span>
                        {t.subject ? <Badge variant="secondary" className="text-[10px]">{t.subject}</Badge> : null}
                      </div>
                    </TableCell>
                    <TableCell className="text-xs">
                      <div className="space-y-0.5">
                        <span>{t.qualification || "—"}</span>
                        <span className="text-muted-foreground block">{t.experience ? `${t.experience} Experience` : "—"}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      <div>{t.email || "—"}</div>
                      <div>{t.phone || "—"}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={badgeVariant}>
                        {t.status || "ACTIVE"}
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
                            setSelectedTeacher(t);
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
                            setSelectedTeacher(t);
                            setHistoryOpen(true);
                          }}
                        >
                          <History className="h-4 w-4" />
                        </Button>

                        {/* Edit */}
                        <Button variant="ghost" size="icon" onClick={() => openEdit(t)}>
                          <Pencil className="h-4 w-4" />
                        </Button>

                        {/* Delete */}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => {
                            if (confirm(`Remove Teacher ${t.firstName} ${t.lastName}? This will also delete their login account.`)) {
                              deleteMutation.mutate(t.id);
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Edit/Create Form Dialog */}
      <TeacherFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        teacher={editingTeacher}
        onSubmit={handleSubmit}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      />

      {/* Manage Credentials Modal */}
      {selectedTeacher && (
        <Dialog open={credOpen} onOpenChange={setCredOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Manage Credentials - {selectedTeacher.firstName}</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-4 text-sm">
              <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground">Username (Employee ID):</span>
                <span className="font-mono font-semibold">{selectedTeacher.employeeId}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground">Login Capability:</span>
                <Badge variant={selectedTeacher.active ? "success" : "secondary"}>
                  {selectedTeacher.active ? "Enabled" : "Disabled"}
                </Badge>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground">Account Status:</span>
                <Badge variant={selectedTeacher.locked ? "destructive" : "success"}>
                  {selectedTeacher.locked ? "Suspended" : "Active / Unlocked"}
                </Badge>
              </div>

              {resetPwdResult && (
                <div className="p-3 bg-primary/10 rounded-lg space-y-1">
                  <p className="font-semibold text-xs text-primary">New Temporary Credentials</p>
                  <p className="text-xs">Username: <span className="font-mono font-bold">{resetPwdResult.username}</span></p>
                  <p className="text-xs">Password: <span className="font-mono font-bold select-all bg-background px-1 border rounded">{resetPwdResult.password}</span></p>
                  <p className="text-[10px] text-muted-foreground">Copy and provide this password to the teacher.</p>
                </div>
              )}

              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="forceChange"
                  checked={forceChange}
                  onChange={(e) => setForceChange(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <Label htmlFor="forceChange" className="text-xs">Force password change on next login</Label>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <Button 
                  variant="outline" 
                  onClick={() => toggleLoginMutation.mutate({ id: selectedTeacher.id })}
                  disabled={toggleLoginMutation.isPending}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  {selectedTeacher.active ? "Disable Login" : "Enable Login"}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => toggleLockMutation.mutate({ id: selectedTeacher.id })}
                  disabled={toggleLockMutation.isPending}
                >
                  {selectedTeacher.locked ? <Unlock className="h-4 w-4 mr-2" /> : <Lock className="h-4 w-4 mr-2" />}
                  {selectedTeacher.locked ? "Reinstate Account" : "Suspend Account"}
                </Button>
              </div>
            </div>

            <DialogFooter>
              <Button 
                variant="destructive" 
                onClick={() => resetPasswordMutation.mutate({ id: selectedTeacher.id, forceChange })}
                disabled={resetPasswordMutation.isPending}
              >
                <RefreshCw className="h-4 w-4 mr-2 animate-spin-hover" />
                Generate Temp Password
              </Button>
              <Button variant="outline" onClick={() => setCredOpen(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Login History Modal */}
      {selectedTeacher && (
        <Dialog open={historyOpen} onOpenChange={setHistoryOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Login History - {selectedTeacher.firstName} {selectedTeacher.lastName}</DialogTitle>
            </DialogHeader>

            <div className="py-4 overflow-y-auto max-h-[350px]">
              {historyQuery.isLoading ? (
                <div className="py-8 text-center text-xs text-muted-foreground">Loading login attempts...</div>
              ) : historyQuery.data?.length === 0 ? (
                <div className="py-8 text-center text-xs text-muted-foreground">No login attempts recorded.</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Time</TableHead>
                      <TableHead>Device/Browser</TableHead>
                      <TableHead>IP Address</TableHead>
                      <TableHead className="text-right">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {historyQuery.data?.map((h) => (
                      <TableRow key={h.id}>
                        <TableCell className="text-xs">
                          {h.attemptedAt ? new Date(h.attemptedAt).toLocaleString() : "—"}
                        </TableCell>
                        <TableCell className="text-xs">
                          <span className="font-semibold block">{h.device || "Desktop"} ({h.os || "OS"})</span>
                          <span className="text-muted-foreground">{h.browser || "Browser"}</span>
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
    </>
  );
}
