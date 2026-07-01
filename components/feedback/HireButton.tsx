import { Trophy } from "lucide-react"

import { FeedbackButtonBase, type FeedbackButtonProps } from "@/components/feedback/FeedbackButton"

export function HireButton(props: FeedbackButtonProps) {
  return (
    <FeedbackButtonBase
      {...props}
      config={{
        feedback: "hired",
        label: "Hire",
        submittedLabel: "Hired",
        icon: Trophy,
        variant: "default",
      }}
    />
  )
}
