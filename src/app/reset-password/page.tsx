import { Metadata } from "next"

// page
import ResetPassword from "@/components/pages/reset-password"

// baseUrl
import { baseUrl } from '@/utils/baseUrl';

// metadata
export const metadata: Metadata = {
  title: "Reset Password ",
  description: "Reset Password Description",
  keywords: "Reset Password",
  alternates: {
    canonical: `${baseUrl}/reset-password`
  },
}

export default function ResetPasswordPage() {
  return <ResetPassword />
}
