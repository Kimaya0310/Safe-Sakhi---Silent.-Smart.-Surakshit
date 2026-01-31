'use client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PhoneCall, Map, Share2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';


export default function QuickActions() {
    const { toast } = useToast();

    const handleAction = (action: string) => {
        toast({
            title: "Action Triggered",
            description: `${action} action has been initiated (simulation).`
        });
    }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-2">
        <Button onClick={() => handleAction('Call emergency services')} suppressHydrationWarning>
            <PhoneCall className="mr-2 h-4 w-4" /> Call Emergency Services
        </Button>
        <Button onClick={() => handleAction('Navigate to passenger')} variant="secondary" suppressHydrationWarning>
            <Map className="mr-2 h-4 w-4" /> Navigate to Passenger
        </Button>
         <Button onClick={() => handleAction('Share live location')} variant="secondary" suppressHydrationWarning>
            <Share2 className="mr-2 h-4 w-4" /> Share Live Location
        </Button>
      </CardContent>
    </Card>
  );
}
