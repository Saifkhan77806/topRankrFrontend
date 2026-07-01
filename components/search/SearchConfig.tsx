"use client"

import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const TOP_K_OPTIONS = [10, 20, 50] as const

interface SearchConfigProps {
  topK: number
  onTopKChange: (value: number) => void
}

export function SearchConfig({ topK, onTopKChange }: SearchConfigProps) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="top-k">Results to show</Label>
      <Select value={String(topK)} onValueChange={(value) => onTopKChange(Number(value))}>
        <SelectTrigger id="top-k" className="w-full sm:w-48">
          <SelectValue placeholder="Select a count" />
        </SelectTrigger>
        <SelectContent>
          {TOP_K_OPTIONS.map((option) => (
            <SelectItem key={option} value={String(option)}>
              Top {option} candidates
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <p className="text-xs text-muted-foreground">
        This controls how many top-ranked candidates are returned — the AI
        always evaluates a much larger pool internally before narrowing it down.
      </p>
    </div>
  )
}
