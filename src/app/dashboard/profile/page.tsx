'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { useAuth } from '@/context/auth-provider';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getInitials } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  if (!user) {
    // This can happen briefly on logout or if accessed directly without being logged in
    return null;
  }
  
  return (
    <Card className="mx-auto w-full max-w-2xl">
      <CardHeader className="text-center">
        <Avatar className="mx-auto mb-4 h-24 w-24">
          <AvatarImage src={user.avatarUrl} alt={user.name} data-ai-hint="person face" />
          <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
        </Avatar>
        <CardTitle className="font-headline text-3xl">{user.name}</CardTitle>
        <CardDescription>{user.email}</CardDescription>
        <Badge className="capitalize mx-auto mt-2" variant="secondary">{user.role}</Badge>
      </CardHeader>
      <CardContent className="space-x-2 border-t pt-6 text-center">
         <Button variant="outline" onClick={() => router.push('/dashboard/settings')}>Edit Profile</Button>
         <Button variant="link" className="text-destructive hover:no-underline" onClick={logout}>Log Out</Button>
      </CardContent>
    </Card>
  );
}
