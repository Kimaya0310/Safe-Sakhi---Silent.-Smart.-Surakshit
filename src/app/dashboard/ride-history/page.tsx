'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useAppState } from '@/context/app-state-provider';
import { useAuth } from '@/context/auth-provider';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function RideHistoryPage() {
  const { rides } = useAppState();
  const { user } = useAuth();
  const router = useRouter();
  
  const userRides = rides.filter(ride => ride.passengerId === user?.id && ride.status === 'completed');

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ride History</CardTitle>
        <CardDescription>A list of your past rides.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>From</TableHead>
              <TableHead>To</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {userRides.length > 0 ? userRides.map((ride) => (
              <TableRow key={ride.rideId}>
                <TableCell>{ride.startTime ? format(ride.startTime, 'PPP') : 'N/A'}</TableCell>
                <TableCell>{ride.startLocation}</TableCell>
                <TableCell>{ride.destination}</TableCell>
                <TableCell><Badge variant="default">{ride.status}</Badge></TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center">No completed rides found.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter>
        <Button onClick={() => router.push('/dashboard')}>Start a New Ride</Button>
      </CardFooter>
    </Card>
  );
}
