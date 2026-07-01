"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { CheckCircle2, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { useRegister } from "@/hooks/use-register";
import { ApiError } from "@/lib/api-client";
import type { Role } from "@/types/auth";

const registerSchema = z
  .object({
    email: z
      .string()
      .min(1, "Email is required")
      .email("Enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    role: z.enum(["recruiter", "admin"]),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

const ROLE_OPTIONS: { value: Role; label: string; description: string }[] = [
  //   {
  //     value: "recruiter",
  //     label: "Recruiter",
  //     description: "Search, compare, and shortlist candidates",
  //   },
  //   {
  //     value: "admin",
  //     label: "Admin",
  //     description: "Full access, including team and settings management",
  //   },
];

export function RegisterForm() {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const registerMutation = useRegister();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      role: "recruiter",
    },
  });

  const selectedRole = useWatch({ control, name: "role" });

  const onSubmit = (values: RegisterFormValues) => {
    setSubmitError(null);
    registerMutation.mutate(
      { email: values.email, password: values.password, role: values.role },
      {
        onSuccess: () => {
          setSuccess(true);
          setTimeout(() => router.push("/login"), 1500);
        },
        onError: (error) => {
          setSubmitError(
            error instanceof ApiError
              ? error.message
              : "Something went wrong. Please try again.",
          );
        },
      },
    );
  };

  if (success) {
    return (
      <Alert className="border-emerald-200 bg-emerald-50">
        <CheckCircle2 className="text-emerald-600" />
        <AlertTitle className="text-emerald-800">Account created</AlertTitle>
        <AlertDescription className="text-emerald-700">
          Redirecting you to sign in...
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      {submitError && (
        <Alert variant="destructive">
          <AlertTitle>Registration failed</AlertTitle>
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
          autoComplete="new-password"
          placeholder="At least 8 characters"
          aria-invalid={!!errors.password}
          {...register("password")}
        />
        {errors.password && (
          <p className="text-sm text-destructive">{errors.password.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="confirmPassword">Confirm password</Label>
        <Input
          id="confirmPassword"
          type="password"
          autoComplete="new-password"
          placeholder="Re-enter your password"
          aria-invalid={!!errors.confirmPassword}
          {...register("confirmPassword")}
        />
        {errors.confirmPassword && (
          <p className="text-sm text-destructive">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label>Role</Label>
        <div className="grid grid-cols-2 gap-3">
          {ROLE_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() =>
                setValue("role", option.value, { shouldValidate: true })
              }
              className={cn(
                "flex flex-col gap-0.5 rounded-xl border px-3.5 py-3 text-left transition-all",
                selectedRole === option.value
                  ? "border-indigo-400 bg-indigo-400/10 ring-1 ring-indigo-400"
                  : "border-white/15 hover:bg-white/5",
              )}
            >
              <span className="text-sm font-medium text-white">
                {option.label}
              </span>
              <span className="text-xs text-white/50">
                {option.description}
              </span>
            </button>
          ))}
        </div>
      </div>

      <Button
        type="submit"
        size="lg"
        className="mt-1 h-11 w-full rounded-xl text-base"
        disabled={registerMutation.isPending}
      >
        {registerMutation.isPending && <Loader2 className="animate-spin" />}
        {registerMutation.isPending ? "Creating account..." : "Create account"}
      </Button>
    </form>
  );
}
