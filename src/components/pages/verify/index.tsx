"use client";

import { useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useAuthStore } from "@/store/useAuthStore";
import dynamic from "next/dynamic";
import { useTranslation } from "react-i18next";
import FloatingShapesBackground from "@/components/common/components/FloatingShapesBackground";

// Lazy-load spinner with fallback
const SmallSpinner = dynamic(() => import("@/components/common/components/SmallSpinner"), {
  loading: () => <div className="h-4 w-4 animate-spin rounded-full border-2 border-t-transparent border-white" />,
  ssr: false,
});

export default function VerifyPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingResend, setIsLoadingResend] = useState(false);
  const { verifyUser, resendVerificationCodeUser } = useAuthStore();
  const { t } = useTranslation();
  const [code, setCode] = useState(["", "", "", ""]);
  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];
  const router = useRouter();
  const verificationId = useSearchParams().get("verificationId");

  const handleChange = (index: number, value: string) => {
    if (value && !/^\d+$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value.slice(0, 1);
    setCode(newCode);

    if (value && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text/plain").trim();
    if (/^\d{4}$/.test(pasted)) {
      const digits = pasted.split("");
      setCode(digits);
      inputRefs[3].current?.focus();
    }
  };

  async function handleVerify() {
    const verificationCode = code.join("");
    if (verificationCode.length !== 4) {
      toast.error(t("verify.verifyError"));
      return;
    }

    setIsLoading(true);
    await verifyUser({ verificationId, verificationCode }, router);
    setIsLoading(false);
  }

  async function handleResend() {
    setIsLoadingResend(true);
    await resendVerificationCodeUser({ verificationId }, router);
    setIsLoadingResend(false);
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center px-4 py-12">
      <FloatingShapesBackground />
      <div className="w-full max-w-md rounded-2xl bg-white p-8 backdrop-blur-md shadow-2xl transition-all duration-300 ease-in-out animate-fade-in2">
        <div className="mb-6 text-center space-y-2">
          <h1 className="text-3xl font-bold text-primary">
            {t("verify.title")}
          </h1>
          <p className="text-sm text-gray-600">{t("verify.description")}</p>
        </div>

        <div role="group" aria-labelledby="verification-code-label" className="space-y-6">
          <label id="verification-code-label" className="sr-only">
            {t("verify.codeLabel")}
          </label>

          <div className="grid grid-cols-4 gap-3 justify-center">
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
                aria-label={`Digit ${index + 1}`}
                aria-required="true"
                tabIndex={index + 1}
                disabled={isLoading}
                className="min-w-[44px] min-h-[44px] rounded-lg border border-gray-300 bg-white text-center text-xl font-semibold text-gray-900 focus:border-mainPurple focus:ring-2 focus:ring-mainPurple focus:outline-none transition-all duration-200 ease-in-out transform focus:scale-105 disabled:opacity-50"
              />
            ))}
          </div>

          <button
            onClick={handleVerify}
            disabled={isLoading || code.some((d) => !d)}
            className="w-full rounded-lg bg-gradient-to-r from-secondary to-accent px-4 py-3 text-base font-semibold text-white shadow transition-all duration-200 hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-3">
                <span>{t("verify.verifying")}</span>
                <SmallSpinner />
              </div>
            ) : (
              t("verify.verifyAccount")
            )}
          </button>

          <div className="text-center text-sm">
            {t("verify.didntReceiveCode")}{" "}
            <button
              onClick={handleResend}
              className="inline-flex items-center gap-2 font-medium text-mainPurple hover:underline hover:opacity-80 transition-opacity"
              disabled={isLoadingResend}
            >
              <span>{t("verify.ResendCode")}</span>
              {isLoadingResend && <SmallSpinner />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
