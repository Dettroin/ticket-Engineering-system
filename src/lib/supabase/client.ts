import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'placeholder-anon-key';

export const isSupabaseConfigured = () => {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://placeholder.supabase.co' &&
    (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)
  );
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export const testSupabaseConnection = async (): Promise<{ connected: boolean; message: string }> => {
  if (!isSupabaseConfigured()) {
    return { connected: false, message: 'Supabase URL or Key is missing/using placeholder defaults.' };
  }

  try {
    const { data, error } = await supabase.from('users').select('id').limit(1);
    if (error) {
      return { connected: false, message: `Supabase error: ${error.message} (${error.code || 'UNKNOWN'})` };
    }
    return { connected: true, message: `Connected to Supabase. Query table 'users' returned successfully.` };
  } catch (err: any) {
    return { connected: false, message: `Connection failed: ${err.message || 'Network error'}` };
  }
};

