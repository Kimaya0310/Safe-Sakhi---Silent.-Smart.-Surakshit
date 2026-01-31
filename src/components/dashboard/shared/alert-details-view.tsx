'use client';

import type { Alert } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, User, Phone, MapPin, Clock, ShieldAlert, Info, Download, Send, Hand } from 'lucide-react';
import Image from 'next/image';
import placeholderData from '@/lib/placeholder-images.json';
import { useAuth } from '@/context/auth-provider';
import SummarizeRideCard from '../authority/summarize-ride-card';
import { useAppState } from '@/context/app-state-provider';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import CaseManagementCard from '../authority/case-management-card';
import IncidentTimeline from '../authority/incident-timeline';
import QuickActions from '../responder/quick-actions';
import SilentChat from '../responder/silent-chat';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface AlertDetailsViewProps {
  alert: Alert;
  onBack: () => void;
  isAuthority?: boolean;
}

export default function AlertDetailsView({ alert, onBack, isAuthority = false }: AlertDetailsViewProps) {
  const mapPlaceholder = placeholderData.placeholderImages.find(p => p.id === 'map-placeholder');
  const { user } = useAuth();
  const { updateAlert, rides } = useAppState();
  const { toast } = useToast();

  const handleStatusChange = (status: Alert['status']) => {
    updateAlert({ ...alert, status });
  };
  
  const rideForAlert = rides.find(r => r.rideId === alert.ride.rideId) || alert.ride;

  const handleExport = () => {
    toast({
        title: "Exporting Evidence...",
        description: "A PDF report is being generated for this case (simulation).",
    });
  }

  const isGestureSos = alert.triggerMethod === 'gesture';

  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between">
        <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to List
        </Button>
        {isAuthority && (
            <Button variant="outline" onClick={handleExport}>
                <Download className="mr-2 h-4 w-4" /> Export Evidence
            </Button>
        )}
       </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className={cn("font-headline text-2xl flex items-center gap-2", isGestureSos && "text-destructive")}>
                {isGestureSos && <Hand className="h-6 w-6" />}
                Live Tracking {isGestureSos && "(GESTURE SOS)"}
              </CardTitle>
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
          {isAuthority && <IncidentTimeline ride={rideForAlert} />}
          {!isAuthority && user?.role === 'responder' && <SilentChat />}
        </div>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Case Details</CardTitle>
              <CardDescription>Alert ID: {alert.alertId}</CardDescription>
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
                {alert.triggerReason && (
                  <div className="flex items-center gap-3">
                      <Info className="h-4 w-4 text-muted-foreground" />
                      <span>Reason: <span className="font-medium">{alert.triggerReason}</span></span>
                  </div>
                )}
                {alert.triggerMethod && (
                  <div className="flex items-center gap-3">
                      <Hand className={cn("h-4 w-4 text-muted-foreground", isGestureSos && "text-destructive")} />
                      <span className={cn(isGestureSos && "font-bold text-destructive")}>Method: <span className="font-medium capitalize">{alert.triggerMethod}</span></span>
                  </div>
                )}
                <Separator />
                <div className="flex items-start gap-3">
                    <MapPin className="h-4 w-4 mt-1 text-muted-foreground" />
                    <div>
                        <p>From: <span className="font-medium">{alert.ride.startLocation}</span></p>
                        <p>To: <span className="font-medium">{alert.ride.destination}</span></p>
                    </div>
                </div>
            </CardContent>
          </Card>
           
           {!isAuthority && user?.role === 'responder' && (
            <>
              <QuickActions />
              <Card>
                <CardHeader>
                    <CardTitle>ETA</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-2xl font-bold">12 mins</p>
                    <p className="text-sm text-muted-foreground">~ 3.4 km away</p>
                </CardContent>
              </Card>
            </>
           )}

           {isAuthority && (
            <>
                <CaseManagementCard alert={alert} onStatusChange={handleStatusChange}/>
                <SummarizeRideCard ride={alert.ride} />
            </>
           )}
           
           {isAuthority && alert.deviceInfoSnapshot && (
              <Card>
                <CardHeader>
                  <CardTitle>Device Info</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-1">
                  <p><strong>OS:</strong> {alert.deviceInfoSnapshot.os}</p>
                  <p><strong>App Version:</strong> {alert.deviceInfoSnapshot.appVersion}</p>
                  <p><strong>Network:</strong> {alert.deviceInfoSnapshot.network}</p>
                  <p><strong>SIM Status:</strong> {alert.deviceInfoSnapshot.simStatus}</p>
                </CardContent>
              </Card>
           )}
        </div>
      </div>
    </div>
  );
}
