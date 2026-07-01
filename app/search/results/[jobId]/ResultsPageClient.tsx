"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { AlertTriangle, FileSearch } from "lucide-react"

import { AuthGuard } from "@/components/auth/AuthGuard"
import { RoleGuard } from "@/components/auth/RoleGuard"
import { Navbar } from "@/components/layout/Navbar"
import { Sidebar } from "@/components/layout/Sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { CandidateTable } from "@/components/results/CandidateTable"
import { Filters, type ResultFilters } from "@/components/results/Filters"
import { Pagination } from "@/components/results/Pagination"
import { useSearchResults } from "@/hooks/use-search-results"
import { ApiError } from "@/lib/api-client"

const PAGE_SIZE = 10

function ResultsContent({ jobId }: { jobId: number }) {
  const { data, isPending, isError, error } = useSearchResults(jobId)
  const [filters, setFilters] = useState<ResultFilters>({ minScore: 0, query: "" })
  const [page, setPage] = useState(1)

  const filteredResults = useMemo(() => {
    const results = data?.results ?? []
    const query = filters.query.trim().toLowerCase()

    return results.filter((candidate) => {
      const meetsScore =
        filters.minScore === 0 ||
        (candidate.ranking_score ?? 0) >= filters.minScore
      if (!meetsScore) return false

      if (!query) return true
      const name = candidate.name?.toLowerCase() ?? ""
      const email = candidate.email?.toLowerCase() ?? ""
      return name.includes(query) || email.includes(query)
    })
  }, [data, filters])

  const pageCount = Math.max(1, Math.ceil(filteredResults.length / PAGE_SIZE))
  const currentPage = Math.min(page, pageCount)
  const paginatedResults = filteredResults.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  )

  const handleFiltersChange = (next: ResultFilters) => {
    setFilters(next)
    setPage(1)
  }

  return (
    <div className="flex flex-1 flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 bg-muted/20 px-4 py-8 sm:px-8">
          <div className="mx-auto flex max-w-6xl flex-col gap-6">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                Search results
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Job #{jobId} — ranked and AI-reviewed candidates.
              </p>
            </div>

            {isPending && (
              <Card className="rounded-xl border-border/60 shadow-sm">
                <CardContent className="flex flex-col gap-3 pt-6">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <Skeleton className="h-9 flex-1" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {isError && (
              <Alert variant="destructive">
                <AlertTitle>Failed to load results</AlertTitle>
                <AlertDescription>
                  {error instanceof ApiError ? error.message : "Something went wrong."}
                </AlertDescription>
              </Alert>
            )}

            {!isPending && !isError && data && data.status !== "completed" && (
              <Card className="rounded-xl border-border/60 shadow-sm">
                <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
                  <div className="flex size-12 items-center justify-center rounded-full bg-amber-100">
                    <AlertTriangle className="size-6 text-amber-600" />
                  </div>
                  <p className="text-sm font-medium text-foreground">
                    This search is still in progress
                  </p>
                  <p className="max-w-sm text-sm text-muted-foreground">
                    Results aren&apos;t ready yet — head back to the search page to
                    watch live progress.
                  </p>
                  <Button render={<Link href="/search" />}>Go to search</Button>
                </CardContent>
              </Card>
            )}

            {!isPending && !isError && data && data.status === "completed" && (
              <Card className="rounded-xl border-border/60 shadow-sm">
                <CardHeader className="gap-4">
                  <CardTitle className="text-base">
                    {data.results.length} candidate{data.results.length === 1 ? "" : "s"} found
                  </CardTitle>
                  <Filters filters={filters} onFiltersChange={handleFiltersChange} />
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  {data.results.length === 0 && (
                    <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-border py-10 text-center">
                      <FileSearch className="size-6 text-muted-foreground" />
                      <p className="text-sm font-medium text-foreground">
                        No matching candidates found for this search
                      </p>
                    </div>
                  )}

                  {data.results.length > 0 && filteredResults.length === 0 && (
                    <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-border py-10 text-center">
                      <FileSearch className="size-6 text-muted-foreground" />
                      <p className="text-sm font-medium text-foreground">
                        No candidates match your filters
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Try lowering the minimum score or clearing the search.
                      </p>
                    </div>
                  )}

                  {paginatedResults.length > 0 && (
                    <>
                      <CandidateTable jobId={jobId} candidates={paginatedResults} />
                      <Pagination
                        page={currentPage}
                        pageCount={pageCount}
                        onPageChange={setPage}
                      />
                    </>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

export function ResultsPageClient({ jobId }: { jobId: number }) {
  return (
    <AuthGuard>
      <RoleGuard allowedRoles={["recruiter", "admin"]}>
        <ResultsContent jobId={jobId} />
      </RoleGuard>
    </AuthGuard>
  )
}
