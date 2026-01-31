'use client';
import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

type Message = {
    text: string;
    sender: 'responder' | 'passenger';
};

const quickReplies = [
    'Are you safe?',
    'Help is on the way.',
    'Can you share details?',
    'Stay on the line.',
]

export default function SilentChat() {
  const [messages, setMessages] = useState<Message[]>([
    { text: 'This is Responder. Are you safe? Please respond if possible.', sender: 'responder'},
    { text: 'Yes. Car took a wrong turn.', sender: 'passenger' }
  ]);
  const [inputValue, setInputValue] = useState('');

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;
    setMessages(prev => [...prev, { text, sender: 'responder' }]);
    setInputValue('');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Silent Chat</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-48 w-full rounded-md border p-4">
            <div className="space-y-4">
                {messages.map((msg, index) => (
                     <div key={index} className={`flex ${msg.sender === 'responder' ? 'justify-end' : 'justify-start'}`}>
                        <p className={`max-w-xs rounded-lg px-4 py-2 ${msg.sender === 'responder' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                           {msg.text}
                        </p>
                    </div>
                ))}
            </div>
        </ScrollArea>
        <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
            {quickReplies.map(reply => (
                <Button key={reply} variant="outline" size="sm" onClick={() => handleSendMessage(reply)}>
                    {reply}
                </Button>
            ))}
        </div>
      </CardContent>
       <CardFooter className="flex gap-2">
            <Input 
                placeholder="Type your message..." 
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSendMessage(inputValue)}
            />
            <Button onClick={() => handleSendMessage(inputValue)}><Send className="h-4 w-4" /></Button>
        </CardFooter>
    </Card>
  );
}
