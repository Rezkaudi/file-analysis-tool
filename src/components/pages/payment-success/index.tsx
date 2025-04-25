import Link from "next/link";


const Index = () => {


    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 p-4">
            <div className="max-w-md w-full bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-green-100 animate-fade-up">
                <div className="flex flex-col items-center text-center space-y-4">
                    <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
                        <svg
                            className="h-10 w-10 text-green-600"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                    </div>

                    <h1 className="text-2xl font-bold text-gray-900">Payment Successful!</h1>

                    <p className="text-gray-600 max-w-sm">
                        Thank you for your payment. Your transaction has been completed successfully.
                    </p>

                    {/* <div className="bg-green-50/50 rounded-lg p-4 w-full">
                        <div className="text-sm text-gray-600">
                            A confirmation email has been sent to your inbox.
                        </div>
                    </div> */}

                    <div className="flex flex-col sm:flex-row gap-4 w-full pt-4">
                        <Link
                            href="/"
                            className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors text-center"
                        >
                            Return Home
                        </Link>
                        <Link
                            href="/history"
                            className="w-full px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-md transition-colors text-center"
                        >
                            View History
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Index;
