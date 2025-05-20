
import { format } from 'date-fns';
import {useTranslation} from "react-i18next";

interface HistoryCardProps {
    data: BalanceHistory
}

export function HistoryCard({ data }: HistoryCardProps) {
    const {t}= useTranslation();

    return (
        <div className="bg-white rounded-lg shadow-md p-6 relative">
            <p className="text-gray-800 mb-4">{t("historyCard.amount")} : {data.amount}</p>
            <p className="text-sm text-gray-500">
                {t("historyCard.created")}: {format(new Date(data.createdAt), 'MMM d, yyyy')}
            </p>
        </div>
    );
}