
'use server';

import { 
  summarizeRideRiskEvents, 
  SummarizeRideRiskEventsInput,
  SummarizeRideRiskEventsOutput
} from '@/ai/flows/summarize-ride-risk-events';
import { 
  suggestImprovedSafeRoute, 
  SuggestImprovedSafeRouteInput,
  SuggestImprovedSafeRouteOutput
} from '@/ai/flows/suggest-improved-safe-route';

export async function handleSummarize(input: SummarizeRideRiskEventsInput): Promise<SummarizeRideRiskEventsOutput> {
  // In a real app, you would fetch real risk events for the rideId.
  // Here, we are using the mock data passed from the client.
  const result = await summarizeRideRiskEvents(input);
  return result;
}

export async function handleSuggestRoute(input: SuggestImprovedSafeRouteInput): Promise<SuggestImprovedSafeRouteOutput> {
  // In a real app, you would fetch real past route data for the user.
  // Here, we are using the mock data passed from the client.
  const result = await suggestImprovedSafeRoute(input);
  return result;
}
