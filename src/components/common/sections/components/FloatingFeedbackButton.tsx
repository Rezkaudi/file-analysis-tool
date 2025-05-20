import Link from 'next/link';
import {MessageCircleCodeIcon} from 'lucide-react';
import React from "react";

export default function FloatingFeedbackButton() {
    return (
        <Link href="/feedback" passHref

                aria-label="Feedback"
                title="Give Feedback"
                className="
          fixed bottom-5 left-5
          bg-blue-600 hover:bg-blue-700
          text-white
          rounded-full
          w-9 h-9
          flex items-center justify-center
          shadow-lg
          transition-colors duration-300
          focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2
          z-50
          md:w-16 md:h-16
          md:bottom-6 md:left-6
        "
            >
                <MessageCircleCodeIcon className="w-6 h-6" />

        </Link>
    );
}

