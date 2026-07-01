"use client"

import { useState } from "react"

import { AuthGuard } from "@/components/auth/AuthGuard"
import { RoleGuard } from "@/components/auth/RoleGuard"
import { Navbar } from "@/components/layout/Navbar"
import { Sidebar } from "@/components/layout/Sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { JDInput, JD_MIN_LENGTH } from "@/components/search/JDInput"
import { SearchConfig } from "@/components/search/SearchConfig"
import { SearchButton } from "@/components/search/SearchButton"
import { SearchProgress } from "@/components/search/SearchProgress"
import { SearchResults } from "@/components/search/SearchResults"
import { useSubmitSearch } from "@/hooks/use-submit-search"

type SearchStage = "idle" | "in-progress" | "completed"

function SearchContent() {
  const [stage, setStage] = useState<SearchStage>("idle")
  const [jobDescription, setJobDescription] = useState("")
  const [topK, setTopK] = useState(20)
  const [activeJobId, setActiveJobId] = useState<number | null>(null)

  const submitSearch = useSubmitSearch()

  const canSubmit = jobDescription.trim().length >= JD_MIN_LENGTH

  const handleSubmit = () => {
    if (!canSubmit) return
    submitSearch.mutate(
      { job_description: jobDescription.trim(), top_k: topK },
      {
        onSuccess: (response) => {
          setActiveJobId(response.job_id)
          setStage("in-progress")
        },
      }
    )
  }

  const handleReset = () => {
    setStage("idle")
    setActiveJobId(null)
    submitSearch.reset()
  }

  return (
    <div className="flex flex-1 flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 bg-muted/20 px-4 py-8 sm:px-8">
          <div className="mx-auto flex max-w-3xl flex-col gap-6">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                Search
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Paste a job description and let AI rank the best-fit candidates.
              </p>
            </div>

            {stage === "idle" && (
              <Card className="rounded-xl border-border/60 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base">New search</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-6">
                  <JDInput value={jobDescription} onChange={setJobDescription} />
                  <SearchConfig topK={topK} onTopKChange={setTopK} />
                  <SearchButton
                    onSubmit={handleSubmit}
                    isPending={submitSearch.isPending}
                    disabled={!canSubmit}
                    error={submitSearch.error}
                  />
                </CardContent>
              </Card>
            )}

            {stage === "in-progress" && activeJobId && (
              <SearchProgress
                jobId={activeJobId}
                onCompleted={() => setStage("completed")}
                onFailed={() => {}}
                onRetry={handleReset}
              />
            )}

            {stage === "completed" && activeJobId && (
              <SearchResults jobId={activeJobId} onNewSearch={handleReset} />
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

export default function SearchPage() {
  return (
    <AuthGuard>
      <RoleGuard allowedRoles={["recruiter", "admin"]}>
        <SearchContent />
      </RoleGuard>
    </AuthGuard>
  )
}
