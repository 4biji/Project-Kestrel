import type { Bird, FeedingLog, HusbandryTask, TrainingLog, MuteLog, WeightLog } from './types';

export const birds: Bird[] = [
  {
    id: 'b1',
    name: 'Apollo',
    species: 'Peregrine Falcon',
    gender: 'Male',
    imageUrl: 'https://placehold.co/400x400.png',
    weight: 650,
  },
  {
    id: 'b2',
    name: 'Athena',
    species: 'Gyrfalcon',
    gender: 'Female',
    imageUrl: 'https://placehold.co/400x400.png',
    weight: 1100,
  },
  {
    id: 'b3',
    name: 'Zeus',
    species: 'Harris\'s Hawk',
    gender: 'Male',
    imageUrl: 'https://placehold.co/400x400.png',
    weight: 710,
  },
];

type FeedingLogData = { [birdId: string]: FeedingLog[] };
export const feedingLogs: FeedingLogData = {
  'b1': [
    { id: 'f1', date: '2024-07-20', foodItem: 'Quail', amount: 50, notes: 'Eager to eat.' },
    { id: 'f2', date: '2024-07-19', foodItem: 'Chicken heart', amount: 45, notes: '' },
  ],
  'b2': [
    { id: 'f3', date: '2024-07-20', foodItem: 'Pigeon', amount: 120, notes: 'Full crop.' },
  ],
  'b3': [],
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
    { id: 't1', date: '2024-07-20', behavior: 'Lure stooping', duration: 15, notes: '10 stoops, good speed.', imageUrl: 'https://placehold.co/600x400.png' },
    { id: 't2', date: '2024-07-18', behavior: 'Fist calling', duration: 10, notes: 'Responsive, came from 50 yards.', imageUrl: 'https://placehold.co/600x400.png' },
  ],
  'b2': [
     { id: 't3', date: '2024-07-19', behavior: 'Kite work', duration: 20, notes: 'Followed kite well, needs more height.' },
  ],
  'b3': [],
};

type MuteLogData = { [birdId: string]: MuteLog[] };
export const muteLogs: MuteLogData = {
  'b1': [
    { id: 'm1', date: '2024-07-20', condition: 'Normal', notes: 'Healthy looking mute.' },
    { id: 'm2', date: '2024-07-19', condition: 'Greenish', notes: 'Slightly off color, monitor.', imageUrl: 'https://placehold.co/600x400.png' },
  ],
  'b2': [],
  'b3': [],
};


type WeightLogData = { [birdId: string]: WeightLog[] };
export const weightLogs: WeightLogData = {
    'b1': [
        { date: '2024-07-15', weight: 655 },
        { date: '2024-07-16', weight: 652 },
        { date: '2024-07-17', weight: 653 },
        { date: '2024-07-18', weight: 651 },
        { date: '2024-07-19', weight: 650 },
        { date: '2024-07-20', weight: 648 },
        { date: '2024-07-21', weight: 650 },
    ],
    'b2': [
        { date: '2024-07-15', weight: 1110 },
        { date: '2024-07-16', weight: 1105 },
        { date: '2024-07-17', weight: 1108 },
        { date: '2024-07-18', weight: 1102 },
        { date: '2024-07-19', weight: 1100 },
        { date: '2024-07-20', weight: 1098 },
        { date: '2024-07-21', weight: 1100 },
    ],
    'b3': [
        { date: '2024-07-15', weight: 715 },
        { date: '2024-07-16', weight: 712 },
        { date: '2024-07-17', weight: 714 },
        { date: '2024-07-18', weight: 710 },
        { date: '2024-07-19', weight: 708 },
        { date: '2024-07-20', weight: 709 },
        { date: '2024-07-21', weight: 710 },
    ],
}
