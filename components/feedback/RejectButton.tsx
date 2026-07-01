import { UserX } from "lucide-react"

import { FeedbackButtonBase, type FeedbackButtonProps } from "@/components/feedback/FeedbackButton"

export function RejectButton(props: FeedbackButtonProps) {
  return (
    <FeedbackButtonBase
      {...props}
      config={{
        feedback: "rejected",
        label: "Reject",
        submittedLabel: "Rejected",
        icon: UserX,
        variant: "destructive",
      }}
    />
  )
}
