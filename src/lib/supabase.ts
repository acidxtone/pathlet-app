import { createClient } from '@supabase/supabase-js';

// Supabase project URL and anon key
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Missing Supabase configuration');
}

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true
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
