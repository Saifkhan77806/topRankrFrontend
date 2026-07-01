import Link from "next/link"

interface CandidateLinkProps {
  candidateId: number
  name: string | null
  jobId?: number
  children?: React.ReactNode
  className?: string
}

export function CandidateLink({
  candidateId,
  name,
  jobId,
  children,
  className,
}: CandidateLinkProps) {
  const href = jobId
    ? `/candidate/${candidateId}?jobId=${jobId}`
    : `/candidate/${candidateId}`

  return (
    <Link href={href} className={className}>
      {children ?? (name?.trim() || "Unknown Candidate")}
    </Link>
  )
}
