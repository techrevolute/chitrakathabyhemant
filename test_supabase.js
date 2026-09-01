import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vlnransfhfgkevnjoolk.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZsbnJhbnNmaGZna2V2bmpvb2xrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgwODIyNjMsImV4cCI6MjEwMzY1ODI2M30.8En8A8TmuqWD8cAX22yS2l-g1d1osxqb4aWWrCmvsRU';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testFullFlow() {
  console.log('--- TEST: ADMIN SAVES "CROSS DEVICE LIVE TEST 777" ---');
  const payload = {
    id: 'hero-main',
    section: 'hero',
    image_url: 'https://assets.mixkit.co/videos/preview/mixkit-wedding-couple-walking-and-holding-hands-43892-large.mp4',
    title: 'CROSS DEVICE LIVE TEST 777',
    category: 'Hero',
    display_order: 1,
    is_active: true,
    data: {
      title: 'CROSS DEVICE LIVE TEST 777',
      subtitle: 'Verified database persistence across every device and page refresh.',
      tagline: 'LUXURY CINEMATIC PHOTOGRAPHY',
      url: 'https://assets.mixkit.co/videos/preview/mixkit-wedding-couple-walking-and-holding-hands-43892-large.mp4'
    },
    updated_at: new Date().toISOString()
  };

  const { data: saved, error: saveErr } = await supabase
    .from('site_images')
    .upsert(payload, { onConflict: 'id' })
    .select()
    .single();

  if (saveErr) {
    console.error('Save failed:', saveErr);
    return;
  }
  console.log('Admin save succeeded! DB record title:', saved.title);

  console.log('\n--- SIMULATING DEVICE B OR PAGE REFRESH ---');
  const publicClient = createClient(supabaseUrl, supabaseAnonKey);
  const { data: publicImgs, error: fetchErr } = await publicClient
    .from('site_images')
    .select('*')
    .eq('is_active', true);

  if (fetchErr) {
    console.error('Public fetch error:', fetchErr);
    return;
  }

  const heroRecord = publicImgs.find(i => i.id === 'hero-main');
  console.log('Device B fetched heroRecord successfully!');
  console.log('  Title in DB:', heroRecord.title);
  console.log('  Data Title:', heroRecord.data?.title);
  console.log('  Data Subtitle:', heroRecord.data?.subtitle);
  console.log('  is_active:', heroRecord.is_active);
}

testFullFlow();
