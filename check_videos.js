import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vlnransfhfgkevnjoolk.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZsbnJhbnNmaGZna2V2bmpvb2xrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgwODIyNjMsImV4cCI6MjEwMzY1ODI2M30.8En8A8TmuqWD8cAX22yS2l-g1d1osxqb4aWWrCmvsRU';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkVideos() {
  console.log('Querying all site_images from Supabase Cloud Database...');
  const { data, error } = await supabase.from('site_images').select('*');
  if (error) {
    console.error('Error fetching site_images:', error);
    return;
  }

  console.log(`Total rows in site_images: ${data.length}`);
  
  const videoRows = data.filter(r => r.section === 'video' || r.section === 'hero');
  console.log('=== VIDEO & HERO ROWS ===');
  console.log(JSON.stringify(videoRows, null, 2));

  console.log('=== ALL SECTIONS IN DATABASE ===');
  const sections = {};
  data.forEach(r => {
    sections[r.section] = (sections[r.section] || 0) + 1;
  });
  console.log(sections);
}

checkVideos();
