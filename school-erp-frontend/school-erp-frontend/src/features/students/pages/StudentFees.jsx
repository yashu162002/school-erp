import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { studentPortalApi } from "@/api/studentPortal.api";
import { PageHeader } from "@/components/common/PageHeader";
import { LoadingBlock } from "@/components/common/LoadingBlock";
import { ErrorState } from "@/components/common/ErrorState";
import { EmptyState } from "@/components/common/EmptyState";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Receipt, Calendar, CreditCard, CheckCircle, Clock } from "lucide-react";

export function StudentFees() {
  const [activeReceipt, setActiveReceipt] = useState(null);

  const feesQuery = useQuery({
    queryKey: ["student-fees"],
    queryFn: studentPortalApi.getFees,
  });

  const profileQuery = useQuery({
    queryKey: ["student-profile"],
    queryFn: studentPortalApi.getProfile,
  });

  if (feesQuery.isLoading || profileQuery.isLoading) {
    return <LoadingBlock rows={6} />;
  }

  if (feesQuery.isError || profileQuery.isError) {
    return (
      <ErrorState
        message="Could not load fee records"
        onRetry={() => {
          feesQuery.refetch();
          profileQuery.refetch();
        }}
      />
    );
  }

  const fees = feesQuery.data ?? [];
  const student = profileQuery.data;

  if (fees.length === 0) {
    return (
      <div className="space-y-6">
        <PageHeader title="My Fees" description="View outstanding dues, fees structures, and download payment receipts." />
        <EmptyState
          icon={Receipt}
          title="No fee records available"
          description="Your profile currently has no active fee billing or dues."
        />
      </div>
    );
  }

  // Calculate totals
  let totalDues = 0;
  let totalPaid = 0;
  let nextDueFee = null;

  fees.forEach((f) => {
    const amt = f.amount ? Number(f.amount) : 0;
    const paid = f.paidAmount ? Number(f.paidAmount) : 0;
    totalDues += amt;
    totalPaid += paid;

    if (f.paymentStatus === "PENDING" || f.paymentStatus === "PARTIAL") {
      if (!nextDueFee || (f.dueDate && new Date(f.dueDate) < new Date(nextDueFee.dueDate))) {
        nextDueFee = f;
      }
    }
  });

  const handlePrintReceipt = (fee) => {
    setActiveReceipt(fee);
    setTimeout(() => {
      window.print();
    }, 100);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "PAID":
        return <Badge variant="success">Paid</Badge>;
      case "PARTIAL":
        return <Badge variant="warning">Partial</Badge>;
      case "PENDING":
        return <Badge variant="destructive">Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Fees"
        description="View outstanding dues, fees structures, and download payment receipts."
      />

      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body * {
            visibility: hidden;
          }
          #print-receipt, #print-receipt * {
            visibility: visible;
          }
          #print-receipt {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            border: none;
            box-shadow: none;
            padding: 20px;
            margin: 0;
            background: #fff !important;
            color: #000 !important;
          }
        }
      `}} />

      {/* Printable Receipt Overlay (Hidden in Screen view, visible in Print view) */}
      {activeReceipt && (
        <div id="print-receipt" className="hidden print:block border border-black p-8 max-w-xl mx-auto space-y-6">
          <div className="text-center border-b pb-4">
            <h2 className="text-xl font-bold uppercase">TRISHUL HIGH SCHOOL, DAVANGERE</h2>
            <p className="text-xs">Payment Receipt & Acknowledgment</p>
          </div>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="font-semibold block">Receipt ID:</span>
              <span>REC-PAY-{activeReceipt.id}</span>
            </div>
            <div>
              <span className="font-semibold block">Payment Date:</span>
              <span>{activeReceipt.dueDate || "—"}</span>
            </div>
            <div>
              <span className="font-semibold block">Student Name:</span>
              <span>{student.firstName} {student.lastName}</span>
            </div>
            <div>
              <span className="font-semibold block">Student ID:</span>
              <span>{student.studentId}</span>
            </div>
            <div>
              <span className="font-semibold block">Class / Section:</span>
              <span>Class {student.className} - {student.section}</span>
            </div>
            <div>
              <span className="font-semibold block">Billing Item:</span>
              <span>{activeReceipt.feeType}</span>
            </div>
          </div>

          <table className="w-full text-left text-xs border-collapse mt-4">
            <thead>
              <tr className="border-b border-t bg-gray-100">
                <th className="p-2 font-bold">Item Description</th>
                <th className="p-2 font-bold text-right">Billed Amount</th>
                <th className="p-2 font-bold text-right">Paid Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-2">{activeReceipt.feeType}</td>
                <td className="p-2 text-right">₹{activeReceipt.amount}</td>
                <td className="p-2 text-right">₹{activeReceipt.paidAmount || "0"}</td>
              </tr>
              <tr className="border-t font-bold">
                <td className="p-2">Outstanding Balance:</td>
                <td className="p-2 text-right" colSpan="2">₹{activeReceipt.amount - (activeReceipt.paidAmount || 0)}</td>
              </tr>
            </tbody>
          </table>

          <div className="flex justify-between items-end pt-12 text-[10px] text-gray-500">
            <div>
              <p>Generated automatically on portal</p>
            </div>
            <div className="text-center">
              <div className="w-24 border-b border-gray-400 h-6"></div>
              <p className="mt-1">Authorized Cashier</p>
            </div>
          </div>
        </div>
      )}

      {/* Stats Summary Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground font-semibold uppercase block">Total Billed Fees</span>
              <p className="text-3xl font-bold text-foreground">₹{totalDues.toFixed(2)}</p>
            </div>
            <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
              <CreditCard className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground font-semibold uppercase block">Total Paid Fees</span>
              <p className="text-3xl font-bold text-success mt-0.5">₹{totalPaid.toFixed(2)}</p>
            </div>
            <div className="h-10 w-10 bg-success/10 rounded-lg flex items-center justify-center text-success">
              <CheckCircle className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground font-semibold uppercase block">Outstanding Balance</span>
              <p className="text-3xl font-bold text-destructive mt-0.5">₹{(totalDues - totalPaid).toFixed(2)}</p>
            </div>
            <div className="h-10 w-10 bg-destructive/10 rounded-lg flex items-center justify-center text-destructive">
              <Clock className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {nextDueFee && (
        <Card className="border border-warning/40 bg-warning/5">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-base font-semibold text-warning-foreground">Upcoming Fee Reminder</h3>
              <p className="text-sm text-muted-foreground">
                Your payment of <strong>₹{nextDueFee.amount - (nextDueFee.paidAmount || 0)}</strong> for <strong>{nextDueFee.feeType}</strong> is due on <strong>{nextDueFee.dueDate}</strong>.
              </p>
            </div>
            <Badge variant="warning">Due Soon</Badge>
          </CardContent>
        </Card>
      )}

      {/* Detailed Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold">Billed Fees & Payment History</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Billing Item</TableHead>
                <TableHead>Billed Amount</TableHead>
                <TableHead>Paid Amount</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Remarks</TableHead>
                <TableHead className="w-32 text-right">Receipt</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fees.map((fee) => (
                <TableRow key={fee.id}>
                  <TableCell className="font-semibold text-foreground py-3.5">
                    {fee.feeType}
                  </TableCell>
                  <TableCell className="py-3.5">₹{fee.amount}</TableCell>
                  <TableCell className="py-3.5">₹{fee.paidAmount || "0"}</TableCell>
                  <TableCell className="py-3.5">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5 shrink-0" />
                      <span>{fee.dueDate}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-3.5">
                    {getStatusBadge(fee.paymentStatus)}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground py-3.5">
                    {fee.remarks || "—"}
                  </TableCell>
                  <TableCell className="text-right py-3.5">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 gap-1"
                      onClick={() => handlePrintReceipt(fee)}
                    >
                      <Receipt className="h-3.5 w-3.5" />
                      Receipt
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
