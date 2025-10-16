import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from './info';

// Create a single Supabase client instance to avoid "Multiple GoTrueClient instances" warning
export const supabase = createClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey
);
