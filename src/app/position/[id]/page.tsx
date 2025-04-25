
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