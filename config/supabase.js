import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const SUPABASE_URL = 'https://qnroaigdrpoceasbqtmh.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFucm9haWdkcnBvY2Vhc2JxdG1oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI1MzIzMzgsImV4cCI6MjA3ODEwODMzOH0.AnySEJv5FLNikQ6aGlpg-p7YSpqINjvbMuuLe4SFKQc'

console.log('🔄 Initializing Supabase client...');

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

console.log('✅ Supabase client created:', supabase ? 'Success' : 'Failed');
