"use client"

import { useMemo } from "react"
import { ShieldOff, TriangleAlert } from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { useSecurityRecords } from "@/hooks/use-security-records"
import { ApiError } from "@/lib/api-client"

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  })
}

export function PromptInjectionAlerts() {
  const { data: records, isPending, isError, error } = useSecurityRecords()

  const injectionRecords = useMemo(
    () => (records ?? []).filter((record) => record.prompt_injection),
    [records]
  )

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Failed to load prompt-injection alerts</AlertTitle>
        <AlertDescription>
          {error instanceof ApiError ? error.message : "Something went wrong."}
        </AlertDescription>
      </Alert>
    )
  }

  if (isPending) {
    return (
      <div className="flex flex-col gap-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    )
  }

  if (injectionRecords.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-border py-10 text-center">
        <ShieldOff className="size-6 text-muted-foreground" />
        <p className="text-sm font-medium text-foreground">
          No prompt-injection attempts detected
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {injectionRecords.map((record) => (
        <Alert key={record.id} variant="destructive">
          <TriangleAlert />
          <AlertTitle>Prompt-injection attempt blocked</AlertTitle>
          <AlertDescription>
            From {record.candidate_email ?? "an unknown sender"} on{" "}
            {formatDate(record.created_at)}
            {record.rejection_reason && ` — reason: ${record.rejection_reason}`}
          </AlertDescription>
        </Alert>
      ))}
    </div>
  )
}
