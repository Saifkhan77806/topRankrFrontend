import { Suspense } from "react"
import Link from "next/link"
import { Sparkles } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { LoginForm } from "@/components/auth/LoginForm"

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen flex-1 items-center justify-center overflow-hidden bg-slate-950 px-4 py-12">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(99,102,241,0.35),transparent_45%),radial-gradient(circle_at_80%_0%,rgba(56,189,248,0.25),transparent_40%),radial-gradient(circle_at_50%_100%,rgba(168,85,247,0.25),transparent_45%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:48px_48px]"
      />

      <div className="relative z-10 flex w-full max-w-md flex-col items-center gap-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-400 to-sky-400 shadow-lg shadow-indigo-500/30">
            <Sparkles className="size-5 text-white" />
          </div>
          <span className="text-xl font-semibold tracking-tight text-white">
            TopRankr <span className="text-indigo-300">AI</span>
          </span>
        </Link>

        <Card className="w-full border-white/10 bg-white/[0.07] shadow-2xl shadow-black/40 backdrop-blur-xl">
          <CardHeader className="gap-1.5 px-8 pt-8">
            <CardTitle className="text-2xl text-white">Welcome back</CardTitle>
            <CardDescription className="text-white/60">
              Sign in to continue to your recruiting workspace
            </CardDescription>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            <div className="[&_label]:text-white/80 [&_input]:border-white/15 [&_input]:bg-white/5 [&_input]:text-white [&_input::placeholder]:text-white/30">
              <Suspense fallback={null}>
                <LoginForm />
              </Suspense>
            </div>
          </CardContent>
        </Card>

        <p className="text-sm text-white/50">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-medium text-indigo-300 hover:text-indigo-200">
            Create one
          </Link>
        </p>
      </div>
    </div>
  )
}
