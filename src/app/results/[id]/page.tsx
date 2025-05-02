'use client';

import { useParams } from 'next/navigation';
import Results from "@/components/pages/results"

export default function ResultsPage() {
  const params = useParams();
  const id = params.id as string;

  return <Results id={id} />;
}

// // page
// import Results from "@/components/pages/results"

// interface IResults {
//   params: Promise<{
//     id: string;
//   }>;
// }

// export default async function ResultsPage({ params }: IResults) {
//   const { id } = await params;
//   return <Results id={id} />;
// }