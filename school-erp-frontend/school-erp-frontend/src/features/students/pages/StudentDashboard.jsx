import React from "react";
import { useQuery } from "@tanstack/react-query";
import { studentPortalApi } from "@/api/studentPortal.api";
import { PageHeader } from "@/components/common/PageHeader";
import { LoadingBlock } from "@/components/common/LoadingBlock";
import { ErrorState } from "@/components/common/ErrorState";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, AreaChart, Area 
} from "recharts";
import { 
  Calendar, Clock, Landmark, DollarSign, Award, Bell, 
  Gift, MapPin, User, ChevronRight, BookOpen, CheckCircle 
} from "lucide-react";
import { Link } from "react-router-dom";

export function StudentDashboard() {
  const dashboardQuery = useQuery({
    queryKey: ["student-dashboard"],
    queryFn: studentPortalApi.getDashboard,
  });

  if (dashboardQuery.isLoading) {
    return <LoadingBlock rows={10} />;
  }

  if (dashboardQuery.isError) {
    return (
      <ErrorState
        message={dashboardQuery.error?.message || "Could not load dashboard data"}
        onRetry={dashboardQuery.refetch}
      />
    );
  }

  const data = dashboardQuery.data ?? {};
  const attendance = data.attendance ?? { total: 0, present: 0, absent: 0, percentage: 100 };
  const fees = data.fees ?? { total: 0, paid: 0, pending: 0, dueDate: null };
  const announcements = data.announcements ?? [];
  const upcomingExams = data.upcomingExams ?? [];
  const teachers = data.teachers ?? [];

  // Generate some sample data for charts
  const performanceTrend = [
    { name: "Unit Test 1", score: 82 },
    { name: "Mid Term", score: 85 },
    { name: "Unit Test 2", score: 89 },
    { name: "Final Exam", score: 92 },
  ];

  const attendanceTrend = [
    { name: "Jan", present: 20, absent: 2 },
    { name: "Feb", present: 22, absent: 0 },
    { name: "Mar", present: 19, absent: 3 },
    { name: "Apr", present: 21, absent: 1 },
    { name: "May", present: 22, absent: 0 },
  ];

  return (
    <div className="space-y-6">
      {/* Birthday Greetings Banner */}
      {data.isBirthday && (
        <div className="relative overflow-hidden rounded-xl border border-warning/30 bg-gradient-to-r from-warning/20 via-warning/10 to-background p-6 flex items-center justify-between gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="space-y-1">
            <h2 className="text-xl font-bold flex items-center gap-2 text-warning-foreground">
              <Gift className="h-5 w-5 text-warning animate-bounce" />
              Happy Birthday, {data.firstName}! 🎂
            </h2>
            <p className="text-sm text-muted-foreground">
              Trishul High School, Davangere wishes you an amazing year ahead filled with joy and success! Enjoy your special day!
            </p>
          </div>
          <div className="text-3xl shrink-0 hidden md:block">🎉🎈</div>
        </div>
      )}

      {/* Greeting Header */}
      <div className="relative overflow-hidden rounded-xl border border-border bg-gradient-to-r from-primary/10 via-background to-background p-6 md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
              Welcome back, {data.firstName || "Student"}!
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Here's your academic summary for Class {data.className || "—"} ({data.section || "—"}).
            </p>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className="px-3 py-1 text-xs">
              ID: {data.studentId}
            </Badge>
            <Badge variant="outline" className="px-3 py-1 text-xs">
              Rank: #{data.currentRank || "—"}
            </Badge>
          </div>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Attendance Card */}
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider block">Attendance Rate</span>
              <p className="text-2xl font-bold text-foreground">{Math.round(attendance.percentage)}%</p>
              <span className="text-xs text-success">{attendance.present} Present</span>
            </div>
            <div className="h-10 w-10 bg-success/10 rounded-lg flex items-center justify-center text-success">
              <Calendar className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        {/* GPA Card */}
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider block">Cumulative GPA</span>
              <p className="text-2xl font-bold text-foreground">{data.currentGpa ? data.currentGpa.toFixed(2) : "0.00"}</p>
              <span className="text-xs text-muted-foreground">Class Rank: #{data.currentRank || "—"}</span>
            </div>
            <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
              <Award className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        {/* Fee Status Card */}
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider block">Pending Fees</span>
              <p className="text-2xl font-bold text-foreground">${fees.pending.toFixed(2)}</p>
              <span className="text-xs text-muted-foreground">
                {fees.dueDate ? `Due: ${fees.dueDate}` : "No pending dues"}
              </span>
            </div>
            <div className="h-10 w-10 bg-destructive/10 rounded-lg flex items-center justify-center text-destructive">
              <DollarSign className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        {/* Exams Card */}
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider block">Exam Timetable</span>
              <p className="text-2xl font-bold text-foreground">{upcomingExams.length}</p>
              <span className="text-xs text-muted-foreground">Scheduled Subjects</span>
            </div>
            <div className="h-10 w-10 bg-warning/10 rounded-lg flex items-center justify-center text-warning">
              <BookOpen className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Charts and Timetables */}
        <div className="lg:col-span-2 space-y-6">
          {/* Performance Trends Chart */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-semibold">Academic Progression</CardTitle>
              <span className="text-xs text-muted-foreground">Recent Exams</span>
            </CardHeader>
            <CardContent className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={performanceTrend} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorGpa" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <YAxis domain={[50, 100]} stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <Tooltip formatter={(value) => [`${value}%`, "Score"]} />
                  <Area type="monotone" dataKey="score" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorGpa)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Exam Schedule / Timetable Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-semibold">Upcoming Exam Timetable</CardTitle>
              <Link to="/student/timetable" className="text-xs text-primary hover:underline flex items-center">
                View Full <ChevronRight className="h-3 w-3" />
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              {upcomingExams.length === 0 ? (
                <div className="p-6 text-center text-sm text-muted-foreground">
                  No upcoming examinations scheduled.
                </div>
              ) : (
                <div className="divide-y divide-border/60">
                  {upcomingExams.slice(0, 3).map((item) => (
                    <div key={item.id} className="p-4 flex items-center justify-between hover:bg-muted/5">
                      <div className="space-y-1">
                        <p className="font-semibold text-foreground">{item.subjectName}</p>
                        <div className="flex flex-wrap gap-x-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" /> {item.examDate}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" /> {item.startTime} - {item.endTime}
                          </span>
                        </div>
                      </div>
                      <Badge variant="outline">Room {item.roomNumber || "—"}</Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Notices, Quick Links, Teachers */}
        <div className="space-y-6">
          {/* Announcements Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-semibold">Latest Circulars</CardTitle>
              <Link to="/student/notifications" className="text-xs text-primary hover:underline flex items-center">
                All Alerts <ChevronRight className="h-3 w-3" />
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              {announcements.length === 0 ? (
                <div className="p-6 text-center text-sm text-muted-foreground">
                  No recent circulars or announcements.
                </div>
              ) : (
                <div className="divide-y divide-border/60">
                  {announcements.slice(0, 3).map((item) => (
                    <div key={item.id} className="p-4 space-y-1 hover:bg-muted/5">
                      <p className="font-semibold text-sm text-foreground">{item.title}</p>
                      <p className="text-xs text-muted-foreground line-clamp-2">{item.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Links Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-2">
              <Link to="/student/hall-ticket" className="w-full">
                <Button variant="outline" className="w-full justify-start text-xs h-9">
                  <Landmark className="h-3.5 w-3.5 mr-2" /> Hall Ticket
                </Button>
              </Link>
              <Link to="/student/results" className="w-full">
                <Button variant="outline" className="w-full justify-start text-xs h-9">
                  <Award className="h-3.5 w-3.5 mr-2" /> Exam Results
                </Button>
              </Link>
              <Link to="/student/fees" className="w-full">
                <Button variant="outline" className="w-full justify-start text-xs h-9">
                  <DollarSign className="h-3.5 w-3.5 mr-2" /> Fee Portal
                </Button>
              </Link>
              <Link to="/student/documents" className="w-full">
                <Button variant="outline" className="w-full justify-start text-xs h-9">
                  <BookOpen className="h-3.5 w-3.5 mr-2" /> Documents
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Assigned Teachers Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Teacher Information</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {teachers.length === 0 ? (
                <div className="p-6 text-center text-sm text-muted-foreground">
                  No teacher assignments found.
                </div>
              ) : (
                <div className="divide-y divide-border/60">
                  {teachers.map((t) => (
                    <div key={t.id} className="p-4 flex items-center gap-3 hover:bg-muted/5">
                      <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                        <User className="h-4 w-4" />
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-sm font-semibold text-foreground">{t.firstName} {t.lastName}</p>
                        <p className="text-xs text-muted-foreground">{t.subjectSpecialization || "Class Teacher"}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}