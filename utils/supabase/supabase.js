import process from "process"
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY|| '';



export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// NEXT_PUBLIC_SUPABASE_URL=supabaseUrl;
// NEXT_PUBLIC_SUPABASE_ANON_KEY=supabaseAnonKey;