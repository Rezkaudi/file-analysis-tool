
// page
import Analysis from "@/components/pages/analysis2"
import { getPositionById } from "@/services/positions";
import { notFound } from "next/navigation";

interface IAnalysis {
  params: Promise<{
    id: string;
  }>;
}

export default async function AnalysisPage({ params }: IAnalysis) {
  const { id } = await params;

  const data: WorkPosition | undefined = await getPositionById(id);

  if (!data) {
    notFound();
  }

  return <Analysis data={data} id={id} />;
}