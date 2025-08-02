
import { FalconryJournalClient } from "@/components/falconry-journal-client";

interface PageProps {
  params: { birdId: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function BirdPage({ params }: PageProps) {
  return <FalconryJournalClient view="detail" selectedBirdId={params.birdId} />;
}
