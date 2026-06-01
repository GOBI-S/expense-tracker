'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for demo user
    const checkDemoUser = () => {
      if (typeof window !== 'undefined') {
        const demoUser = localStorage.getItem('demo_user');
        if (demoUser) {
          try {
            const demoData = JSON.parse(demoUser);
            // Create a mock User object
            setUser({
              uid: demoData.uid,
              displayName: demoData.displayName,
              email: demoData.email,
              photoURL: demoData.photoURL,
            } as User);
            setLoading(false);
            return true;
          } catch (e) {
            localStorage.removeItem('demo_user');
          }
        }
      }
      return false;
    };

    // Check for demo user immediately
    if (checkDemoUser()) {
      return;
    }

    if (!auth) {
      console.warn('Firebase is not initialized. Please configure Firebase in your .env.local file.');
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    // Listen for storage changes (for demo mode)
    const handleStorageChange = () => {
      checkDemoUser();
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      unsubscribe();
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const logout = async () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('demo_user');
    }
    if (auth) {
      try {
        await signOut(auth);
      } catch (error) {
        console.warn('Error signing out:', error);
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
