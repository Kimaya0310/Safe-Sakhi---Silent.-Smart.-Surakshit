'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import type { User, UserRole } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { useAuth as useFirebaseAuth, useFirestore } from '@/firebase';
import {
  onAuthStateChanged,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  type Auth,
  type User as FirebaseUser,
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { convertTimestamps } from '@/lib/utils';

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  signup: (name: string, email: string, password: string, role: UserRole, consentToMonitoring?: boolean) => Promise<void>;
  logout: () => void;
  loading: boolean;
  updateUser: (updatedUser: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const auth = useFirebaseAuth();
  const firestore = useFirestore();
  const { toast } = useToast();

  useEffect(() => {
    if (!auth) return;
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        setFirebaseUser(fbUser);
        const userDoc = await getDoc(doc(firestore, 'users', fbUser.uid));
        if (userDoc.exists()) {
          const userData = convertTimestamps({ id: userDoc.id, ...userDoc.data() });
          setUser(userData as User);
        }
      } else {
        setFirebaseUser(null);
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth, firestore]);

  const login = async (email: string, password: string, role: UserRole) => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userDoc = await getDoc(doc(firestore, 'users', userCredential.user.uid));

      if (userDoc.exists() && userDoc.data().role === role) {
        const userData = convertTimestamps({ id: userDoc.id, ...userDoc.data() });
        setUser(userData as User);
        router.push('/dashboard');
      } else if (userDoc.exists()) {
        throw new Error(`You are not registered as a ${role}.`);
      } 
      else {
        throw new Error('No user profile found.');
      }
    } catch (error: any) {
      console.error("Login error:", error);
      let description = "An unknown error occurred.";
      if (error.code === 'auth/invalid-credential') {
        description = "The email or password you entered is incorrect. Please double-check your credentials or sign up for a new account.";
      } else {
        description = error.message;
      }
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: description,
      });
    } finally {
      setLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string, role: UserRole, consentToMonitoring?: boolean) => {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const newUser: Omit<User, 'id'> = {
        name,
        email,
        role,
        avatarUrl: `https://picsum.photos/seed/${userCredential.user.uid}/200`,
        emergencyContacts: [],
        ...(role === 'passenger' && { consentToMonitoring: consentToMonitoring }),
      };
      await setDoc(doc(firestore, 'users', userCredential.user.uid), newUser);
      setUser({ id: userCredential.user.uid, ...newUser });
      router.push('/dashboard');
    } catch (error: any) {
      console.error("Signup error:", error);
      toast({
        variant: "destructive",
        title: "Signup Failed",
        description: error.message || "Could not create account.",
      });
    } finally {
      setLoading(false);
    }
  }

  const logout = async () => {
    setLoading(true);
    await signOut(auth);
    setUser(null);
    setFirebaseUser(null);
    setLoading(false);
    router.push('/');
  };

  const updateUser = async (updatedUserData: Partial<User>) => {
    if (!user?.id) return;
    try {
      const userRef = doc(firestore, 'users', user.id);
      await updateDoc(userRef, updatedUserData);
      setUser(currentUser => currentUser ? { ...currentUser, ...updatedUserData } : null);
    } catch (error: any) {
      console.error("Update user error:", error);
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: "Could not save your changes.",
      });
    }
  };

  const value = { user, firebaseUser, login, signup, logout, loading, updateUser };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
