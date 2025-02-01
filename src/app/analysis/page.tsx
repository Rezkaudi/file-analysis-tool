import { Metadata } from "next"

// page
import Analysis from "@/components/pages/analysis"

// baseUrl
import { baseUrl } from '@/utils/baseUrl';

// metadata
export const metadata: Metadata = {
  title: "Analysis ",
  description: "Analysis Description",
  keywords: "Analysis",
  alternates: {
    canonical: `${baseUrl}/analysis`
  },
}

export default function AnalysisPage() {
  return <Analysis />
}
