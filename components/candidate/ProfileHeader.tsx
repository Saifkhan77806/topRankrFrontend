"use client"

import { useState } from "react"
import { Briefcase, FileText, Loader2, Mail, Phone } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { candidateService } from "@/services/recruiter/candidate-service"
import { ApiError } from "@/lib/api-client"
import type { CandidateDetail } from "@/types/candidate"

interface ProfileHeaderProps {
  candidate: CandidateDetail
}

export function ProfileHeader({ candidate }: ProfileHeaderProps) {
  const [isFetchingResume, setIsFetchingResume] = useState(false)
  const [resumeError, setResumeError] = useState<string | null>(null)

  const displayName = candidate.name?.trim() || "Unknown Candidate"
  const initials = candidate.name
    ? candidate.name
        .split(" ")
        .map((part) => part[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "?"
  const seniority = candidate.profile.professional?.seniority

  const handleViewResume = async () => {
    setResumeError(null)
    setIsFetchingResume(true)
    try {
      const metadata = await candidateService.getResumeMetadata(candidate.id)
      window.open(metadata.resume_path, "_blank", "noopener,noreferrer")
    } catch (error) {
      setResumeError(
        error instanceof ApiError ? error.message : "Could not load the resume."
      )
    } finally {
      setIsFetchingResume(false)
    }
  }

  return (
    <Card className="rounded-xl border-border/60 shadow-sm">
      <CardContent className="flex flex-col gap-6 pt-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <Avatar size="lg" className="size-16">
            <AvatarFallback className="bg-primary/10 text-xl text-primary">
              {initials}
            </AvatarFallback>
          </Avatar>

          <div className="flex flex-col gap-1.5">
            <h1 className="text-xl font-semibold tracking-tight text-foreground">
              {displayName}
            </h1>

            <div className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
              {candidate.current_title && (
                <span className="flex items-center gap-1">
                  <Briefcase className="size-3.5" />
                  {candidate.current_title}
                </span>
              )}
              {candidate.industry && (
                <>
                  <span>·</span>
                  <span>{candidate.industry}</span>
                </>
              )}
              {candidate.experience_years !== null && (
                <>
                  <span>·</span>
                  <span>{candidate.experience_years} yrs experience</span>
                </>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              {candidate.email && (
                <span className="flex items-center gap-1">
                  <Mail className="size-3.5" />
                  {candidate.email}
                </span>
              )}
              {candidate.phone && (
                <span className="flex items-center gap-1">
                  <Phone className="size-3.5" />
                  {candidate.phone}
                </span>
              )}
            </div>

            {seniority && (
              <Badge variant="secondary" className="mt-1 w-fit capitalize">
                {seniority}
              </Badge>
            )}
          </div>
        </div>

        <div className="flex flex-col items-end gap-1.5">
          <Button variant="outline" onClick={handleViewResume} disabled={isFetchingResume}>
            {isFetchingResume ? <Loader2 className="animate-spin" /> : <FileText />}
            {isFetchingResume ? "Loading resume..." : "View resume"}
          </Button>
          {resumeError && <p className="text-xs text-destructive">{resumeError}</p>}
        </div>
      </CardContent>
    </Card>
  )
}
