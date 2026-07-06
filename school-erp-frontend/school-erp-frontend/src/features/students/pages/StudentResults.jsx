import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { studentPortalApi } from "@/api/studentPortal.api";
import { PageHeader } from "@/components/common/PageHeader";
import { LoadingBlock } from "@/components/common/LoadingBlock";
import { ErrorState } from "@/components/common/ErrorState";
import { EmptyState } from "@/components/common/EmptyState";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, 
  CartesianGrid, Tooltip, BarChart, Bar 
} from "recharts";
import { Printer, ClipboardList, Award, TrendingUp, Landmark } from "lucide-react";

export function StudentResults() {
  const [selectedExamId, setSelectedExamId] = useState("all");

  const resultsQuery = useQuery({
    queryKey: ["student-results"],
    queryFn: studentPortalApi.getResults,
  });

  const profileQuery = useQuery({
    queryKey: ["student-profile"],
    queryFn: studentPortalApi.getProfile,
  });

  if (resultsQuery.isLoading || profileQuery.isLoading) {
    return <LoadingBlock rows={8} />;
  }

  if (resultsQuery.isError || profileQuery.isError) {
    return (
      <ErrorState
        message="Could not load exam results"
        onRetry={() => {
          resultsQuery.refetch();
          profileQuery.refetch();
        }}
      />
    );
  }

  const results = resultsQuery.data ?? [];
  const student = profileQuery.data;

  if (results.length === 0) {
    return (
      <div className="space-y-6">
        <PageHeader title="My Results" description="View and print your subject-wise marks and grades." />
        <EmptyState
          icon={ClipboardList}
          title="No results published"
          description="You currently have no published results. Results will show up once exams are finished and graded."
        />
      </div>
    );
  }

  // Get distinct exams
  const examsMap = {};
  results.forEach((r) => {
    if (r.exam) {
      examsMap[r.exam.id] = r.exam;
    }
  });
  const exams = Object.values(examsMap);

  // Filter results
  const filteredResults = selectedExamId === "all"
    ? results
    : results.filter((r) => r.exam?.id === Number(selectedExamId));

  // If viewing a single exam, compute totals
  const isSingleExam = selectedExamId !== "all" && examsMap[selectedExamId];
  let totalObtained = 0;
  let totalMax = 0;
  let averagePercentage = 0;
  let computedGrade = "A";

  if (isSingleExam) {
    filteredResults.forEach((r) => {
      totalObtained += r.marksObtained ?? 0;
      totalMax += r.maxMarks ?? 100;
    });
    averagePercentage = totalMax > 0 ? (totalObtained / totalMax) * 100 : 0;

    if (averagePercentage >= 90) computedGrade = "A+";
    else if (averagePercentage >= 80) computedGrade = "A";
    else if (averagePercentage >= 70) computedGrade = "B";
    else if (averagePercentage >= 60) computedGrade = "C";
    else if (averagePercentage >= 50) computedGrade = "D";
    else computedGrade = "F";
  }

  // Group performance for charts
  // Chart 1: Subject-wise marks for the selected exam
  const chartData = filteredResults.map((r) => ({
    subject: r.subject?.subjectName || "Subject",
    marks: r.marksObtained,
    max: r.maxMarks,
    percentage: r.percentage || ((r.marksObtained / r.maxMarks) * 100),
  }));

  // Chart 2: Historical exam percentage trend
  const historicalData = exams.map((ex) => {
    const examResults = results.filter((r) => r.exam?.id === ex.id);
    let obtained = 0;
    let max = 0;
    examResults.forEach((r) => {
      obtained += r.marksObtained ?? 0;
      max += r.maxMarks ?? 100;
    });
    return {
      name: ex.examName,
      percentage: max > 0 ? Math.round((obtained / max) * 100) : 0,
    };
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Results"
        description="View and print your subject-wise marks and grades."
        actions={
          <div className="flex gap-2">
            <Select value={selectedExamId} onValueChange={setSelectedExamId}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Exam" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Exams</SelectItem>
                {exams.map((ex) => (
                  <SelectItem key={ex.id} value={ex.id.toString()}>{ex.examName}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handlePrint} variant="outline" className="flex items-center gap-1.5">
              <Printer className="h-4 w-4" />
              Print Marksheet
            </Button>
          </div>
        }
      />

      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body * {
            visibility: hidden;
          }
          #print-marksheet, #print-marksheet * {
            visibility: visible;
          }
          #print-marksheet {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            border: none;
            box-shadow: none;
            padding: 0;
            margin: 0;
          }
          .no-print {
            display: none !important;
          }
        }
      `}} />

      {/* Grid of Summary Stats if single exam selected */}
      {isSingleExam && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6 flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">Aggregate Marks</span>
                <span className="text-2xl font-bold text-foreground">{totalObtained.toFixed(1)} / {totalMax.toFixed(0)}</span>
              </div>
              <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                <ClipboardList className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">Percentage</span>
                <span className="text-2xl font-bold text-foreground">{averagePercentage.toFixed(1)}%</span>
              </div>
              <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                <TrendingUp className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">Grade Achieved</span>
                <span className="text-2xl font-bold text-foreground">{computedGrade}</span>
              </div>
              <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                <Award className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">Rank / Class Rank</span>
                <span className="text-2xl font-bold text-foreground">{student.currentRank ? `#${student.currentRank}` : "—"}</span>
              </div>
              <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                <Award className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Results Marksheet card */}
        <div className="lg:col-span-2 space-y-6">
          <Card id="print-marksheet" className="border border-border shadow-md overflow-hidden bg-background">
            <div className="border-b border-border bg-muted/20 p-6 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Landmark className="h-6 w-6 text-primary shrink-0" />
                <div>
                  <h3 className="text-base font-bold tracking-tight text-foreground uppercase">TRISHUL HIGH SCHOOL, DAVANGERE</h3>
                  <p className="text-xs text-muted-foreground">Class Report & Marksheet</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-sm font-semibold text-foreground">
                  {selectedExamId === "all" ? "Cumulative Results" : examsMap[selectedExamId]?.examName}
                </span>
                <p className="text-xs text-muted-foreground mt-0.5">Student ID: {student.studentId}</p>
              </div>
            </div>

            <CardContent className="p-6">
              {/* Student Header */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs py-4 border-b border-border/60 mb-6">
                <div>
                  <span className="text-muted-foreground block">Student Name</span>
                  <span className="font-semibold text-foreground">{student.firstName} {student.lastName}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block">Class / Section</span>
                  <span className="font-semibold text-foreground">{student.className} - {student.section}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block">Admission No</span>
                  <span className="font-semibold text-foreground">{student.admissionNo}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block">Roll Number</span>
                  <span className="font-semibold text-foreground">{student.rollNo || "—"}</span>
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Subject</TableHead>
                    <TableHead>Marks Obtained</TableHead>
                    <TableHead>Max Marks</TableHead>
                    <TableHead>Percentage</TableHead>
                    <TableHead>Grade</TableHead>
                    <TableHead>Remarks</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredResults.map((r) => {
                    const pct = r.percentage || ((r.marksObtained / r.maxMarks) * 100);
                    return (
                      <TableRow key={r.id}>
                        <td className="font-medium text-foreground py-3">{r.subject?.subjectName}</td>
                        <td className="py-3">{r.marksObtained}</td>
                        <td className="py-3">{r.maxMarks}</td>
                        <td className="py-3 font-semibold">{Math.round(pct)}%</td>
                        <td className="py-3">
                          <span className="px-2 py-0.5 rounded text-xs font-semibold bg-primary/10 text-primary">
                            {r.grade || (pct >= 90 ? "A+" : pct >= 80 ? "A" : pct >= 70 ? "B" : "C")}
                          </span>
                        </td>
                        <td className="text-xs text-muted-foreground py-3">
                          {pct >= 50 ? "Satisfactory Pass" : "Needs Improvement"}
                        </td>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Charts & Analytics */}
        <div className="space-y-6">
          {/* Performance Chart card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Subject-wise Performance</CardTitle>
            </CardHeader>
            <CardContent className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="subject" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <YAxis domain={[0, 100]} stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <Tooltip formatter={(value) => [`${Math.round(value)}%`, "Percentage"]} />
                  <Bar dataKey="percentage" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Historical progress card */}
          {historicalData.length > 1 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-semibold">Academic Progress Trend</CardTitle>
              </CardHeader>
              <CardContent className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={historicalData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorPct" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                    <YAxis domain={[0, 100]} stroke="hsl(var(--muted-foreground))" fontSize={11} />
                    <Tooltip formatter={(value) => [`${value}%`, "Aggregate"]} />
                    <Area type="monotone" dataKey="percentage" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorPct)" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
