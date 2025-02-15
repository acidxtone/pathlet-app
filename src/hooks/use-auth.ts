import { useState, useEffect, useContext, createContext, useMemo, useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Session, User, AuthError } from '@supabase/supabase-js';
import { insertUserSchema } from '@/shared/schema';
import { z } from 'zod';

// Custom error class for authentication
class AuthenticationError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'AuthenticationError';
  }
}

// Define authentication context type with more robust typing
interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  loading: boolean;
  loginMutation: ReturnType<typeof useLoginMutation>;
  registerMutation: ReturnType<typeof useRegisterMutation>;
  logoutMutation: ReturnType<typeof useLogoutMutation>;
  refreshSession: () => Promise<void>;
}

// Create authentication context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom login mutation with enhanced error handling
function useLoginMutation() {
  return useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        // Transform Supabase error into our custom error
        throw new AuthenticationError(
          error.message, 
          error.code ?? 'LOGIN_FAILED'
        );
      }
      
      return data;
    },
    onError: (error: AuthenticationError) => {
      console.error('Login failed:', {
        message: error.message,
        code: error.code
      });
      // Potential: send error to monitoring service
    }
  });
}

// Custom register mutation with enhanced validation
function useRegisterMutation() {
  return useMutation({
    mutationFn: async (userData: z.infer<typeof insertUserSchema>) => {
      const { username, email, password } = userData;
      
      // Additional client-side validation
      try {
        insertUserSchema.parse(userData);
      } catch (validationError) {
        throw new AuthenticationError(
          'Invalid user data', 
          'VALIDATION_ERROR'
        );
      }
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { username }
        }
      });

      if (error) {
        throw new AuthenticationError(
          error.message, 
          error.code ?? 'REGISTRATION_FAILED'
        );
      }
      
      return data;
    },
    onError: (error: AuthenticationError) => {
      console.error('Registration failed:', {
        message: error.message,
        code: error.code
      });
    }
  });
}

// Custom logout mutation
function useLogoutMutation() {
  return useMutation({
    mutationFn: async () => {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw new AuthenticationError(
          error.message, 
          'LOGOUT_FAILED'
        );
      }
    },
    onError: (error: AuthenticationError) => {
      console.error('Logout failed:', {
        message: error.message,
        code: error.code
      });
    }
  });
}

// Authentication provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Memoized mutations to prevent unnecessary re-renders
  const loginMutation = useLoginMutation();
  const registerMutation = useRegisterMutation();
  const logoutMutation = useLogoutMutation();

  // Callback to refresh session
  const refreshSession = useCallback(async () => {
    try {
      const { data: { session: freshSession } } = await supabase.auth.getSession();
      setSession(freshSession);
      setUser(freshSession?.user ?? null);
    } catch (error) {
      console.error('Session refresh failed', error);
      setUser(null);
      setSession(null);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    // Get current session on mount
    async function getSession() {
      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        if (isMounted) {
          setSession(initialSession);
          setUser(initialSession?.user ?? null);
          setLoading(false);
        }
      } catch (error) {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    // Listen for authentication state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (isMounted) {
          setSession(session);
          setUser(session?.user ?? null);
          setLoading(false);
        }
      }
    );

    getSession();

    // Cleanup subscription
    return () => {
      isMounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Memoized context value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    user,
    session,
    isAuthenticated: !!user,
    loading,
    loginMutation,
    registerMutation,
    logoutMutation,
    refreshSession
  }), [user, session, loading, loginMutation, registerMutation, logoutMutation, refreshSession]);

  return (
    <AuthContext.Provider value={value as AuthContextType}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use authentication context
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
