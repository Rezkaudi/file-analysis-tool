import Link from "next/link";


const Index = () => {


    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-gray-50 p-4">
            <div className="max-w-md w-full bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-red-100 animate-fade-up">
                <div className="flex flex-col items-center text-center space-y-4">
                    <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center">
                        <svg
                            className="h-10 w-10 text-red-600"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </div>

                    <h1 className="text-2xl font-bold text-gray-900">Payment Cancelled</h1>

                    <p className="text-gray-600 max-w-sm">
                        Your payment was not completed. Dont worry - no charges were made to your account.
                    </p>

                    <div className="bg-red-50/50 rounded-lg p-4 w-full">
                        <div className="text-sm text-gray-600">
                            If you experienced any issues, please contact our support team.
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 w-full pt-4">
                        <Link
                            href="/"
                            className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors text-center"
                        >
                            Return Home
                        </Link>
                        <Link
                            href="/plans"
                            className="w-full px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-md transition-colors text-center"
                        >
                            Back to Plans
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Index;
