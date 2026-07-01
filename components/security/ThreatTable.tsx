"use client"

import { useState } from "react"
import { ShieldCheck } from "lucide-react"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useSecurityRecords } from "@/hooks/use-security-records"
import { ApiError } from "@/lib/api-client"
import type { SecurityRecordFilters } from "@/types/security"

const ALLOWED_OPTIONS = [
  { value: "all", label: "All records" },
  { value: "true", label: "Passed" },
  { value: "false", label: "Blocked" },
]

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  })
}

export function ThreatTable() {
  const [allowedFilter, setAllowedFilter] = useState<string>("all")

  const filters: SecurityRecordFilters | undefined =
    allowedFilter === "all" ? undefined : { allowed: allowedFilter === "true" }

  const { data: records, isPending, isError, error } = useSecurityRecords(filters)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2 sm:max-w-56">
        <Label htmlFor="allowed-filter">Status</Label>
        <Select value={allowedFilter} onValueChange={(value) => setAllowedFilter(value ?? "all")}>
          <SelectTrigger id="allowed-filter" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ALLOWED_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isError && (
        <Alert variant="destructive">
          <AlertTitle>Failed to load security records</AlertTitle>
          <AlertDescription>
            {error instanceof ApiError ? error.message : "Something went wrong."}
          </AlertDescription>
        </Alert>
      )}

      {isPending && (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      )}

      {!isPending && !isError && records?.length === 0 && (
        <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-border py-10 text-center">
          <ShieldCheck className="size-6 text-muted-foreground" />
          <p className="text-sm font-medium text-foreground">No security events recorded yet</p>
        </div>
      )}

      {!isPending && !isError && records && records.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-border/60">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Rejection reason</TableHead>
                <TableHead>Spam score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {records.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="text-foreground">
                    {record.candidate_email ?? "—"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(record.created_at)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={record.allowed ? "default" : "destructive"}>
                      {record.allowed ? "Passed" : "Blocked"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {record.rejection_reason ?? "—"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{record.spam_score}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
