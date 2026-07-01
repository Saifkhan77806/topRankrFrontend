import { notFound } from "next/navigation"
import { ResultsPageClient } from "./ResultsPageClient"

export default async function SearchResultsPage({
  params,
}: {
  params: Promise<{ jobId: string }>
}) {
  const { jobId } = await params
  const parsedJobId = Number(jobId)

  if (!Number.isInteger(parsedJobId) || parsedJobId <= 0) {
    notFound()
  }

  return <ResultsPageClient jobId={parsedJobId} />
}
