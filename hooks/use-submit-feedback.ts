import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { feedbackService } from "@/services/recruiter/feedback-service"
import type { FeedbackRequest, FeedbackType } from "@/types/feedback"

function feedbackStatusKey(jobId: number, candidateId: number) {
  return ["feedback-status", jobId, candidateId] as const
}

export function useFeedbackStatus(jobId: number, candidateId: number) {
  const { data } = useQuery({
    queryKey: feedbackStatusKey(jobId, candidateId),
    queryFn: () => null as FeedbackType | null,
    initialData: null,
    staleTime: Infinity,
    gcTime: Infinity,
  })

  return data
}

export function useSubmitFeedback() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: FeedbackRequest) => feedbackService.submitFeedback(payload),
    onSuccess: (_response, payload) => {
      queryClient.setQueryData(
        feedbackStatusKey(payload.job_id, payload.candidate_id),
        payload.feedback
      )
    },
  })
}
