'use client';
import type { Ride } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, MapPin, Flag } from 'lucide-react';

interface IncidentTimelineProps {
  ride: Ride;
}

export default function IncidentTimeline({ ride }: IncidentTimelineProps) {
    const events = [
        { type: 'start', timestamp: ride.startTime, description: `Ride started from ${ride.startLocation}` },
        ...ride.riskEvents.map(re => ({ type: 'risk', timestamp: re.timestamp, description: re.description })),
        { type: 'end', timestamp: ride.endTime, description: `Ride ended at ${ride.destination}` },
    ].filter(e => e.timestamp).sort((a,b) => a.timestamp!.getTime() - b.timestamp!.getTime());

  return (
    <Card>
      <CardHeader>
        <CardTitle>Incident Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative pl-6">
          <div className="absolute left-[30px] h-full w-0.5 bg-border -translate-x-1/2"></div>
          <ul className="space-y-8">
            {events.map((event, index) => (
              <li key={index} className="flex items-start gap-4">
                <div className="absolute left-[30px] z-10 flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full bg-card ring-4 ring-card">
                  {event.type === 'start' && <MapPin className="h-4 w-4 text-primary" />}
                  {event.type === 'risk' && <AlertTriangle className="h-4 w-4 text-destructive" />}
                  {event.type === 'end' && <Flag className="h-4 w-4 text-green-500" />}
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">{event.description}</p>
                  <p className="text-xs text-muted-foreground">{new Date(event.timestamp!).toLocaleTimeString()}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
