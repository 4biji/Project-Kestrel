export interface Bird {
  id: string;
  name: string;
  species: string;
  gender: 'Male' | 'Female';
  imageUrl: string;
  weight: number; // Current weight in grams
}

export interface WeightLog {
  date: string;
  weight: number;
}

export interface FeedingLog {
  id: string;
  date: string;
  foodItem: string;
  amount: number; // in grams
  notes?: string;
}

export interface HusbandryTask {
  id: string;
  task: string;
  completed: boolean;
}

export interface TrainingLog {
  id:string;
  date: string;
  behavior: string;
  duration: number; // in minutes
  notes: string;
  imageUrl?: string;
}

export type MuteCondition = 'Normal' | 'Urinate Only' | 'Greenish' | 'Blackish' | 'Yellowish';

export interface MuteLog {
  id: string;
  date: string;
  condition: MuteCondition;
  imageUrl?: string;
  notes?: string;
}

export type AllLogs = {
  [birdId: string]: {
    feedingLogs: FeedingLog[];
    husbandryLogs: HusbandryTask[];
    trainingLogs: TrainingLog[];
    muteLogs: MuteLog[];
    weightLogs: WeightLog[];
  }
}
