"use client"

import { ArrowRight, Users } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CandidateLink } from "@/components/candidate/CandidateLink"
import { useRecentCandidates } from "@/hooks/use-recent-candidates"
import { ApiError } from "@/lib/api-client"

export function RecentCandidates() {
  const { data: candidates, isPending, isError, error } = useRecentCandidates()

  return (
    <Card className="rounded-xl border-border/60 shadow-sm">
      <CardHeader>
        <CardTitle className="text-base">Recent Candidates</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {isError && (
          <Alert variant="destructive">
            <AlertTitle>Failed to load candidates</AlertTitle>
            <AlertDescription>
              {error instanceof ApiError ? error.message : "Something went wrong."}
            </AlertDescription>
          </Alert>
        )}

        {isPending &&
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 rounded-lg border border-border/60 p-3">
              <Skeleton className="size-9 rounded-full" />
              <div className="flex flex-1 flex-col gap-1.5">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          ))}

        {!isPending && !isError && candidates.length === 0 && (
          <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-border py-8 text-center">
            <Users className="size-6 text-muted-foreground" />
            <p className="text-sm font-medium text-foreground">No candidates yet</p>
            <p className="text-xs text-muted-foreground">
              Completed searches will surface top candidates here.
            </p>
          </div>
        )}

        {!isPending &&
          !isError &&
          candidates.map((candidate) => {
            const displayName = candidate.name?.trim() || "Unknown candidate"
            const initials = candidate.name
              ? candidate.name
                  .split(" ")
                  .map((part) => part[0])
                  .slice(0, 2)
                  .join("")
                  .toUpperCase()
              : "?"

            return (
              <div
                key={`${candidate.jobId}-${candidate.candidate_id}`}
                className="flex items-center gap-3 rounded-lg border border-border/60 p-3"
              >
                <Avatar size="sm">
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-1 flex-col">
                  <CandidateLink
                    candidateId={candidate.candidate_id}
                    name={candidate.name}
                    jobId={candidate.jobId}
                    className="text-sm font-medium text-foreground hover:underline"
                  >
                    {displayName}
                  </CandidateLink>
                  <span className="text-xs text-muted-foreground">
                    {candidate.email ?? "No email on file"} · Job #{candidate.jobId}
                  </span>
                </div>
                {candidate.ranking_score !== null && (
                  <Badge variant="secondary">
                    {Math.round(candidate.ranking_score * 100)}%
                  </Badge>
                )}
                <Button
                  variant="ghost"
                  size="icon-sm"
                  render={
                    <CandidateLink
                      candidateId={candidate.candidate_id}
                      name={candidate.name}
                      jobId={candidate.jobId}
                    />
                  }
                >
                  <ArrowRight />
                  <span className="sr-only">View candidate</span>
                </Button>
              </div>
            )
          })}
      </CardContent>
    </Card>
  )
}
