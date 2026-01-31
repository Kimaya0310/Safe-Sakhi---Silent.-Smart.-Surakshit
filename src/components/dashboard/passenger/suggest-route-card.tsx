'use client';

import React, { useState } from 'react';
import type { Ride } from '@/lib/types';
import { handleSuggestRoute } from '@/app/actions';
import type { SuggestImprovedSafeRouteOutput } from '@/ai/flows/suggest-improved-safe-route';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Sparkles, Route, ShieldCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface SuggestRouteCardProps {
  ride: Ride;
}

export default function SuggestRouteCard({ ride }: SuggestRouteCardProps) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SuggestImprovedSafeRouteOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const getSuggestion = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const output = await handleSuggestRoute({
        startLocation: ride.startLocation,
        destination: ride.destination,
        pastRouteData: ride.pastRouteData || '{}',
      });
      setResult(output);
    } catch (e) {
      setError('Failed to generate suggestion. Please try again.');
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
          AI-Powered Route Improvement
        </CardTitle>
        <CardDescription>
          Get a safer route suggestion for your next trip based on an analysis of past ride data.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!result && (
          <Button onClick={getSuggestion} disabled={loading} className="w-full sm:w-auto">
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Route className="mr-2 h-4 w-4" />
            )}
            Suggest Safer Route
          </Button>
        )}

        {result && (
          <div className="space-y-4 rounded-lg border bg-background p-4">
            <div className="flex items-center justify-between">
                <h3 className="font-bold text-lg">Suggested Route</h3>
                <Badge variant={result.safetyScore > 75 ? 'default' : 'secondary'} className="flex items-center gap-1">
                    <ShieldCheck className="h-3 w-3" />
                    Safety Score: {result.safetyScore}/100
                </Badge>
            </div>
            
            <div className="space-y-2">
                <p className="text-sm font-semibold">Route Details:</p>
                <p className="text-sm text-muted-foreground">{result.suggestedRoute}</p>
            </div>
             <div className="space-y-2">
                <p className="text-sm font-semibold">Risk Factors Considered:</p>
                <p className="text-sm text-muted-foreground">{result.riskFactorExplanation}</p>
            </div>

            <Button onClick={() => setResult(null)} variant="outline" className="w-full sm:w-auto">
                Clear Suggestion
            </Button>
          </div>
        )}
         {error && <p className="text-sm text-destructive">{error}</p>}
      </CardContent>
    </Card>
  );
}
