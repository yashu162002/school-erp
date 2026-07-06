import { lazy, Suspense } from "react";
import { PageHeader } from "@/components/common/PageHeader";

const FeeManagementSection = lazy(() => import("../components/FeeManagementSection"));

export function FeesPage() {
  return (
    <>
      <PageHeader
        title="Fees"
        description="View class-wise student fee details, record payments, and manage fees."
      />
      <Suspense fallback={<div className="h-64 mt-6 animate-pulse rounded-md bg-muted" />}>
        <FeeManagementSection isDashboard={false} />
      </Suspense>
    </>
  );
}
