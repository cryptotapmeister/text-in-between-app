'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChange, getCurrentUser } from '@/lib/supabase/client';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    getCurrentUser().then((user) => {
      setUser(user);
      setLoading(false);
    }).catch((error) => {
      console.error('Auth initialization error:', error);
      setLoading(false);
    });

    // Listen for auth changes
    try {
      const authListener = onAuthStateChange((event, session) => {
        setUser(session?.user || null);
        setLoading(false);
      });

      // Check if we got a valid listener
      if (authListener?.data?.subscription) {
        return () => authListener.data.subscription.unsubscribe();
      }
    } catch (error) {
      console.error('Auth listener setup error:', error);
      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 