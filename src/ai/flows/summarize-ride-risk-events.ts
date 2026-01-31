'use server';
/**
 * @fileOverview Summarizes the risk events of a ride for authorities using generative AI.
 *
 * - summarizeRideRiskEvents - A function that summarizes ride risk events.
 * - SummarizeRideRiskEventsInput - The input type for the summarizeRideRiskEvents function.
 * - SummarizeRideRiskEventsOutput - The return type for the summarizeRideRiskEvents function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeRideRiskEventsInputSchema = z.object({
  rideId: z.string().describe('The ID of the ride to summarize risk events for.'),
  riskEvents: z.array(z.string()).describe('An array of risk events associated with the ride.'),
});
export type SummarizeRideRiskEventsInput = z.infer<
  typeof SummarizeRideRiskEventsInputSchema
>;

const SummarizeRideRiskEventsOutputSchema = z.object({
  summary: z.string().describe('A summary of the risk events that occurred during the ride.'),
});
export type SummarizeRideRiskEventsOutput = z.infer<
  typeof SummarizeRideRiskEventsOutputSchema
>;

export async function summarizeRideRiskEvents(
  input: SummarizeRideRiskEventsInput
): Promise<SummarizeRideRiskEventsOutput> {
  return summarizeRideRiskEventsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeRideRiskEventsPrompt',
  input: {schema: SummarizeRideRiskEventsInputSchema},
  output: {schema: SummarizeRideRiskEventsOutputSchema},
  prompt: `You are an AI assistant tasked with summarizing risk events from a ride for authorities.  Given the following risk events, provide a concise summary of the incident.  The summary should focus on the key details and potential safety concerns.

Ride ID: {{{rideId}}}
Risk Events:{{#each riskEvents}} - {{{this}}}{{/each}}`,
});

const summarizeRideRiskEventsFlow = ai.defineFlow(
  {
    name: 'summarizeRideRiskEventsFlow',
    inputSchema: SummarizeRideRiskEventsInputSchema,
    outputSchema: SummarizeRideRiskEventsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
