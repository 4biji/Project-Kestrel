
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

const generateLogs = (bird: Bird, days: number): LogEntry[] => {
    const generatedLogs: LogEntry[] = [];
    let currentWeight = bird.weight;
    const now = new Date();

    for (let i = days - 1; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(now.getDate() - i);
        
        const hourlyLoss = (currentWeight * 0.20) / 24;

        // Morning weight (8 AM)
        date.setHours(8, 0, 0, 0);
        const morningWeight = currentWeight;
        generatedLogs.push({ logType: 'weight', id: `w-${bird.id}-${i}-1`, datetime: date.toISOString(), weight: parseFloat(morningWeight.toFixed(1)) });

        // Morning feeding (8:30 AM)
        const morningFoodAmount = Math.round(bird.weight * 0.05);
        currentWeight += morningFoodAmount;
        date.setHours(8, 30, 0, 0);
        generatedLogs.push({ logType: 'feeding', id: `f-${bird.id}-${i}-1`, datetime: date.toISOString(), foodItem: 'Quail', amount: morningFoodAmount, notes: 'Morning feeding.' });

        // Post-feeding weight (12 PM)
        const hoursSinceMorningWeight = 4;
        currentWeight -= hourlyLoss * hoursSinceMorningWeight;
        date.setHours(12, 0, 0, 0);
        generatedLogs.push({ logType: 'weight', id: `w-${bird.id}-${i}-2`, datetime: date.toISOString(), weight: parseFloat(currentWeight.toFixed(1)) });

        // Training session (4:30 PM)
        date.setHours(16, 30, 0, 0);
        generatedLogs.push({ logType: 'training', id: `t-${bird.id}-${i}-1`, datetime: date.toISOString(), behavior: 'Lure stooping', duration: 15, notes: 'Good session.', performance: 'Positive' });

        // Evening feeding (6 PM)
        const eveningFoodAmount = Math.round(bird.weight * 0.04);
        currentWeight += eveningFoodAmount;
        date.setHours(18, 0, 0, 0);
        generatedLogs.push({ logType: 'feeding', id: `f-${bird.id}-${i}-2`, datetime: date.toISOString(), foodItem: 'Chicken Heart', amount: eveningFoodAmount, notes: 'Evening meal.' });
        
        // Evening weight (8 PM)
        const hoursSinceMiddayWeight = 8;
        currentWeight -= hourlyLoss * hoursSinceMiddayWeight;
        date.setHours(20, 0, 0, 0);
        generatedLogs.push({ logType: 'weight', id: `w-${bird.id}-${i}-3`, datetime: date.toISOString(), weight: parseFloat(currentWeight.toFixed(1)) });
        
        // Weight loss overnight for next day's 8 AM reading
        const hoursOvernight = 12;
        currentWeight -= hourlyLoss * hoursOvernight;
    }
    
    // Add some other log types for variety
    generatedLogs.push({ logType: 'husbandry', id: `h-${bird.id}-1`, datetime: new Date().toISOString(), task: 'Clean mews', completed: true });
    generatedLogs.push({ logType: 'mute', id: `m-${bird.id}-1`, datetime: new Date(now.setDate(now.getDate() - 1)).toISOString(), type: 'Mute', condition: 'Normal', notes: 'Healthy looking mute.' });
    generatedLogs.push({ logType: 'hunting', id: `hunt-${bird.id}-1`, datetime: new Date(now.setDate(now.getDate() - 2)).toISOString(), prey: 'Rabbit', outcome: 'Successful', notes: 'Clean catch.', imageUrl: 'https://placehold.co/600x400.png' });
    if(bird.id === 'b1') {
      generatedLogs.push({ logType: 'health', id: 'health1', datetime: '2024-07-23T10:00:00.000Z', condition: 'Bumblefoot', treatment: 'Applied antiseptic cream and wrapped.', notes: 'Checking daily for improvement.' });
    }

    return generatedLogs.sort((a, b) => new Date(b.datetime).getTime() - new Date(a.datetime).getTime());
};

export const logs: LogData = {
  'b1': generateLogs(birds[0], 30),
  'b2': generateLogs(birds[1], 30),
  'b3': generateLogs(birds[2], 30),
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

    
