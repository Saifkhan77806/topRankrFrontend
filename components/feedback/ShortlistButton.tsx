import { BookmarkPlus } from "lucide-react"

import { FeedbackButtonBase, type FeedbackButtonProps } from "@/components/feedback/FeedbackButton"

export function ShortlistButton(props: FeedbackButtonProps) {
  return (
    <FeedbackButtonBase
      {...props}
      config={{
        feedback: "shortlisted",
        label: "Shortlist",
        submittedLabel: "Shortlisted",
        icon: BookmarkPlus,
        variant: "outline",
      }}
    />
  )
}
