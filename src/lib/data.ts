
import type { Bird, LogEntry, NutritionInfo, PredefinedHusbandryTask, PredefinedTraining, PredefinedHealthIssue, FirstAidLink } from './types';

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
    // Apollo - Peregrine Falcon, avg weight ~650g
    // Day 1
    { logType: 'weight', id: 'w-b1-1', datetime: '2024-07-20T08:00:00', weight: 650 },
    { logType: 'feeding', id: 'f-b1-1', datetime: '2024-07-20T08:30:00', foodItem: 'Quail', amount: 35, notes: 'Morning feeding.' },
    { logType: 'weight', id: 'w-b1-2', datetime: '2024-07-20T12:00:00', weight: 685 },
    { logType: 'training', id: 't-b1-1', datetime: '2024-07-20T16:30:00', behavior: 'Fist calling', duration: 12, notes: 'Very responsive, came from 50 yards.', performance: 'Positive' },
    { logType: 'feeding', id: 'f-b1-2', datetime: '2024-07-20T18:00:00', foodItem: 'Chicken Heart', amount: 30, notes: 'Evening meal.' },
    { logType: 'weight', id: 'w-b1-3', datetime: '2024-07-20T20:00:00', weight: 695 },
    // Day 2
    { logType: 'weight', id: 'w-b1-4', datetime: '2024-07-21T08:00:00', weight: 645 }, // ~50g loss overnight
    { logType: 'feeding', id: 'f-b1-3', datetime: '2024-07-21T08:30:00', foodItem: 'Quail', amount: 40, notes: 'Eager to eat.' },
    { logType: 'weight', id: 'w-b1-5', datetime: '2024-07-21T12:00:00', weight: 685 },
    { logType: 'training', id: 't-b1-2', datetime: '2024-07-21T16:45:00', behavior: 'Lure stooping', duration: 10, notes: 'A bit hesitant today.', performance: 'Neutral', imageUrl: 'https://placehold.co/600x400.png' },
    { logType: 'feeding', id: 'f-b1-4', datetime: '2024-07-21T18:00:00', foodItem: 'Chicken Heart', amount: 35, notes: 'Finished quickly.' },
    { logType: 'weight', id: 'w-b1-6', datetime: '2024-07-21T20:00:00', weight: 700 },
    // Day 3
    { logType: 'weight', id: 'w-b1-7', datetime: '2024-07-22T08:00:00', weight: 650 },
    { logType: 'feeding', id: 'f-b1-5', datetime: '2024-07-22T08:30:00', foodItem: 'Quail', amount: 30, notes: '' },
    { logType: 'weight', id: 'w-b1-8', datetime: '2024-07-22T12:00:00', weight: 680 },
    { logType: 'training', id: 't-b1-3', datetime: '2024-07-22T17:00:00', behavior: 'Lure stooping', duration: 15, notes: '10 stoops, good speed.', performance: 'Positive', imageUrl: 'https://placehold.co/600x400.png' },
    { logType: 'feeding', id: 'f-b1-6', datetime: '2024-07-22T18:00:00', foodItem: 'Chicken Heart', amount: 30, notes: '' },
    { logType: 'weight', id: 'w-b1-9', datetime: '2024-07-22T20:00:00', weight: 690 },

    // Misc Logs for Apollo
    { logType: 'husbandry', id: 'h1', datetime: '2024-07-23T09:00:00', task: 'Clean mews', completed: true },
    { logType: 'mute', id: 'm1', datetime: '2024-07-20T07:00:00', type: 'Mute', condition: 'Normal', notes: 'Healthy looking mute.' },
    { logType: 'mute', id: 'c1', datetime: '2024-07-21T06:00:00', type: 'Casting', notes: 'Good size, clean casting.', imageUrl: 'https://placehold.co/600x400.png' },
    { logType: 'hunting', id: 'hunt1', datetime: '2024-07-21T18:00:00', prey: 'Rabbit', outcome: 'Successful', notes: 'Clean catch.', imageUrl: 'https://placehold.co/600x400.png' },
    { logType: 'health', id: 'health1', datetime: '2024-07-23T10:00:00', condition: 'Bumblefoot', treatment: 'Applied antiseptic cream and wrapped.', notes: 'Checking daily for improvement.' },
  ],
  'b2': [
    // Athena - Gyrfalcon, avg weight ~1100g
    // Day 1
    { logType: 'weight', id: 'w-b2-1', datetime: '2024-07-20T08:00:00', weight: 1100 },
    { logType: 'feeding', id: 'f-b2-1', datetime: '2024-07-20T08:30:00', foodItem: 'Pigeon', amount: 70, notes: 'Morning feeding.' },
    { logType: 'weight', id: 'w-b2-2', datetime: '2024-07-20T12:00:00', weight: 1170 },
    { logType: 'feeding', id: 'f-b2-2', datetime: '2024-07-20T18:00:00', foodItem: 'Rabbit', amount: 80, notes: 'Evening meal.' },
    { logType: 'weight', id: 'w-b2-3', datetime: '2024-07-20T20:00:00', weight: 1230 },
    // Day 2
    { logType: 'weight', id: 'w-b2-4', datetime: '2024-07-21T08:00:00', weight: 1150 }, // ~80g loss overnight
    { logType: 'feeding', id: 'f-b2-3', datetime: '2024-07-21T08:30:00', foodItem: 'Pigeon', amount: 60, notes: 'Ate well.' },
    { logType: 'weight', id: 'w-b2-5', datetime: '2024-07-21T12:00:00', weight: 1210 },
    { logType: 'training', id: 't-b2-1', datetime: '2024-07-21T17:30:00', behavior: 'Kite work', duration: 18, notes: 'Good start, but lost focus.', performance: 'Neutral' },
    { logType: 'feeding', id: 'f-b2-4', datetime: '2024-07-21T18:00:00', foodItem: 'Rabbit', amount: 90, notes: 'Very hungry.' },
    { logType: 'weight', id: 'w-b2-6', datetime: '2024-07-21T20:00:00', weight: 1270 },
    // Day 3
    { logType: 'weight', id: 'w-b2-7', datetime: '2024-07-22T08:00:00', weight: 1190 },
    { logType: 'feeding', id: 'f-b2-5', datetime: '2024-07-22T08:30:00', foodItem: 'Pigeon', amount: 75, notes: '' },
    { logType: 'weight', id: 'w-b2-8', datetime: '2024-07-22T12:00:00', weight: 1265 },
    { logType: 'training', id: 't-b2-2', datetime: '2024-07-22T17:30:00', behavior: 'Kite work', duration: 20, notes: 'Followed kite well, gaining height.', performance: 'Positive' },
    { logType: 'feeding', id: 'f-b2-6', datetime: '2024-07-22T18:00:00', foodItem: 'Rabbit', amount: 65, notes: '' },
    { logType: 'weight', id: 'w-b2-9', datetime: '2024-07-22T20:00:00', weight: 1300 },

    // Misc Logs for Athena
    { logType: 'husbandry', id: 'h4', datetime: '2024-07-23T09:00:00', task: 'Clean mews', completed: true },
    { logType: 'mute', id: 'm-b2-1', datetime: '2024-07-22T07:00:00', type: 'Mute', condition: 'Normal', notes: '' },
  ],
  'b3': [
      // Zeus - Harris's Hawk, avg weight ~710g
      // Day 1
      { logType: 'weight', id: 'w-b3-1', datetime: '2024-07-20T08:00:00', weight: 710 },
      { logType: 'feeding', id: 'f-b3-1', datetime: '2024-07-20T08:30:00', foodItem: 'Mouse', amount: 40, notes: 'Morning feeding.' },
      { logType: 'weight', id: 'w-b3-2', datetime: '2024-07-20T12:00:00', weight: 750 },
      { logType: 'feeding', id: 'f-b3-2', datetime: '2024-07-20T18:00:00', foodItem: 'Quail', amount: 45, notes: 'Evening meal.' },
      { logType: 'weight', id: 'w-b3-3', datetime: '2024-07-20T20:00:00', weight: 785 },
      // Day 2
      { logType: 'weight', id: 'w-b3-4', datetime: '2024-07-21T08:00:00', weight: 725 }, // ~60g loss overnight
      { logType: 'training', id: 't-b3-1', datetime: '2024-07-21T14:00:00', behavior: 'Manning', duration: 25, notes: 'A little jumpy with sudden noises.', performance: 'Neutral' },
      { logType: 'feeding', id: 'f-b3-3', datetime: '2024-07-21T08:30:00', foodItem: 'Mouse', amount: 50, notes: 'Ate well.' },
      { logType: 'weight', id: 'w-b3-5', datetime: '2024-07-21T12:00:00', weight: 775 },
      { logType: 'feeding', id: 'f-b3-4', datetime: '2024-07-21T18:00:00', foodItem: 'Quail', amount: 40, notes: '' },
      { logType: 'weight', id: 'w-b3-6', datetime: '2024-07-21T20:00:00', weight: 805 },
      // Day 3
      { logType: 'weight', id: 'w-b3-7', datetime: '2024-07-22T08:00:00', weight: 745 },
      { logType: 'feeding', id: 'f-b3-5', datetime: '2024-07-22T08:45:00', foodItem: 'Mouse', amount: 30, notes: '' },
      { logType: 'weight', id: 'w-b3-8', datetime: '2024-07-22T12:00:00', weight: 775 },
      { logType: 'training', id: 't-b3-2', datetime: '2024-07-22T15:00:00', behavior: 'Manning', duration: 30, notes: 'Calm on the fist, looking around.', performance: 'Positive' },
      { logType: 'feeding', id: 'f-b3-6', datetime: '2024-07-22T18:00:00', foodItem: 'Quail', amount: 45, notes: '' },
      { logType: 'weight', id: 'w-b3-9', datetime: '2024-07-22T20:00:00', weight: 810 },
      
      // Misc Logs for Zeus
      { logType: 'mute', id: 'm-b3-1', datetime: '2024-07-23T08:00:00', type: 'Mute', condition: 'Normal', notes: 'First mute observed.' },
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

export const predefinedFirstAidLinks: FirstAidLink[] = [
    { id: 'link_1', title: 'The Modern Apprentice', url: 'https://www.themodernapprentice.com/firstaid.htm' },
    { id: 'link_2', title: 'NYS Falconry Association', url: 'https://nysfa.org/health-medical/' },
];

    
