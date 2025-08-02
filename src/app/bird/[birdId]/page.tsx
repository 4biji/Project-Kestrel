
import { FalconryJournalClient } from "@/components/falconry-journal-client";

export default async function BirdPage({ params }: { params: { birdId: string } }) {
  return <FalconryJournalClient view="detail" selectedBirdId={params.birdId} />;
}
