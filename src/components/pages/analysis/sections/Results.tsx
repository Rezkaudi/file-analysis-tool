import { useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { toast } from "react-toastify";

interface FileItem {
    name: string;
    size: number;
    type: string;
}

interface AnalysisResult {
    fileName: string;
    criteria: Record<string, string>;
    score: number;
    analysis: string;
}

interface ResultsProps {
    file: FileItem[] | null;
    criteria: string[];
}

export default function Results({ file, criteria }: ResultsProps) {
    const [results, setResults] = useState<AnalysisResult[] | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    const analyzeFile = () => {
        if (!file || file.length === 0 || (criteria.length === 1 && criteria[0] === "")) {
            if (!file || file.length === 0) {
                toast.warn('Please choose one file at least');
            }

            if (criteria.length === 1 && criteria[0] === "") {
                toast.warn('Please input one criteria at least ');
            }

            return;
        }

        setIsAnalyzing(true);

        setTimeout(() => {
            const mockResults: AnalysisResult[] = file.map((fileItem) => ({
                fileName: fileItem.name,
                criteria: criteria.reduce<Record<string, string>>((acc, curr, idx) => {
                    acc[`criteria${idx + 1}`] = curr;
                    return acc;
                }, {}),
                score: Math.floor(Math.random() * 100),
                analysis:
                    "Detailed analysis of the file content based on provided criteria",
            })).sort((a, b) => b.score - a.score);

            setResults(mockResults);
            setIsAnalyzing(false);
        }, 1000);
    };

    const toggleSortOrder = () => {
        if (results) {
            const newOrder = sortOrder === 'asc' ? 'desc' : 'asc';
            setSortOrder(newOrder);
            setResults([...results].sort((a, b) => newOrder === 'asc' ? a.score - b.score : b.score - a.score));
        }
    };

    return (
        <div className="w-full p-4 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Analysis Results</h2>
            <button
                onClick={analyzeFile}
                disabled={isAnalyzing}
                className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
                {isAnalyzing ? "Analyzing..." : "Start Analysis"}
            </button>
            {results && (
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="border border-gray-300 px-4 py-2">File Name</th>
                                {criteria.map((criterion, index) => (
                                    <th key={index} className="border border-gray-300 px-4 py-2">
                                        Criteria {index + 1}
                                        <div className="text-sm text-gray-500">{criterion}</div>
                                    </th>
                                ))}
                                <th className="border border-gray-300 px-4 py-2">
                                    Score
                                    <button className="ml-2 px-2 py-1 bg-gray-300 rounded flex items-center" onClick={toggleSortOrder}>
                                        {sortOrder === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                    </button>
                                </th>
                                <th className="border border-gray-300 px-4 py-2">Analysis</th>
                            </tr>
                        </thead>
                        <tbody>
                            {results.map((result, index) => (
                                <tr key={index} className="border border-gray-300">
                                    <td className="border border-gray-300 px-4 py-2">{result.fileName}</td>
                                    {criteria.map((_, idx) => (
                                        <td key={idx} className="border border-gray-300 px-4 py-2">
                                            {result.criteria[`criteria${idx + 1}`]}
                                        </td>
                                    ))}
                                    <td className="border border-gray-300 px-4 py-2">
                                        <div className="relative w-full bg-gray-200 rounded">
                                            <div
                                                className="bg-green-500 h-4 rounded"
                                                style={{ width: `${result.score}%` }}
                                            ></div>
                                            <span className="absolute inset-0 flex justify-center items-center text-xs font-semibold">
                                                {result.score}%
                                            </span>
                                        </div>
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2">
                                        {result.analysis}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
