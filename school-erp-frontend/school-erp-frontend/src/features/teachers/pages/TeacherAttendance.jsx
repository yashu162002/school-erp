import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { toast } from "sonner";
import { CalendarCheck, Search, Loader2, ClipboardCheck, Users, HelpCircle, Save } from "lucide-react";
import { teacherPortalApi } from "@/api/teacherPortal.api";
import { PageHeader } from "@/components/common/PageHeader";
import { LoadingBlock } from "@/components/common/LoadingBlock";
import { ErrorState } from "@/components/common/ErrorState";
import { EmptyState } from "@/components/common/EmptyState";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from "@/components/ui/table";
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from "@/components/ui/select";

const STATUSES = [
  { value: "PRESENT", label: "Present", color: "bg-success/10 text-success border-success/20 hover:bg-success/20" },
  { value: "ABSENT", label: "Absent", color: "bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/20" },
  { value: "LATE", label: "Late", color: "bg-warning/10 text-warning border-warning/20 hover:bg-warning/20" },
  { value: "HALF_DAY", label: "Half Day", color: "bg-accent/10 text-accent border-accent/20 hover:bg-accent/20" },
  { value: "LEAVE", label: "Leave", color: "bg-muted-foreground/10 text-muted-foreground border-muted-foreground/20 hover:bg-muted-foreground/20" },
];

export function TeacherAttendance() {
  const queryClient = useQueryClient();
  const todayStr = format(new Date(), "yyyy-MM-dd");

  // Filter States
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [searchQuery, setSearchQuery] = useState("");

  // Attendance local editing cache
  // maps studentId -> { status, remarks }
  const [attendanceCache, setAttendanceCache] = useState({});

  // 1. Fetch Teacher Classes
  const classesQuery = useQuery({
    queryKey: ["teacher-classes"],
    queryFn: teacherPortalApi.getAssignedClasses,
  });

  // 2. Fetch Teacher Subjects
  const subjectsQuery = useQuery({
    queryKey: ["teacher-subjects"],
    queryFn: teacherPortalApi.getAssignedSubjects,
  });

  // Auto select default class/section & subject
  useEffect(() => {
    if (classesQuery.data && classesQuery.data.length > 0 && !selectedClass) {
      const first = classesQuery.data[0];
      setSelectedClass(`${first.className}-${first.section}`);
    }
  }, [classesQuery.data]);

  useEffect(() => {
    if (subjectsQuery.data && subjectsQuery.data.length > 0 && !selectedSubject) {
      setSelectedSubject(subjectsQuery.data[0]);
    }
  }, [subjectsQuery.data]);

  // Parse Class / Section
  const [className, section] = selectedClass.split("-");

  // 3. Fetch Students for selected class
  const studentsQuery = useQuery({
    queryKey: ["teacher-students", className, section],
    queryFn: () => teacherPortalApi.getStudents(className, section),
    enabled: Boolean(className && section),
  });

  // 4. Fetch Existing Attendance Records for selected class/subject/date
  const existingAttendanceQuery = useQuery({
    queryKey: ["teacher-existing-attendance", className, section, selectedSubject, selectedDate],
    queryFn: () => teacherPortalApi.getAttendance(className, section, selectedSubject, selectedDate),
    enabled: Boolean(className && section && selectedSubject && selectedDate),
  });

  // Populate local attendance cache when students or existing attendance records load
  useEffect(() => {
    if (studentsQuery.data) {
      const initialCache = {};
      
      // Default to PRESENT for all students
      studentsQuery.data.forEach((s) => {
        initialCache[s.id] = { status: "PRESENT", remarks: "" };
      });

      // Override with existing records if they exist
      if (existingAttendanceQuery.data && existingAttendanceQuery.data.length > 0) {
        existingAttendanceQuery.data.forEach((record) => {
          if (record.student) {
            initialCache[record.student.id] = {
              status: record.status || "PRESENT",
              remarks: record.remarks || "",
            };
          }
        });
      }

      setAttendanceCache(initialCache);
    }
  }, [studentsQuery.data, existingAttendanceQuery.data]);

  // Bulk Submit Mutation
  const submitMutation = useMutation({
    mutationFn: ({ payload, subjectName }) => teacherPortalApi.submitAttendance(payload, subjectName),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teacher-existing-attendance"] });
      queryClient.invalidateQueries({ queryKey: ["teacher-dashboard"] });
      toast.success("Attendance saved successfully");
    },
    onError: (err) => {
      toast.error(err.message || "Couldn't save attendance records");
    },
  });

  const students = studentsQuery.data ?? [];
  const filteredStudents = searchQuery
    ? students.filter((s) =>
        `${s.firstName} ${s.lastName} ${s.studentId}`.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : students;

  // Handler to toggle individual status
  const handleStatusChange = (studentId, status) => {
    setAttendanceCache((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        status,
      },
    }));
  };

  // Handler to modify remarks
  const handleRemarksChange = (studentId, remarks) => {
    setAttendanceCache((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        remarks,
      },
    }));
  };

  // Bulk Mark All as Status
  const handleBulkMark = (status) => {
    setAttendanceCache((prev) => {
      const updated = { ...prev };
      Object.keys(updated).forEach((id) => {
        updated[id] = { ...updated[id], status };
      });
      return updated;
    });
    toast.info(`All students marked as ${status}`);
  };

  // Save / Submit Attendance Handler
  const handleSaveAttendance = () => {
    const payload = Object.keys(attendanceCache).map((id) => ({
      studentId: Number(id),
      attendanceDate: selectedDate,
      status: attendanceCache[id].status,
      remarks: attendanceCache[id].remarks,
    }));

    if (payload.length === 0) {
      toast.error("No students to submit attendance for.");
      return;
    }

    submitMutation.mutate({ payload, subjectName: selectedSubject });
  };

  return (
    <>
      <PageHeader
        title="Class Attendance"
        description="Mark subject-specific daily attendance for your assigned classes."
      />

      {/* Select filters card */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div>
          <label className="text-xs font-semibold text-muted-foreground uppercase block mb-1.5">Class & Section</label>
          <Select value={selectedClass} onValueChange={setSelectedClass}>
            <SelectTrigger className="bg-card">
              <SelectValue placeholder="Select Class" />
            </SelectTrigger>
            <SelectContent>
              {classesQuery.data?.map((cls, idx) => (
                <SelectItem key={idx} value={`${cls.className}-${cls.section}`}>
                  Class {cls.className}-{cls.section}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-xs font-semibold text-muted-foreground uppercase block mb-1.5">Subject</label>
          <Select value={selectedSubject} onValueChange={setSelectedSubject}>
            <SelectTrigger className="bg-card">
              <SelectValue placeholder="Select Subject" />
            </SelectTrigger>
            <SelectContent>
              {subjectsQuery.data?.map((subj, idx) => (
                <SelectItem key={idx} value={subj}>
                  {subj}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-xs font-semibold text-muted-foreground uppercase block mb-1.5">Date</label>
          <Input
            type="date"
            className="bg-card"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>

        <div className="flex flex-col justify-end">
          <label className="text-xs font-semibold text-muted-foreground uppercase block mb-1.5">Quick Actions</label>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => handleBulkMark("PRESENT")} className="flex-1 text-xs">
              All Present
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleBulkMark("ABSENT")} className="flex-1 text-xs text-destructive">
              All Absent
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                Roll List (Class {selectedClass || "—"} • {selectedSubject || "—"})
              </CardTitle>
              <CardDescription>
                Mark presence rates for {selectedDate}. Changes synchronize immediately in admin records.
              </CardDescription>
            </div>
            <div className="relative max-w-xs w-full md:w-64">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search student roll list…"
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent>
            {studentsQuery.isLoading || existingAttendanceQuery.isLoading ? (
              <LoadingBlock rows={6} />
            ) : studentsQuery.isError ? (
              <ErrorState message={studentsQuery.error?.message} onRetry={studentsQuery.refetch} />
            ) : filteredStudents.length === 0 ? (
              <EmptyState icon={CalendarCheck} title="No students found matching filters" />
            ) : (
              <div className="space-y-4">
                <div className="rounded-lg border border-border overflow-x-auto bg-card">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-16">Roll ID</TableHead>
                        <TableHead>Student Name</TableHead>
                        <TableHead>Status Toggles</TableHead>
                        <TableHead>Remarks</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredStudents.map((s) => {
                        const currentVal = attendanceCache[s.id] ?? { status: "PRESENT", remarks: "" };
                        
                        return (
                          <TableRow key={s.id} className="hover:bg-muted/5 transition-colors">
                            <TableCell className="font-mono text-xs text-muted-foreground">
                              {s.studentId}
                            </TableCell>
                            <TableCell className="font-semibold text-foreground">
                              <div className="flex items-center gap-2">
                                <div className="h-8 w-8 rounded-full overflow-hidden border bg-muted flex items-center justify-center shrink-0">
                                  {s.photoPath ? (
                                    <img src={s.photoPath} alt="" className="h-full w-full object-cover" />
                                  ) : (
                                    <span className="text-[10px] font-bold text-muted-foreground uppercase">
                                      {s.firstName?.[0]}{s.lastName?.[0]}
                                    </span>
                                  )}
                                </div>
                                <span>{s.firstName} {s.lastName}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1">
                                {STATUSES.map((st) => {
                                  const isActive = currentVal.status === st.value;
                                  return (
                                    <Button
                                      key={st.value}
                                      variant={isActive ? "default" : "outline"}
                                      size="sm"
                                      className={`h-7 px-2.5 text-[11px] font-semibold transition-all ${
                                        isActive ? "" : "text-muted-foreground border-border hover:bg-muted"
                                      }`}
                                      onClick={() => handleStatusChange(s.id, st.value)}
                                    >
                                      {st.label}
                                    </Button>
                                  );
                                })}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Input
                                placeholder="Remarks (optional)"
                                className="h-8 text-xs bg-background max-w-[200px]"
                                value={currentVal.remarks}
                                onChange={(e) => handleRemarksChange(s.id, e.target.value)}
                              />
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>

                <div className="flex justify-end pt-2">
                  <Button
                    size="default"
                    onClick={handleSaveAttendance}
                    disabled={submitMutation.isPending}
                    className="gap-2 font-semibold shadow-sm"
                  >
                    {submitMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    Save & Submit Attendance
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
