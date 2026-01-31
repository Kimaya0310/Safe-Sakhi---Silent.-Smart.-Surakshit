'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/auth-provider';
import { UserPlus, Trash2 } from 'lucide-react';

export default function EmergencyContactsPage() {
  const { user } = useAuth();

  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader>
        <CardTitle>Emergency Contacts</CardTitle>
        <CardDescription>Your trusted contacts who will be notified in case of an emergency.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {user?.emergencyContacts?.map((contact, index) => (
          <div key={index} className="flex items-center gap-2">
            <Input type="tel" defaultValue={contact} className="flex-grow"/>
            <Button variant="ghost" size="icon">
              <Trash2 className="h-4 w-4 text-destructive"/>
            </Button>
          </div>
        ))}
        {(!user?.emergencyContacts || user.emergencyContacts.length === 0) && (
          <p className="text-sm text-muted-foreground">You haven't added any emergency contacts yet.</p>
        )}
      </CardContent>
      <CardFooter className="border-t pt-6">
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Add New Contact
        </Button>
      </CardFooter>
    </Card>
  );
}
