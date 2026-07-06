import React from "react";
import { useQuery } from "@tanstack/react-query";
import { studentPortalApi } from "@/api/studentPortal.api";
import { PageHeader } from "@/components/common/PageHeader";
import { LoadingBlock } from "@/components/common/LoadingBlock";
import { ErrorState } from "@/components/common/ErrorState";
import { EmptyState } from "@/components/common/EmptyState";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { CalendarCheck, CalendarDays, CheckCircle, AlertCircle, HelpCircle, FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export function StudentAttendance() {
  const attendanceQuery = useQuery({
    queryKey: ["student-attendance"],
    queryFn: studentPortalApi.getAttendance,
  });

  const dashboardQuery = useQuery({
    queryKey: ["student-dashboard-stats"],
    queryFn: studentPortalApi.getDashboard,
  });

  if (attendanceQuery.isLoading || dashboardQuery.isLoading) {
    return <LoadingBlock rows={8} />;
  }

  if (attendanceQuery.isError || dashboardQuery.isError) {
    return (
      <ErrorState
        message="Could not load attendance logs"
        onRetry={() => {
          attendanceQuery.refetch();
          dashboardQuery.refetch();
        }}
      />
    );
  }

  const logs = attendanceQuery.data ?? [];
  const dashboard = dashboardQuery.data ?? {};
  const stats = dashboard.attendance ?? { total: 0, present: 0, absent: 0, leave: 0, late: 0, percentage: 100 };

  if (logs.length === 0) {
    return (
      <div className="space-y-6">
        <PageHeader title="My Attendance" description="Track your attendance history and performance." />
        <EmptyState
          icon={CalendarCheck}
          title="No attendance logged"
          description="There are currently no attendance logs recorded for your profile."
        />
      </div>
    );
  }

  // Attendance Distribution for Pie Chart
  const pieData = [
    { name: "Present", value: stats.present, color: "hsl(var(--success, 142.1 76.2% 36.3%))" },
    { name: "Absent", value: stats.absent, color: "hsl(var(--destructive, 0 84.2% 60.2%))" },
    { name: "Leave", value: stats.leave, color: "hsl(var(--warning, 47.9 95.8% 53.1%))" },
    { name: "Late", value: stats.late, color: "hsl(var(--primary, 221.2 83.2% 53.3%))" },
  ].filter((d) => d.value > 0);

  // Group by Month for Bar Chart
  const monthlyMap = {};
  logs.forEach((log) => {
    if (log.attendanceDate) {
      const month = new Date(log.attendanceDate).toLocaleString("default", { month: "short", year: "numeric" });
      if (!monthlyMap[month]) monthlyMap[month] = { present: 0, total: 0 };
      monthlyMap[month].total++;
      if (log.status === "PRESENT" || log.status === "LATE") {
        monthlyMap[month].present++;
      }
    }
  });

  const barData = Object.entries(monthlyMap).map(([month, data]) => ({
    month,
    percentage: Math.round((data.present / data.total) * 100),
  }));

  const handleDownload = () => {
    // Generate CSV export
    const headers = "Date,Status,Remarks\n";
    const rows = logs
      .map((l) => `${l.attendanceDate},${l.status},"${l.remarks || ""}"`)
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `attendance_report_${new Date().getFullYear()}.csv`;
    link.click();
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "PRESENT":
        return <Badge variant="success">Present</Badge>;
      case "ABSENT":
        return <Badge variant="destructive">Absent</Badge>;
      case "LEAVE":
        return <Badge variant="warning">Leave</Badge>;
      case "LATE":
        return <Badge variant="default">Late</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Attendance"
        description="Track your attendance history and performance."
        actions={
          <Button onClick={handleDownload} variant="outline" className="flex items-center gap-1.5">
            <FileDown className="h-4 w-4" />
            Download CSV Report
          </Button>
        }
      />

      {/* Summary Scorecards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-6">
            <span className="text-xs text-muted-foreground uppercase font-semibold">Attendance Rate</span>
            <p className="text-3xl font-bold text-foreground mt-1">{stats.percentage ? Math.round(stats.percentage) : 100}%</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <span className="text-xs text-muted-foreground uppercase font-semibold">Present Days</span>
            <p className="text-3xl font-bold text-success mt-1">{stats.present}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <span className="text-xs text-muted-foreground uppercase font-semibold">Absent Days</span>
            <p className="text-3xl font-bold text-destructive mt-1">{stats.absent}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <span className="text-xs text-muted-foreground uppercase font-semibold">Approved Leaves</span>
            <p className="text-3xl font-bold text-warning mt-1">{stats.leave}</p>
          </CardContent>
        </Card>
        <Card className="col-span-2 md:col-span-1">
          <CardContent className="p-6">
            <span className="text-xs text-muted-foreground uppercase font-semibold">Late Arrivals</span>
            <p className="text-3xl font-bold text-primary mt-1">{stats.late || 0}</p>
          </CardContent>
        </Card>
      </div>

      {/* Analytics & Logs Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attendance table logs */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Detailed Attendance Log</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Remarks</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.map((log) => (
                    <TableRow key={log.id} className="hover:bg-muted/10 transition-colors">
                      <TableCell className="font-mono text-sm py-3.5">
                        {log.attendanceDate}
                      </TableCell>
                      <TableCell className="py-3.5">
                        {getStatusBadge(log.status)}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground py-3.5">
                        {log.remarks || "—"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Charts Side Panel */}
        <div className="space-y-6">
          {/* Pie Chart Card */}
          {pieData.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-semibold">Attendance Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="h-64 flex flex-col justify-between items-center relative">
                <ResponsiveContainer width="100%" height="80%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={70}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} Days`, "Count"]} />
                  </PieChart>
                </ResponsiveContainer>
                {/* Legend */}
                <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs">
                  {pieData.map((d) => (
                    <span key={d.name} className="flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: d.color }} />
                      {d.name}: {d.value}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Bar Chart Card */}
          {barData.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-semibold">Monthly Compliance Rate</CardTitle>
              </CardHeader>
              <CardContent className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                    <YAxis domain={[0, 100]} stroke="hsl(var(--muted-foreground))" fontSize={11} />
                    <Tooltip formatter={(value) => [`${value}%`, "Compliance"]} />
                    <Bar dataKey="percentage" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
