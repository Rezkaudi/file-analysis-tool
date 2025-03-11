
// page
import Results from "@/components/pages/results"

interface IResults {
  params: Promise<{
    id: string;
  }>;
}

export default async function ResultsPage({ params }: IResults) {
  const { id } = await params;
  return <Results id={id} />;
}