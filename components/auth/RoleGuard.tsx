"use client"

import { ShieldAlert } from "lucide-react"

import { useAuthStore } from "@/store/auth-store"
import type { Role } from "@/types/auth"

export function RoleGuard({
  allowedRoles,
  children,
}: {
  allowedRoles: Role[]
  children: React.ReactNode
}) {
  const role = useAuthStore((state) => state.role)

  if (!role || !allowedRoles.includes(role)) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-center">
        <div className="flex size-14 items-center justify-center rounded-full bg-destructive/10">
          <ShieldAlert className="size-7 text-destructive" />
        </div>
        <h2 className="text-lg font-semibold text-foreground">
          You don&apos;t have access to this page
        </h2>
        <p className="max-w-sm text-sm text-muted-foreground">
          This section is restricted to {allowedRoles.join(" or ")} accounts.
          Contact your administrator if you believe this is a mistake.
        </p>
      </div>
    )
  }

  return <>{children}</>
}
