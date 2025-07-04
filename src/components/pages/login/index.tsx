"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "@/store/useAuthStore";
import SmallSpinner from "@/components/common/components/SmallSpinner";
import FloatingShapesBackground from "@/components/common/components/FloatingShapesBackground";
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
  const { loginUser } = useAuthStore();

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
    await loginUser(data, router);
    setIsLoading(false);
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center px-4 py-12 overflow-hidden">
      <FloatingShapesBackground />

      <div className="relative z-10 w-full max-w-md rounded-2xl bg-white/90 p-8 shadow-xl backdrop-blur-lg transition-all duration-300 hover:shadow-2xl animate-fade-in2">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-mainPurple">{t("login.login")}</h1>
          <p className="mt-2 text-sm text-gray-600">
            {t("login.enterYourCredentialsToAccessYourAccount")}
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email */}
          <div className="space-y-1">
            <label htmlFor="email" className="block text-sm font-medium text-secondary">
              {t("login.email")}
            </label>
            <input
              id="email"
              type="email"
              placeholder="email@example.com"
              className={`w-full rounded-lg border ${errors.email ? "border-red-500" : "border-gray-300"} px-4 py-2 text-gray-900 placeholder-gray-400 focus:border-mainPurple focus:outline-none focus:ring-1`}
              {...register("email")}
              disabled={isLoading}
            />
            {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label htmlFor="password" className="block text-sm font-medium text-secondary">
              {t("login.password")}
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              className={`w-full rounded-lg border ${errors.password ? "border-red-500" : "border-gray-300"} px-4 py-2 text-gray-900 placeholder-gray-400 focus:border-mainPurple focus:outline-none focus:ring-1`}
              {...register("password")}
              disabled={isLoading}
            />
            {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-gradient-to-r from-mainPurple to-secondary px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-mainPurple focus:ring-offset-2 disabled:opacity-50"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <span>{t("login.loggingIn")}</span>
                <SmallSpinner />
              </div>
            ) : (
              t("login.loginButton")
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          {t("login.dontHaveAnAccount")}{" "}
          <Link href="/register" className="font-medium text-mainPurple hover:underline">
            {t("login.register")}
          </Link>
        </div>

        <div className="mt-2 text-center text-sm">
          <Link href="/forget-password" className="font-medium text-mainPurple hover:underline">
            {t("login.forgotPassword")}
          </Link>
        </div>
      </div>
    </div>
  );
}
