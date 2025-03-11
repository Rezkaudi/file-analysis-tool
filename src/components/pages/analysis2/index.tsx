"use client";

import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { CriteriaCard } from './components/CriteriaCard';
import { ResumeCard } from './components/ResumeCard';
import { CreateCriteriaModal } from './components/CreateCriteriaModal';
import { CreateResumeModal } from './components/CreateResumeModal';
import { addCritiria, deleteCritiria } from '@/services/criteria';
import { getPositionById, startProcessing } from '@/services/positions';
import { addResume, deleteResume } from '@/services/resume';
import { toast } from 'react-toastify';
import { useRouter } from "next/navigation"; // Import useRouter
import { AxiosError } from 'axios';
import Link from 'next/link';

interface IAnalysis {
  data: WorkPosition
  id: string
}

const Index: React.FC<IAnalysis> = ({ data, id }) => {
  const [jobPosting, setJobPosting] = useState<WorkPosition>(data);
  const [isCriteriaModalOpen, setIsCriteriaModalOpen] = useState(false);
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingProcess, setIsLoadingProcess] = useState(false);
  const router = useRouter(); // Initialize router
  // const [results, setResults] = useState<WorkPosition | null>(null);
  // const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');


  // const toggleSortOrder = () => {
  //   if (results) {
  //     const newOrder = sortOrder === 'asc' ? 'desc' : 'asc';
  //     setSortOrder(newOrder);
  //     // setResults([...results.resumes].sort((a, b) => newOrder === 'asc' ? a.score - b.score : b.score - a.score));
  //   }
  // };

  const fetchPositionsById = async () => {
    try {
      setIsLoading(true);
      const response = await getPositionById(id);
      setJobPosting(response);
      return response
    }
    catch (error) {
      const axiosError = error as AxiosError<ApiError>;
      toast.error(axiosError.response?.data?.message);
    }
    finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCriteria = async (id: string) => {
    await deleteCritiria(id)
    await fetchPositionsById()
  };

  const handleDeleteResume = async (id: string) => {
    await deleteResume(id)
    await fetchPositionsById()
  };

  const handleCreateCriteria = async (description: string) => {
    await addCritiria(id, description)
    await fetchPositionsById()
  };

  const handleCreateResume = async (file: File) => {
    await addResume(file, id)
    await fetchPositionsById()
  };

  const startAnalysis = async () => {
    try {
      setIsLoadingProcess(true)
      await startProcessing(id)
      // await fetchPositionsById()
      // setResults(res)
      router.push(`/results/${id}`)
      toast.success("Succsessfull")
    }
    catch (error) {
      const axiosError = error as AxiosError<ApiError>;
      toast.error(axiosError.response?.data?.message);
    }
    finally {
      setIsLoadingProcess(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <div className='flex items-start justify-between'>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{jobPosting.title}</h1>
                <p className="text-gray-600 mb-4">{jobPosting.description}</p>
                <div className="flex items-center mb-10">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${jobPosting.status === 'completed'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                    }`}>
                    {jobPosting.status}
                  </span>
                </div>
              </div>

              <Link className="flex items-center gap-2 rounded-md bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2 text-xl font-medium text-white hover:opacity-80 focus:outline-none focus:ring-2 focus:opacity-80 focus:ring-offset-2 disabled:opacity-50" href={"/profile"}>Back</Link>

            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setIsCriteriaModalOpen(true)}
                className="flex items-center min-w-[149px] gap-2 rounded-md bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2 text-sm font-medium text-white hover:opacity-80 focus:outline-none focus:ring-2 focus:opacity-80 focus:ring-offset-2 disabled:opacity-50"
              >
                <Plus size={20} />
                Add Criteria
              </button>
              <button
                onClick={() => setIsResumeModalOpen(true)}
                className="flex items-center min-w-[149px] gap-2 rounded-md bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2 text-sm font-medium text-white hover:opacity-80 focus:outline-none focus:ring-2 focus:opacity-80 focus:ring-offset-2 disabled:opacity-50"
              >
                <Plus size={20} />
                Upload Resume
              </button>
            </div>
          </div>

          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Criteria</h2>
            {jobPosting.criterias.length > 0 ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobPosting.criterias.map(criteria => (
                <CriteriaCard
                  key={criteria.id}
                  criteria={criteria}
                  onDelete={handleDeleteCriteria}
                />
              ))}
            </div> : <h4 className='w-full text-center mt-[50px] text-red-500'>No Critiria Found . Create New Critiria</h4>}
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">Resumes</h2>
            {jobPosting.resumes.length > 0 ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobPosting.resumes.map(resume => (
                <ResumeCard
                  key={resume.id}
                  resume={resume}
                  onDelete={handleDeleteResume}
                />
              ))}
            </div> : <h4 className='w-full text-center mt-[50px] text-red-500'>No Resumes Found . Create New Resumes</h4>}
          </div>

          <div className='w-full flex items-center justify-center mt-[100px]'>
            <button className="flex px-10 py-3 text-xl items-center gap-2 rounded-md bg-gradient-to-r from-purple-500 to-pink-500 font-medium text-white hover:opacity-80 focus:outline-none focus:ring-2 focus:opacity-80 focus:ring-offset-2 disabled:opacity-50"
              onClick={startAnalysis}>
              Start Analysis
              {isLoadingProcess && (
                <div className="flex items-center justify-center">
                  <svg className="h-4 w-4 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
              )}

            </button>
            {/* {jobPosting.status === "created" ?

              <button className="flex px-10 py-3 text-xl items-center gap-2 rounded-md bg-gradient-to-r from-purple-500 to-pink-500 font-medium text-white hover:opacity-80 focus:outline-none focus:ring-2 focus:opacity-80 focus:ring-offset-2 disabled:opacity-50"
                onClick={startAnalysis}>
                Start Analysis
                {isLoadingProcess && (
                  <div className="flex items-center justify-center">
                    <svg className="h-4 w-4 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>
                )}

              </button> :
              <Link href={`/results/${id}`} className="flex px-10 py-3 text-xl items-center gap-2 rounded-md bg-gradient-to-r from-purple-500 to-pink-500 font-medium text-white hover:opacity-80 focus:outline-none focus:ring-2 focus:opacity-80 focus:ring-offset-2 disabled:opacity-50">
                Results
              </Link>} */}
          </div>


          {/* 
          {results && (
            <div className="overflow-x-auto pt-10">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border border-gray-300 px-4 py-2">File Name</th>
                    {data.criterias.map((criterion, index) => (
                      <th key={index} className="border border-gray-300 px-4 py-2">
                        Criteria {index + 1}
                        <div className="text-sm text-gray-500">{criterion.description}</div>
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
                  {results.resumes.map((result, index) => (
                    <tr key={index} className="border border-gray-300">
                      <td className="border border-gray-300 px-4 py-2">{result.title}</td>
                      {results.criterias.map((item, idx: number) => (
                        <td key={idx} className="border border-gray-300 px-4 py-2">
                          {item.description}
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
                     
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )} */}

        </div>
      )
      }


      <CreateCriteriaModal
        isOpen={isCriteriaModalOpen}
        onClose={() => setIsCriteriaModalOpen(false)}
        onSubmit={handleCreateCriteria}
      />

      <CreateResumeModal
        isOpen={isResumeModalOpen}
        onClose={() => setIsResumeModalOpen(false)}
        onSubmit={handleCreateResume}
      />
    </div >
  );
};

export default Index;

