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
export interface AuthContextType {
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
export function AuthProvider({ children }: { children: React.ReactNode }): React.ReactElement {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const loginMutation = useLoginMutation();
  const registerMutation = useRegisterMutation();
  const logoutMutation = useLogoutMutation();

  const refreshSession = useCallback(async () => {
    try {
      const { data: { session: newSession } } = await supabase.auth.getSession();
      setSession(newSession);
      setUser(newSession?.user ?? null);
    } catch (error) {
      console.error('Error refreshing session:', error);
      setUser(null);
      setSession(null);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    const authListener = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      if (isMounted) {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setLoading(false);
      }
    });

    // Initial session check
    const checkSession = async () => {
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      if (isMounted) {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setLoading(false);
      }
    };

    checkSession();

    return () => {
      isMounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Memoized context value to prevent unnecessary re-renders
  const value: AuthContextType = useMemo(() => ({
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
    <AuthContext.Provider value={value}>
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
