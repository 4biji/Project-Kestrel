
import { FalconryJournalClient } from "@/components/falconry-journal-client";

interface PageProps {
  params: Promise<{ birdId: string }>;
}

export default async function BirdPage({ params }: PageProps) {
  const { birdId } = await params;
  return <FalconryJournalClient view="detail" selectedBirdId={birdId} />;
}
