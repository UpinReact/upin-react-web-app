// utils/supabase/client.js
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

const NEXT_PUBLIC_SUPABASE_URL="https://kxtapuebivyoqwkdhphb.supabase.co"
const NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt4dGFwdWViaXZ5b3F3a2RocGhiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTUzNzg1NDQsImV4cCI6MjAzMDk1NDU0NH0.RHSytO4nnlXj6wsFi5E5TYnKMhJHPYtN_k0Nx9EQf6A"
const supabaseUrl = NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = NEXT_PUBLIC_SUPABASE_ANON_KEY;

export function createClient() {
  const cookieStore = cookies();

  // Create a server's supabase client with newly configured cookie,
  // which could be used to maintain user's session
  return createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value;
        },
        set(name, value, options) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
        remove(name, options) {
          try {
            cookieStore.set({ name, value: '', ...options });
          } catch (error) {
            // The `delete` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
}
