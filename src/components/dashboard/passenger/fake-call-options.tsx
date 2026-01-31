'use client';
import { Button } from '@/components/ui/button';
import { Phone, User, Shield } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger
} from '@/components/ui/dialog';

interface FakeCallOptionsProps {
    onSelectCall: (callerName: string, callerType: 'Family' | 'Friend' | 'Authority') => void;
}

export default function FakeCallOptions({ onSelectCall }: FakeCallOptionsProps) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="secondary" className="w-full">
                    <Phone className="mr-2 h-4 w-4" /> Trigger Fake Call
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Simulate a Call</DialogTitle>
                    <DialogDescription>
                        Choose a call type to simulate. This can help deter suspicious individuals.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <Button variant="outline" onClick={() => onSelectCall('Mom', 'Family')}>
                        <User className="mr-2 h-4 w-4" /> Call from Family
                    </Button>
                    <Button variant="outline" onClick={() => onSelectCall('Priya', 'Friend')}>
                        <User className="mr-2 h-4 w-4" /> Call from a Friend
                    </Button>
                    <Button variant="outline" onClick={() => onSelectCall('Officer Kumar', 'Authority')}>
                        <Shield className="mr-2 h-4 w-4" /> Call from Authority
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
