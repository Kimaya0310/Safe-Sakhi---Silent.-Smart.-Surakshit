'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/auth-provider';
import { UserPlus, Trash2, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function EmergencyContactsPage() {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const [contacts, setContacts] = useState<string[]>(user?.emergencyContacts || []);

  const handleContactChange = (index: number, value: string) => {
    const newContacts = [...contacts];
    newContacts[index] = value;
    setContacts(newContacts);
  };

  const addContact = () => {
    if (contacts.length >= 5) {
        toast({
            variant: "destructive",
            title: "Limit Reached",
            description: "You can add a maximum of 5 emergency contacts.",
        })
        return;
    }
    setContacts([...contacts, '']);
  };

  const removeContact = (index: number) => {
    const newContacts = contacts.filter((_, i) => i !== index);
    setContacts(newContacts);
  };
  
  const saveContacts = () => {
    if (!user) return;
    const validContacts = contacts.filter(c => c.trim() !== '');
    if (validContacts.length !== contacts.length) {
        toast({
            variant: "destructive",
            title: "Invalid Input",
            description: "Please remove empty contact fields before saving.",
        });
        setContacts(validContacts);
        return;
    }
    updateUser({ emergencyContacts: validContacts });
    toast({
      title: 'Contacts Saved',
      description: 'Your emergency contacts have been updated.',
    });
  };

  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader>
        <CardTitle>Emergency Contacts</CardTitle>
        <CardDescription>Your trusted contacts who will be notified in case of an emergency.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {contacts.map((contact, index) => (
          <div key={index} className="flex items-center gap-2">
            <Input 
              type="tel" 
              value={contact}
              onChange={(e) => handleContactChange(index, e.target.value)}
              placeholder="Enter phone number" 
              className="flex-grow"
            />
            <Button variant="ghost" size="icon" onClick={() => removeContact(index)}>
              <Trash2 className="h-4 w-4 text-destructive"/>
            </Button>
          </div>
        ))}
        {contacts.length === 0 && (
          <p className="text-sm text-muted-foreground">You haven't added any emergency contacts yet.</p>
        )}
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-6">
        <Button onClick={addContact} variant="outline">
          <UserPlus className="mr-2 h-4 w-4" />
          Add New Contact
        </Button>
        <Button onClick={saveContacts}>
          <Save className="mr-2 h-4 w-4" />
          Save Contacts
        </Button>
      </CardFooter>
    </Card>
  );
}
