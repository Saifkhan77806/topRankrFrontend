"use client"

import { CheckCircle2, ScanLine, ShieldAlert } from "lucide-react"

import { AuthGuard } from "@/components/auth/AuthGuard"
import { RoleGuard } from "@/components/auth/RoleGuard"
import { Navbar } from "@/components/layout/Navbar"
import { Sidebar } from "@/components/layout/Sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { ThreatTable } from "@/components/security/ThreatTable"
import { DuplicateResumes } from "@/components/security/DuplicateResumes"
import { SpamEmails } from "@/components/security/SpamEmails"
import { PromptInjectionAlerts } from "@/components/security/PromptInjectionAlerts"
import { useSecurityStats } from "@/hooks/use-security-stats"
import { ApiError } from "@/lib/api-client"

function SecurityStatsCards() {
  const { data: stats, isPending, isError, error } = useSecurityStats()

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Failed to load security stats</AlertTitle>
        <AlertDescription>
          {error instanceof ApiError ? error.message : "Something went wrong."}
        </AlertDescription>
      </Alert>
    )
  }

  if (isPending) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full rounded-xl" />
        ))}
      </div>
    )
  }

  if (!stats) return null

  const items = [
    {
      label: "Total scanned",
      value: stats.total_scanned,
      icon: ScanLine,
      accent: "text-indigo-600 bg-indigo-50",
    },
    {
      label: "Passed",
      value: stats.total_allowed,
      icon: CheckCircle2,
      accent: "text-emerald-600 bg-emerald-50",
    },
    {
      label: "Blocked",
      value: stats.total_rejected,
      icon: ShieldAlert,
      accent: "text-rose-600 bg-rose-50",
    },
  ]

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {items.map((item) => (
          <Card key={item.label} className="rounded-xl border-border/60 shadow-sm">
            <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground">
                {item.label}
              </CardTitle>
              <div className={`flex size-8 items-center justify-center rounded-lg ${item.accent}`}>
                <item.icon className="size-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold tracking-tight text-foreground">
                {item.value.toLocaleString()}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {Object.keys(stats.by_reason).length > 0 && (
        <div className="flex flex-wrap gap-2">
          {Object.entries(stats.by_reason).map(([reason, count]) => (
            <Badge key={reason} variant="outline">
              {reason}: {count}
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}

function SecurityContent() {
  return (
    <div className="flex flex-1 flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 bg-muted/20 px-4 py-8 sm:px-8">
          <div className="mx-auto flex max-w-5xl flex-col gap-6">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                Security
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                What&apos;s been automatically filtered from incoming resumes —
                spam, duplicates, and prompt-injection attempts.
              </p>
            </div>

            <SecurityStatsCards />

            <Card className="rounded-xl border-border/60 shadow-sm">
              <CardHeader>
                <CardTitle className="text-base">All records</CardTitle>
              </CardHeader>
              <CardContent>
                <ThreatTable />
              </CardContent>
            </Card>

            <Card className="rounded-xl border-border/60 shadow-sm">
              <CardHeader>
                <CardTitle className="text-base">Duplicate resumes</CardTitle>
              </CardHeader>
              <CardContent>
                <DuplicateResumes />
              </CardContent>
            </Card>

            <Card className="rounded-xl border-border/60 shadow-sm">
              <CardHeader>
                <CardTitle className="text-base">Spam emails</CardTitle>
              </CardHeader>
              <CardContent>
                <SpamEmails />
              </CardContent>
            </Card>

            <Card className="rounded-xl border-border/60 shadow-sm">
              <CardHeader>
                <CardTitle className="text-base">Prompt-injection attempts</CardTitle>
              </CardHeader>
              <CardContent>
                <PromptInjectionAlerts />
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}

export default function SecurityPage() {
  return (
    <AuthGuard>
      <RoleGuard allowedRoles={["admin"]}>
        <SecurityContent />
      </RoleGuard>
    </AuthGuard>
  )
}
