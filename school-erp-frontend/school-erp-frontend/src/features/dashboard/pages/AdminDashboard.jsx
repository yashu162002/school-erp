import React, { lazy, Suspense } from "react";
import { useQuery } from "@tanstack/react-query";
import { Users, UserRound, UsersRound, CalendarCheck, PhoneCall } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { adminDashboardApi } from "@/api/dashboard.api";
import { voiceCallsApi } from "@/api/voiceCalls.api";
import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { ErrorState } from "@/components/common/ErrorState";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const FeeManagementSection = lazy(() => import("@/features/fees/components/FeeManagementSection"));

export function AdminDashboard() {
  const stats = useQuery({
    queryKey: ["admin-dashboard-stats"],
    queryFn: adminDashboardApi.getStats,
  });

  const voiceStats = useQuery({
    queryKey: ["voice-call-stats"],
    queryFn: voiceCallsApi.getStats,
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

  return (
    <>
      <PageHeader title="Dashboard" description="Overview of your school." />

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

      <Card className="mt-6">
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

      <Card className="mt-6">
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
          <p className="mt-4 text-xs text-muted-foreground">
            Note: the backend currently returns fixed sample numbers here (VoiceCallController
            hasn't been wired to voice_call_logs yet), so these won't change between loads.
          </p>
        </CardContent>
      </Card>

      <Suspense fallback={<div className="h-64 mt-6 animate-pulse rounded-md bg-muted" />}>
        <FeeManagementSection isDashboard={true} />
      </Suspense>
    </>
  );
}
