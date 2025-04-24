"use client";

import { useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useAuthStore } from "@/store/useAuthStore";
import SmallSpinner from "@/components/common/components/SmallSpinner";

export default function VerifyPage() {

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingResend, setIsLoadingResend] = useState(false);
  const { verifyUser, resendVerificationCodeUser } = useAuthStore()

  const [code, setCode] = useState(["", "", "", ""]);
  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];
  const router = useRouter();
  const verificationId = useSearchParams().get('verificationId')

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

  async function handleVerify() {
    const verificationCode = code.join("");

    if (verificationCode.length !== 4) {
      toast.error("Please enter a valid 4-digit verification code");
      return;
    }

    setIsLoading(true);
    const verifyData = { verificationId, verificationCode }
    await verifyUser(verifyData, router)
    setIsLoading(false);

  }

  async function handleResend() {
    setIsLoadingResend(true);
    const resendCodeData = { verificationId }
    await resendVerificationCodeUser(resendCodeData, router)
    setIsLoadingResend(false);

  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-mainPurple">Verify your account</h1>
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
                className="h-12 w-12 rounded-md border border-gray-300 text-center text-lg font-semibold text-gray-900 focus:border-mainPurple focus:outline-none focus:ring-1 focus:ring-mainPurple"
                disabled={isLoading}
              />
            ))}
          </div>

          <button
            onClick={handleVerify}
            disabled={isLoading || code.some(digit => !digit)}
            className="w-full rounded-md bg-gradiantPurple px-4 py-2 text-sm font-medium text-white hover:opacity-80 focus:outline-none focus:ring-2 focus:opacity-80 hover:bg-mainPurple  focus:ring-mainPurple focus:ring-offset-2 disabled:opacity-80"
          >
            {isLoading ? (
              <div className="flex items-center gap-3 justify-center">
                <span> Verifying...</span>
                <SmallSpinner />
              </div>
            ) : (
              "Verify Account"
            )}
          </button>


          <div className="text-center text-sm">
            Didn&apos;t receive a code?{" "}
            <button
              onClick={handleResend}
              className="font-medium text-mainPurple hover:opacity-70 inline-flex justify-center items-center gap-2"
              disabled={isLoadingResend}
            >
              <span>Resend code</span>
              {isLoadingResend && <SmallSpinner />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}