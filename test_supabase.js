import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vlnransfhfgkevnjoolk.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZsbnJhbnNmaGZna2V2bmpvb2xrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgwODIyNjMsImV4cCI6MjEwMzY1ODI2M30.8En8A8TmuqWD8cAX22yS2l-g1d1osxqb4aWWrCmvsRU';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function runMasterTest() {
  console.log('=== STEP 1: ADMIN AUTHENTICATION ===');
  const { data: auth, error: authErr } = await supabase.auth.signInWithPassword({
    email: 'techrevolutee@gmail.com',
    password: 'admin@123'
  });
  if (authErr) {
    console.error('Auth error:', authErr);
    return;
  }
  console.log('Logged in as:', auth.user?.email);

  console.log('\n=== STEP 2: SAVING ALL SECTIONS TO SUPABASE ===');
  
  // 1. Hero Save
  const heroPayload = {
    id: 'hero-main',
    section: 'hero',
    image_url: 'https://assets.mixkit.co/videos/preview/mixkit-wedding-couple-walking-and-holding-hands-43892-large.mp4',
    title: 'SYNC TEST 001',
    category: 'Hero',
    display_order: 1,
    is_active: true,
    data: {
      title: 'SYNC TEST 001',
      subtitle: 'Luxury Cinematic Photography across Maharashtra',
      tagline: 'PREMIUM WEDDING CINEMA',
      url: 'https://assets.mixkit.co/videos/preview/mixkit-wedding-couple-walking-and-holding-hands-43892-large.mp4'
    },
    updated_at: new Date().toISOString()
  };
  const { data: heroSaved } = await supabase.from('site_images').upsert(heroPayload, { onConflict: 'id' }).select().single();
  console.log('1. Hero Saved:', heroSaved.title);

  // 2. About Me Save
  const aboutPayload = {
    id: 'about-main',
    section: 'about',
    image_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800',
    title: 'Master Photographer Hemant',
    category: 'About Me',
    display_order: 1,
    is_active: true,
    data: {
      ownerName: 'Master Photographer Hemant',
      experience: '12+ Years',
      story: 'Passionate story-teller preserving luxury weddings across Maharashtra.',
      mission: 'To create timeless heirloom memories.',
      vision: 'Setting the standard for wedding photography.'
    },
    updated_at: new Date().toISOString()
  };
  const { data: aboutSaved } = await supabase.from('site_images').upsert(aboutPayload, { onConflict: 'id' }).select().single();
  console.log('2. About Saved:', aboutSaved.title);

  // 3. Service Save
  const svcPayload = {
    id: 'svc-test-sync',
    section: 'services',
    image_url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800',
    title: 'Pre-Wedding Cinema 4K',
    category: 'Services',
    display_order: 1,
    is_active: true,
    data: {
      id: 'svc-test-sync',
      title: 'Pre-Wedding Cinema 4K',
      description: 'Exclusive couple destination shoots with drone cinematography.',
      priceStarting: '₹45,000'
    },
    updated_at: new Date().toISOString()
  };
  const { data: svcSaved } = await supabase.from('site_images').upsert(svcPayload, { onConflict: 'id' }).select().single();
  console.log('3. Service Saved:', svcSaved.title);

  console.log('\n=== STEP 3: PUBLIC / UNAUTHENTICATED CLIENT FETCH (SIMULATING HOMEPAGE ON REFRESH & OTHER DEVICES) ===');
  const publicClient = createClient(supabaseUrl, supabaseAnonKey);
  const { data: remoteImgs, error: fetchErr } = await publicClient
    .from('site_images')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true });

  if (fetchErr) {
    console.error('Fetch error:', fetchErr);
    return;
  }

  console.log('Total Active Rows Retrieved by Public Client:', remoteImgs.length);

  const heroRecord = remoteImgs.find(img => img.id === 'hero-main');
  console.log('Public Hero Title:', heroRecord?.title, '=== "SYNC TEST 001" ?', heroRecord?.title === 'SYNC TEST 001');

  const aboutRecord = remoteImgs.find(img => img.id === 'about-main');
  console.log('Public About Name:', aboutRecord?.data?.ownerName, '=== "Master Photographer Hemant" ?', aboutRecord?.data?.ownerName === 'Master Photographer Hemant');

  const svcRecord = remoteImgs.find(img => img.id === 'svc-test-sync');
  console.log('Public Service Title:', svcRecord?.title, '=== "Pre-Wedding Cinema 4K" ?', svcRecord?.title === 'Pre-Wedding Cinema 4K');
}

runMasterTest();
