import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, FileText, Calendar, Filter, FileDown } from "lucide-react";
import { auditLogsApi } from "@/api/auditLogs.api";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { LoadingBlock } from "@/components/common/LoadingBlock";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from "@/components/ui/table";

export function AuditLogsPage() {
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("all");
  const [page, setPage] = useState(0);

  const auditQuery = useQuery({
    queryKey: ["audit-logs", page, search, actionFilter],
    queryFn: () => auditLogsApi.list(page, 15, search, actionFilter === "all" ? "" : actionFilter),
  });

  const logs = auditQuery.data?.content ?? [];
  const totalPages = auditQuery.data?.totalPages ?? 0;

  const exportCSV = () => {
    const headers = "Timestamp,User,Action,Module,IP Address,Details\n";
    const rows = logs
      .map(
        (l) =>
          `"${l.timestamp ? new Date(l.timestamp).toLocaleString() : ""}","${l.username}","${l.action}","${
            l.module || "SYSTEM"
          }","${l.ipAddress || ""}","${l.details || ""}"`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `system_audit_logs.csv`;
    link.click();
  };

  const actionOptions = [
    { value: "all", label: "All Actions" },
    { value: "USER_LOGIN", label: "User Login" },
    { value: "USER_LOGOUT", label: "User Logout" },
    { value: "ATTENDANCE_CREATED", label: "Attendance Created" },
    { value: "ATTENDANCE_UPDATED", label: "Attendance Updated" },
    { value: "PROFILE_UPDATED", label: "Profile Updated" },
    { value: "PASSWORD_RESET", label: "Password Reset" },
    { value: "ACCOUNT_LOCKED", label: "Account Locked" },
  ];

  return (
    <>
      <PageHeader
        title="Audit Logs"
        description="Monitor system activities, security events, and database actions."
        actions={
          <Button onClick={exportCSV} variant="outline" disabled={logs.length === 0}>
            <FileDown className="h-4 w-4" /> Export CSV
          </Button>
        }
      />

      {/* Filter and Search Bar */}
      <div className="mb-6 flex flex-wrap items-center gap-4 bg-muted/30 p-4 rounded-lg border border-border">
        <div className="relative max-w-xs flex-1">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by username…"
            className="pl-8 bg-background"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0);
            }}
          />
        </div>

        <div className="w-[180px]">
          <Select
            value={actionFilter}
            onValueChange={(val) => {
              setActionFilter(val);
              setPage(0);
            }}
          >
            <SelectTrigger className="bg-background">
              <SelectValue placeholder="Action" />
            </SelectTrigger>
            <SelectContent>
              {actionOptions.map((a) => (
                <SelectItem key={a.value} value={a.value}>
                  {a.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {auditQuery.isLoading ? (
        <LoadingBlock rows={8} />
      ) : auditQuery.isError ? (
        <ErrorState message={auditQuery.error?.message} onRetry={auditQuery.refetch} />
      ) : logs.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No audit logs found"
          description="Try adjusting your filters or search query."
        />
      ) : (
        <div className="space-y-4">
          <div className="rounded-lg border border-border bg-card overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>User ID</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Module</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead>Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((l) => {
                  let badgeVariant = "secondary";
                  if (l.action === "USER_LOGIN" || l.action === "PASSWORD_RESET") badgeVariant = "success";
                  if (l.action === "ACCOUNT_LOCKED") badgeVariant = "destructive";

                  return (
                    <TableRow key={l.id}>
                      <TableCell className="text-xs text-muted-foreground">
                        {l.timestamp ? new Date(l.timestamp).toLocaleString() : "—"}
                      </TableCell>
                      <TableCell className="font-mono text-xs font-semibold">{l.username}</TableCell>
                      <TableCell>
                        <Badge variant={badgeVariant} className="text-[10px]">
                          {l.action}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs">{l.module || "SYSTEM"}</TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">{l.ipAddress || "—"}</TableCell>
                      <TableCell className="text-xs font-medium text-foreground">{l.details || "—"}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center pt-2">
              <span className="text-xs text-muted-foreground">
                Page {page + 1} of {totalPages}
              </span>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0}
                >
                  Previous
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                  disabled={page === totalPages - 1}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
