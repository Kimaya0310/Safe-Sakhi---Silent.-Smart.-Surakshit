'use client';

import { useEffect } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { useToast } from '@/hooks/use-toast';

export default function FirebaseErrorListener() {
  const { toast } = useToast();

  useEffect(() => {
    const handlePermissionError = (error: FirestorePermissionError) => {
      console.error(error); // Log the full error for debugging
      
      // In a production environment, you might not want to show such a detailed error to the user.
      // For this dev environment, we will use a toast to make it visible.
      toast({
        variant: "destructive",
        title: "Firestore Permission Error",
        description: "Check the console for details about the security rule violation.",
        duration: 10000,
      });

      // You could also throw the error to let an error boundary catch it,
      // which might be better for development visibility.
      // throw error;
    };

    errorEmitter.on('permission-error', handlePermissionError);

    return () => {
      errorEmitter.off('permission-error', handlePermissionError);
    };
  }, [toast]);

  return null; // This component does not render anything
}
