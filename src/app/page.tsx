
import { FalconryJournalClient } from "@/components/falconry-journal-client";
import { birds, logs } from "@/lib/data";

export default function Home() {
  // In a real app, you would fetch this data based on the logged-in user
  const appData = {
    birds,
    logs,
  };

  return <FalconryJournalClient initialData={appData} view="overview" />;
}
