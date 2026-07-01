"use client"

import { AuthGuard } from "@/components/auth/AuthGuard"
import { RoleGuard } from "@/components/auth/RoleGuard"
import { Navbar } from "@/components/layout/Navbar"
import { Sidebar } from "@/components/layout/Sidebar"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { HiringFunnel } from "@/components/analytics/HiringFunnel"
import { FeedbackChart } from "@/components/analytics/FeedbackChart"
import { CandidateChart } from "@/components/analytics/CandidateChart"
import { IndustryChart } from "@/components/analytics/IndustryChart"
import { SkillChart } from "@/components/analytics/SkillChart"
import { useFeedbackStats } from "@/hooks/use-feedback-stats"
import { ApiError } from "@/lib/api-client"

function AnalyticsContent() {
  const { data: stats, isPending, isError, error } = useFeedbackStats()

  return (
    <div className="flex flex-1 flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 bg-muted/20 px-4 py-8 sm:px-8">
          <div className="mx-auto flex max-w-5xl flex-col gap-6">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                Analytics
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Hiring activity and feedback trends across the platform.
              </p>
            </div>

            {isPending && (
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {Array.from({ length: 2 }).map((_, i) => (
                  <Skeleton key={i} className="h-80 w-full rounded-xl" />
                ))}
              </div>
            )}

            {isError && (
              <Alert variant="destructive">
                <AlertTitle>Failed to load analytics</AlertTitle>
                <AlertDescription>
                  {error instanceof ApiError ? error.message : "Something went wrong."}
                </AlertDescription>
              </Alert>
            )}

            {!isPending && !isError && stats && (
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <HiringFunnel stats={stats} />
                <FeedbackChart stats={stats} />
                <CandidateChart />
                <IndustryChart />
                <SkillChart />
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

export default function AnalyticsPage() {
  return (
    <AuthGuard>
      <RoleGuard allowedRoles={["recruiter", "admin"]}>
        <AnalyticsContent />
      </RoleGuard>
    </AuthGuard>
  )
}
