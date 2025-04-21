"use client";

import { useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "@/store/useAuthStore";


export default function ResetPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingResend, setIsLoadingResend] = useState(false);
  const { resetPasswordUser, resendVerificationCodeForResetUser } = useAuthStore()

  const [code, setCode] = useState(["", "", "", ""]);
  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  const resetPasswordSchema = z.object({
    newPassword: z.string().min(4, { message: "Password must be at least 4 characters" }),
    repassword: z.string(),
  }).refine((data) => data.newPassword === data.repassword, {
    message: "Passwords do not match",
    path: ["repassword"],
  });

  type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

  const router = useRouter();
  const verificationId = useSearchParams().get('verificationId')


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
    // Only allow numbers
    if (value && !/^\d+$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value.slice(0, 1); // Only take the first character
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Move to previous input on backspace if current input is empty
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain").trim();

    // Check if pasted content is a 4-digit number
    if (/^\d{4}$/.test(pastedData)) {
      const digits = pastedData.split("");
      setCode(digits);

      // Focus the last input
      inputRefs[3].current?.focus();
    }
  };

  async function onSubmit(data: ResetPasswordFormValues) {
    const verificationCode = code.join("");

    if (verificationCode.length !== 4) {
      toast.error("Please enter a valid 4-digit verification code");
      return;
    }

    setIsLoading(true);
    const resetPasswordData = { verificationId, verificationCode, newPassword: data.newPassword }
    await resetPasswordUser(resetPasswordData, router)
    setIsLoading(false);

  }

  async function handleResend() {

    setIsLoadingResend(true);
    const resendCodeData = { verificationId }
    await resendVerificationCodeForResetUser(resendCodeData, router)
    setIsLoadingResend(false);

  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-primary">Verify your account</h1>
          <p className="mt-3 text-sm text-gray-600">
            Enter the 4-digit code sent to your email
          </p>
        </div>

        <div className="space-y-6">
          <div className="flex justify-center space-x-3 py-4">
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
                className="h-12 w-12 rounded-md border border-gray-300 text-center text-lg font-semibold text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                disabled={isLoading}
              />
            ))}
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">


            <div className="space-y-1">
              <label htmlFor="password" className="block text-sm font-medium text-primary">
                New Password
              </label>
              <input
                id="newPassword"
                type="password"
                placeholder="••••••••"
                className={`w-full rounded-md border ${errors.newPassword ? "border-red-500" : "border-gray-300"
                  } px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:opacity-80`}
                {...register("newPassword")}
                disabled={isLoading}
              />
              {errors.newPassword && (
                <p className="text-xs text-red-500">{errors.newPassword.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <label htmlFor="repassword" className="block text-sm font-medium text-primary">
                Confirm Password
              </label>
              <input
                id="repassword"
                type="password"
                placeholder="••••••••"
                className={`w-full rounded-md border ${errors.repassword ? "border-red-500" : "border-gray-300"
                  } px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:opacity-80`}
                {...register("repassword")}
                disabled={isLoading}
              />
              {errors.repassword && (
                <p className="text-xs text-red-500">{errors.repassword.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-md bg-gradient-to-r from-secondary to-accent px-4 py-2 text-sm font-medium text-white hover:opacity-80 focus:outline-none focus:ring-2 focus:opacity-80 focus:ring-offset-2 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg className="mr-2 h-4 w-4 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Reset...
                </div>
              ) : (
                "Reset Password"
              )}
            </button>
          </form>

          <div className="text-center text-sm">
            Didn&apos;t receive a code?{" "}
            <button
              onClick={handleResend}
              className="font-medium text-blue-600 hover:text-blue-500 inline-flex justify-center items-center gap-2"
              disabled={isLoadingResend}
            >
              <span>Resend code</span>
              {isLoadingResend && <svg className="h-4 w-4 animate-spin text-purple-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}