import { createClient } from '@supabase/supabase-js'

// In dev the Vite proxy forwards /supabase-proxy → http://127.0.0.1:54321
// so the HTTPS page never makes a plain HTTP fetch (mixed content).
// In production VITE_SUPABASE_URL is the cloud Supabase URL.
const supabaseUrl = import.meta.env.DEV
    ? `${window.location.origin}/supabase-proxy`
    : import.meta.env.VITE_SUPABASE_URL

const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables. Check your .env.local file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
