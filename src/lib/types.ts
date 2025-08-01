
export interface Bird {
  id: string;
  name: string;
  species: string;
  gender: 'Male' | 'Female';
  imageUrl: string;
  weight: number; // Current weight in grams
  dateCaptured: string;
}

export type LogType = 'weight' | 'feeding' | 'husbandry' | 'training' | 'mute' | 'hunting';
export type MuteCondition = 'Normal' | 'Urinate Only' | 'Greenish' | 'Blackish' | 'Yellowish';

export interface BaseLog {
  id: string;
  datetime: string;
  logType: LogType;
  notes?: string;
  imageUrl?: string;
}

export interface WeightLog extends BaseLog {
  logType: 'weight';
  weight: number;
}

export interface FeedingLog extends BaseLog {
  logType: 'feeding';
  foodItem: string;
  amount: number; // in grams
}

export interface HusbandryTask extends BaseLog {
  logType: 'husbandry';
  task: string;
  completed: boolean;
}

export interface TrainingLog extends BaseLog {
  logType: 'training';
  behavior: string;
  duration: number; // in minutes
}

export interface MuteLog extends BaseLog {
  logType: 'mute';
  condition: MuteCondition;
}

export interface HuntingLog extends BaseLog {
  logType: 'hunting';
  prey: string;
  outcome: 'Successful' | 'Unsuccessful';
}

export type LogEntry = WeightLog | FeedingLog | HusbandryTask | TrainingLog | MuteLog | HuntingLog;

export interface NutritionInfo {
    id: string;
    foodType: string;
    proteinPer100g: number;
}

export type AllLogs = {
  [birdId: string]: LogEntry[];
}
