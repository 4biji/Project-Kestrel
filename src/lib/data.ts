
import type { Bird, LogEntry, NutritionInfo } from './types';

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

type LogData = { [birdId: string]: LogEntry[] };
export const logs: LogData = {
  'b1': [
    { logType: 'feeding', id: 'f1', datetime: '2024-07-20T08:30:00', foodItem: 'Quail', amount: 50, notes: 'Eager to eat.', protein: 11 },
    { logType: 'feeding', id: 'f2', datetime: '2024-07-19T09:00:00', foodItem: 'Chicken Heart', amount: 45, notes: '', protein: 7.2 },
    { logType: 'feeding', id: 'f5', datetime: '2024-07-21T08:30:00', foodItem: 'Quail', amount: 55, notes: 'Very hungry today.', protein: 12.1 },
    { logType: 'feeding', id: 'f6', datetime: '2024-07-22T09:00:00', foodItem: 'Chicken Heart', amount: 40, notes: '', protein: 6.4 },
    { logType: 'husbandry', id: 'h1', datetime: '2024-07-23T09:00:00', task: 'Clean mews', completed: true },
    { logType: 'husbandry', id: 'h2', datetime: '2024-07-23T09:00:00', task: 'Check equipment (jesses, leash)', completed: true },
    { logType: 'husbandry', id: 'h3', datetime: '2024-07-23T09:00:00', task: 'Weigh bird', completed: false },
    { logType: 'training', id: 't1', datetime: '2024-07-20T17:00:00', behavior: 'Lure stooping', duration: 15, notes: '10 stoops, good speed.', imageUrl: 'https://placehold.co/600x400.png' },
    { logType: 'training', id: 't2', datetime: '2024-07-18T16:45:00', behavior: 'Fist calling', duration: 10, notes: 'Responsive, came from 50 yards.', imageUrl: 'https://placehold.co/600x400.png' },
    { logType: 'mute', id: 'm1', datetime: '2024-07-20T07:00:00', condition: 'Normal', notes: 'Healthy looking mute.' },
    { logType: 'mute', id: 'm2', datetime: '2024-07-19T07:15:00', condition: 'Greenish', notes: 'Slightly off color, monitor.', imageUrl: 'https://placehold.co/600x400.png' },
    { logType: 'weight', id: 'w1', datetime: '2024-07-15T08:00:00', weight: 655 },
    { logType: 'weight', id: 'w2', datetime: '2024-07-16T08:05:00', weight: 652 },
    { logType: 'weight', id: 'w3', datetime: '2024-07-17T07:55:00', weight: 653 },
    { logType: 'weight', id: 'w4', datetime: '2024-07-18T08:00:00', weight: 651 },
    { logType: 'weight', id: 'w5', datetime: '2024-07-19T08:02:00', weight: 650 },
    { logType: 'weight', id: 'w6', datetime: '2024-07-20T07:58:00', weight: 648 },
    { logType: 'weight', id: 'w7', datetime: '2024-07-21T08:01:00', weight: 650 },
    { logType: 'hunting', id: 'hunt1', datetime: '2024-07-21T18:00:00', prey: 'Rabbit', outcome: 'Successful', notes: 'Clean catch.', imageUrl: 'https://placehold.co/600x400.png' },
    { logType: 'hunting', id: 'hunt2', datetime: '2024-07-19T17:45:00', prey: 'Squirrel', outcome: 'Unsuccessful', notes: 'Prey escaped into a tree.' },
  ],
  'b2': [
    { logType: 'feeding', id: 'f3', datetime: '2024-07-20T08:00:00', foodItem: 'Pigeon', amount: 120, notes: 'Full crop.', protein: 25.2 },
    { logType: 'feeding', id: 'f7', datetime: '2024-07-21T08:00:00', foodItem: 'Rabbit', amount: 150, notes: 'Ate well.', protein: 31.5 },
    { logType: 'husbandry', id: 'h4', datetime: '2024-07-23T09:00:00', task: 'Clean mews', completed: true },
    { logType: 'husbandry', id: 'h5', datetime: '2024-07-23T09:00:00', task: 'Check equipment', completed: false },
    { logType: 'training', id: 't3', datetime: '2024-07-19T17:30:00', behavior: 'Kite work', duration: 20, notes: 'Followed kite well, needs more height.' },
    { logType: 'weight', id: 'w8', datetime: '2024-07-15T08:30:00', weight: 1110 },
    { logType: 'weight', id: 'w9', datetime: '2024-07-16T08:35:00', weight: 1105 },
    { logType: 'weight', id: 'w10', datetime: '2024-07-17T08:25:00', weight: 1108 },
    { logType: 'weight', id: 'w11', datetime: '2024-07-18T08:30:00', weight: 1102 },
    { logType: 'weight', id: 'w12', datetime: '2024-07-19T08:32:00', weight: 1100 },
    { logType: 'weight', id: 'w13', datetime: '2024-07-20T08:28:00', weight: 1098 },
    { logType: 'weight', id: 'w14', datetime: '2024-07-21T08:31:00', weight: 1100 },
  ],
  'b3': [
      { logType: 'feeding', id: 'f8', datetime: '2024-07-22T08:45:00', foodItem: 'Mouse', amount: 30, notes: 'First meal with us.' },
      { logType: 'weight', id: 'w15', datetime: '2024-07-15T09:00:00', weight: 715 },
      { logType: 'weight', id: 'w16', datetime: '2024-07-16T09:05:00', weight: 712 },
      { logType: 'weight', id: 'w17', datetime: '2024-07-17T08:55:00', weight: 714 },
      { logType: 'weight', id: 'w18', datetime: '2024-07-18T09:00:00', weight: 710 },
      { logType: 'weight', id: 'w19', datetime: '2024-07-19T09:02:00', weight: 708 },
      { logType: 'weight', id: 'w20', datetime: '2024-07-20T08:58:00', weight: 709 },
      { logType: 'weight', id: 'w21', datetime: '2024-07-21T09:01:00', weight: 710 },
  ],
};

export const nutritionInfo: NutritionInfo[] = [
    { id: 'n1', foodType: 'Quail', proteinPer100g: 22 },
    { id: 'n2', foodType: 'Chicken Heart', proteinPer100g: 16 },
    { id: 'n3', foodType: 'Pigeon', proteinPer100g: 21 },
    { id: 'n4', foodType: 'Rabbit', proteinPer100g: 21 },
];
