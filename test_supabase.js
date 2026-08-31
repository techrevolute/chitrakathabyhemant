import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vlnransfhfgkevnjoolk.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZsbnJhbnNmaGZna2V2bmpvb2xrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgwODIyNjMsImV4cCI6MjEwMzY1ODI2M30.8En8A8TmuqWD8cAX22yS2l-g1d1osxqb4aWWrCmvsRU';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkDatabase() {
  console.log('Checking Supabase site_images table...');
  const { data, error } = await supabase.from('site_images').select('*');
  if (error) {
    console.log('Table site_images error:', error.message, 'Code:', error.code);
  } else {
    console.log('SUCCESS! Total rows in site_images:', data.length);
    console.log('Rows:', JSON.stringify(data, null, 2));
  }
}

checkDatabase();
