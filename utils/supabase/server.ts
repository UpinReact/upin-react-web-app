// Correct way to manage Supabase cookies using its built-in methods

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      async get(name) {
        const cookie = await cookieStore.get(name);
        return cookie?.value; // Ensure value is correctly fetched
      },
      async set(name, value, options = {}) {
        try {
          await cookieStore.set({ name, value, ...options });
        } catch (error) {
          console.error('Error setting cookie:', error);
        }
      },
      async remove(name, options = {}) {
        try {
          await cookieStore.set({ name, value: '', expires: new Date(0), ...options });
        } catch (error) {
          console.error('Error removing cookie:', error);
        }
      },
    },
  });
}
