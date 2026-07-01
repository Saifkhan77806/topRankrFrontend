"use client"

import { useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"

import { SESSION_EXPIRED_EVENT } from "@/lib/api-client"
import { useAuthStore } from "@/store/auth-store"

const PUBLIC_PATHS = new Set(["/login", "/register", "/"])

export function SessionExpiryHandler() {
  const router = useRouter()
  const pathname = usePathname()
  const logout = useAuthStore((state) => state.logout)

  useEffect(() => {
    function handleSessionExpired() {
      const wasAuthenticated = useAuthStore.getState().isAuthenticated
      logout()

      if (!wasAuthenticated || PUBLIC_PATHS.has(pathname)) return

      const loginUrl = new URL("/login", window.location.origin)
      loginUrl.searchParams.set("from", pathname)
      loginUrl.searchParams.set("reason", "expired")
      router.replace(`${loginUrl.pathname}${loginUrl.search}`)
    }

    window.addEventListener(SESSION_EXPIRED_EVENT, handleSessionExpired)
    return () => window.removeEventListener(SESSION_EXPIRED_EVENT, handleSessionExpired)
  }, [logout, pathname, router])

  return null
}
