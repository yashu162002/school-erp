import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const feeSchema = z.object({
  feeType: z.string().min(1, "Fee type is required"),
  amount: z.coerce.number().positive("Amount must be positive"),
  paidAmount: z.coerce.number().nonnegative("Paid amount must be non-negative"),
  dueDate: z.string().min(1, "Due date is required"),
  paymentStatus: z.enum(["PAID", "PARTIAL", "UNPAID"]),
  remarks: z.string().optional().default(""),
}).refine((data) => data.paidAmount <= data.amount, {
  message: "Paid amount cannot exceed total amount",
  path: ["paidAmount"],
});

const EMPTY_VALUES = {
  feeType: "",
  amount: "",
  paidAmount: "0",
  dueDate: new Date().toISOString().split("T")[0],
  paymentStatus: "UNPAID",
  remarks: "",
};

export function FeeFormDialog({ open, onOpenChange, fee, onSubmit, isSubmitting }) {
  const form = useForm({
    resolver: zodResolver(feeSchema),
    defaultValues: EMPTY_VALUES,
  });

  useEffect(() => {
    if (open) {
      if (fee) {
        form.reset({
          feeType: fee.feeType || "",
          amount: fee.amount?.toString() || "",
          paidAmount: fee.paidAmount?.toString() || "0",
          dueDate: fee.dueDate || "",
          paymentStatus: fee.paymentStatus || "UNPAID",
          remarks: fee.remarks || "",
        });
      } else {
        form.reset(EMPTY_VALUES);
      }
    }
  }, [open, fee, form]);

  const watchedAmount = form.watch("amount");
  const watchedPaidAmount = form.watch("paidAmount");

  useEffect(() => {
    const amt = parseFloat(watchedAmount || "0");
    const paid = parseFloat(watchedPaidAmount || "0");
    if (amt > 0) {
      if (paid === 0) {
        form.setValue("paymentStatus", "UNPAID");
      } else if (paid >= amt) {
        form.setValue("paymentStatus", "PAID");
      } else {
        form.setValue("paymentStatus", "PARTIAL");
      }
    }
  }, [watchedAmount, watchedPaidAmount, form]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{fee ? "Edit Fee Record" : "Add Fee Record"}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="feeType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fee Type</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Tuition Fee, Exam Fee, Transport" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Amount</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="paidAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Paid Amount</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Due Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="paymentStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="PAID">Paid</SelectItem>
                        <SelectItem value="PARTIAL">Partial</SelectItem>
                        <SelectItem value="UNPAID">Unpaid</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="remarks"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Remarks</FormLabel>
                  <FormControl>
                    <Input placeholder="Additional notes..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {fee ? "Save Changes" : "Add Fee"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
