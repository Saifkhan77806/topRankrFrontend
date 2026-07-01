import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { authService } from "@/services/auth/auth-service"
import { useAuthStore } from "@/store/auth-store"
import type { LoginRequest } from "@/types/auth"

export function useLogin() {
  const router = useRouter()
  const login = useAuthStore((state) => state.login)

  return useMutation({
    mutationFn: (data: LoginRequest) => authService.login(data),
    onSuccess: (response) => {
      login(response.access_token, response.role)
      router.push("/dashboard")
    },
  })
}
