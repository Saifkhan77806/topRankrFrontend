"use client";

import { useEffect } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useJobStream } from "@/hooks/use-job-stream";

interface SearchProgressProps {
  jobId: number;
  onCompleted: (jobId: number) => void;
  onFailed: () => void;
  onRetry: () => void;
}

export function SearchProgress({
  jobId,
  onCompleted,
  onFailed,
  onRetry,
}: SearchProgressProps) {
  const { status, progress, currentStep, error, isConnected } =
    useJobStream(jobId);

  useEffect(() => {
    if (status === "completed") onCompleted(jobId);
    if (status === "failed") onFailed();
  }, [status, jobId, onCompleted, onFailed]);

  if (status === "completed") return null;

  if (status === "failed" || error) {
    return (
      <Card className="rounded-xl border-border/60 shadow-sm">
        <CardContent className="flex flex-col items-center gap-4 py-10 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="size-6 text-destructive" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">
              {status === "failed" ? "The search failed" : "Connection lost"}
            </p>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              {currentStep ||
                error ||
                "Something went wrong while running your search."}
            </p>
          </div>
          <Button variant="outline" onClick={onRetry}>
            Try again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-xl border-border/60 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Loader2 className="size-4 animate-spin text-primary" />
          Running your search
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <Progress value={progress} />
        <div className="flex items-center justify-between text-sm">
          <span className="text-foreground">
            {currentStep || "Connecting..."}
          </span>
          <span className="text-muted-foreground">{progress}%</span>
        </div>
        {!isConnected && !error && (
          <p className="text-xs text-muted-foreground">
            Reconnecting to progress stream...
          </p>
        )}
      </CardContent>
    </Card>
  );
}
