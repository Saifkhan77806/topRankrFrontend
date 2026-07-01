import { useQuery } from "@tanstack/react-query"
import { resultsService } from "@/services/recruiter/results-service"
import { useAuthStore } from "@/store/auth-store"

export function useSearchResults(jobId: number) {
  const token = useAuthStore((state) => state.token)

  return useQuery({
    queryKey: ["recruiter", "search-results", jobId],
    queryFn: () => resultsService.getResults(jobId),
    enabled: !!token && !!jobId,
    refetchOnMount: false,
    refetchInterval: false,
  })
}
