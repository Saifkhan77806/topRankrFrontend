"use client"

import { useState } from "react"
import { ArrowRight, FileText, Sparkles } from "lucide-react"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { AIScoreCard } from "@/components/results/AIScoreCard"
import { ExplanationCard } from "@/components/results/ExplanationCard"
import { CandidateLink } from "@/components/candidate/CandidateLink"
import { PDFViewer } from "@/components/candidate/PDFViewer"
import { ShortlistButton } from "@/components/feedback/ShortlistButton"
import { RejectButton } from "@/components/feedback/RejectButton"
import { InterviewButton } from "@/components/feedback/InterviewButton"
import { HireButton } from "@/components/feedback/HireButton"
import type { SearchResultItem } from "@/types/search-results"

const AI_REASON_TRUNCATE_LENGTH = 60

interface CandidateTableProps {
  jobId: number
  candidates: SearchResultItem[]
}

export function CandidateTable({ jobId, candidates }: CandidateTableProps) {
  const [activeCandidate, setActiveCandidate] = useState<SearchResultItem | null>(null)
  const [resumeCandidate, setResumeCandidate] = useState<SearchResultItem | null>(null)

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-14">Rank</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Ranking score</TableHead>
            <TableHead>Semantic score</TableHead>
            <TableHead>AI reason</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {candidates.map((candidate) => {
            const displayName = candidate.name?.trim() || "Unknown"
            const displayEmail = candidate.email?.trim() || "—"
            const truncatedReason =
              candidate.ai_reason && candidate.ai_reason.length > AI_REASON_TRUNCATE_LENGTH
                ? `${candidate.ai_reason.slice(0, AI_REASON_TRUNCATE_LENGTH)}…`
                : candidate.ai_reason

            return (
              <TableRow key={candidate.candidate_id}>
                <TableCell className="font-medium text-muted-foreground">
                  #{candidate.rank}
                </TableCell>
                <TableCell className="font-medium text-foreground">
                  <CandidateLink
                    candidateId={candidate.candidate_id}
                    name={candidate.name}
                    jobId={jobId}
                    className="hover:underline"
                  >
                    {displayName}
                  </CandidateLink>
                </TableCell>
                <TableCell className="text-muted-foreground">{displayEmail}</TableCell>
                <TableCell>
                  {candidate.ranking_score !== null ? (
                    <Badge variant="secondary">{Math.round(candidate.ranking_score)}%</Badge>
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell>
                  {candidate.semantic_score !== null ? (
                    <Badge variant="outline">{Math.round(candidate.semantic_score)}%</Badge>
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell className="max-w-56 truncate whitespace-normal">
                  {candidate.ai_reason ? (
                    truncatedReason !== candidate.ai_reason ? (
                      <Tooltip>
                        <TooltipTrigger render={<span className="cursor-default text-sm" />}>
                          {truncatedReason}
                        </TooltipTrigger>
                        <TooltipContent>{candidate.ai_reason}</TooltipContent>
                      </Tooltip>
                    ) : (
                      <span className="text-sm">{candidate.ai_reason}</span>
                    )
                  ) : (
                    <span className="text-xs text-muted-foreground">Not available</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-1.5">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      render={
                        <CandidateLink
                          candidateId={candidate.candidate_id}
                          name={candidate.name}
                          jobId={jobId}
                        />
                      }
                    >
                      <ArrowRight />
                      <span className="sr-only">View Candidate</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setActiveCandidate(candidate)}
                    >
                      <Sparkles />
                      Details
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => setResumeCandidate(candidate)}
                    >
                      <FileText />
                      <span className="sr-only">View resume</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>

      <Dialog
        open={!!activeCandidate}
        onOpenChange={(open) => {
          if (!open) setActiveCandidate(null)
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{activeCandidate?.name?.trim() || "Unknown candidate"}</DialogTitle>
            <DialogDescription>
              {activeCandidate?.email?.trim() || "No email on file"}
            </DialogDescription>
          </DialogHeader>

          {activeCandidate && (
            <div className="flex flex-col gap-4">
              <AIScoreCard
                rankingScore={activeCandidate.ranking_score}
                semanticScore={activeCandidate.semantic_score}
              />
              <ExplanationCard
                aiReason={activeCandidate.ai_reason}
                explanation={activeCandidate.explanation}
              />
              <div className="flex flex-wrap gap-2">
                <ShortlistButton jobId={jobId} candidateId={activeCandidate.candidate_id} />
                <InterviewButton jobId={jobId} candidateId={activeCandidate.candidate_id} />
                <HireButton jobId={jobId} candidateId={activeCandidate.candidate_id} />
                <RejectButton jobId={jobId} candidateId={activeCandidate.candidate_id} />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

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
    </>
  )
}
