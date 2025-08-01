
import { FalconryJournalClient } from "@/components/falconry-journal-client";
import { birds, feedingLogs, husbandryLogs, trainingLogs, muteLogs, weightLogs, huntingLogs } from "@/lib/data";
import { notFound } from 'next/navigation';

export default function BirdPage({ params }: { params: { birdId: string } }) {
    
  const bird = birds.find(b => b.id === params.birdId);
  if (!bird) {
    notFound();
  }

  const appData = {
    birds,
    feedingLogs,
    husbandryLogs,
    trainingLogs,
    muteLogs,
    weightLogs,
    huntingLogs,
  };

  return <FalconryJournalClient initialData={appData} view="detail" selectedBirdId={params.birdId} />;
}
