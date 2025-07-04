import React from 'react';

interface SmallSpinnerProps {
    size?: number; // pixel size, e.g., 16
    color?: string; // Tailwind or hex class
    className?: string;
}

const SmallSpinner: React.FC<SmallSpinnerProps> = ({
    size = 16,
    color = 'text-white',
    className = '',
}) => {
    return (
        <svg
            role="status"
            aria-label="Loading"
            style={{ width: size, height: size }}
            className={`animate-spin ${color} ${className}`}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
        >
            <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
            ></circle>
            <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4zm2 5.3A8 8 0 014 12H0c0 3 1.1 5.8 3 7.9l3-2.6z"
            ></path>
        </svg>
    );
};

export default SmallSpinner;
