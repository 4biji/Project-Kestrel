
import { FalconryJournalClient } from "@/components/falconry-journal-client";
import { birds, logs } from "@/lib/data";
import { notFound } from 'next/navigation';

export default async function BirdPage({ params }: { params: { birdId: string } }) {
    
  const bird = birds.find(b => b.id === params.birdId);
  if (!bird) {
    notFound();
  }

  const appData = {
    birds,
    logs,
  };

  return <FalconryJournalClient initialData={appData} view="detail" selectedBirdId={params.birdId} />;
}
