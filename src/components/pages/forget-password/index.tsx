"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "@/store/useAuthStore";

const forgetSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
});

type ForgetPasswordFormValues = z.infer<typeof forgetSchema>;

export default function ForgetPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { forgetPasswordUser } = useAuthStore()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgetPasswordFormValues>({
    resolver: zodResolver(forgetSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(data: ForgetPasswordFormValues) {
    setIsLoading(true);
    await forgetPasswordUser(data, router)
    setIsLoading(false);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-[#8926a4]">Forget Password</h1>
          <p className="mt-2 text-sm text-gray-600">
            Enter your email to Reset Password
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1">
            <label htmlFor="email" className="block text-sm font-medium text-purple-500">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="email@example.com"
              className={`w-full rounded-md border ${errors.email ? "border-red-500" : "border-gray-300"
                } px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:opacity-80`}
              {...register("email")}
              disabled={isLoading}
            />
            {errors.email && (
              <p className="text-xs text-red-500">{errors.email.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-md bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2 text-sm font-medium text-white hover:opacity-80 focus:outline-none focus:ring-2 focus:opacity-80 focus:ring-offset-2 disabled:opacity-50"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg className="mr-2 h-4 w-4 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Logging in...
              </div>
            ) : (
              "Submit"
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          Do you have an account?{" "}
          <Link href="/login" className="font-medium text-[#8926a4] hover:opacity-80">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}