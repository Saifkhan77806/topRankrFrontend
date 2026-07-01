"use client"

import Link from "next/link"
import { Sparkles } from "lucide-react"

import { Button } from "@/components/ui/button"

export function PublicNavbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-lg supports-backdrop-filter:bg-background/60">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/60 text-primary-foreground shadow-sm">
            <Sparkles className="size-4" />
          </div>
          <span className="text-base font-semibold tracking-tight text-foreground">
            TopRankr <span className="text-primary">AI</span>
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <Button variant="ghost" render={<Link href="/login" />}>
            Sign in
          </Button>
          <Button render={<Link href="/register" />}>Get started</Button>
        </div>
      </div>
    </header>
  )
}
