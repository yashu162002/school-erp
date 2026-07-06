import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { studentPortalApi } from "@/api/studentPortal.api";
import { PageHeader } from "@/components/common/PageHeader";
import { LoadingBlock } from "@/components/common/LoadingBlock";
import { ErrorState } from "@/components/common/ErrorState";
import { EmptyState } from "@/components/common/EmptyState";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, CheckCircle2, Circle, AlertCircle, Calendar, DollarSign, BookOpen } from "lucide-react";
import { toast } from "sonner";

export function StudentNotifications() {
  const queryClient = useQueryClient();

  const notifsQuery = useQuery({
    queryKey: ["student-notifications"],
    queryFn: studentPortalApi.getNotifications,
  });

  const readMutation = useMutation({
    mutationFn: studentPortalApi.readNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["student-notifications"] });
      toast.success("Notification marked as read");
    },
    onError: (err) => {
      toast.error(err.message || "Could not mark as read");
    },
  });

  if (notifsQuery.isLoading) {
    return <LoadingBlock rows={6} />;
  }

  if (notifsQuery.isError) {
    return (
      <ErrorState
        message="Could not load notifications"
        onRetry={notifsQuery.refetch}
      />
    );
  }

  const notifications = notifsQuery.data ?? [];

  const getIcon = (type) => {
    switch (type) {
      case "FEE":
        return <DollarSign className="h-5 w-5 text-warning" />;
      case "EXAM":
      case "HALL_TICKET":
        return <BookOpen className="h-5 w-5 text-primary" />;
      case "ATTENDANCE":
        return <Calendar className="h-5 w-5 text-destructive" />;
      default:
        return <Bell className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getTypeBadge = (type) => {
    switch (type) {
      case "FEE":
        return <Badge variant="warning">Fees</Badge>;
      case "EXAM":
        return <Badge variant="default">Exam</Badge>;
      case "HALL_TICKET":
        return <Badge variant="success">Hall Ticket</Badge>;
      case "ATTENDANCE":
        return <Badge variant="destructive">Attendance</Badge>;
      default:
        return <Badge variant="outline">{type || "Alert"}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notifications & Notices"
        description="Stay updated with school circulars, exam schedule releases, and fee reminders."
      />

      {notifications.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="All caught up!"
          description="You currently have no new notifications or alerts in your inbox."
        />
      ) : (
        <div className="space-y-4">
          {notifications.map((notif) => (
            <Card 
              key={notif.id} 
              className={`border transition-all duration-200 ${
                notif.isRead 
                  ? "border-border bg-background opacity-80" 
                  : "border-primary/20 bg-primary/5 shadow-sm"
              }`}
            >
              <CardContent className="p-5 flex items-start gap-4">
                {/* Type Icon */}
                <div className="h-10 w-10 rounded-lg bg-surface border border-border flex items-center justify-center shrink-0">
                  {getIcon(notif.type)}
                </div>

                {/* Content */}
                <div className="flex-1 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className={`text-base font-semibold ${notif.isRead ? "text-foreground/80" : "text-foreground"}`}>
                      {notif.title}
                    </h3>
                    {getTypeBadge(notif.type)}
                    {!notif.isRead && (
                      <Badge variant="primary" className="animate-pulse">New</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {notif.message}
                  </p>
                  <span className="text-xs text-muted-foreground block pt-1">
                    {notif.createdAt ? new Date(notif.createdAt).toLocaleString() : ""}
                  </span>
                </div>

                {/* Read Action */}
                {!notif.isRead && (
                  <Button
                    variant="ghost"
                    size="icon"
                    title="Mark as Read"
                    disabled={readMutation.isPending}
                    onClick={() => readMutation.mutate(notif.id)}
                  >
                    <CheckCircle2 className="h-5 w-5 text-muted-foreground hover:text-success transition-colors" />
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
