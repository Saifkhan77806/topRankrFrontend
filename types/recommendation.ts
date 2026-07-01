import type { SearchResultItem } from "@/types/search-results"

export interface RecommendedCandidate extends SearchResultItem {
  source_job_id: number
}
