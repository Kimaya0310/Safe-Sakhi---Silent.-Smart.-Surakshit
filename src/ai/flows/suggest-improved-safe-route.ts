'use server';

/**
 * @fileOverview An AI agent that suggests improved safe routes based on past ride data.
 *
 * - suggestImprovedSafeRoute - A function that suggests safer routes.
 * - SuggestImprovedSafeRouteInput - The input type for the suggestImprovedSafeRoute function.
 * - SuggestImprovedSafeRouteOutput - The return type for the suggestImprovedSafeRoute function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestImprovedSafeRouteInputSchema = z.object({
  startLocation: z
    .string()
    .describe('The starting location of the ride.'),
  destination: z.string().describe('The destination of the ride.'),
  pastRouteData: z
    .string()
    .describe(
      'JSON string of past route data, including deviations and risk events.'
    ),
});
export type SuggestImprovedSafeRouteInput = z.infer<
  typeof SuggestImprovedSafeRouteInputSchema
>;

const SuggestImprovedSafeRouteOutputSchema = z.object({
  suggestedRoute: z
    .string()
    .describe(
      'A description of the suggested safer route, including waypoints and rationale.'
    ),
  safetyScore: z
    .number()
    .describe(
      'A numerical score (0-100) indicating the relative safety of the suggested route.'
    ),
  riskFactorExplanation: z
    .string()
    .describe(
      'Explanation of the major risk factors that were considered when suggesting the route.'
    ),
});
export type SuggestImprovedSafeRouteOutput = z.infer<
  typeof SuggestImprovedSafeRouteOutputSchema
>;

export async function suggestImprovedSafeRoute(
  input: SuggestImprovedSafeRouteInput
): Promise<SuggestImprovedSafeRouteOutput> {
  return suggestImprovedSafeRouteFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestImprovedSafeRoutePrompt',
  input: {schema: SuggestImprovedSafeRouteInputSchema},
  output: {schema: SuggestImprovedSafeRouteOutputSchema},
  prompt: `You are an AI assistant designed to suggest safer routes for passengers based on their past ride data.

  Analyze the past route data and suggest an alternative, safer route for future trips between the same start and destination.

  Consider the following factors when suggesting the route:
  - Route deviations
  - Risk events
  - Stop durations
  - Driving behavior

  Provide a suggested route, a safety score (0-100), and an explanation of the major risk factors considered.

  Start Location: {{{startLocation}}}
  Destination: {{{destination}}}
  Past Route Data: {{{pastRouteData}}}
  `,
});

const suggestImprovedSafeRouteFlow = ai.defineFlow(
  {
    name: 'suggestImprovedSafeRouteFlow',
    inputSchema: SuggestImprovedSafeRouteInputSchema,
    outputSchema: SuggestImprovedSafeRouteOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
