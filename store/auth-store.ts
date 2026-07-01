import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Role, User } from "@/types/auth"

const TOKEN_COOKIE = "toprankr-token"

function setTokenCookie(token: string | null) {
  if (typeof document === "undefined") return
  if (token) {
    document.cookie = `${TOKEN_COOKIE}=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`
  } else {
    document.cookie = `${TOKEN_COOKIE}=; path=/; max-age=0; SameSite=Lax`
  }
}

interface AuthState {
  user: User | null
  token: string | null
  role: Role | null
  isAuthenticated: boolean
  login: (token: string, role: Role) => void
  logout: () => void
  setUser: (user: User) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      role: null,
      isAuthenticated: false,

      login: (token, role) => {
        setTokenCookie(token)
        set({ token, role, isAuthenticated: true })
      },

      logout: () => {
        setTokenCookie(null)
        set({ user: null, token: null, role: null, isAuthenticated: false })
      },

      setUser: (user) => set({ user }),
    }),
    {
      name: "toprankr-auth",
      partialize: (state) => ({
        token: state.token,
        role: state.role,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.token) setTokenCookie(state.token)
      },
    }
  )
)
