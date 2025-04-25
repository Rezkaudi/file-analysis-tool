import { Metadata } from "next"

// page
import History from "@/components/pages/history"

// baseUrl
import { baseUrl } from '@/utils/baseUrl';

// metadata
export const metadata: Metadata = {
  title: "History ",
  alternates: {
    canonical: `${baseUrl}/history`
  },
}

export default function HistoryPage() {
  return <History />
}
