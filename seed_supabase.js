import { createClient } from '@supabase/supabase-js';
import {
  INITIAL_ABOUT_DATA,
  BUSINESS_INFO,
  INITIAL_CATEGORIES,
  INITIAL_PACKAGES,
  INITIAL_SERVICES,
  INITIAL_FAQS,
  INITIAL_VIDEOS,
  INITIAL_PORTFOLIO
} from './src/data/initialData.js';

const supabaseUrl = 'https://vlnransfhfgkevnjoolk.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZsbnJhbnNmaGZna2V2bmpvb2xrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgwODIyNjMsImV4cCI6MjEwMzY1ODI2M30.8En8A8TmuqWD8cAX22yS2l-g1d1osxqb4aWWrCmvsRU';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function seedAll() {
  console.log('Seeding COMPLETE dataset (Videos, Portfolio, Categories, Packages, Services, About) to Supabase Cloud Database...');

  const records = [
    {
      id: 'about-me-main',
      section: 'about',
      image_url: INITIAL_ABOUT_DATA.profileImage,
      title: INITIAL_ABOUT_DATA.ownerName,
      category: 'About Me',
      is_active: true,
      data: INITIAL_ABOUT_DATA
    },
    {
      id: 'info-business-global',
      section: 'business_info',
      image_url: null,
      title: BUSINESS_INFO.name,
      category: 'Business Info',
      is_active: true,
      data: BUSINESS_INFO
    },
    ...INITIAL_CATEGORIES.map(cat => ({
      id: cat.id,
      section: 'category',
      image_url: cat.coverImage,
      title: cat.name,
      category: cat.slug,
      is_active: !cat.hidden,
      data: cat
    })),
    ...INITIAL_PACKAGES.map(pkg => ({
      id: pkg.id,
      section: 'package',
      image_url: pkg.image,
      title: pkg.name,
      category: pkg.category,
      is_active: true,
      data: pkg
    })),
    ...INITIAL_SERVICES.map(svc => ({
      id: svc.id,
      section: 'service',
      image_url: svc.image,
      title: svc.title,
      category: 'Services',
      is_active: true,
      data: svc
    })),
    ...INITIAL_FAQS.map(faq => ({
      id: faq.id,
      section: 'faq',
      image_url: null,
      title: faq.question,
      category: faq.category,
      is_active: !faq.hidden,
      data: faq
    })),
    ...INITIAL_VIDEOS.map(vid => ({
      id: vid.id,
      section: 'video',
      image_url: vid.videoUrl,
      title: vid.title,
      category: vid.category,
      display_order: vid.displayOrder || 1,
      is_active: !vid.hidden,
      data: vid
    })),
    ...INITIAL_PORTFOLIO.map(img => ({
      id: img.id,
      section: 'portfolio',
      image_url: img.image,
      title: img.title,
      category: img.category,
      display_order: img.displayOrder || 1,
      is_active: !img.hidden,
      data: img
    }))
  ];

  console.log(`Upserting ${records.length} total records to Supabase site_images table...`);
  
  // Upsert in batches of 20
  for (let i = 0; i < records.length; i += 20) {
    const batch = records.slice(i, i + 20);
    const { data, error } = await supabase.from('site_images').upsert(batch, { onConflict: 'id' }).select();
    if (error) {
      console.error(`Batch error at index ${i}:`, error.message);
    } else {
      console.log(`Upserted batch ${i} to ${i + batch.length - 1} (${data ? data.length : 0} items)`);
    }
  }

  const { data: all } = await supabase.from('site_images').select('id, section, title');
  console.log('Total database rows after complete seed:', all ? all.length : 0);
}

seedAll();
