'use client';
import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/auth-provider';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';

export default function SettingsPage() {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();

  const [name, setName] = useState(user?.name || '');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);

  const handleSaveChanges = () => {
    if (!user) return;
    updateUser({ name });
    // In a real app, you'd also save notification settings to a backend.
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
    </div>
  );
}
