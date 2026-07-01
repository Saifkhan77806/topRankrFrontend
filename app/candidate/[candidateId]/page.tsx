import { notFound } from "next/navigation"
import { CandidatePageClient } from "./CandidatePageClient"

export default async function CandidateDetailPage({
  params,
}: {
  params: Promise<{ candidateId: string }>
}) {
  const { candidateId } = await params
  const parsedCandidateId = Number(candidateId)

  if (!Number.isInteger(parsedCandidateId) || parsedCandidateId <= 0) {
    notFound()
  }

  return <CandidatePageClient candidateId={parsedCandidateId} />
}
