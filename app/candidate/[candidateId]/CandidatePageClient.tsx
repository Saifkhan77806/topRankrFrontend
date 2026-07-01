"use client"

import { useSearchParams } from "next/navigation"
import { UserX } from "lucide-react"

import { AuthGuard } from "@/components/auth/AuthGuard"
import { RoleGuard } from "@/components/auth/RoleGuard"
import { Navbar } from "@/components/layout/Navbar"
import { Sidebar } from "@/components/layout/Sidebar"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ProfileHeader } from "@/components/candidate/ProfileHeader"
import { Skills } from "@/components/candidate/Skills"
import { Experience } from "@/components/candidate/Experience"
import { Education } from "@/components/candidate/Education"
import { Projects } from "@/components/candidate/Projects"
import { Leadership } from "@/components/candidate/Leadership"
import { useCandidateDetail } from "@/hooks/use-candidate-detail"
import { CandidateNotFoundError } from "@/services/recruiter/candidate-service"
import { ApiError } from "@/lib/api-client"

function CandidateContent({ candidateId }: { candidateId: number }) {
  const { data: candidate, isPending, isError, error } = useCandidateDetail(candidateId)
  const searchParams = useSearchParams()
  const autoOpenResume = searchParams.get("resume") === "1"

  const isNotFound = error instanceof CandidateNotFoundError

  return (
    <div className="flex flex-1 flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 bg-muted/20 px-4 py-8 sm:px-8">
          <div className="mx-auto flex max-w-4xl flex-col gap-6">
            {isPending && (
              <>
                <Card className="rounded-xl border-border/60 shadow-sm">
                  <CardContent className="flex items-center gap-4 pt-6">
                    <Skeleton className="size-16 rounded-full" />
                    <div className="flex flex-1 flex-col gap-2">
                      <Skeleton className="h-5 w-48" />
                      <Skeleton className="h-4 w-64" />
                    </div>
                  </CardContent>
                </Card>
                <Card className="rounded-xl border-border/60 shadow-sm">
                  <CardHeader>
                    <Skeleton className="h-4 w-24" />
                  </CardHeader>
                  <CardContent className="flex flex-col gap-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </CardContent>
                </Card>
              </>
            )}

            {isError && isNotFound && (
              <Card className="rounded-xl border-border/60 shadow-sm">
                <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
                  <div className="flex size-12 items-center justify-center rounded-full bg-muted">
                    <UserX className="size-6 text-muted-foreground" />
                  </div>
                  <p className="text-sm font-medium text-foreground">Candidate not found</p>
                  <p className="max-w-sm text-sm text-muted-foreground">
                    This candidate may have been removed or the link is incorrect.
                  </p>
                </CardContent>
              </Card>
            )}

            {isError && !isNotFound && (
              <Alert variant="destructive">
                <AlertTitle>Failed to load candidate</AlertTitle>
                <AlertDescription>
                  {error instanceof ApiError ? error.message : "Something went wrong."}
                </AlertDescription>
              </Alert>
            )}

            {!isPending && !isError && candidate && (
              <>
                <ProfileHeader candidate={candidate} autoOpenResume={autoOpenResume} />

                <Card className="rounded-xl border-border/60 shadow-sm">
                  <CardHeader className="text-base font-medium">Summary</CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{candidate.summary}</p>
                  </CardContent>
                </Card>

                <Skills skills={candidate.profile.skills} />
                <Experience experience={candidate.profile.experience} />
                <Education education={candidate.profile.education} />
                <Projects projects={candidate.profile.projects} />
                <Leadership leadership={candidate.profile.leadership} />
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

export function CandidatePageClient({ candidateId }: { candidateId: number }) {
  return (
    <AuthGuard>
      <RoleGuard allowedRoles={["recruiter", "admin"]}>
        <CandidateContent candidateId={candidateId} />
      </RoleGuard>
    </AuthGuard>
  )
}
