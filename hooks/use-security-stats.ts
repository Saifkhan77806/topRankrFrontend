import { useQuery } from "@tanstack/react-query"
import { securityService } from "@/services/recruiter/security-service"
import { useAuthStore } from "@/store/auth-store"

export function useSecurityStats() {
  const token = useAuthStore((state) => state.token)

  return useQuery({
    queryKey: ["recruiter", "security-stats"],
    queryFn: () => securityService.getSecurityStats(),
    enabled: !!token,
  })
}
