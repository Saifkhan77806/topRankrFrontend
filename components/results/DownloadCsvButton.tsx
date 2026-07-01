"use client"

import { Download } from "lucide-react"

import { Button } from "@/components/ui/button"
import { downloadCsv, toCsv } from "@/lib/csv"
import type { SearchResultItem } from "@/types/search-results"

interface DownloadCsvButtonProps {
  jobId: number
  candidates: SearchResultItem[]
}

const CSV_HEADERS = [
  "Rank",
  "Name",
  "Email",
  "Ranking score",
  "Semantic score",
  "Recommendation",
  "Reason for selection",
]

export function DownloadCsvButton({ jobId, candidates }: DownloadCsvButtonProps) {
  const handleDownload = () => {
    const rows = candidates.map((candidate) => [
      candidate.rank,
      candidate.name?.trim() || "Unknown",
      candidate.email ?? "",
      candidate.ranking_score !== null ? Math.round(candidate.ranking_score) : "",
      candidate.semantic_score !== null ? Math.round(candidate.semantic_score) : "",
      candidate.recommendation ?? "",
      candidate.ai_reason ?? "",
    ])

    const csv = toCsv(CSV_HEADERS, rows)
    downloadCsv(`job-${jobId}-ranked-candidates.csv`, csv)
  }

  return (
    <Button variant="outline" size="sm" onClick={handleDownload} disabled={candidates.length === 0}>
      <Download />
      Export CSV
    </Button>
  )
}
