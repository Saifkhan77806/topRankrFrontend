"use client"

import {
  Briefcase,
  CheckCircle2,
  Loader2,
  ThumbsUp,
  UserCheck,
  UserX,
} from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useJobs } from "@/hooks/use-jobs"
import { useFeedbackStats } from "@/hooks/use-feedback-stats"
import { ApiError } from "@/lib/api-client"

interface StatDef {
  label: string
  value: number
  icon: React.ComponentType<{ className?: string }>
  accent: string
}

export function StatsCards() {
  const jobsQuery = useJobs()
  const feedbackQuery = useFeedbackStats()

  const isLoading = jobsQuery.isPending || feedbackQuery.isPending
  const isError = jobsQuery.isError || feedbackQuery.isError

  if (isError) {
    const message =
      (jobsQuery.error instanceof ApiError && jobsQuery.error.message) ||
      (feedbackQuery.error instanceof ApiError && feedbackQuery.error.message) ||
      "Could not load dashboard stats."
    return (
      <Alert variant="destructive">
        <AlertTitle>Failed to load stats</AlertTitle>
        <AlertDescription>{message}</AlertDescription>
      </Alert>
    )
  }

  const jobs = jobsQuery.data ?? []
  const totalJobs = jobs.length
  const runningJobs = jobs.filter(
    (job) => job.status === "running" || job.status === "pending" || job.status === "queued"
  ).length
  const completedJobs = jobs.filter((job) => job.status === "completed").length

  const feedback = feedbackQuery.data

  const stats: StatDef[] = [
    { label: "Total Jobs", value: totalJobs, icon: Briefcase, accent: "text-indigo-600 bg-indigo-50" },
    { label: "In Progress", value: runningJobs, icon: Loader2, accent: "text-sky-600 bg-sky-50" },
    { label: "Completed", value: completedJobs, icon: CheckCircle2, accent: "text-emerald-600 bg-emerald-50" },
    { label: "Shortlisted", value: feedback?.shortlisted ?? 0, icon: ThumbsUp, accent: "text-violet-600 bg-violet-50" },
    { label: "Interviewed", value: feedback?.interviewed ?? 0, icon: UserCheck, accent: "text-amber-600 bg-amber-50" },
    { label: "Hired", value: feedback?.hired ?? 0, icon: UserCheck, accent: "text-teal-600 bg-teal-50" },
    { label: "Rejected", value: feedback?.rejected ?? 0, icon: UserX, accent: "text-rose-600 bg-rose-50" },
  ]

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="rounded-xl border-border/60 shadow-sm">
          <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              {stat.label}
            </CardTitle>
            <div className={`flex size-8 items-center justify-center rounded-lg ${stat.accent}`}>
              <stat.icon className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-7 w-12" />
            ) : (
              <div className="text-2xl font-semibold tracking-tight text-foreground">
                {stat.value}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
