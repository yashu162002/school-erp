import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ErrorState({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-destructive/30 bg-destructive/5 py-14 text-center">
      <AlertTriangle className="h-8 w-8 text-destructive" />
      <p className="font-medium text-foreground">Couldn't load this data</p>
      <p className="max-w-sm text-sm text-muted-foreground">{message || "Something went wrong. Please try again."}</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}
