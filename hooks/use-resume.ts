import { useEffect, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { resumeService } from "@/services/recruiter/resume-service"
import { useAuthStore } from "@/store/auth-store"

export function useResume(candidateId: number, enabled: boolean) {
  const token = useAuthStore((state) => state.token)
  const [objectUrl, setObjectUrl] = useState<string | null>(null)

  const query = useQuery({
    queryKey: ["recruiter", "resume", candidateId],
    queryFn: () => resumeService.getResumeBlob(candidateId),
    enabled: !!token && !!candidateId && enabled,
    staleTime: Infinity,
    gcTime: 0,
  })

  useEffect(() => {
    if (!query.data) {
      setObjectUrl(null)
      return
    }

    const url = URL.createObjectURL(query.data)
    setObjectUrl(url)

    return () => {
      URL.revokeObjectURL(url)
      setObjectUrl(null)
    }
  }, [query.data])

  return {
    blob: query.data ?? null,
    objectUrl,
    isPending: query.isPending && enabled,
    isError: query.isError,
    error: query.error,
  }
}
