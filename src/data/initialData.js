export const BUSINESS_INFO = {
  name: 'Chitrakatha by Hemant',
  owner: 'Hemant Mandawade',
  experience: '12+ Years',
  phone: '7249532553',
  email: 'clicksbyhemant5564@gmail.com',
  office: 'Satana, Nashik',
  serviceArea: 'All Over Maharashtra',
  workingMode: 'Available by Appointment',
  googleMapEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d60000!2d74.1950!3d20.5900!2m3!1f0!0!f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bdde6a4c28c8ef3%3A0x6b19a16f2c6e6df6!2sSatana%2C%20Maharashtra%20423301!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin',
  instagram: 'https://instagram.com/chitrakatha_by_hemant',
  facebook: 'https://facebook.com/chitrakathabyhemant'
};

export const INITIAL_STATS = [
  { id: 'years', value: 12, label: 'Years Experience', suffix: '+' },
  { id: 'projects', value: 550, label: 'Weddings & Shoots', suffix: '+' },
  { id: 'cities', value: 35, label: 'Cities Covered in MH', suffix: '+' },
  { id: 'clients', value: 99, label: 'Client Satisfaction', suffix: '%' },
  { id: 'photos', value: 250, label: 'Photos Delivered (k+)', suffix: 'k+' },
  { id: 'videos', value: 480, label: 'Cinematic Films', suffix: '+' }
];

export const INITIAL_BROCHURES = [
  {
    id: 'pdf-1',
    name: 'Chitrakatha Complete Wedding Photography & Film Brochure 2026',
    category: 'Wedding Packages',
    description: 'Official 2026 Pricing & Package Deliverables Guide by Hemant Mandawade.',
    fileUrl: 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/examples/learning/helloworld.pdf',
    uploadDate: '2026-08-01',
    active: true,
    createdBy: 'Hemant Mandawade'
  }
];

export const INITIAL_CATEGORIES = [
  {
    id: 'cat-wedding',
    name: 'Wedding Photography',
    slug: 'wedding-photography',
    coverImage: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=800',
    displayOrder: 1,
    hidden: false
  },
  {
    id: 'cat-prewedding',
    name: 'Pre-Wedding',
    slug: 'pre-wedding',
    coverImage: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=800',
    displayOrder: 2,
    hidden: false
  },
  {
    id: 'cat-fashion',
    name: 'Fashion Shoot',
    slug: 'fashion-shoot',
    coverImage: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=800',
    displayOrder: 3,
    hidden: false
  },
  {
    id: 'cat-drone',
    name: 'Drone Photography',
    slug: 'drone-photography',
    coverImage: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&q=80&w=800',
    displayOrder: 4,
    hidden: false
  },
  {
    id: 'cat-cinematic',
    name: 'Cinematic Video',
    slug: 'cinematic-video',
    coverImage: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=800',
    displayOrder: 5,
    hidden: false
  }
];

export const INITIAL_PORTFOLIO = [
  {
    id: 'img-1',
    categoryId: 'cat-wedding',
    category: 'Wedding Photography',
    title: 'Royal Heritage Wedding at Pune Palace',
    description: 'Sacred rituals and grand evening reception captured at Oxford Golf Resort, Pune.',
    image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=1200',
    altText: 'Royal Heritage Wedding at Pune Palace by Hemant Mandawade',
    location: 'Pune, Maharashtra',
    date: 'December 2025',
    featured: true,
    hidden: false,
    watermarked: true,
    displayOrder: 1
  },
  {
    id: 'img-2',
    categoryId: 'cat-prewedding',
    category: 'Pre-Wedding',
    title: 'Sunset Love Stories in Mahabaleshwar',
    description: 'Picturesque misty hill station couple portrait session at sunset vantage point.',
    image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=1200',
    altText: 'Sunset Pre Wedding Shoot Mahabaleshwar by Chitrakatha',
    location: 'Mahabaleshwar, MH',
    date: 'January 2026',
    featured: true,
    hidden: false,
    watermarked: true,
    displayOrder: 2
  }
];

export const INITIAL_VIDEOS = [
  {
    id: 'vid-1',
    title: 'Aditya & Ananya - Royal Destination Wedding Film',
    description: '4K Cinematic Feature Film capturing pre-wedding rituals, vows, and grand evening reception.',
    category: 'Cinematic Video',
    duration: '04:25',
    thumbnail: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-photographer-taking-photos-of-a-bride-and-groom-43889-large.mp4',
    location: 'Satana & Nashik',
    views: '24k',
    featured: true,
    hidden: false,
    displayOrder: 1
  }
];

export const INITIAL_PACKAGES = [
  {
    id: 'pkg-wedding-1',
    category: 'Wedding Photography',
    name: 'Royal Heritage Wedding Package',
    image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=1000',
    description: 'Comprehensive multi-day wedding coverage capturing sacred rituals, candid emotions, and grand celebrations.',
    features: [
      '2 Lead Candid Photographers (Hemant Mandawade & Team)',
      '2 Traditional Photographers & Videographers',
      '4K Cinematic Wedding Feature Film (15-20 Mins)',
      'Instagram Reels Teaser Trailer (60 Seconds)',
      'DGCA Compliant 4K Drone Aerial Coverage',
      '2 Luxury Velvet Photobooks (40 Pages Each)',
      'Password Protected Online Cloud Gallery'
    ],
    duration: '2 Days (Full Event)',
    deliverables: '350+ Retouched Photos, 4K Feature Film, Trailer, 2 Luxury Albums',
    price: 'Get Quote / Contact for Best Price',
    discount: 'Customizable Deal',
    popular: true,
    buttonText: 'Book Wedding Package'
  }
];

export const INITIAL_FAQS = [
  {
    id: 'faq-1',
    category: 'Booking',
    question: 'How can I book Chitrakatha by Hemant for my shoot?',
    answer: 'You can book by submitting the "Book Appointment" form on our website, calling us directly at 7249532553, or messaging us on WhatsApp. We will discuss your dates and event scope before issuing a booking agreement.',
    hidden: false
  }
];

export const INITIAL_BOOKINGS = [
  {
    id: 'ENQ-1001',
    name: 'Rahul Deshmukh',
    phone: '9822012345',
    email: 'rahul.d@gmail.com',
    city: 'Pune',
    eventType: 'Wedding Photography',
    date: '2026-11-20',
    time: 'Morning (09:00 AM)',
    notes: '2-Day Wedding at Oxford Golf Resort, Pune. Need drone and luxury albums.',
    source: 'Website Booking Form',
    status: 'Confirmed',
    createdAt: '2026-08-01'
  }
];

export const INITIAL_INSTAGRAM = [
  { id: 1, image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=500', likes: '1.2k' }
];

export const INITIAL_SERVICES = [
  {
    id: 'wedding',
    title: 'Wedding Photography',
    icon: 'Camera',
    description: 'Capturing sacred vows, emotional rituals, candid laughter, and grand celebrations with timeless luxury aesthetics.',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1200',
    details: 'Our flagship service covering Haldi, Sangeet, Wedding Ceremony, and Reception. Includes candid moments, traditional coverage, custom album design, and drone highlights.',
    priceStarting: 'Contact for Quote'
  }
];

export const INITIAL_WATERMARK = {
  enabled: true,
  text: 'CHITRAKATHA BY HEMANT',
  position: 'bottom-right',
  opacity: 0.65,
  size: 'medium'
};

export const INITIAL_HERO_VIDEO = {
  url: 'https://assets.mixkit.co/videos/preview/mixkit-photographer-taking-photos-of-a-bride-and-groom-43889-large.mp4',
  poster: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1920',
  title: 'Every Moment Has A Story',
  subtitle: 'Professional Wedding, Pre-Wedding, Fashion & Cinematic Photography Across Maharashtra.'
};
