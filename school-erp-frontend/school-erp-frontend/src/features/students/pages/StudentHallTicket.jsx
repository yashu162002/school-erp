import React from "react";
import { useQuery } from "@tanstack/react-query";
import { studentPortalApi } from "@/api/studentPortal.api";
import { PageHeader } from "@/components/common/PageHeader";
import { LoadingBlock } from "@/components/common/LoadingBlock";
import { ErrorState } from "@/components/common/ErrorState";
import { EmptyState } from "@/components/common/EmptyState";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Printer, Download, Landmark, FileText, CheckCircle, ShieldAlert } from "lucide-react";

export function StudentHallTicket() {
  const hallTicketQuery = useQuery({
    queryKey: ["student-hall-ticket"],
    queryFn: studentPortalApi.getHallTickets,
  });

  const profileQuery = useQuery({
    queryKey: ["student-profile"],
    queryFn: studentPortalApi.getProfile,
  });

  const timetableQuery = useQuery({
    queryKey: ["student-timetable"],
    queryFn: studentPortalApi.getTimetable,
  });

  if (hallTicketQuery.isLoading || profileQuery.isLoading || timetableQuery.isLoading) {
    return <LoadingBlock rows={8} />;
  }

  if (hallTicketQuery.isError || profileQuery.isError || timetableQuery.isError) {
    return (
      <ErrorState
        message="Could not load hall ticket information"
        onRetry={() => {
          hallTicketQuery.refetch();
          profileQuery.refetch();
          timetableQuery.refetch();
        }}
      />
    );
  }

  const tickets = hallTicketQuery.data ?? [];
  const student = profileQuery.data;
  const timetable = timetableQuery.data ?? [];

  if (tickets.length === 0) {
    return (
      <div className="space-y-6">
        <PageHeader title="Hall Tickets" description="View and print your examination hall tickets." />
        <EmptyState
          icon={FileText}
          title="No active hall tickets"
          description="You currently have no generated hall tickets. Please contact the administrator to issue a hall ticket."
        />
      </div>
    );
  }

  const activeTicket = tickets[0]; // Get the first active hall ticket

  // Filter timetable for this exam
  const examTimetable = timetable.filter(
    (t) => t.exam?.id === activeTicket.exam?.id
  );

  const handlePrint = () => {
    window.print();
  };

  // Helper to generate a fake barcode SVG
  const BarcodeSVG = ({ code }) => {
    return (
      <svg className="h-10 w-full max-w-[200px]" viewBox="0 0 100 20" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="20" fill="#fff" />
        {/* Draw standard lines representing code */}
        {code.split("").map((char, index) => {
          const val = char.charCodeAt(0) % 5;
          return (
            <rect
              key={index}
              x={index * 7 + 5}
              y="2"
              width={val === 0 ? "1" : val === 1 ? "2" : val === 2 ? "3" : "4"}
              height="14"
              fill="#000"
            />
          );
        })}
        <text x="50" y="19" fontSize="3" textAnchor="middle" fill="#000" letterSpacing="1">
          {code}
        </text>
      </svg>
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Hall Tickets"
        description="View and print your examination hall tickets."
        actions={
          <div className="flex gap-2">
            <Button onClick={handlePrint} variant="outline" className="flex items-center gap-1.5">
              <Printer className="h-4 w-4" />
              Print Hall Ticket
            </Button>
          </div>
        }
      />

      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body * {
            visibility: hidden;
          }
          #print-area, #print-area * {
            visibility: visible;
          }
          #print-area {
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

      {activeTicket.status === "LOCKED" ? (
        <Card className="border border-destructive/50 bg-destructive/10">
          <CardContent className="p-6 flex items-start gap-4">
            <ShieldAlert className="h-6 w-6 text-destructive shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h3 className="text-base font-semibold text-destructive">Hall Ticket Locked</h3>
              <p className="text-sm text-muted-foreground">
                Your hall ticket for {activeTicket.exam?.examName || "this exam"} has been locked by the administrator. Please clear outstanding dues or contact the admin office.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card id="print-area" className="border border-border shadow-md max-w-3xl mx-auto overflow-hidden bg-background">
          {/* Header */}
          <div className="border-b border-border bg-muted/20 p-6 md:p-8 flex items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground shrink-0">
                <Landmark className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold tracking-tight text-foreground uppercase">
                  TRISHUL HIGH SCHOOL, DAVANGERE
                </h2>
                <p className="text-xs text-muted-foreground">Affiliated Educational Institution</p>
              </div>
            </div>
            <div className="text-right">
              <Badge variant={activeTicket.status === "APPROVED" ? "success" : "warning"}>
                {activeTicket.status || "APPROVED"}
              </Badge>
              <p className="text-xs text-muted-foreground mt-1.5">Issue Date: {activeTicket.issueDate || "—"}</p>
            </div>
          </div>

          <CardContent className="p-6 md:p-8 space-y-8">
            <div className="text-center">
              <h3 className="text-xl font-bold tracking-tight uppercase text-foreground">
                EXAMINATION HALL TICKET
              </h3>
              <p className="text-sm text-primary font-semibold mt-1">
                {activeTicket.exam?.examName || "Annual Examinations"}
              </p>
            </div>

            {/* Student & Center Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
              {/* Photo */}
              <div className="flex justify-center md:col-span-1">
                <div className="relative h-32 w-28 rounded border border-border bg-muted overflow-hidden flex items-center justify-center">
                  {student.photoPath ? (
                    <img
                      src={student.photoPath.startsWith("http") ? student.photoPath : `http://localhost:8080/${student.photoPath}`}
                      alt="Student Photo"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-xs text-muted-foreground text-center px-2">No Photo Available</span>
                  )}
                </div>
              </div>

              {/* Personal Details */}
              <div className="md:col-span-3 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                <div>
                  <span className="text-muted-foreground block text-xs">Student Name</span>
                  <span className="font-semibold text-foreground">{student.firstName} {student.lastName}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-xs">Student ID / Roll No</span>
                  <span className="font-semibold text-foreground">{student.studentId} / {student.rollNo || "—"}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-xs">Admission No</span>
                  <span className="font-semibold text-foreground">{student.admissionNo}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-xs">Class / Section</span>
                  <span className="font-semibold text-foreground">Class {student.className} - {student.section}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-muted-foreground block text-xs">Exam Centre</span>
                  <span className="font-semibold text-foreground">{activeTicket.examCentre || "Main Campus Exam Hall"}</span>
                </div>
              </div>
            </div>

            {/* Timetable Table */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Exam Timetable
              </h4>
              {examTimetable.length === 0 ? (
                <p className="text-xs text-muted-foreground">No timetable scheduled for this exam.</p>
              ) : (
                <div className="rounded border border-border overflow-hidden">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-muted/40 border-b border-border">
                        <th className="p-2.5 font-bold">Date / Day</th>
                        <th className="p-2.5 font-bold">Subject</th>
                        <th className="p-2.5 font-bold">Time</th>
                        <th className="p-2.5 font-bold">Room</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      {examTimetable.map((item) => (
                        <tr key={item.id} className="hover:bg-muted/5">
                          <td className="p-2.5 font-medium">{item.examDate} ({item.dayName || "—"})</td>
                          <td className="p-2.5">{item.subjectName}</td>
                          <td className="p-2.5">{item.startTime} - {item.endTime}</td>
                          <td className="p-2.5">Room {item.roomNumber || "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Instructions */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Instructions for Candidate
              </h4>
              <div className="text-xs text-muted-foreground whitespace-pre-line leading-relaxed border-l-2 border-primary/30 pl-3">
                {activeTicket.instructions || "1. Report 30 minutes before exam.\n2. Carry ID Card and printed Hall Ticket.\n3. Electronic devices are strictly prohibited."}
              </div>
            </div>

            {/* Footer Signatures */}
            <div className="flex flex-wrap items-end justify-between gap-6 pt-6 border-t border-border/40">
              <div className="space-y-2">
                <BarcodeSVG code={activeTicket.hallTicketNumber || "HT2026000001"} />
              </div>
              <div className="text-center space-y-1">
                <div className="h-10 w-28 border-b border-border/80 flex items-end justify-center font-mono text-[10px] text-muted-foreground pb-1 italic">
                  Principal Signature
                </div>
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider block">Controller of Exams</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
