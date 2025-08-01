
import { FalconryJournalClient } from "@/components/falconry-journal-client";
import { birds, feedingLogs, husbandryLogs, trainingLogs, muteLogs, weightLogs, huntingLogs } from "@/lib/data";

export default function Home() {
  // In a real app, you would fetch this data based on the logged-in user
  const appData = {
    birds,
    feedingLogs,
    husbandryLogs,
    trainingLogs,
    muteLogs,
    weightLogs,
    huntingLogs,
  };

  return <FalconryJournalClient initialData={appData} view="overview" />;
}
