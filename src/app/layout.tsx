import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/context/auth-provider';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { initializeFirebase } from '@/firebase/server';

const fontInter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const fontSpaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
});

export const metadata: Metadata = {
  title: 'Safe Sakhi – Silent, Smart, Surakshit',
  description: 'A Firebase-powered real-time safety application for women.',
};

const { firebaseApp, firestore, auth } = initializeFirebase();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;700&display=swap" rel="stylesheet" />
      </head>
      <body
        className={cn(
          'min-h-screen bg-background font-body antialiased',
          fontInter.variable,
          fontSpaceGrotesk.variable
        )}
      >
        {firebaseApp && auth && firestore ? (
          <FirebaseClientProvider
            firebaseApp={firebaseApp}
            firestore={firestore}
            auth={auth}
          >
            <AuthProvider>
              {children}
              <Toaster />
            </AuthProvider>
          </FirebaseClientProvider>
        ) : (
          <div className="flex h-screen w-full items-center justify-center p-4">
            <div className="w-full max-w-lg rounded-lg border border-destructive bg-card p-8 text-center shadow-2xl">
              <h1 className="font-headline text-2xl font-bold text-destructive">
                Firebase Configuration Missing
              </h1>
              <p className="mt-2 text-muted-foreground">
                The application cannot start because it is not configured to connect to Firebase.
              </p>
              <p className="mt-4 text-sm text-muted-foreground">
                Please ensure your Firebase project configuration variables (e.g., API Key, Project ID) are correctly set up in your environment.
              </p>
            </div>
          </div>
        )}
      </body>
    </html>
  );
}
