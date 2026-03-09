"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginInput } from "@/lib/validations";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export function LoginForm(): JSX.Element {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput): Promise<void> => {
    setServerError(null);
    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });
    if (result?.error) {
      setServerError("Invalid email or password.");
      return;
    }
    router.push(callbackUrl);
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
      {serverError ? (
        <p className="text-sm text-red-600 dark:text-red-400" role="alert">
          {serverError}
        </p>
      ) : null}
      <Input label="Email" type="email" autoComplete="email" error={errors.email?.message} {...register("email")} />
      <Input
        label="Password"
        type="password"
        autoComplete="current-password"
        error={errors.password?.message}
        {...register("password")}
      />
      <Button type="submit" className="w-full" isLoading={isSubmitting}>
        Log in
      </Button>
      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-zinc-200 dark:border-zinc-700" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-white px-2 text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400">Or continue with</span>
        </div>
      </div>
      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={() => signIn("github", { callbackUrl })}
      >
        GitHub
      </Button>
    </form>
  );
}
