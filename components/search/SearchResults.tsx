"use client"

import { Users } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { useJobResults } from "@/hooks/use-job-results"
import { ApiError } from "@/lib/api-client"

interface SearchResultsProps {
  jobId: number
  onNewSearch: () => void
}

export function SearchResults({ jobId, onNewSearch }: SearchResultsProps) {
  const { data, isPending, isError, error } = useJobResults(jobId)

  return (
    <Card className="rounded-xl border-border/60 shadow-sm">
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle className="text-base">Search results</CardTitle>
        <Button variant="outline" size="sm" onClick={onNewSearch}>
          New search
        </Button>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {isError && (
          <Alert variant="destructive">
            <AlertTitle>Failed to load results</AlertTitle>
            <AlertDescription>
              {error instanceof ApiError ? error.message : "Something went wrong."}
            </AlertDescription>
          </Alert>
        )}

        {isPending &&
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 rounded-lg border border-border/60 p-3">
              <Skeleton className="size-9 rounded-full" />
              <div className="flex flex-1 flex-col gap-1.5">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          ))}

        {!isPending && !isError && data?.results.length === 0 && (
          <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-border py-8 text-center">
            <Users className="size-6 text-muted-foreground" />
            <p className="text-sm font-medium text-foreground">No candidates found</p>
            <p className="text-xs text-muted-foreground">
              Try a different job description or broaden the requirements.
            </p>
          </div>
        )}

        {!isPending &&
          !isError &&
          data?.results.map((candidate) => {
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
                key={candidate.candidate_id}
                className="flex items-center gap-3 rounded-lg border border-border/60 p-3"
              >
                <span className="w-6 shrink-0 text-center text-sm font-medium text-muted-foreground">
                  #{candidate.rank}
                </span>
                <Avatar size="sm">
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-1 flex-col">
                  <span className="text-sm font-medium text-foreground">{displayName}</span>
                  <span className="text-xs text-muted-foreground">
                    {candidate.email ?? "No email on file"}
                  </span>
                  {candidate.ai_reason && (
                    <span className="mt-1 text-xs text-muted-foreground">
                      {candidate.ai_reason}
                    </span>
                  )}
                </div>
                {candidate.ranking_score !== null && (
                  <Badge variant="secondary">
                    {Math.round(candidate.ranking_score * 100)}%
                  </Badge>
                )}
              </div>
            )
          })}
      </CardContent>
    </Card>
  )
}
