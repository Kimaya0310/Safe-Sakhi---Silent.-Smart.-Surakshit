'use client';

import type { Alert } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, User, Phone, MapPin, Clock, ShieldAlert } from 'lucide-react';
import Image from 'next/image';
import placeholderData from '@/lib/placeholder-images.json';
import { useAuth } from '@/context/auth-provider';
import SummarizeRideCard from '../authority/summarize-ride-card';
import { useAppState } from '@/context/app-state-provider';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

interface AlertDetailsViewProps {
  alert: Alert;
  onBack: () => void;
  isAuthority?: boolean;
}

export default function AlertDetailsView({ alert, onBack, isAuthority = false }: AlertDetailsViewProps) {
  const mapPlaceholder = placeholderData.placeholderImages.find(p => p.id === 'map-placeholder');
  const { user } = useAuth();
  const { resolveAlert } = useAppState();

  const handleResolve = () => {
    resolveAlert(alert.alertId);
    onBack();
  }
  
  return (
    <div className="space-y-6">
       <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to List
        </Button>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card className="h-full shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline text-2xl">Live Tracking</CardTitle>
              <CardDescription>
                Live location of ride <span className="font-bold text-primary">{alert.ride.rideId}</span>
              </CardDescription>
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
          </Card>
        </div>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Case Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
                <div className="flex items-center gap-3">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>Passenger: <span className="font-medium">{alert.passenger.name}</span></span>
                </div>
                <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>Contact: <span className="font-medium">{alert.passenger.phone}</span></span>
                </div>
                 <div className="flex items-center gap-3">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>Triggered: <span className="font-medium">{format(alert.triggeredAt, 'PPpp')}</span></span>
                </div>
                 <div className="flex items-center gap-3">
                    <ShieldAlert className="h-4 w-4 text-muted-foreground" />
                     <span>Risk Score: <Badge variant="destructive">{alert.riskScore}</Badge></span>
                </div>
                <div className="flex items-start gap-3">
                    <MapPin className="h-4 w-4 mt-1 text-muted-foreground" />
                    <div>
                        <p>From: <span className="font-medium">{alert.ride.startLocation}</span></p>
                        <p>To: <span className="font-medium">{alert.ride.destination}</span></p>
                    </div>
                </div>
            </CardContent>
          </Card>
           {user?.role === 'authority' && <SummarizeRideCard ride={alert.ride} />}
           {alert.status !== 'resolved' && (
               <Button onClick={handleResolve} className="w-full">
                  Mark as Resolved
               </Button>
           )}
        </div>
      </div>
    </div>
  );
}
