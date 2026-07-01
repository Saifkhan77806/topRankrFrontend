import { useQuery } from "@tanstack/react-query"
import { recruiterService } from "@/services/recruiter/recruiter-service"
import { useAuthStore } from "@/store/auth-store"

export function useJobs() {
  const token = useAuthStore((state) => state.token)

  return useQuery({
    queryKey: ["recruiter", "jobs"],
    queryFn: () => recruiterService.getJobs(),
    enabled: !!token,
  })
}
