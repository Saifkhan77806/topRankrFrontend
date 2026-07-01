import { useQuery } from "@tanstack/react-query"
import { recruiterService } from "@/services/recruiter/recruiter-service"
import { useAuthStore } from "@/store/auth-store"

export function useFeedbackStats() {
  const token = useAuthStore((state) => state.token)

  return useQuery({
    queryKey: ["recruiter", "feedback-stats"],
    queryFn: () => recruiterService.getFeedbackStats(),
    enabled: !!token,
  })
}
