
import type { Bird, LogEntry, NutritionInfo, PredefinedHusbandryTask, PredefinedTraining, PredefinedHealthIssue } from './types';

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
    { logType: 'training', id: 't1', datetime: '2024-07-22T17:00:00', behavior: 'Lure stooping', duration: 15, notes: '10 stoops, good speed.', performance: 'Positive', imageUrl: 'https://placehold.co/600x400.png' },
    { logType: 'training', id: 't2', datetime: '2024-07-21T16:45:00', behavior: 'Fist calling', duration: 10, notes: 'A bit hesitant today.', performance: 'Neutral', imageUrl: 'https://placehold.co/600x400.png' },
    { logType: 'training', id: 't-b1-1', datetime: '2024-07-20T16:30:00', behavior: 'Fist calling', duration: 12, notes: 'Very responsive, came from 50 yards.', performance: 'Positive' },
    { logType: 'training', id: 't-b1-2', datetime: '2024-07-19T17:00:00', behavior: 'Lure stooping', duration: 10, notes: 'Distracted by a dog.', performance: 'Negative' },
    { logType: 'mute', id: 'm1', datetime: '2024-07-20T07:00:00', type: 'Mute', condition: 'Normal', notes: 'Healthy looking mute.' },
    { logType: 'mute', id: 'm2', datetime: '2024-07-19T07:15:00', type: 'Mute', condition: 'Greenish', notes: 'Slightly off color, monitor.', imageUrl: 'https://placehold.co/600x400.png' },
    { logType: 'mute', id: 'c1', datetime: '2024-07-21T06:00:00', type: 'Casting', notes: 'Good size, clean casting.', imageUrl: 'https://placehold.co/600x400.png' },
    { logType: 'weight', id: 'w1', datetime: '2024-07-15T08:00:00', weight: 655 },
    { logType: 'weight', id: 'w2', datetime: '2024-07-16T08:05:00', weight: 652 },
    { logType: 'weight', id: 'w3', datetime: '2024-07-17T07:55:00', weight: 653 },
    { logType: 'weight', id: 'w4', datetime: '2024-07-18T08:00:00', weight: 651 },
    { logType: 'weight', id: 'w5', datetime: '2024-07-19T08:02:00', weight: 650 },
    { logType: 'weight', id: 'w6', datetime: '2024-07-20T07:58:00', weight: 648 },
    { logType: 'weight', id: 'w7', datetime: '2024-07-21T08:01:00', weight: 650 },
    { logType: 'hunting', id: 'hunt1', datetime: '2024-07-21T18:00:00', prey: 'Rabbit', outcome: 'Successful', notes: 'Clean catch.', imageUrl: 'https://placehold.co/600x400.png' },
    { logType: 'hunting', id: 'hunt2', datetime: '2024-07-19T17:45:00', prey: 'Squirrel', outcome: 'Unsuccessful', notes: 'Prey escaped into a tree.' },
    { logType: 'health', id: 'health1', datetime: '2024-07-23T10:00:00', condition: 'Bumblefoot', treatment: 'Applied antiseptic cream and wrapped.', notes: 'Checking daily for improvement.' },
  ],
  'b2': [
    { logType: 'feeding', id: 'f3', datetime: '2024-07-20T08:00:00', foodItem: 'Pigeon', amount: 120, notes: 'Full crop.', protein: 25.2 },
    { logType: 'feeding', id: 'f7', datetime: '2024-07-21T08:00:00', foodItem: 'Rabbit', amount: 150, notes: 'Ate well.', protein: 31.5 },
    { logType: 'husbandry', id: 'h4', datetime: '2024-07-23T09:00:00', task: 'Clean mews', completed: true },
    { logType: 'husbandry', id: 'h5', datetime: '2024-07-23T09:00:00', task: 'Check equipment', completed: false },
    { logType: 'training', id: 't3', datetime: '2024-07-22T17:30:00', behavior: 'Kite work', duration: 20, notes: 'Followed kite well, gaining height.', performance: 'Positive' },
    { logType: 'training', id: 't-b2-1', datetime: '2024-07-21T17:30:00', behavior: 'Kite work', duration: 18, notes: 'Good start, but lost focus.', performance: 'Neutral' },
    { logType: 'mute', id: 'm-b2-1', datetime: '2024-07-22T07:00:00', type: 'Mute', condition: 'Normal', notes: '' },
    { logType: 'mute', id: 'c-b2-1', datetime: '2024-07-23T06:30:00', type: 'Casting', notes: 'Regurgitated cleanly.' },
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
      { logType: 'training', id: 't-b3-1', datetime: '2024-07-22T15:00:00', behavior: 'Manning', duration: 30, notes: 'Calm on the fist, looking around.', performance: 'Positive' },
      { logType: 'training', id: 't-b3-2', datetime: '2024-07-21T14:00:00', behavior: 'Manning', duration: 25, notes: 'A little jumpy with sudden noises.', performance: 'Neutral' },
      { logType: 'mute', id: 'm-b3-1', datetime: '2024-07-23T08:00:00', type: 'Mute', condition: 'Normal', notes: 'First mute observed.' },
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
    { id: 'n5', foodType: 'Mouse', proteinPer100g: 19 },
    { id: 'n6', foodType: 'Day-old chick', proteinPer100g: 15 },
];

export const predefinedHusbandryTasks: PredefinedHusbandryTask[] = [
    { id: 'h_task_1', task: 'Clean mews', frequency: 'daily' },
    { id: 'h_task_2', task: 'Check equipment (jesses, leash)', frequency: 'daily' },
    { id: 'h_task_3', task: 'Clean bath pan', frequency: 'weekly' },
    { id: 'h_task_4', task: 'Cope beak', frequency: 'monthly' },
];

export const predefinedTraining: PredefinedTraining[] = [
    { id: 't_train_1', behavior: 'Manning' },
    { id: 't_train_2', behavior: 'Fist calling' },
    { id: 't_train_3', behavior: 'Lure stooping' },
    { id: 't_train_4', behavior: 'Kite work' },
];

export const predefinedHealthIssues: PredefinedHealthIssue[] = [
    { id: 'health_1', issue: 'Bumblefoot', severity: 3 },
    { id: 'health_2', issue: 'Sour Crop', severity: 8 },
    { id: 'health_3', issue: 'Feather Damage', severity: 2 },
    { id: 'health_4', issue: 'Aspergillosis', severity: 9 },
];

    
