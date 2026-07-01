import { apiClient } from "@/lib/api-client"

export const resumeService = {
  getResumeBlob: (candidateId: number) =>
    apiClient.getBlob(`/recruiter/resume/${candidateId}`, { auth: true }),
}
