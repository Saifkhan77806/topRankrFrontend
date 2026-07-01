"use client"

import { AuthGuard } from "@/components/auth/AuthGuard"
import { RoleGuard } from "@/components/auth/RoleGuard"
import { Navbar } from "@/components/layout/Navbar"
import { Sidebar } from "@/components/layout/Sidebar"
import { RecommendedCandidates } from "@/components/recommendations/RecommendedCandidates"

function RecommendationsContent() {
  return (
    <div className="flex flex-1 flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 bg-muted/20 px-4 py-8 sm:px-8">
          <div className="mx-auto flex max-w-4xl flex-col gap-6">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                Recommended candidates
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Your strongest matches across all completed searches.
              </p>
            </div>

            <RecommendedCandidates />
          </div>
        </main>
      </div>
    </div>
  )
}

export default function RecommendationsPage() {
  return (
    <AuthGuard>
      <RoleGuard allowedRoles={["recruiter", "admin"]}>
        <RecommendationsContent />
      </RoleGuard>
    </AuthGuard>
  )
}
