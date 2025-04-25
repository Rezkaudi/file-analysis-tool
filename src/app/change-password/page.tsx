import { Metadata } from "next"

// page
import ChangePassword from "@/components/pages/change-password"

// baseUrl
import { baseUrl } from '@/utils/baseUrl';

// metadata
export const metadata: Metadata = {
  title: "change-password ",
  alternates: {
    canonical: `${baseUrl}/change-password`
  },
}

export default function ChangePasswordPage() {
  return <ChangePassword />
}
