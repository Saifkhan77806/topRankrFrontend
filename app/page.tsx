import Link from "next/link"
import {
  ArrowRight,
  BarChart3,
  Scale,
  Search,
  Sparkles,
  Users,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { PublicNavbar } from "@/components/layout/PublicNavbar"

const FEATURES = [
  {
    icon: Search,
    title: "AI-powered search",
    description:
      "Paste a job description and let AI rank the best-fit candidates from your talent pool in minutes.",
  },
  {
    icon: Scale,
    title: "Side-by-side comparison",
    description:
      "Compare any number of candidates from a search with an AI-recommended pick and clear reasoning.",
  },
  {
    icon: Users,
    title: "Rich candidate profiles",
    description:
      "Skills, experience, education, and leadership — extracted automatically from every resume.",
  },
  {
    icon: BarChart3,
    title: "Learns from feedback",
    description:
      "Shortlist, reject, interview, or hire — every decision quietly improves future search rankings.",
  },
]

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-background">
      <PublicNavbar />

      <section className="relative overflow-hidden bg-slate-950 px-4 py-24 sm:px-6 lg:px-8">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(99,102,241,0.35),transparent_45%),radial-gradient(circle_at_80%_0%,rgba(56,189,248,0.25),transparent_40%),radial-gradient(circle_at_50%_100%,rgba(168,85,247,0.25),transparent_45%)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:48px_48px]"
        />

        <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-white/70">
            <Sparkles className="size-3.5 text-indigo-300" />
            AI-powered recruitment intelligence
          </div>

          <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Find your best-fit candidates,{" "}
            <span className="text-indigo-300">not just any candidates</span>
          </h1>

          <p className="max-w-xl text-lg text-white/60">
            TopRankr AI ranks, compares, and explains candidate matches for
            every job description — so recruiters spend less time screening
            and more time hiring.
          </p>

          <div className="mt-2 flex flex-col gap-3 sm:flex-row">
            <Button
              size="lg"
              className="h-11 rounded-xl bg-white px-6 text-base text-indigo-700 hover:bg-white/90"
              render={<Link href="/register" />}
            >
              Get started free
              <ArrowRight />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-11 rounded-xl border-white/15 bg-transparent px-6 text-base text-white hover:bg-white/10"
              render={<Link href="/login" />}
            >
              Sign in
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Everything a recruiting team needs
          </h2>
          <p className="mt-2 text-muted-foreground">
            Built for recruiters and hiring managers who want AI to do the
            heavy lifting, not replace their judgment.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {FEATURES.map((feature) => (
            <Card key={feature.title} className="rounded-xl border-border/60 shadow-sm">
              <CardContent className="flex items-start gap-4 pt-6">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <feature.icon className="size-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-foreground">
                    {feature.title}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-4xl px-4 pb-20 sm:px-6 lg:px-8">
        <Card className="relative overflow-hidden rounded-2xl border-none bg-gradient-to-br from-indigo-600 via-indigo-500 to-sky-500 shadow-lg shadow-indigo-500/20">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_0%,rgba(255,255,255,0.25),transparent_50%)]"
          />
          <CardContent className="relative flex flex-col items-center gap-4 px-6 py-12 text-center">
            <h2 className="text-2xl font-semibold text-white sm:text-3xl">
              Ready to rank your next hire?
            </h2>
            <p className="max-w-lg text-white/80">
              Create a free account and run your first AI-powered search in
              minutes.
            </p>
            <Button
              size="lg"
              className="mt-2 h-11 rounded-xl bg-white px-6 text-base text-indigo-700 hover:bg-white/90"
              render={<Link href="/register" />}
            >
              Create your account
              <ArrowRight />
            </Button>
          </CardContent>
        </Card>
      </section>

      <footer className="border-t border-border/60 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-4 text-center text-sm text-muted-foreground sm:px-6 lg:px-8">
          <span>© {new Date().getFullYear()} TopRankr AI. All rights reserved.</span>
        </div>
      </footer>
    </div>
  )
}
