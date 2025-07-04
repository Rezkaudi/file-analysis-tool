"use client";

import { useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "@/store/useAuthStore";
import SmallSpinner from "@/components/common/components/SmallSpinner";
import { useTranslation } from "react-i18next";

export default function ResetPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingResend, setIsLoadingResend] = useState(false);
  const { resetPasswordUser, resendVerificationCodeForResetUser } = useAuthStore();
  const { t } = useTranslation();
  const router = useRouter();
  const verificationId = useSearchParams().get("verificationId");

  const [code, setCode] = useState(["", "", "", ""]);
  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  const resetPasswordSchema = z
    .object({
      newPassword: z.string().min(4, { message: "Password must be at least 4 characters" }),
      repassword: z.string(),
    })
    .refine((data) => data.newPassword === data.repassword, {
      message: "Passwords do not match",
      path: ["repassword"],
    });

  type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
      repassword: "",
    },
  });

  const handleChange = (index: number, value: string) => {
    if (value && !/^\d+$/.test(value)) return;
    const newCode = [...code];
    newCode[index] = value.slice(0, 1);
    setCode(newCode);
    if (value && index < 3) inputRefs[index + 1].current?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain").trim();
    if (/^\d{4}$/.test(pastedData)) {
      setCode(pastedData.split(""));
      inputRefs[3].current?.focus();
    }
  };

  async function onSubmit(data: ResetPasswordFormValues) {
    const verificationCode = code.join("");
    if (verificationCode.length !== 4) {
      toast.error(t("resetPassword.validationError"));
      return;
    }
    setIsLoading(true);
    await resetPasswordUser({ verificationId, verificationCode, newPassword: data.newPassword }, router);
    setIsLoading(false);
  }

  async function handleResend() {
    setIsLoadingResend(true);
    await resendVerificationCodeForResetUser({ verificationId }, router);
    setIsLoadingResend(false);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-100 to-white px-4 py-12">
      <div className="w-full max-w-md rounded-3xl bg-white/90 backdrop-blur-md p-8 shadow-2xl animate-fade-in2">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-extrabold text-primary">{t("resetPassword.title")}</h1>
          <p className="mt-2 text-sm text-gray-600">{t("resetPassword.description")}</p>
        </div>

        <div className="flex justify-center gap-3 py-4">
          {code.map((digit, index) => (
            <input
              key={index}
              ref={inputRefs[index]}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={index === 0 ? handlePaste : undefined}
              className="h-14 w-14 rounded-xl border border-gray-300 text-center text-2xl font-bold text-gray-900 shadow-sm outline-none transition-all duration-150 focus:scale-105 focus:ring-2 focus:ring-mainPurple"
              disabled={isLoading}
            />
          ))}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-6">
          <div className="space-y-1">
            <label htmlFor="newPassword" className="text-sm font-semibold text-primary">
              {t("resetPassword.newPassword")}
            </label>
            <input
              id="newPassword"
              type="password"
              placeholder="••••••••"
              className={`w-full rounded-lg border px-4 py-2 text-gray-900 placeholder-gray-400 transition focus:ring-2 focus:outline-none ${errors.newPassword ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-mainPurple"}`}
              {...register("newPassword")}
              disabled={isLoading}
            />
            {errors.newPassword && (
              <p className="text-xs text-red-500 animate-fade-in2">{errors.newPassword.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <label htmlFor="repassword" className="text-sm font-semibold text-primary">
              {t("resetPassword.confirmPassword")}
            </label>
            <input
              id="repassword"
              type="password"
              placeholder="••••••••"
              className={`w-full rounded-lg border px-4 py-2 text-gray-900 placeholder-gray-400 transition focus:ring-2 focus:outline-none ${errors.repassword ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-mainPurple"}`}
              {...register("repassword")}
              disabled={isLoading}
            />
            {errors.repassword && (
              <p className="text-xs text-red-500 animate-fade-in2">{errors.repassword.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-xl bg-gradient-to-r from-secondary to-accent px-4 py-3 text-white text-sm font-semibold transition-all duration-200 hover:brightness-110 focus:ring-2 focus:ring-offset-2 disabled:opacity-50"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <span>{t("resetPassword.reset")}</span>
                <SmallSpinner />
              </div>
            ) : (
              t("resetPassword.resetPasswordBtn")
            )}
          </button>
        </form>

        <div className="mt-4 text-center text-sm">
          {t("resetPassword.didntReceiveACode")}{" "}
          <button
            onClick={handleResend}
            className="inline-flex items-center gap-1 font-medium text-mainPurple hover:underline transition-opacity"
            disabled={isLoadingResend}
          >
            <span>{"Resend Code"}</span>
            {isLoadingResend && <SmallSpinner />}
          </button>
        </div>
      </div>
    </div>
  );
}
