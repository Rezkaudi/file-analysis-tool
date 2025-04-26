import { Metadata } from "next"

// page
import PaymentSuccess from "@/components/pages/payment-success"

// baseUrl
import { baseUrl } from '@/utils/baseUrl';

// metadata
export const metadata: Metadata = {
  title: "Payment Success ",
  alternates: {
    canonical: `${baseUrl}/Payment Success`
  },
}

export default function PaymentSuccessPage() {
  return <PaymentSuccess />
}
