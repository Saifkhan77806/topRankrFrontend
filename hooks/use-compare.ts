import { useMutation } from "@tanstack/react-query"
import { comparisonService } from "@/services/recruiter/comparison-service"
import type { CompareRequest } from "@/types/comparison"

export function useCompare() {
  return useMutation({
    mutationFn: (payload: CompareRequest) => comparisonService.compareCandidates(payload),
  })
}
