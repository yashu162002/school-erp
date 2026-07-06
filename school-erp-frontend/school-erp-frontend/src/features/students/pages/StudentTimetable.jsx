import React from "react";
import { useQuery } from "@tanstack/react-query";
import { studentPortalApi } from "@/api/studentPortal.api";
import { PageHeader } from "@/components/common/PageHeader";
import { LoadingBlock } from "@/components/common/LoadingBlock";
import { ErrorState } from "@/components/common/ErrorState";
import { EmptyState } from "@/components/common/EmptyState";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CalendarDays, Clock, MapPin, User, FileText, Printer } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function StudentTimetable() {
  const timetableQuery = useQuery({
    queryKey: ["student-timetable"],
    queryFn: studentPortalApi.getTimetable,
  });

  const profileQuery = useQuery({
    queryKey: ["student-profile"],
    queryFn: studentPortalApi.getProfile,
  });

  if (timetableQuery.isLoading || profileQuery.isLoading) {
    return <LoadingBlock rows={6} />;
  }

  if (timetableQuery.isError || profileQuery.isError) {
    return (
      <ErrorState
        message="Could not load timetable metadata"
        onRetry={() => {
          timetableQuery.refetch();
          profileQuery.refetch();
        }}
      />
    );
  }

  const entries = timetableQuery.data ?? [];
  const profile = profileQuery.data ?? {};

  // Group by Exam Name
  const grouped = entries.reduce((acc, curr) => {
    const examName = curr.exam?.examName || "Upcoming Examination";
    if (!acc[examName]) acc[examName] = [];
    acc[examName].push(curr);
    return acc;
  }, {});

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body * {
            visibility: hidden;
          }
          #print-timetable-document, #print-timetable-document * {
            visibility: visible;
          }
          #print-timetable-document {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: white !important;
            color: black !important;
            padding: 24px;
            margin: 0;
          }
        }
      `}} />

      <PageHeader
        title="Exam Timetables"
        description="View examination schedules, subject timings, and invigilator details."
        actions={
          entries.length > 0 && (
            <Button onClick={handlePrint} variant="outline" className="flex items-center gap-1.5 bg-background text-foreground border-border hover:bg-muted/10">
              <Printer className="h-4 w-4" />
              Print/Download Timetable
            </Button>
          )
        }
      />

      {/* Screen View */}
      <div className="space-y-6 print:hidden">
        {entries.length === 0 ? (
          <EmptyState
            icon={CalendarDays}
            title="No exam timetables published"
            description="Your class currently has no active exam timetables. Check back later or contact administration."
          />
        ) : (
          Object.entries(grouped).map(([examName, list]) => (
            <Card key={examName} className="overflow-hidden border border-border">
              <CardHeader className="bg-muted/40 border-b border-border py-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <CardTitle className="text-lg font-bold text-foreground">
                    {examName}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                      Class {list[0].className || "—"} - {list[0].section || "—"}
                    </Badge>
                    {list[0].exam?.startDate && (
                      <span className="text-xs text-muted-foreground">
                        Starts: {list[0].exam.startDate}
                      </span>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date / Day</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Room</TableHead>
                      <TableHead>Invigilator</TableHead>
                      <TableHead>Instructions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {list.map((item) => (
                      <TableRow key={item.id} className="hover:bg-muted/10 transition-colors">
                        <TableCell className="font-semibold py-4">
                          <div className="flex flex-col">
                            <span className="flex items-center gap-1 text-sm text-foreground">
                              <CalendarDays className="h-3.5 w-3.5 text-primary shrink-0" />
                              {item.examDate || "—"}
                            </span>
                            <span className="text-xs text-muted-foreground pl-5 uppercase">
                              {item.dayName || "—"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium text-foreground py-4">
                          {item.subjectName || "—"}
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Clock className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                            <span>{item.startTime || "—"} - {item.endTime || "—"}</span>
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="flex items-center gap-1 text-sm text-foreground">
                            <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                            <span>Room {item.roomNumber || "—"}</span>
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <User className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                            <span>{item.invigilator || "—"}</span>
                          </div>
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate text-xs text-muted-foreground py-4" title={item.instructions}>
                          <div className="flex items-center gap-1">
                            <FileText className="h-3.5 w-3.5 shrink-0" />
                            <span>{item.instructions || "Standard exam protocols apply."}</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Professional Print View Document (Hidden on screen, visible only when printing) */}
      {entries.length > 0 && (
        <div id="print-timetable-document" className="hidden print:block bg-white text-black font-serif">
          <div className="text-center border-b-2 border-black pb-4 mb-6">
            <h1 className="text-2xl font-bold uppercase tracking-wider">TRISHUL HIGH SCHOOL, DAVANGERE</h1>
            <p className="text-xs uppercase italic tracking-widest text-gray-700 mt-1">Official Student Examination Timetable</p>
          </div>

          {/* Student details header grid */}
          <div className="grid grid-cols-2 gap-4 text-xs border border-black p-4 mb-6" style={{ borderCollapse: "collapse" }}>
            <div>
              <span className="font-bold">STUDENT NAME:</span> {profile.firstName?.toUpperCase()} {profile.lastName?.toUpperCase()}
            </div>
            <div>
              <span className="font-bold">STUDENT ID:</span> {profile.studentId}
            </div>
            <div>
              <span className="font-bold">CLASS & SECTION:</span> CLASS {profile.className?.toUpperCase()} - {profile.section?.toUpperCase()}
            </div>
            <div>
              <span className="font-bold">ROLL NUMBER / ADM NO:</span> {profile.rollNo || "—"} / {profile.admissionNo}
            </div>
          </div>

          {Object.entries(grouped).map(([examName, list]) => (
            <div key={examName} className="space-y-6 mb-8">
              <div className="flex justify-between items-center text-xs border-b border-dashed border-gray-400 pb-2">
                <div>
                  <span className="font-bold">EXAMINATION:</span> {examName.toUpperCase()}
                </div>
                <div>
                  <span className="font-bold">ACADEMIC YEAR:</span> {profile.academicYear || "2026"}
                </div>
              </div>

              <table className="w-full border-collapse text-xs text-left" style={{ border: "1px solid black" }}>
                <thead>
                  <tr className="bg-gray-100" style={{ borderBottom: "2px solid black" }}>
                    <th className="p-2.5 font-bold text-center border-r border-black" style={{ width: "8%" }}>Sl No</th>
                    <th className="p-2.5 font-bold border-r border-black" style={{ width: "30%" }}>Subject</th>
                    <th className="p-2.5 font-bold border-r border-black" style={{ width: "22%" }}>Date & Day</th>
                    <th className="p-2.5 font-bold border-r border-black" style={{ width: "20%" }}>Time Range</th>
                    <th className="p-2.5 font-bold border-r border-black" style={{ width: "10%" }}>Room No</th>
                    <th className="p-2.5 font-bold" style={{ width: "10%" }}>Invigilator Sign</th>
                  </tr>
                </thead>
                <tbody>
                  {list.map((item, idx) => (
                    <tr key={item.id} style={{ borderBottom: "1px solid black" }}>
                      <td className="p-3 text-center border-r border-black font-semibold">{idx + 1}</td>
                      <td className="p-3 border-r border-black font-bold text-gray-900">{item.subjectName?.toUpperCase()}</td>
                      <td className="p-3 border-r border-black">
                        <div>{item.examDate}</div>
                        <div className="text-[9px] uppercase font-semibold text-gray-600 mt-0.5">{item.dayName}</div>
                      </td>
                      <td className="p-3 border-r border-black font-mono">{item.startTime} - {item.endTime}</td>
                      <td className="p-3 text-center border-r border-black">RM-{item.roomNumber}</td>
                      <td className="p-3 h-11 border-black"></td> {/* Left empty for physical signature */}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}

          {/* Signature panel at bottom of the page */}
          <div className="flex justify-between items-end pt-24 text-xs font-bold uppercase tracking-wider">
            <div className="text-center w-48">
              <div className="border-b border-black h-6 mb-1"></div>
              <p>Class Teacher Sign</p>
            </div>
            <div className="text-center w-48">
              <div className="border-b border-black h-6 mb-1"></div>
              <p>Principal Sign</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
