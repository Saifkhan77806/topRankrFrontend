import { useQuery } from "@tanstack/react-query"
import { securityService } from "@/services/recruiter/security-service"
import { useAuthStore } from "@/store/auth-store"
import type { SecurityRecordFilters } from "@/types/security"

export function useSecurityRecords(filters?: SecurityRecordFilters) {
  const token = useAuthStore((state) => state.token)

  return useQuery({
    queryKey: ["recruiter", "security-records", filters ?? {}],
    queryFn: () => securityService.getSecurityRecords(filters),
    enabled: !!token,
  })
}
