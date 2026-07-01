"use client"

import Link from "next/link"
import { Briefcase } from "lucide-react"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { useJobs } from "@/hooks/use-jobs"
import { ApiError } from "@/lib/api-client"

const RECENT_JOBS_LIMIT = 5

const STATUS_VARIANT: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  completed: "default",
  running: "secondary",
  pending: "secondary",
  queued: "secondary",
  failed: "destructive",
}

function formatRelativeTime(dateString: string) {
  const date = new Date(dateString)
  const diffMs = date.getTime() - Date.now()
  const diffMinutes = Math.round(diffMs / 60000)
  const formatter = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" })

  if (Math.abs(diffMinutes) < 60) return formatter.format(diffMinutes, "minute")
  const diffHours = Math.round(diffMinutes / 60)
  if (Math.abs(diffHours) < 24) return formatter.format(diffHours, "hour")
  const diffDays = Math.round(diffHours / 24)
  return formatter.format(diffDays, "day")
}

export function RecentJobs() {
  const { data: jobs, isPending, isError, error } = useJobs()

  return (
    <Card className="rounded-xl border-border/60 shadow-sm">
      <CardHeader>
        <CardTitle className="text-base">Recent Jobs</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {isError && (
          <Alert variant="destructive">
            <AlertTitle>Failed to load jobs</AlertTitle>
            <AlertDescription>
              {error instanceof ApiError ? error.message : "Something went wrong."}
            </AlertDescription>
          </Alert>
        )}

        {isPending &&
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-2 rounded-lg border border-border/60 p-3">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-2 w-full" />
            </div>
          ))}

        {!isPending && !isError && jobs?.length === 0 && (
          <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-border py-8 text-center">
            <Briefcase className="size-6 text-muted-foreground" />
            <p className="text-sm font-medium text-foreground">No jobs yet</p>
            <p className="text-xs text-muted-foreground">
              Start your first search to see jobs here.
            </p>
          </div>
        )}

        {!isPending &&
          !isError &&
          jobs?.slice(0, RECENT_JOBS_LIMIT).map((job) => (
            // TODO: link to a job-detail page once it exists (e.g. /jobs/[id])
            <Link
              key={job.id}
              href="#"
              className="flex flex-col gap-2 rounded-lg border border-border/60 p-3 transition-colors hover:bg-muted/50"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">
                  Job #{job.id}
                </span>
                <Badge variant={STATUS_VARIANT[job.status] ?? "outline"} className="capitalize">
                  {job.status}
                </Badge>
              </div>
              <Progress value={job.progress} />
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{job.current_step || "—"}</span>
                <span>{formatRelativeTime(job.created_at)}</span>
              </div>
            </Link>
          ))}
      </CardContent>
    </Card>
  )
}
