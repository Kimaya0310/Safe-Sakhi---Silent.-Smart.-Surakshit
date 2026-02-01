import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Timestamp } from "firebase/firestore";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getInitials(name: string): string {
  if (!name) return '';
  const names = name.split(' ');
  const initials = names.map(n => n[0]).join('');
  return initials.toUpperCase();
}

// Helper to convert Firestore Timestamps to JS Dates recursively
export const convertTimestamps = (data: any): any => {
  if (!data) return data;

  if (Array.isArray(data)) {
    return data.map(item => convertTimestamps(item));
  }

  if (typeof data === 'object' && data !== null) {
    if (data instanceof Timestamp) {
      return data.toDate();
    }
    const converted: { [key: string]: any } = {};
    for (const key in data) {
      converted[key] = convertTimestamps(data[key]);
    }
    return converted;
  }
  
  return data;
}
