"use client"

import { useRouter } from "next/navigation"
import { ArrowRight, Sparkles } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CandidateLink } from "@/components/candidate/CandidateLink"
import { ReasonCard } from "@/components/recommendations/ReasonCard"
import { SimilarityCard } from "@/components/recommendations/SimilarityCard"
import { useRecommendations } from "@/hooks/use-recommendations"
import { ApiError } from "@/lib/api-client"

export function RecommendedCandidates() {
  const router = useRouter()
  const { data: recommendations, isPending, isError, error, hasCompletedJobs } =
    useRecommendations()

  if (isPending) {
    return (
      <div className="flex flex-col gap-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-32 w-full rounded-xl" />
        ))}
      </div>
    )
  }

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Failed to load recommendations</AlertTitle>
        <AlertDescription>
          {error instanceof ApiError ? error.message : "Something went wrong."}
        </AlertDescription>
      </Alert>
    )
  }

  if (!hasCompletedJobs) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-border py-12 text-center">
        <Sparkles className="size-6 text-muted-foreground" />
        <p className="text-sm font-medium text-foreground">No recommendations yet</p>
        <p className="text-sm text-muted-foreground">Run a search first.</p>
      </div>
    )
  }

  if (recommendations.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-border py-12 text-center">
        <Sparkles className="size-6 text-muted-foreground" />
        <p className="text-sm font-medium text-foreground">No strong matches yet</p>
        <p className="text-sm text-muted-foreground">
          None of your completed searches produced an Excellent or Strong match.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {recommendations.map((candidate) => {
        const displayName = candidate.name?.trim() || "Unknown Candidate"
        const initials = candidate.name
          ? candidate.name
              .split(" ")
              .map((part) => part[0])
              .slice(0, 2)
              .join("")
              .toUpperCase()
          : "?"
        const detailHref = `/candidate/${candidate.candidate_id}?jobId=${candidate.source_job_id}`

        return (
          <Card
            key={candidate.candidate_id}
            className="cursor-pointer rounded-xl border-border/60 shadow-sm transition-shadow hover:shadow-md"
            onClick={() => router.push(detailHref)}
          >
            <CardContent className="flex flex-col gap-4 pt-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <Avatar size="lg" className="size-12">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <CandidateLink
                      candidateId={candidate.candidate_id}
                      name={candidate.name}
                      jobId={candidate.source_job_id}
                      className="text-base font-semibold text-foreground hover:underline"
                    >
                      {displayName}
                    </CandidateLink>
                    <span className="text-xs text-muted-foreground">
                      {candidate.email ?? "No email on file"} · from job #{candidate.source_job_id}
                    </span>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={(event) => {
                    event.stopPropagation()
                    router.push(detailHref)
                  }}
                >
                  View Candidate
                  <ArrowRight />
                </Button>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <ReasonCard
                  recommendation={candidate.recommendation}
                  aiReason={candidate.ai_reason}
                />
                <SimilarityCard semanticScore={candidate.semantic_score} />
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
