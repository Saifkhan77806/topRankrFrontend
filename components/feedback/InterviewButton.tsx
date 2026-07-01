import { CalendarCheck } from "lucide-react"

import { FeedbackButtonBase, type FeedbackButtonProps } from "@/components/feedback/FeedbackButton"

export function InterviewButton(props: FeedbackButtonProps) {
  return (
    <FeedbackButtonBase
      {...props}
      config={{
        feedback: "interviewed",
        label: "Interview",
        submittedLabel: "Interviewed",
        icon: CalendarCheck,
        variant: "secondary",
      }}
    />
  )
}
