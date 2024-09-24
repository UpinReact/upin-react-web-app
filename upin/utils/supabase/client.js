
import { createBrowserClient } from '@supabase/ssr';

const NEXT_PUBLIC_SUPABASE_URL="https://kxtapuebivyoqwkdhphb.supabase.co"
const NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt4dGFwdWViaXZ5b3F3a2RocGhiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTUzNzg1NDQsImV4cCI6MjAzMDk1NDU0NH0.RHSytO4nnlXj6wsFi5E5TYnKMhJHPYtN_k0Nx9EQf6A"
const supabaseUrl = NEXT_PUBLIC_SUPABASE_URL;

const supabaseAnonKey = NEXT_PUBLIC_SUPABASE_ANON_KEY;

export function createClient() {
  // Create a Supabase client on the browser with project's credentials
  return createBrowserClient(
    supabaseUrl,
    supabaseAnonKey
  );
}
