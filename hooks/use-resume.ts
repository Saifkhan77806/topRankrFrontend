import { useEffect, useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { resumeService } from "@/services/recruiter/resume-service"
import { useAuthStore } from "@/store/auth-store"

export function useResume(candidateId: number, enabled: boolean) {
  const token = useAuthStore((state) => state.token)

  const query = useQuery({
    queryKey: ["recruiter", "resume", candidateId],
    queryFn: () => resumeService.getResumeBlob(candidateId),
    enabled: !!token && !!candidateId && enabled,
    staleTime: Infinity,
    gcTime: 0,
  })

  const blob = query.data ?? null
  const objectUrl = useMemo(() => (blob ? URL.createObjectURL(blob) : null), [blob])

  useEffect(() => {
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [objectUrl])

  return {
    blob,
    objectUrl,
    isPending: query.isPending && enabled,
    isError: query.isError,
    error: query.error,
  }
}
