
import { format } from 'date-fns';

interface HistoryCardProps {
    data: BalanceHistory
}

export function HistoryCard({ data }: HistoryCardProps) {

    return (
        <div className="bg-white rounded-lg shadow-md p-6 relative">
            <p className="text-gray-800 mb-4">Amount : {data.amount}</p>
            <p className="text-sm text-gray-500">
                paid at: {format(new Date(data.createdAt), 'MMM d, yyyy')}
            </p>
        </div>
    );
}