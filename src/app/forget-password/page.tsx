import { Metadata } from "next"

// page
import ForgetPassword from "@/components/pages/forget-password"

// baseUrl
import { baseUrl } from '@/utils/baseUrl';

// metadata
export const metadata: Metadata = {
  title: "Forget Password ",
  description: "Forget Password Description",
  keywords: "Forget Password",
  alternates: {
    canonical: `${baseUrl}/forget-password`
  },
}

export default function ForgetPasswordPage() {
  return <ForgetPassword />
}
