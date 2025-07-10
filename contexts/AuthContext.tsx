import React, { createContext, useState, useContext, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { getSupabase } from '@/lib/supabase';

interface AuthContextData {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  forgotPassword: (email: string) => Promise<{ error: Error | null }>;
  updatePassword: (newPassword: string) => Promise<{ error: Error | null }>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const supabase = getSupabase();
        if (!supabase) {
          console.warn('Supabase client not available, continuing without auth');
          setLoading(false);
          return;
        }

        // Check active sessions and sets the user
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
        } else {
          setSession(session);
          setUser(session?.user ?? null);
        }

        // Listen for changes on auth state (signed in, signed out, etc.)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
          setSession(session);
          setUser(session?.user ?? null);
        });

        setLoading(false);

        return () => subscription.unsubscribe();
      } catch (error) {
        console.error('Error initializing auth:', error);
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const signUp = async (email: string, password: string) => {
    try {
      const supabase = getSupabase();
      if (!supabase) {
        throw new Error('Supabase client not initialized');
      }

      const { error } = await supabase.auth.signUp({
        email,
        password,
      });
      return { error };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const supabase = getSupabase();
      if (!supabase) {
        throw new Error('Supabase client not initialized');
      }

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { error };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    try {
      const supabase = getSupabase();
      if (!supabase) {
        throw new Error('Supabase client not initialized');
      }

      await supabase.auth.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      const supabase = getSupabase();
      if (!supabase) {
        throw new Error('Supabase client not initialized');
      }

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'one-o-one-fitness://reset-password',
      });
      return { error };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const updatePassword = async (newPassword: string) => {
    try {
      const supabase = getSupabase();
      if (!supabase) {
        throw new Error('Supabase client not initialized');
      }

      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      return { error };
    } catch (error) {
      return { error: error as Error };
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      loading,
      signUp,
      signIn,
      signOut,
      forgotPassword,
      updatePassword,
    }}>
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