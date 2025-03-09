import { Metadata } from "next"

// page
import Profile from "@/components/pages/profile"

// baseUrl
import { baseUrl } from '@/utils/baseUrl';

// metadata
export const metadata: Metadata = {
  title: "profile ",
  description: "profile Description",
  keywords: "profile",
  alternates: {
    canonical: `${baseUrl}/profile`
  },
}

export default function ProfilePage() {
  return <Profile />
}
