'use client';
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Phone, Mic, Speaker, PhoneOff } from 'lucide-react';
import { getInitials } from '@/lib/utils';

type CallType = 'Family' | 'Friend' | 'Authority';

interface FakeCallViewProps {
  callerName: string;
  callerType: CallType;
  onEndCall: () => void;
}

export default function FakeCallView({ callerName, callerType, onEndCall }: FakeCallViewProps) {
  const [callDuration, setCallDuration] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);
    // This is a fake call, so we don't need real audio.
    // In a real app, you might play a pre-recorded audio file.
    return () => clearInterval(timer);
  }, []);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-sm">
      <Card className="w-full max-w-sm text-center shadow-2xl">
        <CardContent className="p-8 space-y-6">
          <div className="space-y-4 pt-8">
            <Avatar className="h-28 w-28 mx-auto border-4 border-primary">
              <AvatarImage src={`https://picsum.photos/seed/${callerName}/200`} data-ai-hint="person face" />
              <AvatarFallback>{getInitials(callerName)}</AvatarFallback>
            </Avatar>
            <div >
              <p className="font-headline text-3xl">{callerName}</p>
              <p className="text-muted-foreground">Incoming call...</p>
            </div>
          </div>

          <p className="text-lg font-mono text-muted-foreground">{formatDuration(callDuration)}</p>

          <div className="grid grid-cols-3 gap-4 text-muted-foreground">
            <div className="flex flex-col items-center gap-1">
              <Button variant="outline" size="icon" className="h-14 w-14 rounded-full bg-muted/50">
                <Mic className="h-6 w-6" />
              </Button>
              <span className="text-xs">Mute</span>
            </div>
             <div className="flex flex-col items-center gap-1">
              <Button variant="outline" size="icon" className="h-14 w-14 rounded-full bg-muted/50">
                <Speaker className="h-6 w-6" />
              </Button>
               <span className="text-xs">Speaker</span>
            </div>
             <div className="flex flex-col items-center gap-1">
              <Button variant="outline" size="icon" className="h-14 w-14 rounded-full bg-muted/50">
                <Phone className="h-6 w-6" />
              </Button>
               <span className="text-xs">Add Call</span>
            </div>
          </div>
          
          <Button variant="destructive" size="lg" className="w-20 h-20 rounded-full mx-auto" onClick={onEndCall}>
            <PhoneOff className="h-8 w-8" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
