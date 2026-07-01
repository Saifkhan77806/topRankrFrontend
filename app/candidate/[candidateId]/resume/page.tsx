import { redirect, notFound } from "next/navigation"

export default async function CandidateResumePage({
  params,
}: {
  params: Promise<{ candidateId: string }>
}) {
  const { candidateId } = await params
  const parsedCandidateId = Number(candidateId)

  if (!Number.isInteger(parsedCandidateId) || parsedCandidateId <= 0) {
    notFound()
  }

  redirect(`/candidate/${parsedCandidateId}?resume=1`)
}
