import { useQuery } from "@tanstack/react-query"
import { candidateService } from "@/services/recruiter/candidate-service"
import { useAuthStore } from "@/store/auth-store"

export function useCandidateDetail(candidateId: number) {
  const token = useAuthStore((state) => state.token)

  return useQuery({
    queryKey: ["recruiter", "candidate", candidateId],
    queryFn: () => candidateService.getCandidateDetail(candidateId),
    enabled: !!token && !!candidateId,
    retry: (failureCount, error) =>
      error.name !== "CandidateNotFoundError" && failureCount < 1,
  })
}
