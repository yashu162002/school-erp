import React from "react";
import { useQuery } from "@tanstack/react-query";
import { studentPortalApi } from "@/api/studentPortal.api";
import { PageHeader } from "@/components/common/PageHeader";
import { LoadingBlock } from "@/components/common/LoadingBlock";
import { ErrorState } from "@/components/common/ErrorState";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  User, BookOpen, Users, ShieldAlert, Award, FileText, 
  MapPin, Phone, Mail, Calendar, Heart, Shield, Home, Truck 
} from "lucide-react";

export function StudentProfile() {
  const profileQuery = useQuery({
    queryKey: ["student-profile"],
    queryFn: studentPortalApi.getProfile,
  });

  if (profileQuery.isLoading) {
    return <LoadingBlock rows={8} />;
  }

  if (profileQuery.isError) {
    return (
      <ErrorState 
        message={profileQuery.error?.message || "Could not load profile"} 
        onRetry={profileQuery.refetch} 
      />
    );
  }

  const student = profileQuery.data;

  const InfoRow = ({ label, value, icon: Icon }) => (
    <div className="flex items-center gap-3 py-3 border-b border-border/40 last:border-0">
      {Icon && <Icon className="h-4 w-4 text-muted-foreground shrink-0" />}
      <span className="text-sm text-muted-foreground min-w-[120px]">{label}</span>
      <span className="text-sm font-medium text-foreground">{value || "—"}</span>
    </div>
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Profile"
        description="View and verify your registered academic and personal details."
      />

      {/* Header Profile Summary */}
      <div className="relative overflow-hidden rounded-xl border border-border bg-gradient-to-r from-primary/10 via-background to-background p-6 md:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center">
          <div className="relative h-24 w-24 shrink-0 rounded-full border-2 border-primary bg-muted overflow-hidden">
            {student.photoPath ? (
              <img 
                src={student.photoPath.startsWith("http") ? student.photoPath : `http://localhost:8080/${student.photoPath}`} 
                alt="Student Profile" 
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-primary/15 text-primary">
                <User className="h-10 w-10" />
              </div>
            )}
          </div>
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-2xl font-bold tracking-tight text-foreground">
                {student.firstName} {student.lastName}
              </h2>
              <Badge variant={student.status === "ACTIVE" ? "success" : "secondary"}>
                {student.status || "ACTIVE"}
              </Badge>
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <BookOpen className="h-4 w-4" /> Class {student.className || "—"} - {student.section || "—"}
              </span>
              <span className="flex items-center gap-1.5">
                <Award className="h-4 w-4" /> Roll No: {student.rollNo || "—"}
              </span>
              <span className="flex items-center gap-1.5">
                <FileText className="h-4 w-4" /> Student ID: {student.studentId || "—"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabbed Info Panels */}
      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:w-[480px]">
          <TabsTrigger value="personal">Personal</TabsTrigger>
          <TabsTrigger value="academic">Academic</TabsTrigger>
          <TabsTrigger value="parents">Parents</TabsTrigger>
          <TabsTrigger value="facilities">Facilities</TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="personal" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <User className="h-4 w-4 text-primary" /> Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="divide-y divide-border/30">
                <InfoRow label="Gender" value={student.gender} icon={User} />
                <InfoRow label="Date of Birth" value={student.dob} icon={Calendar} />
                <InfoRow label="Blood Group" value={student.bloodGroup} icon={Heart} />
                <InfoRow label="Religion" value={student.religion} icon={Shield} />
                <InfoRow label="Category" value={student.category} icon={Award} />
                <InfoRow label="Email Address" value={student.email} icon={Mail} />
                <InfoRow label="Phone Number" value={student.studentPhone} icon={Phone} />
                <InfoRow label="Residential Address" value={student.address} icon={MapPin} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="academic" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-primary" /> Academic Administration
                </CardTitle>
              </CardHeader>
              <CardContent className="divide-y divide-border/30">
                <InfoRow label="Admission Number" value={student.admissionNo} icon={FileText} />
                <InfoRow label="Student ID / Username" value={student.studentId} icon={User} />
                <InfoRow label="Admission Date" value={student.admissionDate} icon={Calendar} />
                <InfoRow label="Current Academic Year" value={student.academicYear} icon={Calendar} />
                <InfoRow label="Attendance Score" value={student.attendancePercentage ? `${student.attendancePercentage}%` : "100%"} icon={Calendar} />
                <InfoRow label="Current Cumulative GPA" value={student.currentGpa ? student.currentGpa.toFixed(2) : "0.00"} icon={Award} />
                <InfoRow label="Current Rank in Class" value={student.currentRank ? `#${student.currentRank}` : "—"} icon={Award} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="parents" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" /> Parent & Guardian Information
                </CardTitle>
              </CardHeader>
              <CardContent className="divide-y divide-border/30">
                <InfoRow label="Father's Name" value={student.fatherName} icon={User} />
                <InfoRow label="Mother's Name" value={student.motherName} icon={User} />
                <InfoRow label="Designated Guardian" value={student.guardian} icon={User} />
                <InfoRow label="Emergency Contact Name" value={student.guardian || student.fatherName} icon={User} />
                <InfoRow label="Emergency Phone" value={student.emergencyContact || student.studentPhone} icon={Phone} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="facilities" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Home className="h-4 w-4 text-primary" /> Facilities & Health Information
                </CardTitle>
              </CardHeader>
              <CardContent className="divide-y divide-border/30">
                <InfoRow label="Transport Route" value={student.transport} icon={Truck} />
                <InfoRow label="Hostel Allocation" value={student.hostel} icon={Home} />
                <InfoRow label="School House / Club" value={student.house} icon={Award} />
                <InfoRow label="Medical Alert / Info" value={student.medicalInfo} icon={ShieldAlert} />
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
