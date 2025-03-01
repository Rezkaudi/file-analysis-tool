import { Metadata } from "next"

// page
import Login from "@/components/pages/login"

// baseUrl
import { baseUrl } from '@/utils/baseUrl';

// metadata
export const metadata: Metadata = {
  title: "Login ",
  description: "Login Description",
  keywords: "Login",
  alternates: {
    canonical: `${baseUrl}/login`
  },
}

export default function LoginPage() {
  return <Login />
}
