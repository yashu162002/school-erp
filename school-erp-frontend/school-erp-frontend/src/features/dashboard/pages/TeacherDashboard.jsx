import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { teacherPortalApi } from "@/api/teacherPortal.api";
import { LoadingBlock } from "@/components/common/LoadingBlock";
import { ErrorState } from "@/components/common/ErrorState";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Link } from "react-router-dom";
import {
  Calendar, Clock, Award, Bell, User, BookOpen, GraduationCap, ClipboardCheck,
  FileText, CalendarDays, Wallet, UserCheck, ShieldAlert, Sparkles, LogOut, Camera, Receipt
} from "lucide-react";

export function TeacherDashboard() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("overview");
  
  // Leave form state
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [reason, setReason] = useState("");

  // Photo dialog state
  const [photoOpen, setPhotoOpen] = useState(false);
  const [photoUrl, setPhotoUrl] = useState("");

  // Queries
  const dashboardQuery = useQuery({
    queryKey: ["teacher-dashboard"],
    queryFn: teacherPortalApi.getDashboard,
  });

  const leavesQuery = useQuery({
    queryKey: ["teacher-leaves"],
    queryFn: teacherPortalApi.getLeaves,
    enabled: activeTab === "leaves",
  });

  // Mutations
  const applyLeaveMutation = useMutation({
    mutationFn: teacherPortalApi.applyLeave,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teacher-leaves"] });
      setFromDate("");
      setToDate("");
      setReason("");
      toast.success("Leave application submitted successfully");
    },
    onError: (err) => {
      toast.error(err.message || "Could not submit leave request");
    },
  });

  const photoMutation = useMutation({
    mutationFn: teacherPortalApi.updateProfilePhoto,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teacher-dashboard"] });
      setPhotoOpen(false);
      toast.success("Profile photo updated successfully");
    },
    onError: (err) => {
      toast.error(err.message || "Failed to update profile photo");
    },
  });

  if (dashboardQuery.isLoading) {
    return <LoadingBlock rows={10} />;
  }

  if (dashboardQuery.isError) {
    return (
      <ErrorState
        message={dashboardQuery.error?.message || "Could not load teacher dashboard details"}
        onRetry={dashboardQuery.refetch}
      />
    );
  }

  const data = dashboardQuery.data ?? {};
  const timetable = data.todayTimetable ?? [];
  const announcements = data.announcements ?? [];
  const leaves = leavesQuery.data ?? [];
  const leaveStats = data.leaveStats ?? { casualSpent: 0, casualTotal: 12, sickSpent: 0, sickTotal: 10, earnedSpent: 0, earnedTotal: 15 };
  const sal = data.salaryDetails ?? { basic: 45000.0, hra: 4500.0, da: 2250.0, deductions: 3600.0, net: 48150.0 };

  const handleApplyLeave = (e) => {
    e.preventDefault();
    if (!fromDate || !toDate || !reason) {
      toast.error("Please fill in all leave request fields.");
      return;
    }
    applyLeaveMutation.mutate({ fromDate, toDate, reason });
  };

  const handleUpdatePhoto = () => {
    if (!photoUrl.trim()) {
      toast.error("Please enter a valid image URL");
      return;
    }
    photoMutation.mutate(photoUrl);
  };

  return (
    <div className="space-y-6">
      {/* Greeting Header */}
      <div className="relative overflow-hidden rounded-xl border border-border bg-gradient-to-r from-primary/10 via-background to-background p-6 md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="relative group">
              <div className="h-16 w-16 rounded-full overflow-hidden border border-border bg-muted flex items-center justify-center shrink-0">
                {data.photoPath ? (
                  <img src={data.photoPath} alt={`${data.firstName}`} className="h-full w-full object-cover" />
                ) : (
                  <span className="text-xl font-bold text-muted-foreground uppercase font-display">
                    {data.firstName?.[0]}{data.lastName?.[0]}
                  </span>
                )}
              </div>
              <button 
                onClick={() => {
                  setPhotoUrl(data.photoPath || "");
                  setPhotoOpen(true);
                }}
                className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Camera className="h-5 w-5 text-white" />
              </button>
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
                Welcome back, {data.firstName || "Teacher"}!
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {data.qualification || "Faculty"} • Dept. of {data.department || "Education"}
              </p>
            </div>
          </div>
          <div className="flex gap-2 shrink-0">
            <Badge variant="outline" className="px-3 py-1 text-xs">
              ID: {data.employeeId}
            </Badge>
            <Badge variant="success" className="px-3 py-1 text-xs">
              Subject: {data.subject || "General"}
            </Badge>
          </div>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider block">Assigned Classes</span>
              <p className="text-2xl font-bold text-foreground">{data.assignedClassesCount ?? 0}</p>
              <span className="text-xs text-muted-foreground">Classrooms managed</span>
            </div>
            <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
              <GraduationCap className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider block">Total Students</span>
              <p className="text-2xl font-bold text-foreground">{data.totalStudents ?? 0}</p>
              <span className="text-xs text-muted-foreground">Active roll strength</span>
            </div>
            <div className="h-10 w-10 bg-success/10 rounded-lg flex items-center justify-center text-success">
              <User className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider block">Sessions Taken</span>
              <p className="text-2xl font-bold text-foreground">{data.classesConducted ?? 0}</p>
              <span className="text-xs text-muted-foreground">Attendance sessions logged</span>
            </div>
            <div className="h-10 w-10 bg-warning/10 rounded-lg flex items-center justify-center text-warning">
              <ClipboardCheck className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider block">Leave Balance</span>
              <p className="text-2xl font-bold text-foreground">
                {(leaveStats.casualTotal - leaveStats.casualSpent) + (leaveStats.sickTotal - leaveStats.sickSpent)} Days
              </p>
              <span className="text-xs text-muted-foreground">Paid leaves remaining</span>
            </div>
            <div className="h-10 w-10 bg-accent/10 rounded-lg flex items-center justify-center text-accent">
              <CalendarDays className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs Layout */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 max-w-xl bg-muted p-1">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="leaves">Leave Center</TabsTrigger>
          <TabsTrigger value="salary">Salary Details</TabsTrigger>
          <TabsTrigger value="profile">My Profile</TabsTrigger>
        </TabsList>

        {/* Tab 1: Overview */}
        <TabsContent value="overview" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <div>
                  <CardTitle className="text-sm font-semibold">Today's Class Schedule</CardTitle>
                  <CardDescription>Timetable slots mapped to assignments</CardDescription>
                </div>
                <Link to="/teacher/attendance">
                  <Button size="sm" variant="outline" className="text-xs">Take Attendance</Button>
                </Link>
              </CardHeader>
              <CardContent className="p-0">
                {timetable.length === 0 ? (
                  <div className="p-6 text-center text-sm text-muted-foreground">
                    No classes scheduled or assigned for today.
                  </div>
                ) : (
                  <div className="divide-y divide-border/60">
                    {timetable.map((item, idx) => (
                      <div key={idx} className="p-4 flex items-center justify-between hover:bg-muted/5">
                        <div className="space-y-1">
                          <p className="font-semibold text-foreground">{item.class}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" /> {item.time}
                            </span>
                            <span className="flex items-center gap-1">
                              <BookOpen className="h-3 w-3" /> {item.subject}
                            </span>
                          </div>
                        </div>
                        <Badge variant="secondary">Period {idx + 1}</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-semibold">Latest School Circulars</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {announcements.length === 0 ? (
                  <div className="p-6 text-center text-sm text-muted-foreground">
                    No recent circulars or announcements.
                  </div>
                ) : (
                  <div className="divide-y divide-border/60">
                    {announcements.map((item) => (
                      <div key={item.id} className="p-4 space-y-1 hover:bg-muted/5">
                        <p className="font-semibold text-xs text-foreground flex items-center gap-1">
                          <Bell className="h-3.5 w-3.5 text-warning shrink-0" />
                          {item.title}
                        </p>
                        <p className="text-[11px] text-muted-foreground line-clamp-2 pl-4.5">{item.description}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 2: Leave Management */}
        <TabsContent value="leaves" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Leave Balances Card */}
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle className="text-sm font-semibold">Leave Balances</CardTitle>
                <CardDescription>Available leave count for academic year</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b">
                  <div>
                    <span className="font-semibold block text-xs">Casual Leave</span>
                    <span className="text-[10px] text-muted-foreground">Spent: {leaveStats.casualSpent} of {leaveStats.casualTotal}</span>
                  </div>
                  <Badge variant="success">{leaveStats.casualTotal - leaveStats.casualSpent} Rem</Badge>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <div>
                    <span className="font-semibold block text-xs">Sick Leave</span>
                    <span className="text-[10px] text-muted-foreground">Spent: {leaveStats.sickSpent} of {leaveStats.sickTotal}</span>
                  </div>
                  <Badge variant="success">{leaveStats.sickTotal - leaveStats.sickSpent} Rem</Badge>
                </div>
                <div className="flex justify-between items-center py-2">
                  <div>
                    <span className="font-semibold block text-xs">Earned Leave</span>
                    <span className="text-[10px] text-muted-foreground">Spent: {leaveStats.earnedSpent} of {leaveStats.earnedTotal}</span>
                  </div>
                  <Badge variant="success">{leaveStats.earnedTotal - leaveStats.earnedSpent} Rem</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Apply Leave Form */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="text-sm font-semibold">Apply for Leave</CardTitle>
                <CardDescription>Submit formal request for administrative approval</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleApplyLeave} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label htmlFor="fromDate" className="text-xs">From Date</Label>
                      <Input
                        type="date"
                        id="fromDate"
                        value={fromDate}
                        onChange={(e) => setFromDate(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="toDate" className="text-xs">To Date</Label>
                      <Input
                        type="date"
                        id="toDate"
                        value={toDate}
                        onChange={(e) => setToDate(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="reason" className="text-xs">Reason</Label>
                    <Input
                      placeholder="Specify reason for leave request"
                      id="reason"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" disabled={applyLeaveMutation.isPending} className="w-full text-xs font-semibold">
                    {applyLeaveMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    Submit Application
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Leave Application History Tracker */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold">My Leave Applications</CardTitle>
              <CardDescription>Track status updates on submitted leave requests</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {leavesQuery.isLoading ? (
                <div className="p-6 text-center text-xs text-muted-foreground">Loading applications...</div>
              ) : leaves.length === 0 ? (
                <div className="p-6 text-center text-sm text-muted-foreground">No leave applications logged.</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>From Date</TableHead>
                      <TableHead>To Date</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead className="text-right">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {leaves.map((l) => (
                      <TableRow key={l.id}>
                        <TableCell className="text-xs font-mono">{l.fromDate}</TableCell>
                        <TableCell className="text-xs font-mono">{l.toDate}</TableCell>
                        <TableCell className="text-xs text-foreground font-medium">{l.reason}</TableCell>
                        <TableCell className="text-right">
                          <Badge variant={l.status === "APPROVED" ? "success" : l.status === "REJECTED" ? "destructive" : "secondary"}>
                            {l.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Salary Slip */}
        <TabsContent value="salary" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="text-sm font-semibold flex items-center gap-1.5">
                  <Receipt className="h-4 w-4 text-primary" />
                  Monthly Salary Statement
                </CardTitle>
                <CardDescription>Salary break-up details for the current pay period</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Basic Pay (Monthly)</span>
                  <span className="font-semibold font-mono">₹{sal.basic.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">House Rent Allowance (HRA - 10%)</span>
                  <span className="font-semibold font-mono text-success">+ ₹{sal.hra.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Dearness Allowance (DA - 5%)</span>
                  <span className="font-semibold font-mono text-success">+ ₹{sal.da.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Deductions (Provident Fund / Tax - 8%)</span>
                  <span className="font-semibold font-mono text-destructive">- ₹{sal.deductions.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-3 border-t-2 border-dashed font-display text-base font-bold">
                  <span>Net Salary Payable</span>
                  <span className="text-primary font-mono">₹{sal.net.toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-1 flex flex-col justify-between">
              <CardHeader>
                <CardTitle className="text-sm font-semibold">Payment Status</CardTitle>
                <CardDescription>Bank transaction logging</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 bg-success/10 rounded-lg flex items-center justify-between">
                  <span className="text-xs font-semibold text-success uppercase">Paid</span>
                  <Badge variant="success">Disbursed</Badge>
                </div>
                <div className="text-xs space-y-1 text-muted-foreground">
                  <p>Transaction ID: <span className="font-mono font-semibold text-foreground">TXN849182390</span></p>
                  <p>Settled On: <span className="font-semibold text-foreground">1st of Current Month</span></p>
                  <p>Mode: <span className="font-semibold text-foreground">Direct Bank Transfer (NEFT)</span></p>
                </div>
                <Button variant="outline" className="w-full text-xs font-semibold mt-4">
                  <FileText className="h-4 w-4 mr-2" /> Download Statement
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 4: My Profile */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Personal & Academic Records</CardTitle>
              <CardDescription>Faculty registration details</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div className="space-y-4">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Full Name:</span>
                  <span className="font-semibold text-foreground">{data.firstName} {data.lastName}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Primary Subject Specialization:</span>
                  <span className="font-semibold text-foreground">{data.subject || "General"}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Qualifications:</span>
                  <span className="font-semibold text-foreground">{data.qualification || "—"}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Experience:</span>
                  <span className="font-semibold text-foreground">{data.experience || "—"}</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Email Address:</span>
                  <span className="font-semibold text-foreground">{data.email || "—"}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Phone Number:</span>
                  <span className="font-semibold text-foreground">{data.phone || "—"}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Employment Status:</span>
                  <Badge variant="success">Active</Badge>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Employee ID / Username:</span>
                  <span className="font-mono font-semibold text-foreground">{data.employeeId}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Photo url upload dialog */}
      <Dialog open={photoOpen} onOpenChange={setPhotoOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Profile Photo</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-3">
            <Label htmlFor="url" className="text-xs">Image URL</Label>
            <Input
              placeholder="Paste absolute profile image URL..."
              id="url"
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPhotoOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdatePhoto} disabled={photoMutation.isPending}>
              {photoMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Save Photo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
