"use client"

import { CalendarDays, Mail, ShieldCheck, ShieldOff, UserRound } from "lucide-react"

import { AuthGuard } from "@/components/auth/AuthGuard"
import { Navbar } from "@/components/layout/Navbar"
import { Sidebar } from "@/components/layout/Sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { useMe } from "@/hooks/use-me"

function ProfileContent() {
  const { data: user, isLoading, isError } = useMe()

  return (
    <div className="flex flex-1 flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 bg-muted/20 px-4 py-8 sm:px-8">
          <div className="mx-auto max-w-2xl">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Profile
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Your account details as recorded by TopRankr AI.
            </p>

            <Card className="mt-6 rounded-2xl border-border/60 shadow-lg">
              <CardHeader className="flex-row items-center gap-4">
                {isLoading ? (
                  <Skeleton className="size-14 rounded-full" />
                ) : (
                  <Avatar size="lg" className="size-14">
                    <AvatarFallback className="bg-primary/10 text-lg text-primary">
                      {user?.email?.slice(0, 2).toUpperCase() ?? "TR"}
                    </AvatarFallback>
                  </Avatar>
                )}
                <div className="flex flex-col gap-1">
                  {isLoading ? (
                    <Skeleton className="h-5 w-40" />
                  ) : (
                    <CardTitle className="text-lg">{user?.email}</CardTitle>
                  )}
                  {isLoading ? (
                    <Skeleton className="h-4 w-20" />
                  ) : (
                    <Badge variant="secondary" className="w-fit capitalize">
                      {user?.role}
                    </Badge>
                  )}
                </div>
              </CardHeader>

              <Separator />

              <CardContent className="flex flex-col gap-5 pt-5">
                {isError && (
                  <p className="text-sm text-destructive">
                    Could not load your profile. Please try refreshing.
                  </p>
                )}

                <ProfileRow
                  icon={Mail}
                  label="Email"
                  value={user?.email}
                  loading={isLoading}
                />
                <ProfileRow
                  icon={UserRound}
                  label="Role"
                  value={user?.role}
                  loading={isLoading}
                  capitalize
                />
                <ProfileRow
                  icon={user?.active ? ShieldCheck : ShieldOff}
                  label="Status"
                  value={user ? (user.active ? "Active" : "Inactive") : undefined}
                  loading={isLoading}
                />
                <ProfileRow
                  icon={CalendarDays}
                  label="Created"
                  value={
                    user?.created_at
                      ? new Date(user.created_at).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : undefined
                  }
                  loading={isLoading}
                />
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}

function ProfileRow({
  icon: Icon,
  label,
  value,
  loading,
  capitalize,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value?: string
  loading: boolean
  capitalize?: boolean
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
        <Icon className="size-4 text-muted-foreground" />
      </div>
      <div className="flex flex-col">
        <span className="text-xs text-muted-foreground">{label}</span>
        {loading ? (
          <Skeleton className="mt-1 h-4 w-32" />
        ) : (
          <span className={`text-sm font-medium text-foreground ${capitalize ? "capitalize" : ""}`}>
            {value ?? "—"}
          </span>
        )}
      </div>
    </div>
  )
}

export default function ProfilePage() {
  return (
    <AuthGuard>
      <ProfileContent />
    </AuthGuard>
  )
}
