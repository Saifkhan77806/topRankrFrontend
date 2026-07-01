import { useMutation } from "@tanstack/react-query"
import { useRouter, useSearchParams } from "next/navigation"
import { authService } from "@/services/auth/auth-service"
import { useAuthStore } from "@/store/auth-store"
import type { LoginRequest } from "@/types/auth"

function isSafeRedirect(path: string | null): path is string {
  return !!path && path.startsWith("/") && !path.startsWith("//")
}

export function useLogin() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const login = useAuthStore((state) => state.login)

  return useMutation({
    mutationFn: (data: LoginRequest) => authService.login(data),
    onSuccess: (response) => {
      login(response.access_token, response.role)
      const from = searchParams.get("from")
      router.push(isSafeRedirect(from) ? from : "/dashboard")
    },
  })
}
