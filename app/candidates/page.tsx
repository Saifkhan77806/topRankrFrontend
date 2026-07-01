"use client"

import { useMemo, useState } from "react"
import { FileText, Search, Users } from "lucide-react"

import { AuthGuard } from "@/components/auth/AuthGuard"
import { RoleGuard } from "@/components/auth/RoleGuard"
import { Navbar } from "@/components/layout/Navbar"
import { Sidebar } from "@/components/layout/Sidebar"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { CandidateLink } from "@/components/candidate/CandidateLink"
import { PDFViewer } from "@/components/candidate/PDFViewer"
import { useAllCandidates, type AggregatedCandidate } from "@/hooks/use-all-candidates"
import { ApiError } from "@/lib/api-client"

function CandidatesContent() {
  const { data: candidates, isPending, isError, error, hasCompletedJobs } = useAllCandidates()
  const [query, setQuery] = useState("")
  const [resumeCandidate, setResumeCandidate] = useState<AggregatedCandidate | null>(null)

  const filteredCandidates = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return candidates
    return candidates.filter((candidate) => {
      const name = candidate.name?.toLowerCase() ?? ""
      const email = candidate.email?.toLowerCase() ?? ""
      return name.includes(q) || email.includes(q)
    })
  }, [candidates, query])

  return (
    <div className="flex flex-1 flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 bg-muted/20 px-4 py-8 sm:px-8">
          <div className="mx-auto flex max-w-5xl flex-col gap-6">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                Candidates
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Every candidate seen across your completed searches.
              </p>
            </div>

            <div className="relative sm:max-w-sm">
              <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by name or email"
                className="pl-8"
              />
            </div>

            {isError && (
              <Alert variant="destructive">
                <AlertTitle>Failed to load candidates</AlertTitle>
                <AlertDescription>
                  {error instanceof ApiError ? error.message : "Something went wrong."}
                </AlertDescription>
              </Alert>
            )}

            {isPending && (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-32 w-full rounded-xl" />
                ))}
              </div>
            )}

            {!isPending && !isError && !hasCompletedJobs && (
              <Card className="rounded-xl border-border/60 shadow-sm">
                <CardContent className="flex flex-col items-center gap-2 py-12 text-center">
                  <Users className="size-6 text-muted-foreground" />
                  <p className="text-sm font-medium text-foreground">No candidates yet</p>
                  <p className="text-sm text-muted-foreground">
                    Run a search to see candidates here.
                  </p>
                </CardContent>
              </Card>
            )}

            {!isPending && !isError && hasCompletedJobs && filteredCandidates.length === 0 && (
              <Card className="rounded-xl border-border/60 shadow-sm">
                <CardContent className="flex flex-col items-center gap-2 py-12 text-center">
                  <Users className="size-6 text-muted-foreground" />
                  <p className="text-sm font-medium text-foreground">No matching candidates</p>
                  <p className="text-sm text-muted-foreground">
                    Try a different name or email.
                  </p>
                </CardContent>
              </Card>
            )}

            {!isPending && !isError && filteredCandidates.length > 0 && (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredCandidates.map((candidate) => {
                  const displayName = candidate.name?.trim() || "Unknown Candidate"
                  const initials = candidate.name
                    ? candidate.name
                        .split(" ")
                        .map((part) => part[0])
                        .slice(0, 2)
                        .join("")
                        .toUpperCase()
                    : "?"

                  return (
                    <Card
                      key={candidate.candidate_id}
                      className="rounded-xl border-border/60 shadow-sm"
                    >
                      <CardContent className="flex flex-col gap-3 pt-6">
                        <div className="flex items-start gap-3">
                          <Avatar size="lg" className="size-11">
                            <AvatarFallback className="bg-primary/10 text-primary">
                              {initials}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-1 flex-col overflow-hidden">
                            <CandidateLink
                              candidateId={candidate.candidate_id}
                              name={candidate.name}
                              jobId={candidate.jobId}
                              className="truncate text-sm font-semibold text-foreground hover:underline"
                            >
                              {displayName}
                            </CandidateLink>
                            <span className="truncate text-xs text-muted-foreground">
                              {candidate.email ?? "No email on file"}
                            </span>
                          </div>
                        </div>

                        {candidate.ranking_score !== null && (
                          <Badge variant="secondary" className="w-fit">
                            {Math.round(candidate.ranking_score)}% match
                          </Badge>
                        )}

                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => setResumeCandidate(candidate)}
                          >
                            <FileText />
                            Resume
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="flex-1"
                            render={
                              <CandidateLink
                                candidateId={candidate.candidate_id}
                                name={candidate.name}
                                jobId={candidate.jobId}
                              />
                            }
                          >
                            View profile
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </div>
        </main>
      </div>

      {resumeCandidate && (
        <PDFViewer
          candidateId={resumeCandidate.candidate_id}
          candidateName={resumeCandidate.name?.trim() || "Unknown candidate"}
          open={!!resumeCandidate}
          onOpenChange={(open) => {
            if (!open) setResumeCandidate(null)
          }}
        />
      )}
    </div>
  )
}

export default function CandidatesPage() {
  return (
    <AuthGuard>
      <RoleGuard allowedRoles={["recruiter", "admin"]}>
        <CandidatesContent />
      </RoleGuard>
    </AuthGuard>
  )
}
