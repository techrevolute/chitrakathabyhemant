import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vlnransfhfgkevnjoolk.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZsbnJhbnNmaGZna2V2bmpvb2xrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgwODIyNjMsImV4cCI6MjEwMzY1ODI2M30.8En8A8TmuqWD8cAX22yS2l-g1d1osxqb4aWWrCmvsRU';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function simulateAppHydration() {
  console.log('=== 1. PUBLIC BROWSER SENDS GET TO SUPABASE ===');
  const { data: remoteImgs, error } = await supabase
    .from('site_images')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Supabase query error:', error);
    return;
  }
  console.log(`Supabase returned ${remoteImgs.length} rows.\n`);

  console.log('=== 2. APP.JSX HYDRATES REACT STATE ===');
  
  // 1. Hero
  const heroRecord = remoteImgs.find(img => img.id === 'hero-main') ||
    remoteImgs
      .filter(img => img.section === 'hero' && img.is_active !== false)
      .sort((a, b) => new Date(b.updated_at || 0) - new Date(a.updated_at || 0))[0];

  let renderedHeroTitle = 'Default fallback';
  if (heroRecord) {
    const heroPayload = heroRecord.data || {};
    const heroTitle = heroPayload.title || heroRecord.title;
    const heroSubtitle = heroPayload.subtitle !== undefined ? heroPayload.subtitle : heroRecord.subtitle;
    const heroUrl = heroPayload.url || heroRecord.image_url;
    const heroTagline = heroPayload.tagline;

    const nextHeroState = {
      title: heroTitle || 'Chitrakatha by Hemant',
      subtitle: heroSubtitle !== undefined ? heroSubtitle : '',
      tagline: heroTagline || 'LUXURY CINEMATIC PHOTOGRAPHY',
      url: (heroUrl && !heroUrl.startsWith('blob:')) ? heroUrl : 'https://assets.mixkit.co/videos/preview/mixkit-wedding-couple-walking-and-holding-hands-43892-large.mp4',
      ...heroPayload
    };

    console.log('[REACT STATE: heroData]:', nextHeroState);
    renderedHeroTitle = nextHeroState.title;
  }

  // 2. About Me
  const aboutImg = remoteImgs.find(img => img.id === 'about-main') ||
    remoteImgs.find(img => img.section === 'about' && img.is_active !== false);
  let renderedAboutName = 'Default Hemant';
  if (aboutImg) {
    const aboutPayload = aboutImg.data || {};
    renderedAboutName = aboutImg.title || aboutPayload.ownerName;
    console.log('[REACT STATE: aboutData]:', { ownerName: renderedAboutName, story: aboutPayload.story });
  }

  console.log('\n=== 3. WHAT HOMEPAGE COMPONENT RENDERS TO DOM ===');
  console.log('Hero <h1> rendered text:', renderedHeroTitle);
  console.log('About Owner rendered text:', renderedAboutName);

  console.log('\n=== 4. VERIFICATION ===');
  console.log('Does Hero match "VERCEL-SUPABASE-SYNC-TEST-999"?', renderedHeroTitle === 'VERCEL-SUPABASE-SYNC-TEST-999');
  console.log('Does About match "Master Photographer Hemant"?', renderedAboutName === 'Master Photographer Hemant');
}

simulateAppHydration();
