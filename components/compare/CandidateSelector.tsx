"use client"

import { Users } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useJobs } from "@/hooks/use-jobs"
import { useSearchResults } from "@/hooks/use-search-results"
import { ApiError } from "@/lib/api-client"

interface CandidateSelectorProps {
  jobId: number | null
  onJobChange: (jobId: number | null) => void
  selectedCandidateIds: number[]
  onSelectionChange: (ids: number[]) => void
}

export function CandidateSelector({
  jobId,
  onJobChange,
  selectedCandidateIds,
  onSelectionChange,
}: CandidateSelectorProps) {
  const { data: jobs, isPending: isJobsPending } = useJobs()
  const completedJobs = (jobs ?? []).filter((job) => job.status === "completed")

  const {
    data: results,
    isPending: isResultsPending,
    isError,
    error,
  } = useSearchResults(jobId ?? 0)

  const handleJobChange = (value: string | null) => {
    onJobChange(value ? Number(value) : null)
    onSelectionChange([])
  }

  const toggleCandidate = (candidateId: number) => {
    if (selectedCandidateIds.includes(candidateId)) {
      onSelectionChange(selectedCandidateIds.filter((id) => id !== candidateId))
    } else {
      onSelectionChange([...selectedCandidateIds, candidateId])
    }
  }

  return (
    <Card className="rounded-xl border-border/60 shadow-sm">
      <CardHeader>
        <CardTitle className="text-base">Select candidates to compare</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <Label htmlFor="job-picker">Search job</Label>
          {isJobsPending ? (
            <Skeleton className="h-8 w-full sm:w-72" />
          ) : completedJobs.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No completed searches yet — run a search first.
            </p>
          ) : (
            <Select value={jobId ? String(jobId) : undefined} onValueChange={handleJobChange}>
              <SelectTrigger id="job-picker" className="w-full sm:w-72">
                <SelectValue placeholder="Choose a completed search" />
              </SelectTrigger>
              <SelectContent>
                {completedJobs.map((job) => (
                  <SelectItem key={job.id} value={String(job.id)}>
                    Job #{job.id}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        {jobId && (
          <div className="flex flex-col gap-2">
            <Label>Candidates from job #{jobId}</Label>

            {isResultsPending && (
              <div className="flex flex-col gap-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            )}

            {isError && (
              <Alert variant="destructive">
                <AlertTitle>Failed to load candidates</AlertTitle>
                <AlertDescription>
                  {error instanceof ApiError ? error.message : "Something went wrong."}
                </AlertDescription>
              </Alert>
            )}

            {!isResultsPending && !isError && results?.results.length === 0 && (
              <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-border py-8 text-center">
                <Users className="size-6 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  This job has no candidates to compare.
                </p>
              </div>
            )}

            {!isResultsPending && !isError && results && results.results.length > 0 && (
              <div className="flex flex-col gap-1.5">
                {results.results.map((candidate) => {
                  const isChecked = selectedCandidateIds.includes(candidate.candidate_id)
                  return (
                    <label
                      key={candidate.candidate_id}
                      className="flex cursor-pointer items-center gap-3 rounded-lg border border-border/60 p-2.5 transition-colors hover:bg-muted/50"
                    >
                      <input
                        type="checkbox"
                        className="size-4 rounded border-input accent-primary"
                        checked={isChecked}
                        onChange={() => toggleCandidate(candidate.candidate_id)}
                      />
                      <span className="flex-1 text-sm font-medium text-foreground">
                        {candidate.name?.trim() || "Unknown candidate"}
                      </span>
                      {candidate.ranking_score !== null && (
                        <Badge variant="secondary">
                          {Math.round(candidate.ranking_score)}%
                        </Badge>
                      )}
                    </label>
                  )
                })}
              </div>
            )}

            <p className="text-xs text-muted-foreground">
              {selectedCandidateIds.length} selected — pick at least 2 to compare.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
