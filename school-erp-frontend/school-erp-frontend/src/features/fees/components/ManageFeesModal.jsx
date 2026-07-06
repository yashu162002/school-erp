import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, User, Coins } from "lucide-react";
import { toast } from "sonner";
import { feesApi } from "@/api/fees.api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { FeeFormDialog } from "./FeeFormDialog";

export function ManageFeesModal({ open, onOpenChange, student, className }) {
  const queryClient = useQueryClient();
  const [formOpen, setFormOpen] = useState(false);
  const [editingFee, setEditingFee] = useState(null);

  const createMutation = useMutation({
    mutationFn: feesApi.createFee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["class-fees", className] });
      toast.success("Fee record added successfully");
      setFormOpen(false);
    },
    onError: (err) => toast.error(err.message || "Failed to add fee record"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => feesApi.updateFee(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["class-fees", className] });
      toast.success("Fee record updated successfully");
      setFormOpen(false);
      setEditingFee(null);
    },
    onError: (err) => toast.error(err.message || "Failed to update fee record"),
  });

  const deleteMutation = useMutation({
    mutationFn: feesApi.deleteFee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["class-fees", className] });
      toast.success("Fee record deleted successfully");
    },
    onError: (err) => toast.error(err.message || "Failed to delete fee record"),
  });

  if (!student) return null;

  const fees = student.fees || [];

  function handleFormSubmit(values) {
    const payload = {
      ...values,
      studentId: student.id,
    };
    if (editingFee) {
      updateMutation.mutate({ id: editingFee.id, payload });
    } else {
      createMutation.mutate(payload);
    }
  }

  function openAddFee() {
    setEditingFee(null);
    setFormOpen(true);
  }

  function openEditFee(fee) {
    setEditingFee(fee);
    setFormOpen(true);
  }

  function handleDeleteFee(feeId) {
    if (confirm("Delete this fee record?\n\nThis action cannot be undone.")) {
      deleteMutation.mutate(feeId);
    }
  }

  function getStatusColor(status) {
    switch (status?.toUpperCase()) {
      case "PAID":
        return "bg-success/15 text-success hover:bg-success/15 border-success/30";
      case "PARTIAL":
        return "bg-warning/15 text-warning hover:bg-warning/15 border-warning/30";
      default:
        return "bg-destructive/15 text-destructive hover:bg-destructive/15 border-destructive/30";
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl p-6">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl font-bold">
              <Coins className="h-5 w-5 text-primary" />
              Manage Student Fees
            </DialogTitle>
          </DialogHeader>

          {/* Student Profile Card Header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center justify-between rounded-xl border border-border bg-card p-4 shadow-sm">
            <div className="flex items-center gap-3.5">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 border border-primary/20 text-primary">
                <User className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground text-base">
                  {student.firstName} {student.lastName}
                </h3>
                <p className="text-xs text-muted-foreground font-mono">
                  Admn: {student.admissionNo}
                </p>
              </div>
            </div>
            <div className="flex gap-4 text-sm">
              <div className="rounded-lg bg-muted/50 px-3 py-1.5 border border-border/50">
                <span className="text-xs text-muted-foreground block">Class</span>
                <span className="font-medium text-foreground">{student.className || "—"}</span>
              </div>
              <div className="rounded-lg bg-muted/50 px-3 py-1.5 border border-border/50">
                <span className="text-xs text-muted-foreground block">Section</span>
                <span className="font-medium text-foreground">{student.section || "—"}</span>
              </div>
            </div>
          </div>

          {/* Fees Table */}
          <div className="mt-4 flex items-center justify-between">
            <h4 className="font-semibold text-sm text-foreground">Fee Records breakdown</h4>
            <Button size="sm" onClick={openAddFee} className="h-8">
              <Plus className="mr-1 h-3.5 w-3.5" />
              Add Fee Record
            </Button>
          </div>

          <div className="mt-2.5 rounded-lg border border-border overflow-hidden bg-background">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30">
                  <TableHead className="py-2.5">Fee Type</TableHead>
                  <TableHead className="py-2.5 text-right">Amount</TableHead>
                  <TableHead className="py-2.5 text-right">Paid Amount</TableHead>
                  <TableHead className="py-2.5 text-right">Due Amount</TableHead>
                  <TableHead className="py-2.5">Due Date</TableHead>
                  <TableHead className="py-2.5">Status</TableHead>
                  <TableHead className="w-20 py-2.5 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fees.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground text-sm">
                      No fee records assigned to this student yet. Click "Add Fee Record" above.
                    </TableCell>
                  </TableRow>
                ) : (
                  fees.map((fee) => {
                    const amount = fee.amount || 0;
                    const paid = fee.paidAmount || 0;
                    const due = Math.max(0, amount - paid);

                    return (
                      <TableRow key={fee.id} className="hover:bg-muted/10 transition-colors">
                        <TableCell className="font-medium text-sm py-2">
                          {fee.feeType}
                          {fee.remarks && (
                            <span className="block text-[11px] font-normal text-muted-foreground mt-0.5">
                              Note: {fee.remarks}
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-right py-2 font-medium">₹{amount.toFixed(2)}</TableCell>
                        <TableCell className="text-right py-2 text-success">₹{paid.toFixed(2)}</TableCell>
                        <TableCell className={`text-right py-2 font-semibold ${due > 0 ? "text-destructive" : "text-muted-foreground"}`}>
                          ₹{due.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground py-2">{fee.dueDate || "—"}</TableCell>
                        <TableCell className="py-2">
                          <Badge variant="outline" className={getStatusColor(fee.paymentStatus)}>
                            {fee.paymentStatus || "UNPAID"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right py-2">
                          <div className="flex justify-end gap-1.5">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => openEditFee(fee)}
                            >
                              <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10"
                              onClick={() => handleDeleteFee(fee.id)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>

      <FeeFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        fee={editingFee}
        onSubmit={handleFormSubmit}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      />
    </>
  );
}
