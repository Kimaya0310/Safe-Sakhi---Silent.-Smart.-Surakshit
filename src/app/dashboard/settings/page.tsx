'use client';
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/auth-provider';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Hand } from 'lucide-react';

export default function SettingsPage() {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();

  const [name, setName] = useState('');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [isGestureSosEnabled, setIsGestureSosEnabled] = useState(true);
  const [gestureSensitivity, setGestureSensitivity] = useState<'low' | 'medium' | 'high'>('medium');

  useEffect(() => {
    if (user) {
      setName(user.name || '');
    }
  }, [user]);

  const handleSaveChanges = async () => {
    if (!user) return;
    await updateUser({ name });
    // In a real app, you'd also save notification and gesture settings to a backend.
    toast({
      title: 'Settings Saved',
      description: 'Your profile and notification settings have been updated.',
    });
  };
  
  return (
    <div className="mx-auto grid max-w-4xl gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile Settings</CardTitle>
          <CardDescription>Update your personal information.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
           <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" defaultValue={user?.email} disabled />
          </div>
          <Button onClick={handleSaveChanges}>Save Changes</Button>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Notification Settings</CardTitle>
          <CardDescription>Manage how you receive notifications.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
           <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="email-notifications">Email Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive updates via email.</p>
              </div>
              <Switch 
                id="email-notifications" 
                checked={emailNotifications}
                onCheckedChange={setEmailNotifications}
              />
            </div>
             <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="sms-notifications">SMS Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive critical alerts via SMS.</p>
              </div>
              <Switch 
                id="sms-notifications"
                checked={smsNotifications}
                onCheckedChange={setSmsNotifications}
              />
            </div>
        </CardContent>
      </Card>

      {user?.role === 'passenger' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Hand className="h-5 w-5" />
              Gesture SOS Settings
            </CardTitle>
            <CardDescription>
              Trigger an emergency alert by shaking your phone. This requires native device access and is simulated here.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="gesture-sos-enabled">Enable Gesture SOS</Label>
                <p className="text-sm text-muted-foreground">
                  Allow triggering alerts with a physical gesture.
                </p>
              </div>
              <Switch
                id="gesture-sos-enabled"
                checked={isGestureSosEnabled}
                onCheckedChange={setIsGestureSosEnabled}
              />
            </div>
            <div className="space-y-2">
              <Label>Sensitivity Level</Label>
              <p className="text-sm text-muted-foreground">
                Set how sensitive the gesture detection should be.
              </p>
              <RadioGroup
                defaultValue={gestureSensitivity}
                onValueChange={(value: 'low' | 'medium' | 'high') => setGestureSensitivity(value)}
                className="grid grid-cols-3 gap-4 pt-2"
                disabled={!isGestureSosEnabled}
              >
                <div>
                  <RadioGroupItem value="low" id="sensitivity-low" className="peer sr-only" />
                  <Label htmlFor="sensitivity-low" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                    Low
                  </Label>
                </div>
                <div>
                  <RadioGroupItem value="medium" id="sensitivity-medium" className="peer sr-only" />
                  <Label htmlFor="sensitivity-medium" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                    Medium
                  </Label>
                </div>
                <div>
                  <RadioGroupItem value="high" id="sensitivity-high" className="peer sr-only" />
                  <Label htmlFor="sensitivity-high" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                    High
                  </Label>
                </div>
              </RadioGroup>
            </div>
            <Button onClick={handleSaveChanges}>Save Gesture Settings</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
