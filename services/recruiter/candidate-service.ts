import { apiClient } from "@/lib/api-client"
import type { CandidateDetail, CandidateDetailResponse } from "@/types/candidate"

export class CandidateNotFoundError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "CandidateNotFoundError"
  }
}

export const candidateService = {
  getCandidateDetail: async (candidateId: number): Promise<CandidateDetail> => {
    const response = await apiClient.get<CandidateDetailResponse>(
      `/recruiter/candidate/${candidateId}`,
      { auth: true }
    )

    if (!response.success || !response.data) {
      throw new CandidateNotFoundError(response.message ?? "Candidate not found")
    }

    return response.data
  },
}
