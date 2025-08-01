import { FalconryJournalClient } from "@/components/falconry-journal-client";
import { birds, feedingLogs, husbandryLogs, trainingLogs, muteLogs, weightLogs } from "@/lib/data";

export default function Home() {
  // In a real app, you would fetch this data based on the logged-in user
  const appData = {
    birds,
    feedingLogs,
    husbandryLogs,
    trainingLogs,
    muteLogs,
    weightLogs,
  };

  return <FalconryJournalClient initialData={appData} view="overview" />;
}
