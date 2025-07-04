"use client";

import React, { useCallback, useEffect, useState } from "react";
import { ArrowBigRight, ListChecks, FileText } from "lucide-react";
import { CriteriaCard } from "./components/CriteriaCard";
import { ResumeCard } from "./components/ResumeCard";
import { CreateCriteriaModal } from "./components/CreateCriteriaModal";
import { CreateResumeModal } from "./components/CreateResumeModal";
import { addCritiria, deleteCritiria } from "@/services/criteria";
import { getPositionById, startProcessing } from "@/services/positions";
import { addResume, deleteResume } from "@/services/resume";
import { toast } from "sonner";
import { notFound, useRouter } from "next/navigation";
import { AxiosError } from "axios";
import Link from "next/link";
import { useAuthStore } from "@/store/useAuthStore";
import DataLoadSpinner from "@/components/common/components/DataLoadSpinner";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";

interface IAnalysis {
  id: string;
}

const containerVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { staggerChildren: 0.12, delayChildren: 0.15 },
  },
};

const scaleFade = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
};

const StatusPill = ({ status, id }: { status: string; id: string }) => {
  if (status === "completed") {
    return (
      <Link href={`/results/${id}`}>
        <motion.span
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 border border-green-400 rounded-full text-sm font-medium cursor-pointer hover:bg-green-200"
        >
          {status}
          <ArrowBigRight size={18} />
        </motion.span>
      </Link>
    );
  }

  return (
    <span className="inline-block px-4 py-2 bg-yellow-100 text-yellow-800 border border-yellow-400 rounded-full text-sm font-medium">
      {status}
    </span>
  );
};

const Index: React.FC<IAnalysis> = ({ id }) => {
  const [jobPosting, setJobPosting] = useState<WorkPosition | null>(null);
  const [isCriteriaModalOpen, setIsCriteriaModalOpen] = useState(false);
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingProcess, setIsLoadingProcess] = useState(false);
  const router = useRouter();
  const { getUserBalance } = useAuthStore();
  const { t } = useTranslation();

  const fetchPositionsById = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await getPositionById(id);
      if (!response) notFound();
      setJobPosting(response);
    } catch (error) {
      const axiosError = error as AxiosError<ApiError>;
      toast.error(axiosError.response?.data?.message);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchPositionsById();
  }, [fetchPositionsById]);

  const handleDeleteCriteria = async (criteriaId: string) => {
    await deleteCritiria(criteriaId);
    await fetchPositionsById();
  };

  const handleDeleteResume = async (resumeId: string) => {
    await deleteResume(resumeId);
    await fetchPositionsById();
  };

  const handleCreateCriteria = async (description: string) => {
    await addCritiria(id, description);
    await fetchPositionsById();
  };

  const handleCreateResume = async (file: File) => {
    await addResume(file, id);
    await fetchPositionsById();
  };

  const startAnalysis = async () => {
    try {
      setIsLoadingProcess(true);
      await startProcessing(id);
      await getUserBalance();
      router.push(`/results/${id}`);
      toast.success("Analysis started successfully");
    } catch (error) {
      const axiosError = error as AxiosError<ApiError>;
      toast.error(axiosError.response?.data?.message);
      if (axiosError.response?.data?.message !== "No enough points to process") {
        router.push(`/results/${id}`);
      }
    } finally {
      setIsLoadingProcess(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-slate-100 px-4 py-8 md:px-8">
      {isLoading ? (
        <div className="flex items-center justify-center min-h-[70vh]">
          <DataLoadSpinner />
        </div>
      ) : (
        jobPosting && (
          <motion.div
            className="max-w-7xl mx-auto space-y-12"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            {/* Header */}
            <motion.div

              className="p-6 md:p-8 bg-white shadow-xl rounded-3xl backdrop-blur-sm border border-slate-100 space-y-4"
            >
              <div className="flex flex-col md:flex-row justify-between gap-6">
                <div className="flex-1">
                  <motion.h1 className="text-4xl font-bold text-gray-900 tracking-tight">
                    {jobPosting.title}
                  </motion.h1>
                  <motion.p className="text-gray-600 mt-2 text-base leading-relaxed">
                    {jobPosting.description}
                  </motion.p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  {jobPosting.status !== "completed" && (
                    <button
                      onClick={() => setIsCriteriaModalOpen(true)}
                      className="bg-mainPurple text-white font-semibold text-sm px-5 py-3 rounded-xl shadow-md hover:shadow-lg hover:bg-mainPurple/90 transition-all duration-200 flex items-center gap-2"
                    >
                      <ListChecks size={18} />
                      {t("analysis.addCriteria")}
                    </button>
                  )}
                  <button
                    onClick={() => setIsResumeModalOpen(true)}
                    className="bg-mainPurple text-white font-semibold text-sm px-5 py-3 rounded-xl shadow-md hover:shadow-lg hover:bg-mainPurple/90 transition-all duration-200 flex items-center gap-2"
                  >
                    <FileText size={18} />
                    {t("analysis.uploadResume")}
                  </button>
                </div>
              </div>

              <div>
                <StatusPill status={jobPosting.status} id={id} />
              </div>
            </motion.div>

            {/* Criteria Section */}
            <motion.section className="">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                {t("analysis.criteriaList")}{" "}
                <span className="text-mainPurple">({jobPosting.criterias.length})</span>
              </h2>
              {jobPosting.criterias.length > 0 ? (
                <motion.div
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {jobPosting.criterias.map((criteria) => (
                    <motion.div key={criteria.id} variants={scaleFade} layout>
                      <CriteriaCard criteria={criteria} onDelete={handleDeleteCriteria} />
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  className="w-full text-center py-16 bg-white border border-dashed border-slate-200 rounded-2xl shadow-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >


                  <h4 className="text-gray-500 text-lg">{t("analysis.noCriteriaFound")}</h4>
                </motion.div>
              )}
            </motion.section>

            {/* Resume Section */}
            <motion.section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                {t("analysis.resumesList")}{" "}
                <span className="text-mainPurple">({jobPosting.resumes.length})</span>
              </h2>
              {jobPosting.resumes.length > 0 ? (
                <motion.div
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {jobPosting.resumes.map((resume) => (
                    <motion.div key={resume.id} variants={scaleFade} layout>
                      <ResumeCard resume={resume} onDelete={handleDeleteResume} />
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  className="w-full text-center py-16 bg-white border border-dashed border-slate-200 rounded-2xl shadow-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >

                  <h4 className="text-gray-500 text-lg">{t("analysis.noResumesFound")}</h4>
                </motion.div>
              )}
            </motion.section>

            {/* Start Analysis Button */}
            {jobPosting.status !== "completed" && (
              <motion.div className="text-center mt-12 mb-8">
                <motion.button
                  disabled={
                    jobPosting.criterias.length === 0 || jobPosting.resumes.length === 0
                  }
                  onClick={startAnalysis}
                  className={`px-10 py-4 text-lg font-bold rounded-full transition-all flex items-center justify-center gap-3 shadow-lg ${jobPosting.criterias.length === 0 || jobPosting.resumes.length === 0
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-mainPurple to-secondary text-white hover:scale-105 hover:shadow-xl"
                    }`}
                  whileTap={{ scale: 0.95 }}
                >
                  {t("analysis.startAnalysis")}
                  {isLoadingProcess ? (
                    <svg
                      className="h-5 w-5 animate-spin text-white"
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
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      ></path>
                    </svg>
                  ) : (
                    <ArrowBigRight size={22} />
                  )}
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        )
      )}

      {/* Modals */}
      <AnimatePresence>
        {isCriteriaModalOpen && (
          <CreateCriteriaModal
            isOpen={isCriteriaModalOpen}
            onClose={() => setIsCriteriaModalOpen(false)}
            onSubmit={handleCreateCriteria}
          />
        )}
        {isResumeModalOpen && (
          <CreateResumeModal
            isOpen={isResumeModalOpen}
            onClose={() => setIsResumeModalOpen(false)}
            onSubmit={handleCreateResume}
            fetchPositionsById={fetchPositionsById}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;
