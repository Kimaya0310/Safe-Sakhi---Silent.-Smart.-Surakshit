'use client';

import React from 'react';
import type { Ride } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Clock, MapPin, AlertTriangle, LifeBuoy, BookUser, ShieldQuestion } from 'lucide-react';
import SuggestRouteCard from './suggest-route-card';

interface RideSummaryViewProps {
  ride: Ride;
  onNewRide: () => void;
}

export default function RideSummaryView({ ride, onNewRide }: RideSummaryViewProps) {
  const duration = ride.startTime && ride.endTime ? 
    Math.round((ride.endTime.getTime() - ride.startTime.getTime()) / 60000) : 0;
  
  const wasHighRisk = ride.riskScore > 50 || ride.status === 'emergency';

  return (
    <div className="flex flex-col items-center justify-center space-y-6">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader className="text-center">
          <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
          <CardTitle className="font-headline text-2xl mt-4">Ride Completed</CardTitle>
          <CardDescription>Here is the summary of your recent trip.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="flex items-center gap-4">
            <MapPin className="h-6 w-6 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">From</p>
              <p className="font-medium">{ride.startLocation}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <MapPin className="h-6 w-6 text-accent" />
            <div>
              <p className="text-sm text-muted-foreground">To</p>
              <p className="font-medium">{ride.destination}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Clock className="h-6 w-6 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Duration</p>
              <p className="font-medium">{duration} minutes</p>
            </div>
          </div>
           <div className="flex items-center gap-4">
            <AlertTriangle className="h-6 w-6 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Final Risk Score</p>
              <p className="font-medium">{ride.riskScore}</p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={onNewRide} className="w-full">
            Start a New Ride
          </Button>
        </CardFooter>
      </Card>
      
      {wasHighRisk && (
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline">
              <LifeBuoy className="h-5 w-5 text-primary" />
              Post-Incident Support
            </CardTitle>
            <CardDescription>
              We're here to help. Here are some resources that might be useful.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2">
            <Button variant="outline" className="justify-start">
              <BookUser className="mr-2" />
              Contact a Support Counselor
            </Button>
            <Button variant="outline" className="justify-start">
              <ShieldQuestion className="mr-2" />
              Get Legal Assistance Information
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="w-full max-w-2xl">
        <SuggestRouteCard ride={ride} />
      </div>
    </div>
  );
}
