'use client';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function SilentChat() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Silent Chat</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-48 w-full rounded-md border p-4">
            <div className="space-y-4">
                <div className="flex justify-end">
                    <p className="max-w-xs rounded-lg bg-primary px-4 py-2 text-primary-foreground">
                        This is Responder. Are you safe? Please respond if possible.
                    </p>
                </div>
                <div className="flex justify-start">
                     <p className="max-w-xs rounded-lg bg-muted px-4 py-2">
                        Yes. Car took a wrong turn.
                    </p>
                </div>
            </div>
        </ScrollArea>
        <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
            <Button variant="outline" size="sm" suppressHydrationWarning>Are you safe?</Button>
            <Button variant="outline" size="sm" suppressHydrationWarning>Help is on the way.</Button>
            <Button variant="outline" size="sm" suppressHydrationWarning>Can you share details?</Button>
            <Button variant="outline" size="sm" suppressHydrationWarning>Stay on the line.</Button>
        </div>
      </CardContent>
       <CardFooter className="flex gap-2">
            <Input placeholder="Type your message..." suppressHydrationWarning/>
            <Button suppressHydrationWarning><Send className="h-4 w-4" /></Button>
        </CardFooter>
    </Card>
  );
}
