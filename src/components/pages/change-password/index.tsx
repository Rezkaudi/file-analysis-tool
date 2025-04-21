"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { changePassword } from "@/services/profile";

const changePasswordSchema = z.object({
  oldPassword: z.string().min(4, { message: "Password must be at least 4 characters" }),
  newPassword: z.string().min(4, { message: "Password must be at least 4 characters" }),
  repassword: z.string(),
}).refine((data) => data.newPassword === data.repassword, {
  message: "Passwords do not match",
  path: ["repassword"],
});

type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

export default function ChangePasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      repassword: "",
    },
  });

  async function onSubmit(data: ChangePasswordFormValues) {
    setIsLoading(true);

    try {
      // Extract only the required fields for API submission
      const apiData = {
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
      };

      // Replace with actual API call
      await changePassword(apiData)
      router.push(`/profile`);

      toast.success("Change Password successful");

    } catch (error) {
      const axiosError = error as AxiosError<ApiError>;
      toast.error(axiosError.response?.data?.message || "Failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <div className="mb-6 text-center">
          <h1 className="text-4xl font-black text-primary">Change Password</h1>
          <p className="mt-3 text-sm text-gray-600">
            Enter your information to Change Password
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          <div className="space-y-1">
            <label htmlFor="oldPassword" className="block text-sm font-medium text-primary">
              Old Password
            </label>
            <input
              id="oldPassword"
              type="password"
              placeholder="••••••••"
              className={`w-full rounded-md border ${errors.oldPassword ? "border-red-500" : "border-gray-300"
                } px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:opacity-80`}
              {...register("oldPassword")}
              disabled={isLoading}
            />
            {errors.oldPassword && (
              <p className="text-xs text-red-500">{errors.oldPassword.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <label htmlFor="newPassword" className="block text-sm font-medium text-primary">
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
              Confirm New Password
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
                Changing...
              </div>
            ) : (
              "Change Password"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}