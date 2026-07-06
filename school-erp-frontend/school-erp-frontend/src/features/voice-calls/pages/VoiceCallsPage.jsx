import { useQuery } from "@tanstack/react-query";
import { PhoneCall, PhoneOutgoing, PhoneOff, Clock } from "lucide-react";
import { voiceCallsApi } from "@/api/voiceCalls.api";
import { PageHeader } from "@/components/common/PageHeader";
import { NotImplementedBanner } from "@/components/common/NotImplementedBanner";
import { StatCard } from "@/components/common/StatCard";
import { ErrorState } from "@/components/common/ErrorState";

export function VoiceCallsPage() {
  const query = useQuery({ queryKey: ["voice-call-stats"], queryFn: voiceCallsApi.getStats });

  return (
    <>
      <PageHeader title="Voice Calls" description="Automated voice call activity." />

      <NotImplementedBanner>
        VoiceCallController currently returns fixed sample numbers rather than querying
        voice_call_logs, so these stats won't change between loads yet.
      </NotImplementedBanner>

      {query.isError ? (
        <ErrorState message={query.error?.message} onRetry={query.refetch} />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Calls today" value={query.data?.totalCallsToday ?? "—"} icon={PhoneCall} isLoading={query.isLoading} />
          <StatCard label="Successful" value={query.data?.successfulCalls ?? "—"} icon={PhoneOutgoing} isLoading={query.isLoading} accent="success" />
          <StatCard label="Failed" value={query.data?.failedCalls ?? "—"} icon={PhoneOff} isLoading={query.isLoading} />
          <StatCard label="Scheduled" value={query.data?.scheduledCalls ?? "—"} icon={Clock} isLoading={query.isLoading} accent="accent" />
        </div>
      )}
    </>
  );
}
