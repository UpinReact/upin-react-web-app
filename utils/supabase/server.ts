// utils/supabase/server.ts
'use server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export async function createClient() {
  // Ensure cookies() is inside a request scope (no await here, it's resolved automatically)
  const cookieStore = cookies()

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      async getAll() {
        const resolvedCookieStore = await cookieStore;
        return resolvedCookieStore.getAll(); // Correct usage
      },
      async setAll(newCookies) {
        try {
          for (const { name, value, options } of newCookies) {
            (await cookieStore).set(name, value, { path: '/', httpOnly: true, ...options })
          }
        } catch (error) {
          console.error('Error setting cookies:', error)
        }
      },
    },
  })
}
