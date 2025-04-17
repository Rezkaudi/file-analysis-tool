import { Metadata } from "next"

// page
import UseCases from "@/components/pages/use-cases"

// baseUrl
import { baseUrl } from '@/utils/baseUrl';

// metadata
export const metadata: Metadata = {
  title: "Use Cases ",
  description: "Use Cases Description",
  keywords: "Use Cases",
  alternates: {
    canonical: `${baseUrl}/UseCases`
  },
}

export default function UseCasesPage() {
  return <UseCases />
}
