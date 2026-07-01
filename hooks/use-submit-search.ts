import { useMutation } from "@tanstack/react-query"
import { searchService } from "@/services/recruiter/search-service"
import type { SearchRequest } from "@/types/search"

export function useSubmitSearch() {
  return useMutation({
    mutationFn: (data: SearchRequest) => searchService.submitSearch(data),
  })
}
