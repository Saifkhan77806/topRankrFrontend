"use client"

import { Loader2, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { RateLimitError } from "@/services/recruiter/search-service"

interface SearchButtonProps {
  onSubmit: () => void
  isPending: boolean
  disabled: boolean
  error: unknown
}

export function SearchButton({ onSubmit, isPending, disabled, error }: SearchButtonProps) {
  const isRateLimited = error instanceof RateLimitError

  return (
    <div className="flex flex-col gap-3">
      {error ? (
        <Alert variant="destructive">
          <AlertTitle>{isRateLimited ? "Slow down" : "Search failed"}</AlertTitle>
          <AlertDescription>
            {error instanceof Error ? error.message : "Something went wrong. Please try again."}
          </AlertDescription>
        </Alert>
      ) : null}

      <Button
        type="button"
        size="lg"
        className="h-11 w-full rounded-xl text-base sm:w-auto"
        onClick={onSubmit}
        disabled={disabled || isPending}
      >
        {isPending ? <Loader2 className="animate-spin" /> : <Search />}
        {isPending ? "Starting search..." : "Start search"}
      </Button>
    </div>
  )
}
