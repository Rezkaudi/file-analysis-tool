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
    criterias: Record<string, string>;
    score: number;
    analysis: string;
}

interface ResultsProps {
    files: FileItem[] | null;
    criterias: string[];
}

export default function Results({ files, criterias }: ResultsProps) {
    const [results, setResults] = useState<AnalysisResult[] | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
    const [startUploadingFiles, setStartUploadingFiles] = useState<boolean>(false);
    const [StartFilesAnalysis, setStartFilesAnalysis] = useState<boolean>(false);
    const [currentStep, setCurrentStep] = useState<number>(0);

    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    const simulateUpload = async () => {
        setStartUploadingFiles(true);
        setIsAnalyzing(true);

        await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate upload time
        // try {
        //     const response = await fetch(url, {
        //         method: 'POST',
        //         headers: {
        //             'Content-Type': 'application/json'
        //         },
        //         body: JSON.stringify(data)
        //     });

        //     if (!response.ok) {
        //         throw new Error(`HTTP error! status: ${response.status}`);
        //     }

        //     const result = await response.json();
        //     return result;
        // } catch (error) {
        //     console.error('Error:', error);
        //     throw error;
        // }

        setStartUploadingFiles(false);
        setCurrentStep(prev => prev + 1);
        const allFilesContents = [
            {
                "filename": "Dockerfile1",
                "content": "aaa"
            },
            {
                "filename": "Dockerfile2",
                "content": "bbb"
            }
        ];

        return allFilesContents
    };

    const simulateAnalysis = async (formData: { "file_contents": string[], "criterias": string[] }) => {
        console.log(formData)

        setStartFilesAnalysis(true);
        await new Promise(resolve => setTimeout(resolve, 3000)); // Simulate analysis time

        // try {
        //     const response = await fetch(url, {
        //         method: 'POST',
        //         headers: {
        //             'Content-Type': 'application/json'
        //         },
        //         body: JSON.stringify(data)
        //     });

        //     if (!response.ok) {
        //         throw new Error(`HTTP error! status: ${response.status}`);
        //     }

        //     const result = await response.json();
        //     return result;
        // } catch (error) {
        //     console.error('Error:', error);
        //     throw error;
        // }
        setStartFilesAnalysis(false);
        setCurrentStep(prev => prev + 1);
        setIsAnalyzing(false);


        const mockResults: AnalysisResult[] | undefined = files?.map((fileItem) => ({
            fileName: fileItem.name,
            criterias: criterias.reduce<Record<string, string>>((acc, curr, idx) => {
                acc[`criteria${idx + 1}`] = curr;
                return acc;
            }, {}),
            score: Math.floor(Math.random() * 100),
            analysis:
                "Detailed analysis of the file content based on provided criteria",
        })).sort((a, b) => b.score - a.score);

        return mockResults

    };

    const analyzeFile = async () => {
        if (!files || files.length === 0 || (criterias.length === 1 && criterias[0] === "")) {
            if (!files || files.length === 0) {
                toast.warn('Please choose one file at least');
            }

            if (criterias.length === 1 && criterias[0] === "") {
                toast.warn('Please input one criteria at least ');
            }

            return;
        }

        let formData = null

        const allFilesContents = await simulateUpload();

        const filesContents = allFilesContents.map(file => file.content);

        formData = {
            "file_contents": filesContents,
            "criterias": criterias
        }

        const result = await simulateAnalysis(formData);
        if (result) {
            setResults(result);
        }

        else {
            console.log("error")
        }
    };

    const toggleSortOrder = () => {
        if (results) {
            const newOrder = sortOrder === 'asc' ? 'desc' : 'asc';
            setSortOrder(newOrder);
            setResults([...results].sort((a, b) => newOrder === 'asc' ? a.score - b.score : b.score - a.score));
        }
    };

    return (
        <div className="w-full p-4 bg-white">
            {/* <h2 className="text-xl font-semibold mb-4 text-purple-700">Analysis Results</h2> */}
            {!results && <div className="w-full flex items-center justify-center">
                <button
                    onClick={analyzeFile}
                    disabled={isAnalyzing}
                    className="mb-4 px-20 text-3xl py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:opacity-80 transition"
                >
                    {isAnalyzing ? "Analyzing..." : "Start Analysis"}
                </button>
            </div>}

            {isAnalyzing && <div className="w-[400px] mx-auto flex flex-col gap-5 p-4 rounded shadow-2xl items-start justify-center mt-10">
                <div className={`flex items-center gap-2 ${currentStep > 0 ? 'text-green-600' : ''}`}>
                    <span>Step 1 :</span>
                    <div>
                        <h3 className="font-medium">Uploading Files {currentStep > 0 ? <span className="text-xl">&#10003;</span> : ''}</h3>
                        {startUploadingFiles && (
                            <div className="mt-2 flex justify-between text-sm text-gray-500">
                                <span>Processing...</span>
                                <div className="w-5 h-5 border-b-2 border-purple-700 rounded-full animate-spin" />
                            </div>
                        )}
                    </div>
                </div>

                <div className={`flex items-center gap-2 ${currentStep > 1 ? 'text-green-600' : ''}`}>
                    <span>Step 2 : </span>
                    <div>
                        <h3 className="font-medium">Files Analysis {currentStep > 1 ? <span className="text-xl">&#10003;</span> : ''}</h3>
                        {StartFilesAnalysis && (
                            <div className="mt-2 flex justify-between text-sm text-gray-500">
                                <span>Processing...</span>
                                <div className="w-5 h-5 border-b-2 border-purple-700 rounded-full animate-spin" />
                            </div>
                        )}
                    </div>
                </div>
            </div>}


            {results && (
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="border border-gray-300 px-4 py-2">File Name</th>
                                {criterias.map((criterion, index) => (
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
                                    {criterias.map((_, idx) => (
                                        <td key={idx} className="border border-gray-300 px-4 py-2">
                                            {result.criterias[`criteria${idx + 1}`]}
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
