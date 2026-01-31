'use client';

import React, { useState, useEffect, useRef } from 'react';
import type { Ride, RiskEvent } from '@/lib/types';
import { useAppState } from '@/context/app-state-provider';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { AlertTriangle, MapPin, Shield, ShieldCheck, ShieldAlert, PhoneOff } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import placeholderData from '@/lib/placeholder-images.json';
import { cn } from '@/lib/utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface LiveRideViewProps {
  ride: Ride;
  onEndRide: (ride: Ride) => void;
}

export default function LiveRideView({ ride: initialRide, onEndRide }: LiveRideViewProps) {
  const [ride, setRide] = useState<Ride>(initialRide);
  const [progress, setProgress] = useState(5);
  const { updateRide } = useAppState();
  const isInitialMount = useRef(true);

  const mapPlaceholder = placeholderData.placeholderImages.find(p => p.id === 'map-placeholder');

  useEffect(() => {
    const rideInterval = setInterval(() => {
      setProgress(prev => (prev < 95 ? prev + Math.random() * 5 : prev));
      
      setRide(currentRide => {
        let newRiskScore = currentRide.riskScore;
        let newStatus = currentRide.status;
        const newRiskEvents: RiskEvent[] = [...currentRide.riskEvents];

        // Simulate random events
        if (Math.random() < 0.1) {
            const eventType = Math.random() < 0.5 ? 'deviation' : 'stop';
            const severity = Math.floor(Math.random() * 3) + 1;
            newRiskScore += severity * 5;
            newRiskEvents.push({
                id: `re_${Date.now()}`,
                rideId: currentRide.rideId,
                eventType,
                severity,
                timestamp: new Date(),
                description: `${eventType.charAt(0).toUpperCase() + eventType.slice(1)} detected.`,
            });
        }
        
        // Decay risk score
        newRiskScore = Math.max(0, newRiskScore - 1);
        
        if (newRiskScore > 60) newStatus = 'emergency';
        else if (newRiskScore > 30) newStatus = 'active'; // could be 'monitoring'
        else newStatus = 'active';

        const updatedRide: Ride = {
            ...currentRide,
            riskScore: Math.round(newRiskScore),
            status: newStatus,
            riskEvents: newRiskEvents,
        };

        return updatedRide;
      });

    }, 3000);

    return () => clearInterval(rideInterval);
  }, []);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      updateRide(ride);
    }
  }, [ride, updateRide]);

  const getStatusInfo = () => {
    if (ride.status === 'emergency') {
      return { icon: ShieldAlert, color: 'text-red-500', text: 'Emergency', badge: 'destructive', progressColor: 'bg-red-500' };
    }
    if (ride.riskScore > 30) {
      return { icon: Shield, color: 'text-yellow-500', text: 'Monitoring', badge: 'secondary', progressColor: 'bg-yellow-500' };
    }
    return { icon: ShieldCheck, color: 'text-green-500', text: 'Safe', badge: 'default', progressColor: 'bg-green-500' };
  };

  const statusInfo = getStatusInfo();

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <Card className="h-full shadow-lg">
           <CardHeader>
                <CardTitle className="font-headline text-2xl">Live Ride Status</CardTitle>
                <CardDescription>Your journey is being silently monitored for your safety.</CardDescription>
           </CardHeader>
           <CardContent>
            {mapPlaceholder && (
              <div className="aspect-video w-full overflow-hidden rounded-lg border">
                <Image
                  src={mapPlaceholder.imageUrl}
                  alt={mapPlaceholder.description}
                  width={1200}
                  height={800}
                  className="h-full w-full object-cover"
                  data-ai-hint={mapPlaceholder.imageHint}
                />
              </div>
            )}
           </CardContent>
           <CardFooter>
              <div className="w-full space-y-2">
                  <div className="flex justify-between text-sm font-medium">
                      <span>{ride.startLocation}</span>
                      <span>{ride.destination}</span>
                  </div>
                  <Progress value={progress} />
                  <p className="text-center text-xs text-muted-foreground">{Math.round(progress)}% of trip completed</p>
              </div>
           </CardFooter>
        </Card>
      </div>

      <div className="space-y-6">
        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Safety Status</CardTitle>
            <statusInfo.icon className={cn("h-4 w-4 text-muted-foreground", statusInfo.color)} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusInfo.text}</div>
            <p className="text-xs text-muted-foreground">
              Risk Score: {ride.riskScore}
            </p>
             <Progress value={ride.riskScore} className="mt-4 h-2 [&>*]:bg-primary" />
          </CardContent>
        </Card>
        
        <Card>
            <CardHeader>
                <CardTitle className="text-lg font-headline">Risk Events</CardTitle>
            </CardHeader>
            <CardContent className="max-h-48 overflow-y-auto">
                {ride.riskEvents.length > 0 ? (
                    <ul className="space-y-2">
                        {ride.riskEvents.map(event => (
                            <li key={event.id} className="flex items-start gap-2 text-sm">
                                <AlertTriangle className="h-4 w-4 mt-0.5 text-yellow-500 shrink-0" />
                                <div>
                                    <span>{event.description}</span>
                                    <span className="ml-2 text-xs text-muted-foreground">({new Date(event.timestamp).toLocaleTimeString()})</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-sm text-muted-foreground">No suspicious events detected.</p>
                )}
            </CardContent>
        </Card>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className="w-full">
              <PhoneOff className="mr-2 h-4 w-4" /> End Ride
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure you want to end the ride?</AlertDialogTitle>
              <AlertDialogDescription>
                This will stop location tracking. Only do this if you have safely reached your destination.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => onEndRide(ride)}>Confirm End Ride</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
