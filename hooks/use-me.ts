import { useQuery } from "@tanstack/react-query"
import { authService } from "@/services/auth/auth-service"
import { useAuthStore } from "@/store/auth-store"

export function useMe() {
  const token = useAuthStore((state) => state.token)
  const setUser = useAuthStore((state) => state.setUser)

  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      const user = await authService.getMe()
      setUser(user)
      return user
    },
    enabled: !!token,
  })
}
