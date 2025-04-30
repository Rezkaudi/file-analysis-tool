import { Metadata } from "next"

// page
import Feedback from "@/components/pages/feedback"

// baseUrl
import { baseUrl } from '@/utils/baseUrl';

// metadata
export const metadata: Metadata = {
    title: "Feedback ",
    alternates: {
        canonical: `${baseUrl}/feedback`
    },
}

export default function FeedbackPage() {
    return <Feedback />
}
