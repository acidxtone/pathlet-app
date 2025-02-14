import { createClient } from '@supabase/supabase-js';

// Supabase project URL and anon key
const supabaseUrl = 'https://swaswbpczjelajyetmkf.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN3YXN3YnBjemplbGFqeWV0bWtmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk0OTQ2NjcsImV4cCI6MjA1NTA3MDY2N30.78q-fFI0dz4cWd0EDZVjpTz9xTQdkhkbOcSEp4IXE-g';

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
