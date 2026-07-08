import React, { lazy, Suspense, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Users, UserRound, UsersRound, CalendarCheck, PhoneCall, BarChart2, AlertCircle, Bookmark, Compass } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from "recharts";
import { adminDashboardApi } from "@/api/dashboard.api";
import { voiceCallsApi } from "@/api/voiceCalls.api";
import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { ErrorState } from "@/components/common/ErrorState";
import { LoadingBlock } from "@/components/common/LoadingBlock";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

const FeeManagementSection = lazy(() => import("@/features/fees/components/FeeManagementSection"));

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  const stats = useQuery({
    queryKey: ["admin-dashboard-stats"],
    queryFn: adminDashboardApi.getStats,
  });

  const voiceStats = useQuery({
    queryKey: ["voice-call-stats"],
    queryFn: voiceCallsApi.getStats,
  });

  const attendanceDashboard = useQuery({
    queryKey: ["admin-attendance-stats"],
    queryFn: adminDashboardApi.getAttendanceStats,
    enabled: activeTab === "attendance",
  });

  const chartData = stats.data
    ? [
        { name: "Students", value: stats.data.totalStudents ?? 0 },
        { name: "Teachers", value: stats.data.totalTeachers ?? 0 },
        { name: "Parents", value: stats.data.totalParents ?? 0 },
      ]
    : [];

  if (stats.isError) {
    return (
      <>
        <PageHeader title="Dashboard" description="Overview of your school." />
        <ErrorState message={stats.error?.message} onRetry={stats.refetch} />
      </>
    );
  }

  const att = attendanceDashboard.data ?? {};
  const daily = att.dailyAttendance ?? { total: 0, present: 0, absent: 0, late: 0, leave: 0, rate: 100 };
  
  const dailyPieData = [
    { name: "Present", value: daily.present, color: "hsl(var(--success))" },
    { name: "Absent", value: daily.absent, color: "hsl(var(--destructive))" },
    { name: "Late", value: daily.late, color: "hsl(var(--warning))" },
    { name: "Leave", value: daily.leave, color: "hsl(var(--muted-foreground))" },
  ].filter(d => d.value > 0);

  return (
    <>
      <PageHeader title="Dashboard" description="Enterprise School ERP administration controls." />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="overview">General Overview</TabsTrigger>
          <TabsTrigger value="attendance">Attendance Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="Students"
              value={stats.data?.totalStudents ?? "—"}
              icon={Users}
              isLoading={stats.isLoading}
            />
            <StatCard
              label="Teachers"
              value={stats.data?.totalTeachers ?? "—"}
              icon={UserRound}
              isLoading={stats.isLoading}
              accent="accent"
            />
            <StatCard
              label="Parents"
              value={stats.data?.totalParents ?? "—"}
              icon={UsersRound}
              isLoading={stats.isLoading}
              accent="success"
            />
            <StatCard
              label="Attendance records"
              value={stats.data?.totalAttendance ?? "—"}
              icon={CalendarCheck}
              isLoading={stats.isLoading}
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>People at a glance</CardTitle>
            </CardHeader>
            <CardContent>
              {stats.isLoading ? (
                <div className="h-64 animate-pulse rounded-md bg-muted" />
              ) : (
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={chartData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                    <XAxis dataKey="name" tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }} axisLine={false} tickLine={false} allowDecimals={false} />
                    <Tooltip
                      contentStyle={{
                        background: "var(--color-surface)",
                        border: "1px solid var(--color-border)",
                        borderRadius: 8,
                        fontSize: 13,
                      }}
                    />
                    <Bar dataKey="value" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <CardTitle className="flex items-center gap-2">
                <PhoneCall className="h-4 w-4 text-muted-foreground" />
                Voice call activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div>
                  <p className="text-xs text-muted-foreground">Calls today</p>
                  <p className="font-display text-lg font-semibold">
                    {voiceStats.isLoading ? "…" : voiceStats.data?.totalCallsToday ?? "—"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Successful</p>
                  <p className="font-display text-lg font-semibold text-success">
                    {voiceStats.isLoading ? "…" : voiceStats.data?.successfulCalls ?? "—"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Failed</p>
                  <p className="font-display text-lg font-semibold text-destructive">
                    {voiceStats.isLoading ? "…" : voiceStats.data?.failedCalls ?? "—"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Scheduled</p>
                  <p className="font-display text-lg font-semibold">
                    {voiceStats.isLoading ? "…" : voiceStats.data?.scheduledCalls ?? "—"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Suspense fallback={<div className="h-64 mt-6 animate-pulse rounded-md bg-muted" />}>
            <FeeManagementSection isDashboard={true} />
          </Suspense>
        </TabsContent>

        <TabsContent value="attendance" className="space-y-6">
          {attendanceDashboard.isLoading ? (
            <LoadingBlock rows={8} />
          ) : attendanceDashboard.isError ? (
            <ErrorState message={attendanceDashboard.error?.message} onRetry={attendanceDashboard.refetch} />
          ) : (
            <div className="space-y-6">
              {/* Daily attendance summary card */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-1">
                  <CardHeader>
                    <CardTitle className="text-sm font-semibold">Today's Presence</CardTitle>
                    <CardDescription>Records marked for {daily.date}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center justify-center">
                    {dailyPieData.length === 0 ? (
                      <div className="py-8 text-center text-xs text-muted-foreground">
                        No attendance sessions marked today.
                      </div>
                    ) : (
                      <>
                        <div className="h-44 w-full relative">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={dailyPieData}
                                cx="50%"
                                cy="50%"
                                innerRadius={55}
                                outerRadius={70}
                                paddingAngle={3}
                                dataKey="value"
                              >
                                {dailyPieData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Pie>
                            </PieChart>
                          </ResponsiveContainer>
                          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                            <span className="text-2xl font-bold">{Math.round(daily.rate)}%</span>
                            <span className="text-[10px] text-muted-foreground uppercase font-semibold">Presence Rate</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-x-6 gap-y-2 mt-4 text-xs w-full px-2">
                          <div className="flex items-center gap-1.5">
                            <span className="h-2 w-2 rounded-full bg-success shrink-0" />
                            <span className="text-muted-foreground">Present:</span>
                            <span className="font-bold ml-auto">{daily.present}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="h-2 w-2 rounded-full bg-destructive shrink-0" />
                            <span className="text-muted-foreground">Absent:</span>
                            <span className="font-bold ml-auto">{daily.absent}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="h-2 w-2 rounded-full bg-warning shrink-0" />
                            <span className="text-muted-foreground">Late:</span>
                            <span className="font-bold ml-auto">{daily.late}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="h-2 w-2 rounded-full bg-muted-foreground shrink-0" />
                            <span className="text-muted-foreground">Leave:</span>
                            <span className="font-bold ml-auto">{daily.leave}</span>
                          </div>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>

                {/* Class-wise progress */}
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle className="text-sm font-semibold">Class-wise Attendance Averages</CardTitle>
                    <CardDescription>Aggregate student presence by level</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[220px]">
                    {att.classWise?.length === 0 ? (
                      <div className="py-8 text-center text-xs text-muted-foreground">No class averages available.</div>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={att.classWise} layout="vertical" margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--color-border)" />
                          <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} />
                          <YAxis dataKey="className" type="category" tick={{ fontSize: 11 }} />
                          <Tooltip formatter={(value) => [`${value}%`, "Attendance"]} />
                          <Bar dataKey="percentage" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} barSize={12} />
                        </BarChart>
                      </ResponsiveContainer>
                    )}
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Subject-wise averages */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-semibold">Subject-wise Performance</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 max-h-[300px] overflow-y-auto">
                    {att.subjectWise?.length === 0 ? (
                      <div className="py-8 text-center text-xs text-muted-foreground">No subject-wise records available.</div>
                    ) : (
                      att.subjectWise?.map((sub) => (
                        <div key={sub.subjectName} className="space-y-1">
                          <div className="flex justify-between text-xs font-semibold">
                            <span>{sub.subjectName}</span>
                            <span>{sub.percentage}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary transition-all duration-300"
                              style={{ width: `${sub.percentage}%` }}
                            />
                          </div>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>

                {/* Teacher sessions counts */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-semibold">Teacher Attendance Log Activity</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 max-h-[300px] overflow-y-auto">
                    {att.teacherWise?.length === 0 ? (
                      <div className="py-8 text-center text-xs text-muted-foreground">No teacher statistics available.</div>
                    ) : (
                      att.teacherWise?.map((tch) => (
                        <div key={tch.employeeId} className="flex items-center justify-between py-2 border-b last:border-0 text-xs">
                          <div>
                            <span className="font-semibold block">{tch.teacherName}</span>
                            <span className="text-[10px] text-muted-foreground uppercase font-mono">{tch.employeeId}</span>
                          </div>
                          <div className="text-right">
                            <span className="font-bold block">{tch.percentage}% Presence</span>
                            <Badge variant="outline" className="text-[9px] mt-0.5">{tch.sessionsCount} Sessions taken</Badge>
                          </div>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Low Attendance Alert */}
              <Card className="border-destructive/30 bg-destructive/5">
                <CardHeader className="flex-row items-center gap-2 space-y-0">
                  <AlertCircle className="h-5 w-5 text-destructive" />
                  <div>
                    <CardTitle className="text-sm font-bold text-destructive">Attendance Alert (Below 75%)</CardTitle>
                    <CardDescription className="text-destructive/80 text-[11px]">Students requiring intervention due to low attendance rates</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  {att.lowAttendanceAlerts?.length === 0 ? (
                    <div className="py-4 text-center text-xs text-success font-semibold">All students satisfy the 75% minimum attendance rate.</div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {att.lowAttendanceAlerts?.map((stu) => (
                        <div key={stu.studentId} className="p-3 border border-destructive/20 bg-background rounded-lg flex justify-between items-center text-xs">
                          <div>
                            <span className="font-semibold block">{stu.name}</span>
                            <span className="text-muted-foreground block text-[10px]">Class {stu.className}-{stu.section}</span>
                          </div>
                          <Badge variant="destructive" className="font-bold">{stu.percentage}%</Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </>
  );
}
