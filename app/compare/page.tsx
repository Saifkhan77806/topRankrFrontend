"use client"

import { useState } from "react"
import { Loader2, Scale } from "lucide-react"

import { AuthGuard } from "@/components/auth/AuthGuard"
import { RoleGuard } from "@/components/auth/RoleGuard"
import { Navbar } from "@/components/layout/Navbar"
import { Sidebar } from "@/components/layout/Sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { CandidateSelector } from "@/components/compare/CandidateSelector"
import { ComparisonGrid } from "@/components/compare/ComparisonGrid"
import { WinnerCard } from "@/components/compare/WinnerCard"
import { RadarChart } from "@/components/compare/RadarChart"
import { useCompare } from "@/hooks/use-compare"
import { RateLimitError } from "@/services/recruiter/comparison-service"

function CompareContent() {
  const [jobId, setJobId] = useState<number | null>(null)
  const [selectedCandidateIds, setSelectedCandidateIds] = useState<number[]>([])

  const compareMutation = useCompare()

  const canCompare = !!jobId && selectedCandidateIds.length >= 2

  const handleCompare = () => {
    if (!jobId || selectedCandidateIds.length < 2) return
    compareMutation.mutate({ job_id: jobId, candidate_ids: selectedCandidateIds })
  }

  const isRateLimited = compareMutation.error instanceof RateLimitError

  return (
    <div className="flex flex-1 flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 bg-muted/20 px-4 py-8 sm:px-8">
          <div className="mx-auto flex max-w-5xl flex-col gap-6">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                Compare candidates
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Pick a completed search and compare any number of its candidates
                side by side, with an AI-recommended pick.
              </p>
            </div>

            <CandidateSelector
              jobId={jobId}
              onJobChange={setJobId}
              selectedCandidateIds={selectedCandidateIds}
              onSelectionChange={setSelectedCandidateIds}
            />

            <div className="flex flex-col gap-3">
              {compareMutation.error && (
                <Alert variant="destructive">
                  <AlertTitle>{isRateLimited ? "Slow down" : "Comparison failed"}</AlertTitle>
                  <AlertDescription>
                    {compareMutation.error instanceof Error
                      ? compareMutation.error.message
                      : "Something went wrong. Please try again."}
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex items-center gap-3">
                <Button
                  size="lg"
                  className="h-11 rounded-xl"
                  onClick={handleCompare}
                  disabled={!canCompare || compareMutation.isPending}
                >
                  {compareMutation.isPending ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <Scale />
                  )}
                  {compareMutation.isPending ? "Comparing with AI..." : "Compare"}
                </Button>
                {!canCompare && !compareMutation.isPending && (
                  <p className="text-xs text-muted-foreground">
                    Select a search job and at least 2 candidates to compare.
                  </p>
                )}
              </div>
            </div>

            {compareMutation.isPending && (
              <Card className="rounded-xl border-border/60 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base">Comparing candidates with AI...</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                  <Skeleton className="h-24 w-full" />
                  <Skeleton className="h-64 w-full" />
                </CardContent>
              </Card>
            )}

            {compareMutation.isSuccess && compareMutation.data && (
              <div className="flex flex-col gap-6">
                <WinnerCard comparison={compareMutation.data} />
                <ComparisonGrid comparison={compareMutation.data} />
                <Card className="rounded-xl border-border/60 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-base">Score comparison</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RadarChart candidates={compareMutation.data.comparison} />
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

export default function ComparePage() {
  return (
    <AuthGuard>
      <RoleGuard allowedRoles={["recruiter", "admin"]}>
        <CompareContent />
      </RoleGuard>
    </AuthGuard>
  )
}
