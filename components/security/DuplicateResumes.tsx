"use client"

import { useMemo } from "react"
import { Copy, FileStack } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
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

export function DuplicateResumes() {
  const { data: records, isPending, isError, error } = useSecurityRecords()

  const duplicateGroups = useMemo(() => {
    const duplicates = (records ?? []).filter((record) => record.duplicate_resume)

    const byHash = new Map<string, typeof duplicates>()
    for (const record of duplicates) {
      const key = record.resume_hash ?? "unknown"
      const bucket = byHash.get(key) ?? []
      bucket.push(record)
      byHash.set(key, bucket)
    }

    return Array.from(byHash.entries()).sort((a, b) => b[1].length - a[1].length)
  }, [records])

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Failed to load duplicate resumes</AlertTitle>
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

  if (duplicateGroups.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-border py-10 text-center">
        <FileStack className="size-6 text-muted-foreground" />
        <p className="text-sm font-medium text-foreground">No duplicate resumes detected</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {duplicateGroups.map(([hash, group]) => (
        <div key={hash} className="flex flex-col gap-2 rounded-lg border border-border/60 p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Copy className="size-3.5" />
              <span className="font-mono">{hash === "unknown" ? "unknown hash" : hash.slice(0, 16) + "…"}</span>
            </div>
            <Badge variant="secondary">{group.length} submissions</Badge>
          </div>
          <div className="flex flex-col gap-1.5">
            {group.map((record) => (
              <div
                key={record.id}
                className="flex items-center justify-between text-sm text-foreground"
              >
                <span>{record.candidate_email ?? "Unknown email"}</span>
                <span className="text-xs text-muted-foreground">
                  {formatDate(record.created_at)}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
