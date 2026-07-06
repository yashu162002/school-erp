import React from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { ExamsTable } from "@/features/results/components/ExamsTable";

export function ExamsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Exam Administration"
        description="Schedule class-wise exams, create timetables, and enable visibility for students and teachers."
      />
      <div className="w-full">
        <ExamsTable />
      </div>
    </div>
  );
}
