import { ShieldCheck } from 'lucide-react';
import React from 'react';

export function Logo() {
  return (
    <div className="flex items-center gap-2 text-primary">
      <ShieldCheck className="h-8 w-8" />
      <span className="font-headline text-2xl font-bold tracking-tighter">
        Safe Sakhi
      </span>
    </div>
  );
}
