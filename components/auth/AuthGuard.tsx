"use client"

import { useEffect, useSyncExternalStore } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

import { useAuthStore } from "@/store/auth-store"

function subscribeToHydration(callback: () => void) {
  return useAuthStore.persist.onFinishHydration(callback)
}

function getHasHydrated() {
  return useAuthStore.persist.hasHydrated()
}

function getServerHasHydrated() {
  return false
}

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const hasHydrated = useSyncExternalStore(
    subscribeToHydration,
    getHasHydrated,
    getServerHasHydrated
  )

  useEffect(() => {
    if (hasHydrated && !isAuthenticated) {
      const loginUrl = new URL("/login", window.location.origin)
      loginUrl.searchParams.set("from", pathname)
      router.replace(`${loginUrl.pathname}${loginUrl.search}`)
    }
  }, [hasHydrated, isAuthenticated, pathname, router])

  if (!hasHydrated || !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return <>{children}</>
}
