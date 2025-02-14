import { createClient } from '@supabase/supabase-js';

// Use environment variables for Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true, // Keep user logged in across browser sessions
    autoRefreshToken: true, // Automatically refresh the token
    detectSessionInUrl: true // Detect OAuth login from magic link or social providers
  }
});

// Enhanced sign-up with additional validation
export async function signUp(email: string, password: string, metadata?: Record<string, any>) {
  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error('Invalid email format');
  }

  // Password strength check
  if (password.length < 8) {
    throw new Error('Password must be at least 8 characters long');
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata // Optional additional user metadata
    }
  });

  if (error) throw error;
  return data;
}

// Sign in with improved error handling
export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    switch (error.message) {
      case 'Invalid login credentials':
        throw new Error('Incorrect email or password');
      case 'Email not confirmed':
        throw new Error('Please confirm your email before logging in');
      default:
        throw error;
    }
  }

  return data;
}

// Send magic link with rate limiting guidance
export async function sendMagicLink(email: string) {
  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: true,
      emailRedirectTo: 'https://yourapp.com/welcome' // Replace with your app's URL
    }
  });

  if (error) {
    if (error.message.includes('rate limit')) {
      throw new Error('Too many magic link requests. Please try again later.');
    }
    throw error;
  }

  return data;
}

// Sign out
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

// Get current user with enhanced information
export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('No user is currently logged in');
  }

  return {
    id: user.id,
    email: user.email,
    emailVerified: user.email_confirmed_at !== null,
    metadata: user.user_metadata
  };
}

// Social Login with more providers
export async function signInWithProvider(provider: 'google' | 'github' | 'apple') {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: 'https://yourapp.com/welcome' // Replace with your app's URL
    }
  });

  if (error) throw error;
  return data;
}

// Password reset functionality
export async function resetPassword(email: string) {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: 'https://yourapp.com/reset-password' // Replace with password reset page
  });

  if (error) throw error;
  return data;
}
