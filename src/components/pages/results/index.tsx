"use client";

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronDown, ChevronUp, Download } from 'lucide-react';
import { getPositionById } from '@/services/positions';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';
import { getResumeFile } from '@/services/resume';
import * as XLSX from "xlsx";
import DataLoadSpinner from '@/components/common/components/DataLoadSpinner';
import SmallSpinner from '@/components/common/components/SmallSpinner';

interface IAnalysis {
  id: string
}

const Index: React.FC<IAnalysis> = ({ id }) => {
  const [position, setPosition] = useState<WorkPosition | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingFile, setIsLoadingFile] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string>("");

  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null); // Store interval reference
  const isPollingStopped = useRef(false); // Flag to prevent unnecessary API calls



  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const handleGetFile = async (resumeId: string) => {
    setSelectedFile(resumeId)

    setIsLoadingFile(true)
    await getResumeFile(resumeId)
    setIsLoadingFile(false)
  }

  const toggleSortOrder = () => {
    if (!position || !position.resumes) return;

    const newOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    setSortOrder(newOrder);

    setPosition(prevPosition => {
      if (!prevPosition?.criterias) {
        return {
          ...prevPosition,
          resumes: [...prevPosition!.resumes].sort((a, b) => {
            if (a.score === null && b.score !== null) return newOrder === 'asc' ? 1 : -1;
            if (a.score !== null && b.score === null) return newOrder === 'asc' ? -1 : 1;
            return newOrder === 'asc'
              ? (a.score ?? 0) - (b.score ?? 0)
              : (b.score ?? 0) - (a.score ?? 0);
          })
        } as WorkPosition;
      }

      return {
        ...prevPosition,
        resumes: [...prevPosition!.resumes].sort((a, b) => {
          if (a.score === null && b.score !== null) return newOrder === 'asc' ? 1 : -1;
          if (a.score !== null && b.score === null) return newOrder === 'asc' ? -1 : 1;
          return newOrder === 'asc'
            ? (a.score ?? 0) - (b.score ?? 0)
            : (b.score ?? 0) - (a.score ?? 0);
        })
      } as WorkPosition;
    });
  };



  const fetchAndUpdatePosition = useCallback(async () => {
    if (isPollingStopped.current) return; // Stop API calls if status is completed

    try {
      const newPosition = await getPositionById(id);

      if (newPosition?.status === 'completed') {
        isPollingStopped.current = true; // Stop further requests
        if (pollIntervalRef.current) {
          clearInterval(pollIntervalRef.current); // Clear polling
          pollIntervalRef.current = null;
        }
      }

      return newPosition;
    } catch (error) {
      const axiosError = error as AxiosError<ApiError>;
      toast.error(axiosError.response?.data?.message);
    }
  }, [id]);

  useEffect(() => {
    setIsLoading(true);
    isPollingStopped.current = false; // Reset flag when component mounts

    const initializePosition = async () => {
      const position = await fetchAndUpdatePosition();

      if (position) {
        setPosition(position);
      }

      // Start polling if position exists and isn't completed
      if (position && (position.status !== 'completed' || position.status !== 'completedWithError')) {
        pollIntervalRef.current = setInterval(async () => {
          try {
            console.log("Fetching position...");
            const updatedPosition = await fetchAndUpdatePosition();

            if (updatedPosition) {
              setPosition(updatedPosition);
            }

            // Stop polling if status is completed
            if ((updatedPosition?.status === 'completed' || updatedPosition?.status === 'completedWithError')) {
              isPollingStopped.current = true;
              if (pollIntervalRef.current) {
                clearInterval(pollIntervalRef.current);
                pollIntervalRef.current = null;
              }
            }

          } catch (error) {
            console.error('Error during polling:', error);
          } finally {
            setIsLoading(false);
          }
        }, 5000);
      } else {
        setIsLoading(false);
      }
    };

    initializePosition();

    // Cleanup function to stop polling on unmount
    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
      }
    };
  }, [fetchAndUpdatePosition]);


  const handleExtractExcel = (data: Resume[]) => {
    // Define the sheet data
    const sheetData = data.map(({ title, score, explanation }) => ({
      FileName: title,
      Score: score,
      Explanation: explanation,
    }));

    // Create a new worksheet
    const worksheet = XLSX.utils.json_to_sheet(sheetData);

    // Create a new workbook and append the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Resumes");

    // Convert the workbook to a binary Excel file
    XLSX.writeFile(workbook, "resumes.xlsx");
  };


  return (
    <div className="min-h-screen bg-gray-100 p-8">

      {isLoading ? <DataLoadSpinner /> : (
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
            <span className={`px-3 py-1 flex gap-3 rounded-full text-sm font-medium ${position?.status === 'completed'
              ? 'bg-green-100 text-green-800'
              : 'bg-yellow-100 text-yellow-800'
              }`}>
              {position?.status}

              {position?.status === 'processing' && <svg className="animate-spin h-5 w-5 text-mainPurple" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>}
            </span>

            <div className='flex gap-3'>
              {position?.status !== 'processing' && position?.resumes &&
                <button
                  className="flex items-center gap-2 rounded-md bg-gradient-to-r from-secondary to-accent px-4 py-2 text-md font-medium text-white hover:opacity-80 focus:outline-none focus:ring-2 focus:opacity-80 focus:ring-offset-2 disabled:opacity-50"
                  onClick={() => handleExtractExcel(position?.resumes)}>
                  Export
                  <Download size={16} />
                </button>}
            </div>
          </div>

          <div className="overflow-x-auto pt-10">

            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-300 px-4 py-2">File Name</th>
                  {/* {position?.criterias.map((criterion, index) => (
                    <th key={index} className="border border-gray-300 px-4 py-2">
                      Criteria {index + 1}
                      <div className="text-sm text-gray-500">{criterion.description}</div>
                    </th>
                  ))} */}
                  <th className=" px-4 py-2 flex items-center justify-center">
                    Score
                    <button className="ml-2 px-2 py-1 bg-gray-300 rounded flex items-center" onClick={toggleSortOrder}>
                      {sortOrder === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                  </th>
                  <th className="border border-gray-300 px-4 py-2">Analysis</th>
                </tr>
              </thead>
              <tbody>
                {position?.resumes.map((result, index) => (
                  <tr key={index} className="border border-gray-300">

                    <td className=" flex items-center gap-2 justify-between px-4 py-2">
                      <span className='hover:text-purple-900 cursor-pointer flex gap-3' onClick={() => handleGetFile(result.id)}>
                        {result.title}
                        {isLoadingFile && selectedFile === result.id && (
                          <div className="flex items-center justify-center">
                            <SmallSpinner />
                          </div>
                        )}
                      </span>

                    </td>
                    {/* {position?.criterias.map((item, idx: number) => (
                      <td key={idx} className="border border-gray-300 px-4 py-2">
                        {item.description}
                      </td>
                    ))} */}
                    <td className="border border-gray-300 px-4 py-2">
                      <div className="relative w-full bg-gray-200 rounded">
                        <div
                          className="bg-green-500 h-4 rounded"
                          style={{ width: `${result.score || 0}%` }}
                        ></div>
                        <span className="absolute inset-0 flex justify-center items-center text-xs font-semibold">
                          {result.score !== null ? `${result.score}%` : "null"}
                        </span>
                      </div>
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {result.explanation}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )
      }
    </div >
  );
};

export default Index;

