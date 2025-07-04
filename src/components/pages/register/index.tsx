"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import Link from "next/link";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";

import { useAuthStore } from "@/store/useAuthStore";
import SmallSpinner from "@/components/common/components/SmallSpinner";
import FloatingShapesBackground from "@/components/common/components/FloatingShapesBackground";

// Validation schema using Zod
const registerSchema = z
  .object({
    name: z
      .string()
      .min(2, { message: "Name must be at least 2 characters" })
      .regex(/^[a-zA-Z\s]+$/, { message: "Name must contain only letters and spaces" }),
    email: z.string().email({ message: "Please enter a valid email address" }),
    password: z.string(),
    repassword: z.string(),
    terms: z
      .boolean()
      .refine((val) => val === true, {
        message: "You must accept the terms and conditions",
      }),
  })
  .refine((data) => data.password === data.repassword, {
    message: "Passwords do not match",
    path: ["repassword"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { signupUser } = useAuthStore();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      repassword: "",
      terms: false,
    },
  });

  async function onSubmit(data: RegisterFormValues) {
    setIsLoading(true);

    // Prepare API payload
    const apiData = {
      name: data.name,
      email: data.email,
      password: data.password,
    };

    await signupUser(apiData, router);
    setIsLoading(false);
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center px-4 py-12">
      <FloatingShapesBackground />
      <div className="w-full z-10 max-w-md rounded-2xl bg-white p-10 shadow-xl backdrop-blur-sm transform transition-all duration-500 ease-in-out animate-fade-in2">
        <div className="mb-6 text-center">
          <h1 className="text-4xl font-extrabold text-mainPurple transition-transform duration-300 ease-out">
            {t("register.createAnAccount")}
          </h1>
          <p className="mt-2 text-sm text-gray-600 transition-opacity duration-300 ease-out">
            {t("register.enterYourInformationToCreateAnAccount")}
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Name Input */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              {t("register.name")}
            </label>
            <input
              id="name"
              type="text"
              maxLength={30}
              placeholder="John Doe"
              className={`mt-1 w-full rounded-xl border px-4 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-mainPurple transition duration-300 ease-in-out ${errors.name ? "border-red-500" : "border-gray-300"
                }`}
              {...register("name")}
              disabled={isLoading}
            />
            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
          </div>

          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              {t("register.email")}
            </label>
            <input
              id="email"
              type="email"
              placeholder="email@example.com"
              className={`mt-1 w-full rounded-xl border px-4 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-mainPurple transition duration-300 ease-in-out ${errors.email ? "border-red-500" : "border-gray-300"
                }`}
              {...register("email")}
              disabled={isLoading}
            />
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
          </div>

          {/* Password Input */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              {t("register.password")}
            </label>
            <div className="relative mt-1">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className={`w-full rounded-xl border px-4 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-mainPurple transition duration-300 ease-in-out ${errors.password ? "border-red-500" : "border-gray-300"
                  }`}
                {...register("password")}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 transition-colors duration-300 ease-in-out hover:text-gray-700"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
              </button>
            </div>
            {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
          </div>

          {/* Confirm Password Input */}
          <div>
            <label htmlFor="repassword" className="block text-sm font-medium text-gray-700">
              {t("register.confirmPassword")}
            </label>
            <div className="relative mt-1">
              <input
                id="repassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                className={`w-full rounded-xl border px-4 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-mainPurple transition duration-300 ease-in-out ${errors.repassword ? "border-red-500" : "border-gray-300"
                  }`}
                {...register("repassword")}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 transition-colors duration-300 ease-in-out hover:text-gray-700"
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
              </button>
            </div>
            {errors.repassword && <p className="mt-1 text-xs text-red-500">{errors.repassword.message}</p>}
          </div>

          {/* Terms & Conditions */}
          <div className="flex items-start space-x-3">
            <input
              id="terms"
              type="checkbox"
              className="mt-1 h-4 w-4 rounded text-mainPurple focus:ring-mainPurple transition-colors duration-300 ease-in-out"
              {...register("terms")}
              disabled={isLoading}
            />
            <label htmlFor="terms" className="text-sm text-gray-700">
              {t("register.IAgreeToTheTermsOfServiceAnd")}{" "}
              <Link
                href="/privacy-policy"
                className="text-secondary underline transition-colors duration-300 ease-in-out hover:text-secondary-dark"
              >
                {t("register.privacyPolicy")}
              </Link>
            </label>
          </div>
          {errors.terms && <p className="mt-1 text-xs text-red-500">{errors.terms.message}</p>}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-xl bg-mainPurple px-4 py-2 text-white font-semibold transition-all duration-300 hover:bg-opacity-90 disabled:opacity-50"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <span>{t("register.creatingAccount")}</span>
                <SmallSpinner />
              </div>
            ) : (
              <span>{t("register.regButton")}</span>
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          {t("register.alreadyHaveAnAccount")}{" "}
          <Link href="/login" className="font-medium text-mainPurple transition-colors duration-300 hover:underline">
            {t("register.login")}
          </Link>
        </p>
      </div>
    </div>
  );
}
