"use client"

import { useState } from "react"
import { Loader2, type LucideIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useFeedbackStatus, useSubmitFeedback } from "@/hooks/use-submit-feedback"
import { RateLimitError } from "@/services/recruiter/feedback-service"
import type { FeedbackType } from "@/types/feedback"

interface FeedbackButtonConfig {
  feedback: FeedbackType
  label: string
  submittedLabel: string
  icon: LucideIcon
  variant: "default" | "outline" | "secondary" | "ghost" | "destructive" | "link"
}

interface FeedbackButtonProps {
  jobId: number | null
  candidateId: number
  disabledReason?: string
}

function FeedbackButtonBase({
  jobId,
  candidateId,
  disabledReason,
  config,
}: FeedbackButtonProps & { config: FeedbackButtonConfig }) {
  const [error, setError] = useState<string | null>(null)
  const submittedFeedback = useFeedbackStatus(jobId ?? -1, candidateId)
  const mutation = useSubmitFeedback()

  const alreadySubmittedThis = submittedFeedback === config.feedback
  const isDisabled = !jobId || mutation.isPending || alreadySubmittedThis
  const Icon = config.icon

  const handleClick = () => {
    if (!jobId || isDisabled) return
    setError(null)
    mutation.mutate(
      { job_id: jobId, candidate_id: candidateId, feedback: config.feedback },
      {
        onError: (err) => {
          setError(
            err instanceof RateLimitError
              ? err.message
              : "Could not submit feedback. Please try again."
          )
        },
      }
    )
  }

  const button = (
    <Button
      variant={config.variant}
      size="sm"
      onClick={handleClick}
      disabled={isDisabled}
      title={!jobId ? disabledReason : undefined}
    >
      {mutation.isPending && submittedFeedback !== config.feedback ? (
        <Loader2 className="animate-spin" />
      ) : (
        <Icon />
      )}
      {alreadySubmittedThis ? config.submittedLabel : config.label}
    </Button>
  )

  return (
    <div className="flex flex-col gap-1">
      {button}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}

export { FeedbackButtonBase }
export type { FeedbackButtonConfig, FeedbackButtonProps }
