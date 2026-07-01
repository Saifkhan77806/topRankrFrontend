import { useQuery } from "@tanstack/react-query"
import { recruiterService } from "@/services/recruiter/recruiter-service"
import { useAuthStore } from "@/store/auth-store"

export function useJobResults(jobId: number | null) {
  const token = useAuthStore((state) => state.token)

  return useQuery({
    queryKey: ["recruiter", "job-results", jobId],
    queryFn: () => recruiterService.getJobResults(jobId as number),
    enabled: !!token && !!jobId,
  })
}
