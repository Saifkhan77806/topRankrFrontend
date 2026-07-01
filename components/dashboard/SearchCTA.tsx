import Link from "next/link"
import { ArrowRight, Sparkles } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function SearchCTA() {
  return (
    <Card className="relative overflow-hidden rounded-2xl border-none bg-gradient-to-br from-indigo-600 via-indigo-500 to-sky-500 shadow-lg shadow-indigo-500/20">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_0%,rgba(255,255,255,0.25),transparent_50%)]"
      />
      <CardContent className="relative flex flex-col items-start justify-between gap-4 px-6 py-6 sm:flex-row sm:items-center">
        <div className="flex items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/15">
            <Sparkles className="size-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">
              Start a new AI-powered search
            </h2>
            <p className="mt-0.5 text-sm text-white/80">
              Rank and shortlist the best-fit candidates for your next role in minutes.
            </p>
          </div>
        </div>
        <Button
          size="lg"
          className="h-11 shrink-0 rounded-xl bg-white px-5 text-indigo-700 hover:bg-white/90"
          render={<Link href="/search" />}
        >
          New Search
          <ArrowRight />
        </Button>
      </CardContent>
    </Card>
  )
}
