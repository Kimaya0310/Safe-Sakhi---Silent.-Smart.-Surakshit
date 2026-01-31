'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MapPin, ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/auth-provider';

const formSchema = z.object({
  startLocation: z.string().min(3, 'Please enter a valid start location.'),
  destination: z.string().min(3, 'Please enter a valid destination.'),
});

interface StartRideFormProps {
  onStartRide: (startLocation: string, destination: string) => void;
}

export default function StartRideForm({ onStartRide }: StartRideFormProps) {
  const { user } = useAuth();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      startLocation: '',
      destination: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    onStartRide(values.startLocation, values.destination);
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <Card className="w-full max-w-lg shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">
            Hello, {user?.name.split(' ')[0]}!
          </CardTitle>
          <CardDescription>
            Where are you heading today? Let's make your journey safe.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="startLocation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-primary" />
                      Start Location
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Koramangala, Bengaluru" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="destination"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-accent" />
                      Destination
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Indiranagar, Bengaluru" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full">
                Start Secure Ride <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
