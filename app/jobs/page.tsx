"use client"

import Link from "next/link"
import { Briefcase, Info } from "lucide-react"

import { AuthGuard } from "@/components/auth/AuthGuard"
import { RoleGuard } from "@/components/auth/RoleGuard"
import { Navbar } from "@/components/layout/Navbar"
import { Sidebar } from "@/components/layout/Sidebar"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { Progress } from "@/components/ui/progress"
import { useJobs } from "@/hooks/use-jobs"
import { ApiError } from "@/lib/api-client"

const STATUS_VARIANT: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  completed: "default",
  running: "secondary",
  pending: "secondary",
  queued: "secondary",
  failed: "destructive",
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  })
}

function JobsContent() {
  const { data: jobs, isPending, isError, error } = useJobs()

  return (
    <div className="flex flex-1 flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 bg-muted/20 px-4 py-8 sm:px-8">
          <div className="mx-auto flex max-w-4xl flex-col gap-6">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                Jobs
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Every search job you&apos;ve run. Open one to see its ranked candidates.
              </p>
            </div>

            <Alert>
              <Info />
              <AlertTitle>Job description not shown here</AlertTitle>
              <AlertDescription>
                The backend doesn&apos;t currently return the original job description
                text for a job once submitted — only its status and ranked results.
                Showing the JD here would require a small backend addition to persist
                and return it.
              </AlertDescription>
            </Alert>

            {isError && (
              <Alert variant="destructive">
                <AlertTitle>Failed to load jobs</AlertTitle>
                <AlertDescription>
                  {error instanceof ApiError ? error.message : "Something went wrong."}
                </AlertDescription>
              </Alert>
            )}

            {isPending && (
              <div className="flex flex-col gap-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-20 w-full rounded-xl" />
                ))}
              </div>
            )}

            {!isPending && !isError && jobs?.length === 0 && (
              <Card className="rounded-xl border-border/60 shadow-sm">
                <CardContent className="flex flex-col items-center gap-2 py-12 text-center">
                  <Briefcase className="size-6 text-muted-foreground" />
                  <p className="text-sm font-medium text-foreground">No jobs yet</p>
                  <p className="text-sm text-muted-foreground">
                    Start a search to create your first job.
                  </p>
                </CardContent>
              </Card>
            )}

            {!isPending && !isError && jobs && jobs.length > 0 && (
              <div className="flex flex-col gap-3">
                {jobs.map((job) => (
                  <Link key={job.id} href={`/search/results/${job.id}`}>
                    <Card className="rounded-xl border-border/60 shadow-sm transition-shadow hover:shadow-md">
                      <CardContent className="flex flex-col gap-2 pt-6">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-foreground">
                            Job #{job.id}
                          </span>
                          <Badge
                            variant={STATUS_VARIANT[job.status] ?? "outline"}
                            className="capitalize"
                          >
                            {job.status}
                          </Badge>
                        </div>
                        <Progress value={job.progress} />
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>{job.current_step || "—"}</span>
                          <span>{formatDate(job.created_at)}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

export default function JobsPage() {
  return (
    <AuthGuard>
      <RoleGuard allowedRoles={["recruiter", "admin"]}>
        <JobsContent />
      </RoleGuard>
    </AuthGuard>
  )
}
