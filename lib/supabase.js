import { createClient } from '@supabase/supabase-js';

const rawUrl = import.meta.env.VITE_SUPABASE_URL;
const rawKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

const supabaseUrl = (rawUrl && !rawUrl.includes('YOUR_PROJECT_ID'))
    ? rawUrl
    : 'https://vxqvjffssebnuxtslghp.supabase.co';

const supabaseKey = (rawKey && !rawKey.includes('YOUR_PUBLISHABLE_KEY'))
    ? rawKey
    : 'sb_publishable_B_pB3EX1rYiHTrO042sR8A_W6llCh54';

export const supabase = (supabaseUrl && supabaseKey)
    ? createClient(supabaseUrl, supabaseKey)
    : null;