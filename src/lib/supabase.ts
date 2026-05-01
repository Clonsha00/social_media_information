import { createClient } from '@supabase/supabase-js';

const getSupabaseUrl = () => import.meta.env.VITE_SUPABASE_URL || '';
const getSupabaseKey = () => import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Create a helper to get the client dynamically
export const getSupabaseClient = () => {
  const url = getSupabaseUrl();
  const key = getSupabaseKey();
  
  if (!url || !key) return null;
  return createClient(url, key);
};
