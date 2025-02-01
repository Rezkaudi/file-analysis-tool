import { Metadata } from "next"

// page
import AnalysisOld from "@/components/pages/analysis-old"

// baseUrl
import { baseUrl } from '@/utils/baseUrl';

// metadata
export const metadata: Metadata = {
  title: "Analysis Old ",
  description: "Analysis Old Description",
  keywords: "Analysis Old",
  alternates: {
    canonical: `${baseUrl}/analysis-old`
  },
}

export default function AnalysisPageOld() {
  return <AnalysisOld />
}
