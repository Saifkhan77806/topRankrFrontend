"use client"

import { useMemo } from "react"
import { Mail, MailWarning } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useSecurityRecords } from "@/hooks/use-security-records"
import { ApiError } from "@/lib/api-client"

const SPAM_THRESHOLD = 2

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  })
}

export function SpamEmails() {
  const { data: records, isPending, isError, error } = useSecurityRecords()

  const spamRecords = useMemo(
    () =>
      (records ?? [])
        .filter((record) => record.spam_score > 0)
        .sort((a, b) => b.spam_score - a.spam_score),
    [records]
  )

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Failed to load spam emails</AlertTitle>
        <AlertDescription>
          {error instanceof ApiError ? error.message : "Something went wrong."}
        </AlertDescription>
      </Alert>
    )
  }

  if (isPending) {
    return (
      <div className="flex flex-col gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-14 w-full" />
        ))}
      </div>
    )
  }

  if (spamRecords.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-border py-10 text-center">
        <Mail className="size-6 text-muted-foreground" />
        <p className="text-sm font-medium text-foreground">No spam scores recorded</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      {spamRecords.map((record) => (
        <div
          key={record.id}
          className="flex items-center justify-between gap-3 rounded-lg border border-border/60 p-3"
        >
          <div className="flex items-center gap-3">
            <MailWarning
              className={`size-4 shrink-0 ${
                record.spam_score >= SPAM_THRESHOLD ? "text-rose-600" : "text-amber-500"
              }`}
            />
            <div className="flex flex-col">
              <span className="text-sm font-medium text-foreground">
                {record.candidate_email ?? "Unknown email"}
              </span>
              <span className="text-xs text-muted-foreground">
                {formatDate(record.created_at)}
              </span>
            </div>
          </div>
          <Badge variant={record.spam_score >= SPAM_THRESHOLD ? "destructive" : "secondary"}>
            Score: {record.spam_score}
          </Badge>
        </div>
      ))}
    </div>
  )
}
