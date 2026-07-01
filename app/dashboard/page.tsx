"use client"

import { AuthGuard } from "@/components/auth/AuthGuard"
import { RoleGuard } from "@/components/auth/RoleGuard"
import { Navbar } from "@/components/layout/Navbar"
import { Sidebar } from "@/components/layout/Sidebar"
import { StatsCards } from "@/components/dashboard/StatsCards"
import { RecentJobs } from "@/components/dashboard/RecentJobs"
import { RecentCandidates } from "@/components/dashboard/RecentCandidates"
import { SearchCTA } from "@/components/dashboard/SearchCTA"

function DashboardContent() {
  return (
    <div className="flex flex-1 flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 bg-muted/20 px-4 py-8 sm:px-8">
          <div className="mx-auto flex max-w-6xl flex-col gap-6">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                Dashboard
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                An overview of your recruiting activity.
              </p>
            </div>

            <SearchCTA />

            <StatsCards />

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <RecentJobs />
              <RecentCandidates />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <AuthGuard>
      <RoleGuard allowedRoles={["recruiter", "admin"]}>
        <DashboardContent />
      </RoleGuard>
    </AuthGuard>
  )
}
