import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vlnransfhfgkevnjoolk.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZsbnJhbnNmaGZna2V2bmpvb2xrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgwODIyNjMsImV4cCI6MjEwMzY1ODI2M30.8En8A8TmuqWD8cAX22yS2l-g1d1osxqb4aWWrCmvsRU';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const INITIAL_ABOUT_DATA = {
  ownerName: 'Hemant Mandawade',
  experience: '12+ Years',
  profileImage: 'assets/hemant_about.png',
  story: 'With over 12 years of capturing couples and grand celebrations across Maharashtra, Chitrakatha by Hemant was founded on a simple philosophy: every glance, tear of joy, and warm embrace deserves to be preserved in timeless cinematic beauty.',
  mission: 'To preserve raw human emotions and sacred rituals beautifully, creating visual legacies that families cherish for generations.',
  vision: 'To set the benchmark for luxury photography in Maharashtra, blending traditional heritage with contemporary cinematic elegance.'
};

const BUSINESS_INFO = {
  name: 'Chitrakatha by Hemant',
  owner: 'Hemant Mandawade',
  experience: '12+ Years',
  phone: '7249532553',
  email: 'clicksbyhemant5564@gmail.com',
  office: 'Satana, Nashik',
  serviceArea: 'All Over Maharashtra',
  workingMode: 'Available by Appointment',
  googleMapEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d60000!2d74.1950!3d20.5900!2m3!1f0!0!f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bdde6a4c28c8ef3%3A0x6b19a16f2c6e6df6!2sSatana%2C%20Maharashtra%20423301!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin',
  instagram: 'https://www.instagram.com/chitrakatha_by_hemant?igsi=MWFzenNxZHR3YWdpNg==',
  facebook: 'https://facebook.com/chitrakathabyhemant'
};

const INITIAL_CATEGORIES = [
  { id: 'cat-wedding', name: 'Wedding Photography', slug: 'wedding-photography', coverImage: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=800', displayOrder: 1, hidden: false },
  { id: 'cat-prewedding', name: 'Pre-Wedding', slug: 'pre-wedding', coverImage: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=800', displayOrder: 2, hidden: false },
  { id: 'cat-drone', name: 'Drone Cinema', slug: 'drone-cinema', coverImage: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&q=80&w=800', displayOrder: 3, hidden: false },
  { id: 'cat-fashion', name: 'Fashion & Portraits', slug: 'fashion-portraits', coverImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800', displayOrder: 4, hidden: false }
];

const INITIAL_PACKAGES = [
  {
    id: 'pkg-luxury-wedding',
    name: 'Luxury Royal Wedding Story',
    category: 'Wedding Photography',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800',
    description: 'Comprehensive 3-day complete wedding coverage by Hemant Mandawade & senior candid crew.',
    features: [
      'Lead Candid Photographers (Hemant Mandawade & Team)',
      '4K Cinematic Wedding Feature Film (25-30 Mins)',
      'Teaser / Instagram Reel (60 Secs 4K 60fps)',
      'DGCA Compliant 4K Aerial Drone Coverage',
      '2 Luxury Flush-Mount Leather Photobook Albums (300 GSM)',
      'Complete Raw Data + Edited High-Res Photos on Drive'
    ],
    price: '₹1,50,000 Starting',
    duration: '3 Days Full Coverage',
    deliverables: '500+ Retouched Photos, 4K Feature Film, 2 Albums',
    popular: true,
    buttonText: 'Book Wedding Package'
  },
  {
    id: 'pkg-prewedding-cinematic',
    name: 'Cinematic Pre-Wedding Story',
    category: 'Pre-Wedding',
    image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=800',
    description: 'A 2-day outdoor cinematic journey capturing intimate romantic stories at scenic Maharashtra destinations.',
    features: [
      'Full Day Shoot at Destination Location',
      '4K Pre-Wedding Concept Video Song (3-4 Mins)',
      '100+ Color Graded HD Candid Photographs',
      'Drone Aerial Cinematic Shots',
      'Mini Canvera Coffee Table Photo Album'
    ],
    price: '₹45,000 Starting',
    duration: '1-2 Days Outdoor Destination',
    deliverables: '100+ Retouched Photos, 4K Pre-Wedding Video',
    popular: false,
    buttonText: 'Book Pre-Wedding'
  }
];

const INITIAL_SERVICES = [
  {
    id: 'svc-wedding',
    title: 'Wedding Photography & Film',
    icon: 'Camera',
    description: 'Complete candid, traditional, and cinematic 4K film coverage for sacred wedding rituals.',
    image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=800',
    priceStarting: '₹75,000 Starting',
    details: 'Candid Photography, Traditional Photography, 4K Cinema Film, Aerial Drone Coverage, Handcrafted Photobooks.'
  },
  {
    id: 'svc-prewedding',
    title: 'Pre-Wedding Cinematic Stories',
    icon: 'Video',
    description: 'Romantic, high-concept outdoor photo and video shoots at scenic hill stations & heritage palaces.',
    image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=800',
    priceStarting: '₹35,000 Starting',
    details: 'Destination Outdoor Location, Concept Teaser Film, 4K Drone Footage, Styled Portraiture.'
  }
];

const INITIAL_FAQS = [
  {
    id: 'faq-1',
    category: 'Booking',
    question: 'How far in advance should we book Chitrakatha by Hemant for our wedding?',
    answer: 'We recommend booking 3 to 6 months in advance for prime wedding season dates across Maharashtra (November through May).',
    hidden: false
  },
  {
    id: 'faq-2',
    category: 'Deliverables',
    question: 'What is the delivery timeline for final retouched photos and 4K wedding films?',
    answer: 'Preview teaser photos and Instagram reels are delivered within 48-72 hours. Complete high-resolution edited photo galleries and 4K cinematic films are delivered within 3-4 weeks.',
    hidden: false
  }
];

async function seed() {
  console.log('Seeding initial datasets & categories to Supabase Cloud Database...');

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
    }))
  ];

  for (const r of records) {
    const { data, error } = await supabase.from('site_images').upsert([r], { onConflict: 'id' }).select();
    if (error) {
      console.error(`Error seeding ${r.id}:`, error.message);
    } else {
      console.log(`Seeded record [${r.section}] ID: ${r.id}`);
    }
  }

  const { data: all } = await supabase.from('site_images').select('id, section, title');
  console.log('Total database rows after seeding:', all ? all.length : 0);
  console.log('Database summary:', all);
}

seed();
