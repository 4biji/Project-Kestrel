// src/ai/flows/calculate-avg-weight-loss.ts
'use server';
/**
 * @fileOverview Calculates the average weight loss of a bird within a specified date range.
 *
 * - calculateAvgWeightLoss - A function that calculates the average weight loss.
 * - CalculateAvgWeightLossInput - The input type for the calculateAvgWeightLoss function.
 * - CalculateAvgWeightLossOutput - The return type for the calculateAvgWeightLoss function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { weightLogs } from '@/lib/data';
import { parseISO, isWithinInterval } from 'date-fns';

const CalculateAvgWeightLossInputSchema = z.object({
  birdId: z.string().describe('The ID of the bird.'),
  startDate: z.string().describe('The start date for the weight loss calculation (YYYY-MM-DD).'),
  endDate: z.string().describe('The end date for the weight loss calculation (YYYY-MM-DD).'),
});
export type CalculateAvgWeightLossInput = z.infer<typeof CalculateAvgWeightLossInputSchema>;

const CalculateAvgWeightLossOutputSchema = z.object({
  averageWeightLoss: z.number().describe('The average weight loss of the bird during the specified period, in grams.'),
});
export type CalculateAvgWeightLossOutput = z.infer<typeof CalculateAvgWeightLossOutputSchema>;

export async function calculateAvgWeightLoss(input: CalculateAvgWeightLossInput): Promise<CalculateAvgWeightLossOutput> {
  return calculateAvgWeightLossFlow(input);
}

const calculateAvgWeightLossFlow = ai.defineFlow(
  {
    name: 'calculateAvgWeightLossFlow',
    inputSchema: CalculateAvgWeightLossInputSchema,
    outputSchema: CalculateAvgWeightLossOutputSchema,
  },
  async ({ birdId, startDate, endDate }) => {
    const birdWeightLogs = weightLogs[birdId];

    if (!birdWeightLogs) {
      return { averageWeightLoss: 0 };
    }

    const start = parseISO(startDate);
    const end = parseISO(endDate);

    const relevantLogs = birdWeightLogs.filter(log =>
      isWithinInterval(parseISO(log.date), { start, end })
    ).sort((a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime());

    if (relevantLogs.length < 2) {
      return { averageWeightLoss: 0 };
    }
    
    let totalLoss = 0;
    let lossCount = 0;

    for (let i = 1; i < relevantLogs.length; i++) {
        const weightChange = relevantLogs[i].weight - relevantLogs[i-1].weight;
        if (weightChange < 0) {
            totalLoss += Math.abs(weightChange);
            lossCount++;
        }
    }
    
    const averageWeightLoss = lossCount > 0 ? totalLoss / lossCount : 0;

    return { averageWeightLoss };
  }
);
