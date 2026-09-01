import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vlnransfhfgkevnjoolk.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZsbnJhbnNmaGZna2V2bmpvb2xrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgwODIyNjMsImV4cCI6MjEwMzY1ODI2M30.8En8A8TmuqWD8cAX22yS2l-g1d1osxqb4aWWrCmvsRU';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testCycle() {
  console.log('1. Admin saves "CROSS DEVICE FINAL 002"...');
  const payload = {
    id: 'hero-main',
    section: 'hero',
    image_url: 'https://assets.mixkit.co/videos/preview/mixkit-wedding-couple-walking-and-holding-hands-43892-large.mp4',
    title: 'CROSS DEVICE FINAL 002',
    category: 'Hero',
    display_order: 1,
    is_active: true,
    data: {
      title: 'CROSS DEVICE FINAL 002',
      subtitle: 'Testing verified production database synchronization across devices.',
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
  console.log('Saved successfully. DB Record is_active =', saved.is_active, 'title =', saved.title);

  console.log('\n2. Device B queries Supabase (apiFetchSiteImages simulation)...');
  const { data: remoteImgs, error: fetchErr } = await supabase
    .from('site_images')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true });

  const heroRecord = remoteImgs.find(i => i.id === 'hero-main');
  console.log('Device B fetched heroRecord:');
  console.log({
    id: heroRecord.id,
    title: heroRecord.title,
    is_active: heroRecord.is_active,
    data_title: heroRecord.data?.title
  });

  const heroPayload = heroRecord.data || {};
  const heroTitle = heroPayload.title || heroRecord.title;
  console.log('\n3. Device B DOM will render Title:', heroTitle);
}

testCycle();
