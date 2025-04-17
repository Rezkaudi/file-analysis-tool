import { Metadata } from "next"

// page
import Plans from "@/components/pages/plans"

// baseUrl
import { baseUrl } from '@/utils/baseUrl';

// metadata
export const metadata: Metadata = {
  title: "Plans ",
  description: "Plans Description",
  keywords: "Plans",
  alternates: {
    canonical: `${baseUrl}/Plans`
  },
}

export default function PlansPage() {
  return <Plans />
}
