
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://rfkjvrkbhqvgilbleygx.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJma2p2cmtiaHF2Z2lsYmxleWd4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEyNTAyMDYsImV4cCI6MjA4NjgyNjIwNn0.Obmp1bJugIeRrLyLKVanTWPsKWUY2OHAMmAzQvrHLE4';

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn(
        'Missing Supabase environment variables. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.'
    );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
