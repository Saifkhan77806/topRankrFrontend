export interface SecurityRecord {
  id: number
  candidate_email: string | null
  resume_hash: string | null
  spam_score: number
  prompt_injection: boolean
  duplicate_resume: boolean
  virus_scan: string
  allowed: boolean
  rejection_reason: string | null
  created_at: string
}

export interface SecurityStats {
  total_scanned: number
  total_allowed: number
  total_rejected: number
  by_reason: Record<string, number>
}

export interface SecurityRecordFilters {
  allowed?: boolean
  rejection_reason?: string
}
