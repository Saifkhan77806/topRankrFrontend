"use client"

import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export const JD_MIN_LENGTH = 50

interface JDInputProps {
  value: string
  onChange: (value: string) => void
}

export function JDInput({ value, onChange }: JDInputProps) {
  const trimmedLength = value.trim().length
  const showHint = trimmedLength > 0 && trimmedLength < JD_MIN_LENGTH

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="job-description">Job description</Label>
      <Textarea
        id="job-description"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Paste the full job description here — responsibilities, required skills, experience level, etc."
        className="min-h-48 resize-y"
        aria-invalid={showHint}
      />
      <div className="flex items-center justify-between text-xs">
        {showHint ? (
          <span className="text-destructive">
            Add a bit more detail — at least {JD_MIN_LENGTH} characters works best.
          </span>
        ) : (
          <span className="text-muted-foreground">
            The more detail you provide, the better the AI can rank candidates.
          </span>
        )}
        <span className="text-muted-foreground">{value.length} characters</span>
      </div>
    </div>
  )
}
