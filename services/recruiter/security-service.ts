import { apiClient } from "@/lib/api-client"
import type {
  SecurityRecord,
  SecurityRecordFilters,
  SecurityStats,
} from "@/types/security"

export const securityService = {
  getSecurityRecords: (filters?: SecurityRecordFilters) => {
    const params = new URLSearchParams()
    if (filters?.allowed !== undefined) params.set("allowed", String(filters.allowed))
    if (filters?.rejection_reason) params.set("rejection_reason", filters.rejection_reason)
    const query = params.toString()

    return apiClient.get<SecurityRecord[]>(
      `/recruiter/security/records${query ? `?${query}` : ""}`,
      { auth: true }
    )
  },

  getSecurityStats: () =>
    apiClient.get<SecurityStats>("/recruiter/security/stats", { auth: true }),
}
