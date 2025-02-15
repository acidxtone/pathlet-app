import { createClient } from '@supabase/supabase-js';

// Supabase project URL and anon key for Vite
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase configuration. Please check your .env file.');
  throw new Error('Supabase configuration is incomplete');
}

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storageKey: 'supabase-auth-token'
  }
});

// Function to create a reading record
export async function createReading(readingData: any) {
  const { data, error } = await supabase
    .from('readings')
    .insert([readingData])
    .select();

  if (error) {
    console.error('Error creating reading:', error);
    throw error;
  }

  return data;
}

// Function to fetch a reading by ID
export async function fetchReading(readingId: string) {
  const { data, error } = await supabase
    .from('readings')
    .select('*')
    .eq('id', readingId)
    .single();

  if (error) {
    console.error('Error fetching reading:', error);
    throw error;
  }

  return data;
}

// Add error handling middleware
supabase.on('error', (error) => {
  console.error('Supabase global error:', error);
});
