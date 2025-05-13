// 'use client';

// import { useParams } from 'next/navigation';
// import Analysis from "@/components/pages/analysis";

// export default function AnalysisPage() {
//   const params = useParams();
//   const id = params.id as string;

//   return <Analysis id={id} />;
// }

// page
import Analysis from "@/components/pages/analysis"

interface IAnalysis {
  params: Promise<{
    id: string;
  }>;
}

export default async function AnalysisPage({ params }: IAnalysis) {
  const { id } = await params;

  return <Analysis id={id} />;
}





