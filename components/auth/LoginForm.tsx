"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useLogin } from "@/hooks/use-login"
import { ApiError } from "@/lib/api-client"

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
})

type LoginFormValues = z.infer<typeof loginSchema>

export function LoginForm() {
  const [submitError, setSubmitError] = useState<string | null>(null)
  const searchParams = useSearchParams()
  const sessionExpired = searchParams.get("reason") === "expired"
  const loginMutation = useLogin()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", rememberMe: true },
  })

  const onSubmit = (values: LoginFormValues) => {
    setSubmitError(null)
    loginMutation.mutate(
      { email: values.email, password: values.password },
      {
        onError: (error) => {
          setSubmitError(
            error instanceof ApiError ? error.message : "Something went wrong. Please try again."
          )
        },
      }
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      {sessionExpired && !submitError && (
        <Alert className="border-amber-400/30 bg-amber-400/10">
          <AlertTitle className="text-amber-300">Session expired</AlertTitle>
          <AlertDescription className="text-amber-200/80">
            Your session has ended. Please sign in again to continue.
          </AlertDescription>
        </Alert>
      )}

      {submitError && (
        <Alert variant="destructive">
          <AlertTitle>Login failed</AlertTitle>
          <AlertDescription>{submitError}</AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="you@company.com"
          aria-invalid={!!errors.email}
          {...register("email")}
        />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          aria-invalid={!!errors.password}
          {...register("password")}
        />
        {errors.password && (
          <p className="text-sm text-destructive">{errors.password.message}</p>
        )}
      </div>

      <div className="flex items-center justify-between">
        <label className="flex cursor-pointer items-center gap-2 text-sm text-white/60">
          <input
            type="checkbox"
            className="size-4 rounded border-white/20 accent-indigo-400"
            {...register("rememberMe")}
          />
          Remember me
        </label>
      </div>

      <Button
        type="submit"
        size="lg"
        className="mt-1 h-11 w-full rounded-xl text-base"
        disabled={loginMutation.isPending}
      >
        {loginMutation.isPending && <Loader2 className="animate-spin" />}
        {loginMutation.isPending ? "Signing in..." : "Sign in"}
      </Button>
    </form>
  )
}
