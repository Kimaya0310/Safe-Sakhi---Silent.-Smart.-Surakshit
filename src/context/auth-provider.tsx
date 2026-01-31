'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { User, UserRole } from '@/lib/types';
import { mockUsers } from '@/lib/data';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  login: (email: string, role: UserRole) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const login = (email: string, role: UserRole) => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      const foundUser = mockUsers.find(
        (u) => u.email === email && u.role === role
      );
      if (foundUser) {
        setUser(foundUser);
        router.push('/dashboard');
      } else {
        // For MVP, we'll just log in the first user of the selected role if not found
        const fallbackUser = mockUsers.find((u) => u.role === role);
        setUser(fallbackUser || null);
        router.push('/dashboard');
      }
      setLoading(false);
    }, 500);
  };

  const logout = () => {
    setUser(null);
    router.push('/');
  };

  const value = { user, login, logout, loading };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
