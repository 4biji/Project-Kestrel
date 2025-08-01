
import type { Bird, FeedingLog, HusbandryTask, TrainingLog, MuteLog, WeightLog, NutritionInfo } from './types';

export const birds: Bird[] = [
  {
    id: 'b1',
    name: 'Apollo',
    species: 'Peregrine Falcon',
    gender: 'Male',
    imageUrl: 'https://placehold.co/400x400.png',
    weight: 650,
    dateCaptured: '2022-09-15T00:00:00.000Z',
  },
  {
    id: 'b2',
    name: 'Athena',
    species: 'Gyrfalcon',
    gender: 'Female',
    imageUrl: 'https://placehold.co/400x400.png',
    weight: 1100,
    dateCaptured: '2021-10-20T00:00:00.000Z',
  },
  {
    id: 'b3',
    name: 'Zeus',
    species: 'Harris\'s Hawk',
    gender: 'Male',
    imageUrl: 'https://placehold.co/400x400.png',
    weight: 710,
    dateCaptured: '2023-04-01T00:00:00.000Z',
  },
];

type FeedingLogData = { [birdId: string]: FeedingLog[] };
export const feedingLogs: FeedingLogData = {
  'b1': [
    { id: 'f1', datetime: '2024-07-20T08:30:00', foodItem: 'Quail', amount: 50, notes: 'Eager to eat.' },
    { id: 'f2', datetime: '2024-07-19T09:00:00', foodItem: 'Chicken heart', amount: 45, notes: '' },
    { id: 'f5', datetime: '2024-07-21T08:30:00', foodItem: 'Quail', amount: 55, notes: 'Very hungry today.' },
    { id: 'f6', datetime: '2024-07-22T09:00:00', foodItem: 'Chicken liver', amount: 40, notes: '' },
  ],
  'b2': [
    { id: 'f3', datetime: '2024-07-20T08:00:00', foodItem: 'Pigeon', amount: 120, notes: 'Full crop.' },
    { id: 'f7', datetime: '2024-07-21T08:00:00', foodItem: 'Rabbit', amount: 150, notes: 'Ate well.' },
  ],
  'b3': [
      { id: 'f8', datetime: '2024-07-22T08:45:00', foodItem: 'Mouse', amount: 30, notes: 'First meal with us.' },
  ],
};

type HusbandryLogData = { [birdId: string]: HusbandryTask[] };
export const husbandryLogs: HusbandryLogData = {
  'b1': [
    { id: 'h1', task: 'Clean mews', completed: true },
    { id: 'h2', task: 'Check equipment (jesses, leash)', completed: true },
    { id: 'h3', task: 'Weigh bird', completed: false },
  ],
  'b2': [
    { id: 'h4', task: 'Clean mews', completed: true },
    { id: 'h5', task: 'Check equipment', completed: false },
  ],
  'b3': [],
};

type TrainingLogData = { [birdId: string]: TrainingLog[] };
export const trainingLogs: TrainingLogData = {
  'b1': [
    { id: 't1', datetime: '2024-07-20T17:00:00', behavior: 'Lure stooping', duration: 15, notes: '10 stoops, good speed.', imageUrl: 'https://placehold.co/600x400.png' },
    { id: 't2', datetime: '2024-07-18T16:45:00', behavior: 'Fist calling', duration: 10, notes: 'Responsive, came from 50 yards.', imageUrl: 'https://placehold.co/600x400.png' },
  ],
  'b2': [
     { id: 't3', datetime: '2024-07-19T17:30:00', behavior: 'Kite work', duration: 20, notes: 'Followed kite well, needs more height.' },
  ],
  'b3': [],
};

type MuteLogData = { [birdId: string]: MuteLog[] };
export const muteLogs: MuteLogData = {
  'b1': [
    { id: 'm1', datetime: '2024-07-20T07:00:00', condition: 'Normal', notes: 'Healthy looking mute.' },
    { id: 'm2', datetime: '2024-07-19T07:15:00', condition: 'Greenish', notes: 'Slightly off color, monitor.', imageUrl: 'https://placehold.co/600x400.png' },
  ],
  'b2': [],
  'b3': [],
};


type WeightLogData = { [birdId: string]: WeightLog[] };
export const weightLogs: WeightLogData = {
    'b1': [
        { datetime: '2024-07-15T08:00:00', weight: 655 },
        { datetime: '2024-07-16T08:05:00', weight: 652 },
        { datetime: '2024-07-17T07:55:00', weight: 653 },
        { datetime: '2024-07-18T08:00:00', weight: 651 },
        { datetime: '2024-07-19T08:02:00', weight: 650 },
        { datetime: '2024-07-20T07:58:00', weight: 648 },
        { datetime: '2024-07-21T08:01:00', weight: 650 },
    ],
    'b2': [
        { datetime: '2024-07-15T08:30:00', weight: 1110 },
        { datetime: '2024-07-16T08:35:00', weight: 1105 },
        { datetime: '2024-07-17T08:25:00', weight: 1108 },
        { datetime: '2024-07-18T08:30:00', weight: 1102 },
        { datetime: '2024-07-19T08:32:00', weight: 1100 },
        { datetime: '2024-07-20T08:28:00', weight: 1098 },
        { datetime: '2024-07-21T08:31:00', weight: 1100 },
    ],
    'b3': [
        { datetime: '2024-07-15T09:00:00', weight: 715 },
        { datetime: '2024-07-16T09:05:00', weight: 712 },
        { datetime: '2024-07-17T08:55:00', weight: 714 },
        { datetime: '2024-07-18T09:00:00', weight: 710 },
        { datetime: '2024-07-19T09:02:00', weight: 708 },
        { datetime: '2024-07-20T08:58:00', weight: 709 },
        { datetime: '2024-07-21T09:01:00', weight: 710 },
    ],
}

export const nutritionInfo: NutritionInfo[] = [
    { id: 'n1', foodType: 'Quail', proteinPer100g: 22 },
    { id: 'n2', foodType: 'Chicken Heart', proteinPer100g: 16 },
    { id: 'n3', foodType: 'Pigeon', proteinPer100g: 21 },
    { id: 'n4', foodType: 'Rabbit', proteinPer100g: 21 },
];
