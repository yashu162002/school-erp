import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Info, Trash2, Calendar, BookOpen, Clock, MapPin, Megaphone, Eye, EyeOff, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { examsApi } from "@/api/exams.api";
import { subjectsApi } from "@/api/subjects.api";
import { studentsApi } from "@/api/students.api";
import { hallTicketsApi } from "@/api/hallTickets.api";

export function ExamsTable() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("exams");

  // Form State - Exam Creation
  const [examName, setExamName] = useState("");
  const [className, setClassName] = useState("");
  const [section, setSection] = useState("");
  const [academicYear, setAcademicYear] = useState("2026");
  const [examType, setExamType] = useState("UNIT_TEST");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [resultDate, setResultDate] = useState("");

  // Form State - Exam Selection
  const [selectedExamId, setSelectedExamId] = useState("");
  const [timetableClass, setTimetableClass] = useState("");
  const [timetableSection, setTimetableSection] = useState("");

  // Dynamic Subjects List for the selected class/section
  const [subjectList, setSubjectList] = useState([]);

  // Form State - Dynamic Papers list (Default: 1 empty row)
  const [papers, setPapers] = useState([
    { subjectName: "", examDate: "", dayName: "", startTime: "09:30 AM", endTime: "12:30 PM", roomNumber: "", invigilator: "", instructions: "" }
  ]);

  // Hall Ticket management states
  const [selectedExamIdForTickets, setSelectedExamIdForTickets] = useState("");
  const [targetClassForTickets, setTargetClassForTickets] = useState("");
  const [targetSectionForTickets, setTargetSectionForTickets] = useState("");
  const [studentsList, setStudentsList] = useState([]);
  const [hallTicketsList, setHallTicketsList] = useState([]);
  const [isLoadingTickets, setIsLoadingTickets] = useState(false);

  const loadStudentTickets = async () => {
    if (!selectedExamIdForTickets) {
      toast.error("Please select an exam first");
      return;
    }
    if (!targetClassForTickets) {
      toast.error("Please specify a class name");
      return;
    }
    
    setIsLoadingTickets(true);
    try {
      // 1. Fetch all students
      const allStudents = await studentsApi.list();
      // Filter students by class and section
      const filteredStudents = allStudents.filter(
        (s) =>
          s.className?.toString() === targetClassForTickets.toString() &&
          (!targetSectionForTickets || s.section?.toLowerCase() === targetSectionForTickets.toLowerCase())
      );
      setStudentsList(filteredStudents);

      // 2. Fetch hall tickets for the selected exam
      const allTickets = await hallTicketsApi.list();
      const filteredTickets = allTickets.filter(
        (t) => t.exam?.id.toString() === selectedExamIdForTickets.toString()
      );
      setHallTicketsList(filteredTickets);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load student hall ticket details");
    } finally {
      setIsLoadingTickets(false);
    }
  };

  const handleToggleTicket = async (studentId, currentEnabled) => {
    try {
      const newStatus = currentEnabled ? "PENDING" : "APPROVED";
      await hallTicketsApi.toggle({
        examId: selectedExamIdForTickets,
        studentId: studentId,
        status: newStatus
      });
      toast.success(`Hall ticket ${currentEnabled ? 'disabled' : 'enabled'} successfully`);
      
      // Reload tickets
      const allTickets = await hallTicketsApi.list();
      const filteredTickets = allTickets.filter(
        (t) => t.exam?.id.toString() === selectedExamIdForTickets.toString()
      );
      setHallTicketsList(filteredTickets);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update hall ticket status");
    }
  };

  const handleEnableAll = async () => {
    if (studentsList.length === 0) return;
    try {
      const studentIds = studentsList.map(s => s.id);
      await hallTicketsApi.bulkStatus({
        examId: selectedExamIdForTickets,
        studentIds: studentIds,
        status: "APPROVED"
      });
      toast.success("All hall tickets enabled successfully");
      
      // Reload tickets
      const allTickets = await hallTicketsApi.list();
      const filteredTickets = allTickets.filter(
        (t) => t.exam?.id.toString() === selectedExamIdForTickets.toString()
      );
      setHallTicketsList(filteredTickets);
    } catch (err) {
      console.error(err);
      toast.error("Failed to enable all hall tickets");
    }
  };

  const handleDisableAll = async () => {
    if (studentsList.length === 0) return;
    try {
      const studentIds = studentsList.map(s => s.id);
      await hallTicketsApi.bulkStatus({
        examId: selectedExamIdForTickets,
        studentIds: studentIds,
        status: "PENDING"
      });
      toast.success("All hall tickets disabled successfully");
      
      // Reload tickets
      const allTickets = await hallTicketsApi.list();
      const filteredTickets = allTickets.filter(
        (t) => t.exam?.id.toString() === selectedExamIdForTickets.toString()
      );
      setHallTicketsList(filteredTickets);
    } catch (err) {
      console.error(err);
      toast.error("Failed to disable all hall tickets");
    }
  };

  // Queries
  const examsQuery = useQuery({
    queryKey: ["admin-exams"],
    queryFn: examsApi.list,
  });

  const timetablesQuery = useQuery({
    queryKey: ["admin-timetables"],
    queryFn: () => examsApi.listTimetable(),
  });

  const examsList = examsQuery.data ?? [];
  const timetablesList = timetablesQuery.data ?? [];

  // Helper to get day of the week from date string
  const getDayName = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { weekday: "long" });
  };

  // Fetch subjects dynamically when an exam is selected in timetable form
  useEffect(() => {
    if (selectedExamId) {
      const selectedExam = examsList.find((ex) => ex.id.toString() === selectedExamId);
      if (selectedExam) {
        setTimetableClass(selectedExam.className || "");
        setTimetableSection(selectedExam.section || "");

        subjectsApi
          .list({ className: selectedExam.className, section: selectedExam.section })
          .then((data) => {
            setSubjectList(data || []);
            // Prepopulate rows with first subject code if available
            if (data && data.length > 0) {
              setPapers([
                { subjectName: data[0].subjectName, examDate: "", dayName: "", startTime: "09:30 AM", endTime: "12:30 PM", roomNumber: "", invigilator: "", instructions: "" }
              ]);
            }
          })
          .catch((err) => {
            console.error("Could not fetch subjects for exam class", err);
            setSubjectList([]);
          });
      }
    }
  }, [selectedExamId, examsList]);

  // Mutations
  const createExamMutation = useMutation({
    mutationFn: examsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-exams"] });
      toast.success("Exam created successfully");
      setExamName("");
      setClassName("");
      setSection("");
      setDescription("");
      setStartDate("");
      setEndDate("");
      setResultDate("");
    },
    onError: (err) => toast.error(err.message || "Failed to create exam"),
  });

  const toggleEnableMutation = useMutation({
    mutationFn: examsApi.toggleEnable,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-exams"] });
      queryClient.invalidateQueries({ queryKey: ["student-timetable"] });
      toast.success("Exam visibility state updated");
    },
    onError: (err) => toast.error(err.message || "Failed to toggle visibility status"),
  });

  const publishResultsMutation = useMutation({
    mutationFn: examsApi.publish,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-exams"] });
      toast.success("Exam results status set to PUBLISHED");
    },
    onError: (err) => toast.error(err.message || "Failed to publish results"),
  });

  const deleteTimetableMutation = useMutation({
    mutationFn: examsApi.deleteTimetable,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-timetables"] });
      toast.success("Timetable entry removed");
    },
    onError: (err) => toast.error(err.message || "Failed to delete entry"),
  });

  // Dynamic Row Actions
  const addPaperRow = () => {
    const defaultSubject = subjectList.length > 0 ? subjectList[0].subjectName : "";
    setPapers([
      ...papers,
      { subjectName: defaultSubject, examDate: "", dayName: "", startTime: "09:30 AM", endTime: "12:30 PM", roomNumber: "", invigilator: "", instructions: "" }
    ]);
  };

  const removePaperRow = (index) => {
    if (papers.length === 1) {
      toast.error("At least one paper schedule is required");
      return;
    }
    const updated = papers.filter((_, idx) => idx !== index);
    setPapers(updated);
  };

  const updatePaperField = (index, field, value) => {
    const updated = [...papers];
    updated[index][field] = value;
    
    // Auto-calculate day name when date is entered
    if (field === "examDate") {
      updated[index]["dayName"] = getDayName(value);
    }
    
    setPapers(updated);
  };

  const [isSavingTimetable, setIsSavingTimetable] = useState(false);

  const handleCreateTimetable = async (e) => {
    e.preventDefault();
    if (!selectedExamId) {
      toast.error("Please select an exam first");
      return;
    }

    // Validation
    for (let i = 0; i < papers.length; i++) {
      const p = papers[i];
      if (!p.subjectName || !p.examDate || !p.startTime || !p.endTime || !p.roomNumber) {
        toast.error(`Please fill out all required fields (Subject, Date, Time, Room) in Paper Row #${i + 1}`);
        return;
      }
    }

    setIsSavingTimetable(true);
    try {
      // Loop over rows and post each timetable record
      for (const paper of papers) {
        await examsApi.createTimetable({
          exam: { id: Number(selectedExamId) },
          className: timetableClass,
          section: timetableSection,
          subjectName: paper.subjectName,
          examDate: paper.examDate,
          dayName: paper.dayName || getDayName(paper.examDate),
          startTime: paper.startTime,
          endTime: paper.endTime,
          roomNumber: paper.roomNumber,
          invigilator: paper.invigilator || "",
          instructions: paper.instructions || "",
        });
      }
      queryClient.invalidateQueries({ queryKey: ["admin-timetables"] });
      toast.success("Exam timetable updated successfully with " + papers.length + " papers!");
      // Reset papers
      const defaultSubject = subjectList.length > 0 ? subjectList[0].subjectName : "";
      setPapers([
        { subjectName: defaultSubject, examDate: "", dayName: "", startTime: "09:30 AM", endTime: "12:30 PM", roomNumber: "", invigilator: "", instructions: "" }
      ]);
    } catch (err) {
      toast.error(err.message || "Failed to schedule some timetable papers");
    } finally {
      setIsSavingTimetable(false);
    }
  };

  const handleCreateExam = (e) => {
    e.preventDefault();
    createExamMutation.mutate({
      examName,
      className,
      section,
      academicYear,
      examType,
      description,
      startDate,
      endDate,
      resultDate,
      status: "SCHEDULED",
      enabled: false,
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>Examinations & Schedules Control</span>
          <Info className="h-4 w-4 text-muted-foreground" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="exams">Exams Management</TabsTrigger>
            <TabsTrigger value="timetables">Exam Timetable Scheduling</TabsTrigger>
          </TabsList>

          {/* Exams Tab */}
          <TabsContent value="exams" className="space-y-6">
            {/* Create Exam Form */}
            <form onSubmit={handleCreateExam} className="bg-muted/30 p-4 rounded-lg border border-border space-y-4">
              <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Plus className="h-4 w-4 text-primary" /> Create Class-wise Exam
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <Label>Exam Name</Label>
                  <Input
                    required
                    placeholder="e.g. Second Semester Final"
                    value={examName}
                    onChange={(e) => setExamName(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <Label>Target Class Name</Label>
                  <Input
                    required
                    placeholder="e.g. 10"
                    value={className}
                    onChange={(e) => setClassName(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <Label>Section (Optional)</Label>
                  <Input
                    placeholder="e.g. A"
                    value={section}
                    onChange={(e) => setSection(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <Label>Academic Year</Label>
                  <Select value={academicYear} onValueChange={setAcademicYear}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2026">2026</SelectItem>
                      <SelectItem value="2027">2027</SelectItem>
                      <SelectItem value="2028">2028</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label>Exam Type</Label>
                  <Select value={examType} onValueChange={setExamType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UNIT_TEST">Unit Test</SelectItem>
                      <SelectItem value="MID_TERM">Mid Term</SelectItem>
                      <SelectItem value="FINAL_EXAM">Final Exam</SelectItem>
                      <SelectItem value="SEMESTER">Semester</SelectItem>
                      <SelectItem value="PRACTICAL">Practical</SelectItem>
                      <SelectItem value="MOCK_TEST">Mock Test</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label>Start Date</Label>
                  <Input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <Label>End Date</Label>
                  <Input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <Label>Expected Result Date</Label>
                  <Input
                    type="date"
                    required
                    value={resultDate}
                    onChange={(e) => setResultDate(e.target.value)}
                  />
                </div>
                <div className="space-y-1 md:col-span-3">
                  <Label>Description / Notice Instructions</Label>
                  <Input
                    placeholder="General information for candidates..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <Button type="submit" disabled={createExamMutation.isPending}>
                  {createExamMutation.isPending ? "Creating..." : "Create Exam"}
                </Button>
              </div>
            </form>

            {/* Exams list */}
            <div className="rounded-lg border border-border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">ID</TableHead>
                    <TableHead>Exam Name</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Dates</TableHead>
                    <TableHead>Year / Type</TableHead>
                    <TableHead>Student/Teacher Access</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {examsQuery.isLoading ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-4">Loading exams...</TableCell>
                    </TableRow>
                  ) : examsList.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-4">No exams scheduled in database.</TableCell>
                    </TableRow>
                  ) : (
                    examsList.map((ex) => (
                      <TableRow key={ex.id}>
                        <TableCell className="font-mono text-xs">{ex.id}</TableCell>
                        <TableCell className="font-semibold text-foreground">{ex.examName}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            Class {ex.className}
                            {ex.section ? `-${ex.section}` : ""}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {ex.startDate} to {ex.endDate}
                        </TableCell>
                        <TableCell className="text-xs">
                          {ex.academicYear} - {ex.examType}
                        </TableCell>
                        <TableCell>
                          <Badge variant={ex.enabled ? "success" : "secondary"}>
                            {ex.enabled ? "Enabled (Visible)" : "Disabled (Hidden)"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={ex.status === "PUBLISHED" ? "success" : "default"}>
                            {ex.status || "SCHEDULED"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 text-xs gap-1"
                              onClick={() => toggleEnableMutation.mutate(ex.id)}
                              disabled={toggleEnableMutation.isPending}
                            >
                              {ex.enabled ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                              {ex.enabled ? "Hide Timetable" : "Show Timetable"}
                            </Button>
                            {ex.status !== "PUBLISHED" && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 text-xs gap-1"
                                onClick={() => {
                                  if (confirm(`Are you sure you want to publish results for ${ex.examName}?`)) {
                                    publishResultsMutation.mutate(ex.id);
                                  }
                                }}
                                disabled={publishResultsMutation.isPending}
                              >
                                <Megaphone className="h-3.5 w-3.5" /> Publish Results
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Hall Ticket Activation Management Card */}
            <Card className="border border-border mt-8 shadow-sm">
              <CardHeader className="border-b bg-muted/10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-lg font-bold flex items-center gap-2 text-foreground">
                      <BookOpen className="h-5 w-5 text-primary" />
                      Student Hall Ticket Activation
                    </CardTitle>
                    <p className="text-xs text-muted-foreground mt-1">
                      Manage hall ticket visibility for students class-wise. Enabled tickets will be visible on student portals.
                    </p>
                  </div>
                  
                  {/* Bulk actions */}
                  {studentsList.length > 0 && (
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-xs border-emerald-500/30 hover:bg-emerald-50/10 hover:text-emerald-500 text-emerald-500 font-semibold transition-all duration-200"
                        onClick={handleEnableAll}
                      >
                        Enable All for Class
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-xs border-destructive/30 hover:bg-destructive/10 hover:text-destructive text-destructive font-semibold transition-all duration-200"
                        onClick={handleDisableAll}
                      >
                        Disable All for Class
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="p-6 space-y-6">
                {/* Filter Row */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end bg-muted/20 p-4 rounded-lg border border-border">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Select Exam *</Label>
                    <Select value={selectedExamIdForTickets} onValueChange={setSelectedExamIdForTickets}>
                      <SelectTrigger className="bg-background">
                        <SelectValue placeholder="Choose an exam" />
                      </SelectTrigger>
                      <SelectContent>
                        {examsList.map((exam) => (
                          <SelectItem key={exam.id} value={exam.id.toString()}>
                            {exam.examName} (Class {exam.className})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Class Name *</Label>
                    <Input 
                      placeholder="e.g. 10" 
                      value={targetClassForTickets}
                      onChange={(e) => setTargetClassForTickets(e.target.value)}
                      className="bg-background"
                    />
                  </div>
                  
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Section (Optional)</Label>
                    <Input 
                      placeholder="e.g. A" 
                      value={targetSectionForTickets}
                      onChange={(e) => setTargetSectionForTickets(e.target.value)}
                      className="bg-background"
                    />
                  </div>
                  
                  <Button 
                    onClick={loadStudentTickets}
                    disabled={isLoadingTickets}
                    className="w-full flex items-center justify-center gap-1.5 bg-primary hover:bg-primary/95 text-primary-foreground font-semibold shadow-sm transition-all duration-200"
                  >
                    {isLoadingTickets ? "Loading..." : "Load Students"}
                  </Button>
                </div>

                {/* Table/List */}
                {studentsList.length === 0 ? (
                  <div className="text-center py-8 border border-dashed rounded-lg bg-muted/10 text-muted-foreground text-sm">
                    Select an exam and input a class name to load students.
                  </div>
                ) : (
                  <div className="rounded-lg border border-border overflow-hidden bg-background">
                    <Table>
                      <TableHeader className="bg-muted/40">
                        <TableRow>
                          <TableHead className="w-[120px]">Student ID</TableHead>
                          <TableHead>Student Name</TableHead>
                          <TableHead>Roll No</TableHead>
                          <TableHead>Class / Section</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {studentsList.map((student) => {
                          const ticket = hallTicketsList.find(t => t.student?.id === student.id);
                          const isEnabled = ticket && ticket.status === "APPROVED";
                          
                          return (
                            <TableRow key={student.id} className="hover:bg-muted/10 transition-colors duration-150">
                              <TableCell className="font-mono text-xs font-medium">{student.studentId}</TableCell>
                              <TableCell className="font-semibold text-foreground">
                                {student.firstName} {student.lastName}
                              </TableCell>
                              <TableCell>{student.rollNo || "—"}</TableCell>
                              <TableCell>
                                Class {student.className}
                                {student.section ? `-${student.section}` : ""}
                              </TableCell>
                              <TableCell>
                                <Badge variant={isEnabled ? "success" : "secondary"} className="transition-all duration-300">
                                  {isEnabled ? "Enabled" : "Disabled"}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                <Button
                                  variant={isEnabled ? "destructive" : "outline"}
                                  size="sm"
                                  className="h-8 text-xs font-semibold shadow-sm transition-all duration-200"
                                  onClick={() => handleToggleTicket(student.id, isEnabled)}
                                >
                                  {isEnabled ? "Disable" : "Enable"}
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
            </Card>
          </TabsContent>

          {/* Timetable Scheduling Tab */}
          <TabsContent value="timetables" className="space-y-6">
            {/* Create timetable entry form */}
            <form onSubmit={handleCreateTimetable} className="bg-muted/30 p-5 rounded-lg border border-border space-y-6">
              <div className="flex items-center justify-between border-b pb-2">
                <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Plus className="h-4 w-4 text-primary" /> Schedule Exam Papers / Timetable
                </h4>
              </div>

              {/* Header Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <Label>Link Scheduled Exam</Label>
                  <Select value={selectedExamId} onValueChange={setSelectedExamId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose an Exam" />
                    </SelectTrigger>
                    <SelectContent>
                      {examsList.map((ex) => (
                        <SelectItem key={ex.id} value={ex.id.toString()}>
                          {ex.examName} (Class {ex.className})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label>Class Name</Label>
                  <Input required disabled placeholder="Auto-filled" value={timetableClass} />
                </div>
                <div className="space-y-1">
                  <Label>Section</Label>
                  <Input required disabled placeholder="Auto-filled" value={timetableSection} />
                </div>
              </div>

              {/* Dynamic Rows for Subjects */}
              <div className="space-y-4 pt-2">
                <div className="flex justify-between items-center">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Exam Papers List ({papers.length})
                  </Label>
                  <Button type="button" variant="outline" size="sm" onClick={addPaperRow} className="h-8 gap-1">
                    <Plus className="h-3.5 w-3.5" /> Add Subject Paper
                  </Button>
                </div>

                <div className="space-y-3">
                  {papers.map((paper, index) => (
                    <div key={index} className="p-4 bg-background border rounded-lg space-y-3 relative group">
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-destructive hover:bg-destructive/10"
                          onClick={() => removePaperRow(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                        {/* Subject */}
                        <div className="space-y-1">
                          <Label className="text-xs">Subject Name</Label>
                          {subjectList.length > 0 ? (
                            <Select
                              value={paper.subjectName}
                              onValueChange={(val) => updatePaperField(index, "subjectName", val)}
                            >
                              <SelectTrigger className="h-9">
                                <SelectValue placeholder="Choose Subject" />
                              </SelectTrigger>
                              <SelectContent>
                                {subjectList.map((sub) => (
                                  <SelectItem key={sub.id} value={sub.subjectName}>
                                    {sub.subjectName} ({sub.subjectCode})
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          ) : (
                            <Input
                              required
                              placeholder="e.g. Mathematics"
                              value={paper.subjectName}
                              onChange={(e) => updatePaperField(index, "subjectName", e.target.value)}
                              className="h-9"
                            />
                          )}
                        </div>

                        {/* Date */}
                        <div className="space-y-1">
                          <Label className="text-xs">Exam Date</Label>
                          <Input
                            type="date"
                            required
                            value={paper.examDate}
                            onChange={(e) => updatePaperField(index, "examDate", e.target.value)}
                            className="h-9"
                          />
                        </div>

                        {/* Day Name */}
                        <div className="space-y-1">
                          <Label className="text-xs">Day Name (Auto)</Label>
                          <Input
                            required
                            placeholder="e.g. Monday"
                            value={paper.dayName}
                            onChange={(e) => updatePaperField(index, "dayName", e.target.value)}
                            className="h-9"
                          />
                        </div>

                        {/* Room Number */}
                        <div className="space-y-1">
                          <Label className="text-xs">Room Number</Label>
                          <Input
                            required
                            placeholder="e.g. 302"
                            value={paper.roomNumber}
                            onChange={(e) => updatePaperField(index, "roomNumber", e.target.value)}
                            className="h-9"
                          />
                        </div>

                        {/* Start Time */}
                        <div className="space-y-1">
                          <Label className="text-xs">Start Time</Label>
                          <Input
                            required
                            placeholder="e.g. 09:30 AM"
                            value={paper.startTime}
                            onChange={(e) => updatePaperField(index, "startTime", e.target.value)}
                            className="h-9"
                          />
                        </div>

                        {/* End Time */}
                        <div className="space-y-1">
                          <Label className="text-xs">End Time</Label>
                          <Input
                            required
                            placeholder="e.g. 12:30 PM"
                            value={paper.endTime}
                            onChange={(e) => updatePaperField(index, "endTime", e.target.value)}
                            className="h-9"
                          />
                        </div>

                        {/* Invigilator */}
                        <div className="space-y-1">
                          <Label className="text-xs">Invigilator Name</Label>
                          <Input
                            placeholder="e.g. Mr. David Smith"
                            value={paper.invigilator}
                            onChange={(e) => updatePaperField(index, "invigilator", e.target.value)}
                            className="h-9"
                          />
                        </div>

                        {/* Instructions */}
                        <div className="space-y-1">
                          <Label className="text-xs">Instructions</Label>
                          <Input
                            placeholder="e.g. Bring own geometry box"
                            value={paper.instructions}
                            onChange={(e) => updatePaperField(index, "instructions", e.target.value)}
                            className="h-9"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <Button type="submit" disabled={isSavingTimetable || !selectedExamId}>
                  {isSavingTimetable ? "Saving All..." : `Schedule Timetable (${papers.length} Papers)`}
                </Button>
              </div>
            </form>

            {/* Timetables list */}
            <div className="rounded-lg border border-border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Exam / Class</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Date / Day</TableHead>
                    <TableHead>Time Range</TableHead>
                    <TableHead>Room / Invigilator</TableHead>
                    <TableHead className="w-20 text-right">Delete</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {timetablesQuery.isLoading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4">Loading timetables...</TableCell>
                    </TableRow>
                  ) : timetablesList.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4">No scheduled papers in database.</TableCell>
                    </TableRow>
                  ) : (
                    timetablesList.map((item) => (
                      <TableRow key={item.id} className="hover:bg-muted/10 transition-colors">
                        <TableCell>
                          <div className="space-y-0.5">
                            <span className="font-semibold text-foreground block">{item.exam?.examName}</span>
                            <Badge variant="secondary">
                              Class {item.className}-{item.section}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className="font-semibold text-primary">{item.subjectName}</TableCell>
                        <TableCell>
                          <div className="flex flex-col text-xs">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3.5 w-3.5 shrink-0" />
                              {item.examDate}
                            </span>
                            <span className="text-muted-foreground uppercase text-[10px] pl-5">{item.dayName}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-xs">
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Clock className="h-3.5 w-3.5 shrink-0" />
                            <span>{item.startTime} - {item.endTime}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-xs">
                          <div className="flex flex-col">
                            <span className="flex items-center gap-1 text-foreground">
                              <MapPin className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                              Room {item.roomNumber}
                            </span>
                            <span className="text-muted-foreground text-[10px] pl-5">Invigilator: {item.invigilator || "—"}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive"
                            onClick={() => {
                              if (confirm("Remove this paper from the timetable?")) {
                                deleteTimetableMutation.mutate(item.id);
                              }
                            }}
                            disabled={deleteTimetableMutation.isPending}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
