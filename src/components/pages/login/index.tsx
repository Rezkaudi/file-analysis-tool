"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "@/store/useAuthStore";
import SmallSpinner from "@/components/common/components/SmallSpinner";
import { useTranslation } from "react-i18next";


const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(4, { message: "Password must be at least 4 characters" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { loginUser } = useAuthStore()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: LoginFormValues) {
    setIsLoading(true);
    await loginUser(data, router)
    setIsLoading(false);

  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-primary">{t("login.login")}</h1>
          <p className="mt-2 text-sm text-gray-600">
            {t("login.enterYourCredentialsToAccessYourAccount")}
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1">
            <label htmlFor="email" className="block text-sm font-medium text-secondary">
              {t("login.email")}
            </label>
            <input
              id="email"
              type="email"
              placeholder="email@example.com"
              className={`w-full rounded-md border ${errors.email ? "border-red-500" : "border-gray-300"
                } px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-mainPurple focus:outline-none focus:ring-1 focus:opacity-80`}
              {...register("email")}
              disabled={isLoading}
            />
            {errors.email && (
              <p className="text-xs text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <label htmlFor="password" className="block text-sm font-medium text-secondary">
              {t("login.password")}
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              className={`w-full rounded-md border ${errors.password ? "border-red-500" : "border-gray-300"
                } px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-mainPurple focus:outline-none focus:ring-1 focus:opacity-80`}
              {...register("password")}
              disabled={isLoading}
            />
            {errors.password && (
              <p className="text-xs text-red-500">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-md bg-gradient-to-r from-secondary to-accent px-4 py-2 text-sm font-medium text-white hover:opacity-80 focus:outline-none focus:ring-2 focus:opacity-80 focus:ring-offset-2 disabled:opacity-50"
          >
            {isLoading ? (
              <div className="flex items-center gap-3 justify-center">
                <span> {t("login.loggingIn")}</span>
                <SmallSpinner />
              </div>
            ) : (
              <div>{t("login.loginButton")}</div>

            )}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          {t("login.dontHaveAnAccount")}?{" "}
          <Link href="/register" className="font-medium text-primary hover:opacity-80">
            {t("login.register")}
          </Link>
        </div>
        <div className="mt-2 text-center text-sm">
          <Link href="/forget-password" className="font-medium text-primary hover:opacity-80">
            {t("login.forgotPassword")}
          </Link>
        </div>
      </div>
    </div>
  );
}