"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Briefcase, FileText, Mail, Phone } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PDFViewer } from "@/components/candidate/PDFViewer"
import { DownloadButton } from "@/components/candidate/DownloadButton"
import { ShortlistButton } from "@/components/feedback/ShortlistButton"
import { RejectButton } from "@/components/feedback/RejectButton"
import { InterviewButton } from "@/components/feedback/InterviewButton"
import { HireButton } from "@/components/feedback/HireButton"
import type { CandidateDetail } from "@/types/candidate"

interface ProfileHeaderProps {
  candidate: CandidateDetail
  autoOpenResume?: boolean
  jobId?: number | null
}

export function ProfileHeader({ candidate, autoOpenResume = false, jobId = null }: ProfileHeaderProps) {
  const [isViewerOpen, setIsViewerOpen] = useState(autoOpenResume)

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

  return (
    <Card className="rounded-xl border-border/60 shadow-sm">
      {jobId && (
        <div className="border-b border-border/60 px-6 py-2.5">
          <Link
            href={`/search/results/${jobId}`}
            className="flex w-fit items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-3.5" />
            Back to search results (Job #{jobId})
          </Link>
        </div>
      )}
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

        <div className="flex flex-col items-end gap-3">
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => setIsViewerOpen(true)}>
              <FileText />
              View resume
            </Button>
            <DownloadButton candidateId={candidate.id} candidateName={candidate.name} />
          </div>

          <div className="flex flex-col items-end gap-1">
            <div
              className="flex flex-wrap justify-end gap-2"
              title={
                jobId
                  ? undefined
                  : "Feedback must be tied to a specific search — open this candidate from a search results page to enable these actions."
              }
            >
              <ShortlistButton
                jobId={jobId}
                candidateId={candidate.id}
                disabledReason="Feedback must be tied to a specific search"
              />
              <InterviewButton
                jobId={jobId}
                candidateId={candidate.id}
                disabledReason="Feedback must be tied to a specific search"
              />
              <HireButton
                jobId={jobId}
                candidateId={candidate.id}
                disabledReason="Feedback must be tied to a specific search"
              />
              <RejectButton
                jobId={jobId}
                candidateId={candidate.id}
                disabledReason="Feedback must be tied to a specific search"
              />
            </div>
            {!jobId && (
              <p className="max-w-56 text-right text-xs text-muted-foreground">
                Open this candidate from a search to record feedback.
              </p>
            )}
          </div>
        </div>
      </CardContent>

      <PDFViewer
        candidateId={candidate.id}
        candidateName={displayName}
        open={isViewerOpen}
        onOpenChange={setIsViewerOpen}
      />
    </Card>
  )
}
