import { Metadata } from "next"

// page
import PaymentCancel from "@/components/pages/payment-cancel"

// baseUrl
import { baseUrl } from '@/utils/baseUrl';

// metadata
export const metadata: Metadata = {
  title: "Payment Cancel ",
  alternates: {
    canonical: `${baseUrl}/Payment Cancel`
  },
}

export default function PaymentCancelPage() {
  return <PaymentCancel />
}
