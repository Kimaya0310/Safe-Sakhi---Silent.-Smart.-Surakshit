'use client';
import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { SlidersHorizontal } from 'lucide-react';

type Zone = 'North' | 'South' | 'East' | 'West' | 'Central';

const initialConfig = {
    'North': { deviation: 60, stopDuration: 70 },
    'South': { deviation: 50, stopDuration: 60 },
    'East': { deviation: 55, stopDuration: 65 },
    'West': { deviation: 45, stopDuration: 55 },
    'Central': { deviation: 40, stopDuration: 50 },
}

export default function SystemConfigPage() {
    const { toast } = useToast();
    const [selectedZone, setSelectedZone] = useState<Zone>('North');
    const [config, setConfig] = useState(initialConfig);

    const handleSliderChange = (type: 'deviation' | 'stopDuration', value: number[]) => {
        setConfig(prev => ({
            ...prev,
            [selectedZone]: {
                ...prev[selectedZone],
                [type]: value[0],
            }
        }))
    }

    const handleSaveChanges = () => {
        // In a real app, this would be an API call to a backend service.
        toast({
            title: "Configuration Saved",
            description: `Risk thresholds for ${selectedZone} zone have been updated (simulation).`,
        });
    }

  return (
    <div className="space-y-6">
        <div className="flex items-center gap-4">
            <SlidersHorizontal className="h-8 w-8" />
            <div>
                 <h1 className="text-3xl font-bold font-headline">System Configuration</h1>
                 <p className="text-muted-foreground">Adjust system-wide parameters and risk thresholds.</p>
            </div>
        </div>
      
        <Card>
            <CardHeader>
                <CardTitle>Risk Thresholds by Zone</CardTitle>
                <CardDescription>
                    Fine-tune risk sensitivity for different geographical zones. 
                    Higher values mean lower sensitivity (i.e., it takes more to trigger an alert).
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="max-w-xs space-y-2">
                    <Label htmlFor="zone-select">Select Zone</Label>
                    <Select value={selectedZone} onValueChange={(v) => setSelectedZone(v as Zone)}>
                        <SelectTrigger id="zone-select">
                            <SelectValue placeholder="Select a zone" />
                        </SelectTrigger>
                        <SelectContent>
                            {Object.keys(config).map(zone => (
                                <SelectItem key={zone} value={zone}>{zone} Zone</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-4 rounded-md border p-4">
                    <h3 className="font-medium">Thresholds for {selectedZone} Zone</h3>
                    <div className="space-y-2">
                        <Label>Deviation Sensitivity ({config[selectedZone].deviation})</Label>
                        <Slider 
                            value={[config[selectedZone].deviation]} 
                            onValueChange={(val) => handleSliderChange('deviation', val)}
                            max={100} 
                            step={5} 
                        />
                         <p className="text-xs text-muted-foreground">Controls how much of a route deviation is tolerated.</p>
                    </div>
                     <div className="space-y-2">
                        <Label>Stop Duration Threshold ({config[selectedZone].stopDuration})</Label>
                        <Slider
                            value={[config[selectedZone].stopDuration]}
                            onValueChange={(val) => handleSliderChange('stopDuration', val)}
                            max={100}
                            step={5}
                        />
                         <p className="text-xs text-muted-foreground">Controls how long a stop is tolerated before raising risk.</p>
                    </div>
                </div>

                <Button onClick={handleSaveChanges}>Save Changes for {selectedZone} Zone</Button>
            </CardContent>
        </Card>
    </div>
  );
}
