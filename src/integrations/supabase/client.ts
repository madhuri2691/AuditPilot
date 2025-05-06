
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://auteoclxtxphszpuphog.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF1dGVvY2x4dHhwaHN6cHVwaG9nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYzNDQwMDgsImV4cCI6MjA2MTkyMDAwOH0.F_GMcCqxy7IRpzvZpxOTPcFDYdFn6YvE0yd21Cnnt2M";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});
