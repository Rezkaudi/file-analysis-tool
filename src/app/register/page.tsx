import { Metadata } from "next"

// page
import Register from "@/components/pages/register"

// baseUrl
import { baseUrl } from '@/utils/baseUrl';

// metadata
export const metadata: Metadata = {
  title: "Register ",
  alternates: {
    canonical: `${baseUrl}/register`
  },
}

export default function RegisterPage() {
  return <Register />
}
