import { createClient } from '@supabase/supabase-js';

const rawUrl = typeof import.meta !== 'undefined' && import.meta?.env ? import.meta.env.VITE_SUPABASE_URL : undefined;
const rawKey = typeof import.meta !== 'undefined' && import.meta?.env ? import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY : undefined;

const supabaseUrl = (rawUrl && !rawUrl.includes('YOUR_PROJECT_ID'))
    ? rawUrl
    : 'https://vxqvjffssebnuxtslghp.supabase.co';

const supabaseKey = (rawKey && !rawKey.includes('YOUR_PUBLISHABLE_KEY'))
    ? rawKey
    : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ4cXZqZmZzc2VibnV4dHNsZ2hwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE4MDk5NjgsImV4cCI6MjEwNzM4NTk2OH0.KZUQnisFgnoo_ZHUk7Wn9LfbLAzuzSztwYRLh1VHp6U';

export const supabase = createClient(supabaseUrl, supabaseKey);