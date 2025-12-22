import { createClient } from '@supabase/supabase-js';

// مقادیر را از فایل .env.local می‌خواند
// علامت تعجب ! یعنی به تایپ‌اسکریپت قول می‌دهیم که این متغیرها حتماً وجود دارند
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);