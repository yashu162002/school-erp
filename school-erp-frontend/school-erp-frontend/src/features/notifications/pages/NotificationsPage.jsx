import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Bell, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { notificationsApi } from "@/api/notifications.api";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { LoadingBlock } from "@/components/common/LoadingBlock";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

// Mirrors NotificationRequest exactly
const notificationSchema = z.object({
  title: z.string().min(1, "Title is required"),
  message: z.string().min(1, "Message is required"),
  notificationType: z.string().min(1, "Type is required"),
  targetAudience: z.string().min(1, "Target audience is required"),
});

export function NotificationsPage() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const query = useQuery({ queryKey: ["notifications"], queryFn: notificationsApi.list });

  const form = useForm({
    resolver: zodResolver(notificationSchema),
    defaultValues: { title: "", message: "", notificationType: "", targetAudience: "" },
  });

  const createMutation = useMutation({
    mutationFn: notificationsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.success("Notification sent");
      setOpen(false);
      form.reset();
    },
    onError: (err) => toast.error(err.message || "Couldn't send notification"),
  });

  const notifications = query.data ?? [];

  return (
    <>
      <PageHeader
        title="Notifications"
        description="Send and review notifications."
        actions={
          <Button onClick={() => setOpen(true)}>
            <Plus className="h-4 w-4" />
            New notification
          </Button>
        }
      />

      {query.isLoading ? (
        <LoadingBlock rows={4} />
      ) : query.isError ? (
        <ErrorState message={query.error?.message} onRetry={query.refetch} />
      ) : notifications.length === 0 ? (
        <EmptyState icon={Bell} title="No notifications yet" description="Sent notifications will appear here." />
      ) : (
        <div className="rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Audience</TableHead>
                <TableHead>Read</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {notifications.map((n) => (
                <TableRow key={n.id}>
                  <TableCell className="font-medium">{n.title}</TableCell>
                  <TableCell className="max-w-xs truncate text-muted-foreground">{n.message}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{n.notificationType}</Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{n.targetAudience}</TableCell>
                  <TableCell>
                    <Badge variant={n.isRead ? "success" : "outline"}>
                      {n.isRead ? "Read" : "Unread"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New notification</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit((v) => createMutation.mutate(v))} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="notificationType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <FormControl><Input placeholder="e.g. INFO, ALERT" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="targetAudience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target audience</FormLabel>
                    <FormControl><Input placeholder="e.g. ALL, STUDENTS" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createMutation.isPending}>
                  {createMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                  Send
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
