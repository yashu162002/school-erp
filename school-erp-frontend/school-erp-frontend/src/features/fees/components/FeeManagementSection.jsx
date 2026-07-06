import { useState, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import {
  Coins,
  TrendingUp,
  AlertCircle,
  Percent,
  RefreshCw,
  Search,
  BookOpen,
  Layers,
  Activity,
  ArrowRight,
} from "lucide-react";
import { feesApi } from "@/api/fees.api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ManageFeesModal } from "./ManageFeesModal";
import { ErrorState } from "@/components/common/ErrorState";

export default function FeeManagementSection({ isDashboard = true }) {
  const queryClient = useQueryClient();
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("ALL");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Fetch unique classes
  const classesQuery = useQuery({
    queryKey: ["fee-classes"],
    queryFn: feesApi.getClasses,
    onSuccess: (data) => {
      if (data && data.length > 0 && !selectedClass) {
        setSelectedClass(data[0]);
      }
    },
  });

  // Automatically select the first class when classes are loaded
  useMemo(() => {
    if (classesQuery.data && classesQuery.data.length > 0 && !selectedClass) {
      setSelectedClass(classesQuery.data[0]);
    }
  }, [classesQuery.data, selectedClass]);

  // Fetch fees/students for the selected class
  const classFeesQuery = useQuery({
    queryKey: ["class-fees", selectedClass],
    queryFn: () => feesApi.getClassFees(selectedClass),
    enabled: !!selectedClass,
  });

  // Calculate unique sections in current class data
  const sections = useMemo(() => {
    const data = classFeesQuery.data ?? [];
    const secSet = new Set();
    data.forEach((student) => {
      if (student.section) secSet.add(student.section);
    });
    return Array.from(secSet).sort();
  }, [classFeesQuery.data]);

  // Handle Refresh Action
  function handleRefresh() {
    queryClient.invalidateQueries({ queryKey: ["fee-classes"] });
    if (selectedClass) {
      queryClient.invalidateQueries({ queryKey: ["class-fees", selectedClass] });
    }
  }

  // Filter and compute statistics
  const { studentsList, stats } = useMemo(() => {
    const rawList = classFeesQuery.data ?? [];

    let totalAssigned = 0;
    let totalCollected = 0;

    // First, compute metrics for the ENTIRE class to keep stats independent of section/search filters
    rawList.forEach((s) => {
      const fees = s.fees || [];
      fees.forEach((f) => {
        totalAssigned += f.amount || 0;
        totalCollected += f.paidAmount || 0;
      });
    });

    const outstandingAmount = Math.max(0, totalAssigned - totalCollected);
    const collectionPercentage = totalAssigned > 0 ? (totalCollected / totalAssigned) * 100 : 0;

    // Now apply filters for display table
    const filteredList = rawList.filter((student) => {
      // Section Filter
      if (selectedSection !== "ALL" && student.section !== selectedSection) {
        return false;
      }

      // Compute student-specific totals for status filter
      let studentAssigned = 0;
      let studentPaid = 0;
      student.fees?.forEach((f) => {
        studentAssigned += f.amount || 0;
        studentPaid += f.paidAmount || 0;
      });

      let studentStatus = "UNPAID";
      if (studentAssigned > 0) {
        if (studentPaid >= studentAssigned) {
          studentStatus = "PAID";
        } else if (studentPaid > 0) {
          studentStatus = "PARTIAL";
        }
      }

      // Status Filter
      if (selectedStatus !== "ALL" && studentStatus !== selectedStatus) {
        return false;
      }

      // Search Query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const fullName = `${student.firstName} ${student.lastName}`.toLowerCase();
        const adNo = student.admissionNo?.toLowerCase() || "";
        if (!fullName.includes(query) && !adNo.includes(query)) {
          return false;
        }
      }

      return true;
    });

    return {
      studentsList: filteredList,
      stats: {
        totalAssigned,
        totalCollected,
        outstandingAmount,
        collectionPercentage,
      },
    };
  }, [classFeesQuery.data, selectedSection, selectedStatus, searchQuery]);

  function handleManageFees(student) {
    setSelectedStudent(student);
    setModalOpen(true);
  }

  function getOverallStatus(assigned, paid) {
    if (assigned === 0) return { label: "Unpaid", color: "bg-destructive/15 text-destructive border-destructive/30" };
    if (paid >= assigned) return { label: "Paid", color: "bg-success/15 text-success border-success/30" };
    if (paid > 0) return { label: "Partial", color: "bg-warning/15 text-warning border-warning/30" };
    return { label: "Unpaid", color: "bg-destructive/15 text-destructive border-destructive/30" };
  }

  function getLastPaymentDate(fees) {
    if (!fees || fees.length === 0) return "—";
    // Returns due date of the latest fee record or custom payment date if available.
    // For now, sorting by due date or id descending is a good proxy.
    const sorted = [...fees].sort((a, b) => (b.dueDate || "").localeCompare(a.dueDate || ""));
    return sorted[0]?.dueDate || "—";
  }

  if (classesQuery.isError) {
    return (
      <Card className="mt-6 border-destructive/20 shadow-lg">
        <CardHeader>
          <CardTitle className="text-destructive">Failed to load Fee Management</CardTitle>
        </CardHeader>
        <CardContent>
          <ErrorState message={classesQuery.error?.message} onRetry={handleRefresh} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-6 border-border shadow-md bg-card overflow-hidden">
      {/* Widget Header */}
      <CardHeader className="flex flex-row items-center justify-between border-b border-border/50 bg-muted/20 py-4 px-6">
        <div>
          <CardTitle className="font-display text-lg font-bold text-foreground">Fee Management</CardTitle>
          <p className="text-xs text-muted-foreground">Manage student fees and monitor fee collection.</p>
        </div>
        {isDashboard && (
          <Button variant="outline" size="sm" asChild className="h-8 hover:bg-muted font-medium transition-all">
            <Link to="/admin/fees" className="flex items-center gap-1.5">
              View All
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        )}
      </CardHeader>

      <CardContent className="p-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
          {/* Card 1 */}
          <div className="relative overflow-hidden rounded-xl border border-border bg-gradient-to-br from-surface to-muted/20 p-4 transition-all duration-300 hover:scale-[1.02] hover:shadow-md group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total Assigned</span>
              <div className="rounded-lg bg-primary/10 p-2 text-primary group-hover:bg-primary/20 transition-colors">
                <BookOpen className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2.5">
              <span className="font-display text-2xl font-bold text-foreground">
                ₹{classFeesQuery.isLoading ? "…" : stats.totalAssigned.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span className="block text-[11px] text-muted-foreground mt-1">Sum of all assigned fee items.</span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="relative overflow-hidden rounded-xl border border-border bg-gradient-to-br from-surface to-muted/20 p-4 transition-all duration-300 hover:scale-[1.02] hover:shadow-md group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total Collected</span>
              <div className="rounded-lg bg-success/10 p-2 text-success group-hover:bg-success/20 transition-colors">
                <TrendingUp className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2.5">
              <span className="font-display text-2xl font-bold text-success">
                ₹{classFeesQuery.isLoading ? "…" : stats.totalCollected.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span className="block text-[11px] text-muted-foreground mt-1">Total payments recorded.</span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="relative overflow-hidden rounded-xl border border-border bg-gradient-to-br from-surface to-muted/20 p-4 transition-all duration-300 hover:scale-[1.02] hover:shadow-md group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Outstanding</span>
              <div className="rounded-lg bg-destructive/10 p-2 text-destructive group-hover:bg-destructive/20 transition-colors">
                <AlertCircle className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2.5">
              <span className="font-display text-2xl font-bold text-destructive">
                ₹{classFeesQuery.isLoading ? "…" : stats.outstandingAmount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span className="block text-[11px] text-muted-foreground mt-1">Pending student balances.</span>
            </div>
          </div>

          {/* Card 4 */}
          <div className="relative overflow-hidden rounded-xl border border-border bg-gradient-to-br from-surface to-muted/20 p-4 transition-all duration-300 hover:scale-[1.02] hover:shadow-md group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Collection %</span>
              <div className="rounded-lg bg-warning/10 p-2 text-warning group-hover:bg-warning/20 transition-colors">
                <Percent className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2.5">
              <span className="font-display text-2xl font-bold text-foreground">
                {classFeesQuery.isLoading ? "…" : `${stats.collectionPercentage.toFixed(1)}%`}
              </span>
              <div className="mt-2 h-1.5 w-full rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-warning to-success transition-all duration-500"
                  style={{ width: `${Math.min(100, stats.collectionPercentage)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Filters Toolbar */}
        <div className="flex flex-col gap-3.5 mb-4 lg:flex-row lg:items-center justify-between bg-muted/10 p-3.5 rounded-xl border border-border/50">
          <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-4 flex-1">
            {/* Class Dropdown */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                <Layers className="h-3 w-3" /> Class
              </label>
              <Select value={selectedClass} onValueChange={(val) => { setSelectedClass(val); setSelectedSection("ALL"); }}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  {classesQuery.data?.map((cls) => (
                    <SelectItem key={cls} value={cls}>
                      Class {cls}
                    </SelectItem>
                  ))}
                  {(!classesQuery.data || classesQuery.data.length === 0) && (
                    <SelectItem value="none" disabled>No classes found</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Section Dropdown */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                <Activity className="h-3 w-3" /> Section
              </label>
              <Select value={selectedSection} onValueChange={setSelectedSection}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="All sections" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Sections</SelectItem>
                  {sections.map((sec) => (
                    <SelectItem key={sec} value={sec}>
                      Section {sec}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Payment Status Dropdown */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                <Coins className="h-3 w-3" /> Status
              </label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Statuses</SelectItem>
                  <SelectItem value="PAID">Paid</SelectItem>
                  <SelectItem value="PARTIAL">Partial</SelectItem>
                  <SelectItem value="UNPAID">Unpaid</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Search Box */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                <Search className="h-3 w-3" /> Search
              </label>
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Name or Admn No…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 h-9 text-sm"
                />
              </div>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleRefresh}
            className="self-end lg:self-auto h-9 w-9 border border-border bg-surface hover:bg-muted"
            title="Refresh statistics"
          >
            <RefreshCw className={`h-4 w-4 text-muted-foreground ${(classesQuery.isFetching || classFeesQuery.isFetching) ? "animate-spin" : ""}`} />
          </Button>
        </div>

        {/* Loader, Empty, and Table States */}
        {classFeesQuery.isLoading ? (
          <div className="space-y-2.5 py-8">
            <div className="h-8 animate-pulse rounded-md bg-muted" />
            <div className="h-12 animate-pulse rounded-md bg-muted" />
            <div className="h-12 animate-pulse rounded-md bg-muted" />
            <div className="h-12 animate-pulse rounded-md bg-muted" />
          </div>
        ) : classFeesQuery.isError ? (
          <ErrorState message={classFeesQuery.error?.message} onRetry={classFeesQuery.refetch} />
        ) : studentsList.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border py-12 text-center bg-muted/5">
            <Coins className="h-8 w-8 text-muted-foreground/60 mx-auto mb-2 animate-bounce" />
            <h4 className="font-semibold text-sm text-foreground">No students match selection</h4>
            <p className="text-xs text-muted-foreground mt-1 px-4 max-w-xs mx-auto">
              {searchQuery ? "Try altering search inputs or selected class filters." : "Assign student fee records to view metrics here."}
            </p>
          </div>
        ) : (
          <div className="rounded-lg border border-border overflow-hidden bg-background">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30">
                  <TableHead className="py-2.5">Admn No.</TableHead>
                  <TableHead className="py-2.5">Student Name</TableHead>
                  <TableHead className="py-2.5">Class</TableHead>
                  <TableHead className="py-2.5">Section</TableHead>
                  <TableHead className="py-2.5 text-right">Total Assigned</TableHead>
                  <TableHead className="py-2.5 text-right">Total Paid</TableHead>
                  <TableHead className="py-2.5 text-right">Outstanding</TableHead>
                  <TableHead className="py-2.5">Status</TableHead>
                  <TableHead className="py-2.5">Last Payment</TableHead>
                  <TableHead className="w-24 py-2.5 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {studentsList.map((student) => {
                  let assigned = 0;
                  let paid = 0;
                  student.fees?.forEach((fee) => {
                    assigned += fee.amount || 0;
                    paid += fee.paidAmount || 0;
                  });
                  const due = Math.max(0, assigned - paid);
                  const status = getOverallStatus(assigned, paid);

                  return (
                    <TableRow key={student.id} className="hover:bg-muted/10 transition-colors">
                      <TableCell className="font-mono text-xs py-2">{student.admissionNo}</TableCell>
                      <TableCell className="font-medium text-sm py-2">
                        {student.firstName} {student.lastName}
                      </TableCell>
                      <TableCell className="py-2 text-sm">{student.className || "—"}</TableCell>
                      <TableCell className="py-2 text-sm">
                        {student.section ? (
                          <Badge variant="secondary" className="px-1.5 py-0.2">
                            {student.section}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right py-2 font-medium">₹{assigned.toFixed(2)}</TableCell>
                      <TableCell className="text-right py-2 text-success">₹{paid.toFixed(2)}</TableCell>
                      <TableCell className={`text-right py-2 font-semibold ${due > 0 ? "text-destructive" : "text-muted-foreground"}`}>
                        ₹{due.toFixed(2)}
                      </TableCell>
                      <TableCell className="py-2">
                        <Badge variant="outline" className={status.color}>
                          {status.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground py-2">
                        {getLastPaymentDate(student.fees)}
                      </TableCell>
                      <TableCell className="text-right py-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleManageFees(student)}
                          className="h-7 text-xs px-2.5 hover:bg-primary/5 hover:text-primary hover:border-primary/30"
                        >
                          Manage Fees
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>

      <ManageFeesModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        student={selectedStudent}
        className={selectedClass}
      />
    </Card>
  );
}
