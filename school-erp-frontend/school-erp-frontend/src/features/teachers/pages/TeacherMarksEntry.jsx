import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ClipboardCheck, Search, Loader2, Save, Users, Award, Percent } from "lucide-react";
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

export function TeacherMarksEntry() {
  const queryClient = useQueryClient();

  // Filter States
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedExamId, setSelectedExamId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Global bulk controls
  const [globalMaxMarks, setGlobalMaxMarks] = useState("100");

  // Local editing cache
  // maps studentId -> { marksObtained, maxMarks, grade }
  const [marksCache, setMarksCache] = useState({});

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

  // 3. Fetch Published Exams
  const examsQuery = useQuery({
    queryKey: ["teacher-exams"],
    queryFn: teacherPortalApi.getPublishedExams,
  });

  // Auto select default filters
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

  useEffect(() => {
    if (examsQuery.data && examsQuery.data.length > 0 && !selectedExamId) {
      setSelectedExamId(String(examsQuery.data[0].id));
    }
  }, [examsQuery.data]);

  // Parse Class / Section
  const [className, section] = selectedClass.split("-");

  // 4. Fetch Students
  const studentsQuery = useQuery({
    queryKey: ["teacher-students-marks", className, section],
    queryFn: () => teacherPortalApi.getStudents(className, section),
    enabled: Boolean(className && section),
  });

  // 5. Fetch Existing Marks Records
  const existingResultsQuery = useQuery({
    queryKey: ["teacher-existing-results", selectedExamId, selectedSubject, className, section],
    queryFn: () => teacherPortalApi.getResults(selectedExamId, selectedSubject, className, section),
    enabled: Boolean(selectedExamId && selectedSubject && className && section),
  });

  // Populate local marks cache
  useEffect(() => {
    if (studentsQuery.data) {
      const initialCache = {};
      
      // Default to 0 marks obtained, max marks 100
      studentsQuery.data.forEach((s) => {
        initialCache[s.id] = { marksObtained: "0", maxMarks: globalMaxMarks || "100", grade: "F" };
      });

      // Override with existing marks if they exist
      if (existingResultsQuery.data && existingResultsQuery.data.length > 0) {
        existingResultsQuery.data.forEach((record) => {
          if (record.student) {
            initialCache[record.student.id] = {
              marksObtained: String(record.marksObtained ?? 0),
              maxMarks: String(record.maxMarks ?? 100),
              grade: record.grade || "F",
            };
          }
        });
      }

      setMarksCache(initialCache);
    }
  }, [studentsQuery.data, existingResultsQuery.data]);

  // Save/Submit Marks Mutation
  const submitMutation = useMutation({
    mutationFn: ({ examId, subjectName, className, section, payload }) =>
      teacherPortalApi.submitResults(examId, subjectName, className, section, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teacher-existing-results"] });
      toast.success("Exam marks saved and published successfully");
    },
    onError: (err) => {
      toast.error(err.message || "Couldn't save exam marks");
    },
  });

  const students = studentsQuery.data ?? [];
  const filteredStudents = searchQuery
    ? students.filter((s) =>
        `${s.firstName} ${s.lastName} ${s.studentId}`.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : students;

  // Handler to modify student marks obtained
  const handleMarksObtainedChange = (studentId, val) => {
    setMarksCache((prev) => {
      const current = prev[studentId] ?? { marksObtained: "0", maxMarks: "100" };
      const newMarks = val;
      const max = Number(current.maxMarks) || 100;
      const percentage = (Number(newMarks) / max) * 100;

      let grade = "F";
      if (percentage >= 90) grade = "A+";
      else if (percentage >= 80) grade = "A";
      else if (percentage >= 70) grade = "B";
      else if (percentage >= 60) grade = "C";
      else if (percentage >= 50) grade = "D";

      return {
        ...prev,
        [studentId]: {
          ...current,
          marksObtained: newMarks,
          grade,
        },
      };
    });
  };

  // Handler to modify student max marks
  const handleMaxMarksChange = (studentId, val) => {
    setMarksCache((prev) => {
      const current = prev[studentId] ?? { marksObtained: "0", maxMarks: "100" };
      const newMax = val;
      const pct = (Number(current.marksObtained) / (Number(newMax) || 1)) * 100;

      let grade = "F";
      if (pct >= 90) grade = "A+";
      else if (pct >= 80) grade = "A";
      else if (pct >= 70) grade = "B";
      else if (pct >= 60) grade = "C";
      else if (pct >= 50) grade = "D";

      return {
        ...prev,
        [studentId]: {
          ...current,
          maxMarks: newMax,
          grade,
        },
      };
    });
  };

  // Apply Bulk Max Marks
  const handleApplyBulkMax = () => {
    if (!globalMaxMarks || isNaN(Number(globalMaxMarks))) {
      toast.error("Please enter a valid max marks number");
      return;
    }
    setMarksCache((prev) => {
      const updated = { ...prev };
      Object.keys(updated).forEach((id) => {
        const current = updated[id];
        const max = Number(globalMaxMarks);
        const pct = (Number(current.marksObtained) / max) * 100;

        let grade = "F";
        if (pct >= 90) grade = "A+";
        else if (pct >= 80) grade = "A";
        else if (pct >= 70) grade = "B";
        else if (pct >= 60) grade = "C";
        else if (pct >= 50) grade = "D";

        updated[id] = {
          ...current,
          maxMarks: globalMaxMarks,
          grade,
        };
      });
      return updated;
    });
    toast.info(`Max Marks updated to ${globalMaxMarks} for all students`);
  };

  // Submit Marks
  const handleSaveMarks = () => {
    const payload = Object.keys(marksCache).map((id) => ({
      studentId: Number(id),
      marksObtained: Number(marksCache[id].marksObtained || 0),
      maxMarks: Number(marksCache[id].maxMarks || 100),
      grade: marksCache[id].grade,
    }));

    if (payload.length === 0) {
      toast.error("No student marks to submit.");
      return;
    }

    // Verify all marks obtained are less than or equal to max marks
    const invalid = payload.find((p) => p.marksObtained > p.maxMarks);
    if (invalid) {
      toast.error("Marks obtained cannot exceed max marks.");
      return;
    }

    submitMutation.mutate({
      examId: Number(selectedExamId),
      subjectName: selectedSubject,
      className,
      section,
      payload,
    });
  };

  return (
    <>
      <PageHeader
        title="Marks Entry"
        description="Fill and publish subject-wise test and exam marks for students."
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
          <label className="text-xs font-semibold text-muted-foreground uppercase block mb-1.5">Active Exam / Test</label>
          <Select value={selectedExamId} onValueChange={setSelectedExamId}>
            <SelectTrigger className="bg-card">
              <SelectValue placeholder="Select Exam" />
            </SelectTrigger>
            <SelectContent>
              {examsQuery.data?.map((ex) => (
                <SelectItem key={ex.id} value={String(ex.id)}>
                  {ex.examName} ({ex.examType})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-xs font-semibold text-muted-foreground uppercase block mb-1.5">Set Max Marks (Bulk)</label>
          <div className="flex gap-2">
            <Input
              type="number"
              className="bg-card h-9 text-xs flex-1"
              value={globalMaxMarks}
              onChange={(e) => setGlobalMaxMarks(e.target.value)}
            />
            <Button variant="outline" size="sm" onClick={handleApplyBulkMax} className="text-xs shrink-0 h-9">
              Apply All
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <ClipboardCheck className="h-4 w-4 text-primary" />
                Student Marks Entry Sheet
              </CardTitle>
              <CardDescription>
                Input scores for Class {selectedClass || "—"} • {selectedSubject || "—"}. Percentage and grades are calculated dynamically.
              </CardDescription>
            </div>
            <div className="relative max-w-xs w-full md:w-64">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search student list…"
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent>
            {studentsQuery.isLoading || existingResultsQuery.isLoading || examsQuery.isLoading ? (
              <LoadingBlock rows={6} />
            ) : studentsQuery.isError ? (
              <ErrorState message={studentsQuery.error?.message} onRetry={studentsQuery.refetch} />
            ) : filteredStudents.length === 0 ? (
              <EmptyState icon={Users} title="No students found matching filters" />
            ) : (
              <div className="space-y-4">
                <div className="rounded-lg border border-border overflow-x-auto bg-card">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-20">Student ID</TableHead>
                        <TableHead>Student Name</TableHead>
                        <TableHead className="w-32">Marks Obtained</TableHead>
                        <TableHead className="w-32">Max Marks</TableHead>
                        <TableHead className="w-24">Percentage</TableHead>
                        <TableHead className="w-20">Grade</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredStudents.map((s) => {
                        const currentVal = marksCache[s.id] ?? { marksObtained: "0", maxMarks: "100", grade: "F" };
                        const marksNum = Number(currentVal.marksObtained) || 0;
                        const maxNum = Number(currentVal.maxMarks) || 100;
                        const pct = maxNum > 0 ? Math.round((marksNum / maxNum) * 100) : 0;
                        
                        let badgeColor = "secondary";
                        if (currentVal.grade.startsWith("A")) badgeColor = "success";
                        if (currentVal.grade.startsWith("B") || currentVal.grade.startsWith("C")) badgeColor = "warning";
                        if (currentVal.grade === "F") badgeColor = "destructive";

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
                              <Input
                                type="number"
                                className="h-8 text-xs bg-background max-w-[100px]"
                                value={currentVal.marksObtained}
                                min="0"
                                onChange={(e) => handleMarksObtainedChange(s.id, e.target.value)}
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                className="h-8 text-xs bg-background max-w-[100px]"
                                value={currentVal.maxMarks}
                                min="1"
                                onChange={(e) => handleMaxMarksChange(s.id, e.target.value)}
                              />
                            </TableCell>
                            <TableCell className="text-xs font-semibold text-muted-foreground">
                              <span className="flex items-center gap-0.5">
                                <Percent className="h-3.5 w-3.5 text-primary shrink-0" />
                                {pct}%
                              </span>
                            </TableCell>
                            <TableCell>
                              <Badge variant={badgeColor} className="font-bold text-xs px-2.5">
                                {currentVal.grade}
                              </Badge>
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
                    onClick={handleSaveMarks}
                    disabled={submitMutation.isPending}
                    className="gap-2 font-semibold shadow-sm"
                  >
                    {submitMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    Publish Exam Marks
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
