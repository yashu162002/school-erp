import React from "react";
import { useQuery } from "@tanstack/react-query";
import { studentPortalApi } from "@/api/studentPortal.api";
import { getStudentPhotoUrl } from "@/lib/utils";
import { PageHeader } from "@/components/common/PageHeader";
import { LoadingBlock } from "@/components/common/LoadingBlock";
import { ErrorState } from "@/components/common/ErrorState";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download, FileText, BadgeCheck, ShieldAlert, Landmark, User } from "lucide-react";
import { toast } from "sonner";

export function StudentDocuments() {
  const docsQuery = useQuery({
    queryKey: ["student-documents"],
    queryFn: studentPortalApi.getDocuments,
  });

  const profileQuery = useQuery({
    queryKey: ["student-profile"],
    queryFn: studentPortalApi.getProfile,
  });

  if (docsQuery.isLoading || profileQuery.isLoading) {
    return <LoadingBlock rows={6} />;
  }

  if (docsQuery.isError || profileQuery.isError) {
    return (
      <ErrorState
        message="Could not load student documents"
        onRetry={() => {
          docsQuery.refetch();
          profileQuery.refetch();
        }}
      />
    );
  }

  const uploadedDocs = docsQuery.data ?? [];
  const student = profileQuery.data;

  // Let's create some dynamic/printable document links that are always available for a student!
  const systemDocuments = [
    {
      id: "sys-study-cert",
      documentName: "Study Certificate (Bonafide)",
      documentType: "STUDY_CERTIFICATE",
      uploadDate: student.admissionDate || "—",
      isSystemGenerated: true,
    },
    {
      id: "sys-id-card",
      documentName: "Student Identity Card (Printable)",
      documentType: "ID_CARD",
      uploadDate: student.admissionDate || "—",
      isSystemGenerated: true,
    },
  ];

  const allDocuments = [...systemDocuments, ...uploadedDocs];

  const handleDownload = (doc) => {
    if (doc.isSystemGenerated) {
      if (doc.documentType === "ID_CARD") {
        printStudentIDCard();
      } else if (doc.documentType === "STUDY_CERTIFICATE") {
        printStudyCertificate();
      }
    } else {
      // Direct file download from backend upload path
      if (doc.filePath) {
        const fileUrl = doc.filePath.startsWith("http") ? doc.filePath : `http://localhost:8080/${doc.filePath}`;
        window.open(fileUrl, "_blank");
      } else {
        toast.error("Document file path is invalid");
      }
    }
  };

  const printStudentIDCard = () => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Student ID Card - ${student.firstName}</title>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              margin: 0;
              background-color: #f3f4f6;
            }
            .id-card {
              width: 320px;
              height: 480px;
              background-color: #ffffff;
              border-radius: 12px;
              box-shadow: 0 4px 15px rgba(0,0,0,0.1);
              overflow: hidden;
              border: 1px solid #e5e7eb;
              display: flex;
              flex-direction: column;
            }
            .header {
              background-color: #1e3a8a;
              color: white;
              padding: 16px;
              text-align: center;
            }
            .header h2 {
              margin: 0;
              font-size: 16px;
              letter-spacing: 1px;
            }
            .header p {
              margin: 4px 0 0 0;
              font-size: 10px;
              opacity: 0.8;
            }
            .photo-area {
              display: flex;
              justify-content: center;
              padding: 24px 0;
              background-color: #f9fafb;
            }
            .photo {
              width: 100px;
              height: 110px;
              border-radius: 6px;
              border: 2px solid #e5e7eb;
              background-color: #e5e7eb;
              display: flex;
              align-items: center;
              justify-content: center;
              overflow: hidden;
            }
            .photo img {
              width: 100%;
              height: 100%;
              object-cover: cover;
            }
            .details {
              padding: 16px 24px;
              flex-grow: 1;
            }
            .name {
              font-size: 18px;
              font-weight: bold;
              text-align: center;
              color: #111827;
              margin-bottom: 12px;
            }
            .detail-row {
              display: flex;
              margin-bottom: 8px;
              font-size: 12px;
            }
            .label {
              color: #6b7280;
              width: 100px;
              font-weight: 500;
            }
            .val {
              color: #1f2937;
              font-weight: 600;
            }
            .footer {
              background-color: #1e3a8a;
              height: 12px;
            }
            @media print {
              body { background-color: white; }
              .id-card { box-shadow: none; border: 1px solid #000; }
            }
          </style>
        </head>
        <body onload="window.print()">
          <div class="id-card">
            <div class="header">
              <h2>TRISHUL HIGH SCHOOL, DAVANGERE</h2>
              <p>STUDENT ID CARD</p>
            </div>
            <div class="photo-area">
              <div class="photo">
                ${student.photoPath ? `<img src="${getStudentPhotoUrl(student.photoPath)}" />` : '<div style="font-size: 10px; color: #6b7280">No Photo</div>'}
              </div>
            </div>
            <div class="details">
              <div class="name">${student.firstName} ${student.lastName}</div>
              <div class="detail-row"><span class="label">Student ID:</span><span class="val">${student.studentId}</span></div>
              <div class="detail-row"><span class="label">Roll No:</span><span class="val">${student.rollNo || '—'}</span></div>
              <div class="detail-row"><span class="label">Class:</span><span class="val">Class ${student.className}</span></div>
              <div class="detail-row"><span class="label">Section:</span><span class="val">${student.section}</span></div>
              <div class="detail-row"><span class="label">Phone:</span><span class="val">${student.studentPhone || '—'}</span></div>
            </div>
            <div class="footer"></div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const printStudyCertificate = () => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Study Certificate - ${student.firstName}</title>
          <style>
            body {
              font-family: Georgia, serif;
              padding: 40px;
              line-height: 1.6;
              color: #333;
            }
            .cert-border {
              border: 10px double #1e3a8a;
              padding: 40px;
              max-width: 800px;
              margin: 0 auto;
              background-color: #fff;
            }
            .header {
              text-align: center;
              margin-bottom: 40px;
            }
            .header h1 {
              font-size: 28px;
              margin: 0;
              color: #1e3a8a;
            }
            .header p {
              margin: 5px 0;
              font-size: 12px;
              color: #666;
            }
            .title {
              text-align: center;
              font-size: 22px;
              font-weight: bold;
              margin-bottom: 40px;
              text-decoration: underline;
            }
            .content {
              font-size: 16px;
              text-align: justify;
              margin-bottom: 50px;
            }
            .signature-area {
              display: flex;
              justify-content: space-between;
              margin-top: 80px;
            }
            .signature {
              text-align: center;
              width: 200px;
            }
            .line {
              border-bottom: 1px solid #333;
              margin-bottom: 5px;
              height: 20px;
            }
          </style>
        </head>
        <body onload="window.print()">
          <div class="cert-border">
            <div class="header">
              <h1>TRISHUL HIGH SCHOOL, DAVANGERE</h1>
              <p>Affiliated Secondary and Higher Secondary Board</p>
            </div>
            <div class="title">STUDY & BONAFIDE CERTIFICATE</div>
            <div class="content">
              This is to certify that Master/Miss <strong>${student.firstName} ${student.lastName}</strong>, 
              son/daughter of Mr. <strong>${student.fatherName || '—'}</strong>, is a bonafide student of this institution 
              admitted on <strong>${student.admissionDate || '—'}</strong> under Admission No: <strong>${student.admissionNo}</strong>.
              <br/><br/>
              He/She is currently studying in <strong>Class ${student.className}</strong>, Section <strong>${student.section}</strong> 
              for the Academic Year <strong>${student.academicYear || new Date().getFullYear()}</strong>.
              <br/><br/>
              To the best of our knowledge, his/her character and conduct have been exemplary.
            </div>
            <div class="signature-area">
              <div class="signature">
                <div class="line"></div>
                <span>Prepared By</span>
              </div>
              <div class="signature">
                <div class="line"></div>
                <span>Principal Seal & Sign</span>
              </div>
            </div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Documents & Certificates"
        description="View and print official letters, study certificates, marksheet pdfs, or school identity cards."
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold">Available Documents</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Document Name</TableHead>
                <TableHead>Document Type</TableHead>
                <TableHead>Issue / Upload Date</TableHead>
                <TableHead>Source</TableHead>
                <TableHead className="w-32 text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allDocuments.map((doc) => (
                <TableRow key={doc.id} className="hover:bg-muted/10 transition-colors">
                  <TableCell className="font-semibold text-foreground py-3.5 flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary shrink-0" />
                    {doc.documentName}
                  </TableCell>
                  <TableCell className="py-3.5">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-primary/10 text-primary">
                      {doc.documentType}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground py-3.5">
                    {doc.uploadDate}
                  </TableCell>
                  <TableCell className="text-xs py-3.5">
                    {doc.isSystemGenerated ? (
                      <span className="text-success font-medium">System Generated</span>
                    ) : (
                      <span className="text-muted-foreground">Admin Uploaded</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right py-3.5">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 gap-1.5"
                      onClick={() => handleDownload(doc)}
                    >
                      <Download className="h-3.5 w-3.5" />
                      {doc.isSystemGenerated ? "Print" : "Download"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
