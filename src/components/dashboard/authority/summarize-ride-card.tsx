'use client';

import React, { useState } from 'react';
import type { Ride } from '@/lib/types';
import { handleSummarize } from '@/app/actions';
import type { SummarizeRideRiskEventsOutput } from '@/ai/flows/summarize-ride-risk-events';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Sparkles, FileText } from 'lucide-react';

interface SummarizeRideCardProps {
  ride: Ride;
}

export default function SummarizeRideCard({ ride }: SummarizeRideCardProps) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SummarizeRideRiskEventsOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const getSummary = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    if (ride.riskEvents.length === 0) {
      setError("No risk events to summarize for this ride.");
      setLoading(false);
      return;
    }

    try {
      const output = await handleSummarize({
        rideId: ride.rideId,
        riskEvents: ride.riskEvents.map(e => e.description),
      });
      setResult(output);
    } catch (e) {
      setError('Failed to generate summary. Please try again.');
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline">
          <Sparkles className="h-5 w-5 text-primary" />
          AI Incident Summary
        </CardTitle>
        <CardDescription>
          Generate an AI-powered summary of the risk events for this ride.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!result && (
          <Button onClick={getSummary} disabled={loading} className="w-full sm:w-auto">
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <FileText className="mr-2 h-4 w-4" />
            )}
            Generate Summary
          </Button>
        )}

        {result && (
          <div className="space-y-4 rounded-lg border bg-background p-4">
            <h3 className="font-bold">Incident Report</h3>
            <p className="text-sm text-muted-foreground">{result.summary}</p>
            <Button onClick={() => setResult(null)} variant="outline" className="w-full sm:w-auto">
                Clear Summary
            </Button>
          </div>
        )}

        {error && <p className="text-sm text-destructive">{error}</p>}
      </CardContent>
    </Card>
  );
}
