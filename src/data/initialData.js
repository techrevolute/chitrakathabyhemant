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
  instagram: 'https://www.instagram.com/chitrakatha_by_hemant?igsi=MWFzenNxZHR3YWdpNg==',
  facebook: 'https://facebook.com/chitrakathabyhemant'
};

export const INITIAL_LOGO_URL = 'assets/chitrakatha_logo.png';

export const INITIAL_ABOUT_DATA = {
  ownerName: 'Hemant Mandawade',
  experience: '12+ Years',
  profileImage: 'assets/hemant_about.png',
  story: 'With over 12 years of capturing couples and grand celebrations across Maharashtra, Chitrakatha by Hemant was founded on a simple philosophy: every glance, tear of joy, and warm embrace deserves to be preserved in timeless cinematic beauty.',
  mission: 'To preserve raw human emotions and sacred rituals beautifully, creating visual legacies that families cherish for generations.',
  vision: 'To set the benchmark for luxury photography in Maharashtra, blending traditional heritage with contemporary cinematic elegance.'
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
  { id: 'cat-wedding', name: 'Wedding', slug: 'wedding', coverImage: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=800', displayOrder: 1, hidden: false },
  { id: 'cat-prewedding', name: 'Pre-Wedding', slug: 'pre-wedding', coverImage: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=800', displayOrder: 2, hidden: false },
  { id: 'cat-engagement', name: 'Engagement', slug: 'engagement', coverImage: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&q=80&w=800', displayOrder: 3, hidden: false },
  { id: 'cat-birthday', name: 'Birthday', slug: 'birthday', coverImage: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&q=80&w=800', displayOrder: 4, hidden: false },
  { id: 'cat-babyshoot', name: 'Baby Shoot', slug: 'baby-shoot', coverImage: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&q=80&w=800', displayOrder: 5, hidden: false },
  { id: 'cat-maternity', name: 'Maternity', slug: 'maternity', coverImage: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&q=80&w=800', displayOrder: 6, hidden: false },
  { id: 'cat-fashion', name: 'Fashion', slug: 'fashion', coverImage: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=800', displayOrder: 7, hidden: false },
  { id: 'cat-events', name: 'Events', slug: 'events', coverImage: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=800', displayOrder: 8, hidden: false },
  { id: 'cat-portrait', name: 'Portrait', slug: 'portrait', coverImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800', displayOrder: 9, hidden: false },
  { id: 'cat-product', name: 'Product', slug: 'product', coverImage: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800', displayOrder: 10, hidden: false },
  { id: 'cat-drone', name: 'Drone', slug: 'drone', coverImage: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&q=80&w=800', displayOrder: 11, hidden: false }
];

export const INITIAL_PORTFOLIO = [
  // WEDDING CATEGORY (4 PHOTOS)
  {
    id: 'img-w1',
    categoryId: 'cat-wedding',
    category: 'Wedding',
    title: 'Royal Heritage Wedding at Pune Palace',
    description: 'Sacred rituals and grand evening reception captured at Oxford Golf Resort, Pune.',
    image: 'https://drive.google.com/file/d/16i9vvRNKV3PUmx-HzwR87EPSRfz92MTd/view?usp=sharing',
    altText: 'Royal Heritage Wedding at Pune Palace by Hemant Mandawade',
    location: 'Pune, Maharashtra',
    date: 'December 2025',
    featured: true,
    hidden: false,
    watermarked: true,
    displayOrder: 1
  },
  {
    id: 'img-w2',
    categoryId: 'cat-wedding',
    category: 'Wedding',
    title: 'Grand Haldi & Sangeet Celebrations',
    description: 'Vibrant marigold decor and joy-filled Haldi rituals with family.',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1200',
    altText: 'Vibrant Haldi Ceremony by Chitrakatha',
    location: 'Nashik, MH',
    date: 'January 2026',
    featured: true,
    hidden: false,
    watermarked: true,
    displayOrder: 2
  },
  {
    id: 'img-w3',
    categoryId: 'cat-wedding',
    category: 'Wedding',
    title: 'Maharashtrian Traditional Pheras & Saptapadi',
    description: 'Sacred fire rituals and emotional Phera moments captured in timeless detail.',
    image: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&q=80&w=1200',
    altText: 'Traditional Maharashtrian Wedding Ceremony',
    location: 'Satana, MH',
    date: 'November 2025',
    featured: true,
    hidden: false,
    watermarked: true,
    displayOrder: 3
  },
  {
    id: 'img-w4',
    categoryId: 'cat-wedding',
    category: 'Wedding',
    title: 'Cinematic Royal Bride Portrait',
    description: 'Elegant bridal portrait with intricate jewelry and royal wedding attire.',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=1200',
    altText: 'Cinematic Bride Portrait by Hemant Mandawade',
    location: 'Mumbai, MH',
    date: 'February 2026',
    featured: true,
    hidden: false,
    watermarked: true,
    displayOrder: 4
  },

  // PRE-WEDDING CATEGORY (4 PHOTOS)
  {
    id: 'img-pw1',
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
    displayOrder: 5
  },
  {
    id: 'img-pw2',
    categoryId: 'cat-prewedding',
    category: 'Pre-Wedding',
    title: 'Golden Hour Vineyard Romance in Sula',
    description: 'Romantic stroll amidst sunlit vineyards and lush green rows.',
    image: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&q=80&w=1200',
    altText: 'Golden Hour Pre Wedding Vineyard Shoot',
    location: 'Nashik, MH',
    date: 'February 2026',
    featured: true,
    hidden: false,
    watermarked: true,
    displayOrder: 6
  },
  {
    id: 'img-pw3',
    categoryId: 'cat-prewedding',
    category: 'Pre-Wedding',
    title: 'Lakeside Sunset Reflections',
    description: 'Serene lakeside shoot with golden sky and reflection aesthetics.',
    image: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&q=80&w=1200',
    altText: 'Lakeside Pre Wedding Shoot',
    location: 'Pawna Lake, MH',
    date: 'December 2025',
    featured: true,
    hidden: false,
    watermarked: true,
    displayOrder: 7
  },
  {
    id: 'img-pw4',
    categoryId: 'cat-prewedding',
    category: 'Pre-Wedding',
    title: 'Heritage Fort & Palatial Architecture',
    description: 'Royal couple portraits against grand stone arches and carved fort gates.',
    image: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&q=80&w=1200',
    altText: 'Heritage Fort Pre Wedding Shoot',
    location: 'Jadhavgadh, MH',
    date: 'January 2026',
    featured: true,
    hidden: false,
    watermarked: true,
    displayOrder: 8
  },

  // ENGAGEMENT CATEGORY (3 PHOTOS)
  {
    id: 'img-eng1',
    categoryId: 'cat-engagement',
    category: 'Engagement',
    title: 'Romantic Ring Ceremony in Nashik',
    description: 'Candid engagement moments captured amidst vineyard landscapes.',
    image: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&q=80&w=1200',
    altText: 'Romantic Ring Ceremony Nashik',
    location: 'Nashik, MH',
    date: 'February 2026',
    featured: true,
    hidden: false,
    watermarked: true,
    displayOrder: 9
  },
  {
    id: 'img-eng2',
    categoryId: 'cat-engagement',
    category: 'Engagement',
    title: 'Floral Ring Exchange Moments',
    description: 'Close-up ring exchange ceremony with glowing stage backdrop.',
    image: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&q=80&w=1200',
    altText: 'Floral Ring Exchange Engagement',
    location: 'Pune, MH',
    date: 'January 2026',
    featured: true,
    hidden: false,
    watermarked: true,
    displayOrder: 10
  },
  {
    id: 'img-eng3',
    categoryId: 'cat-engagement',
    category: 'Engagement',
    title: 'Evening Ring Ceremony Reception',
    description: 'Glamorous evening engagement party with fireworks and champagne toast.',
    image: 'https://images.unsplash.com/photo-1529636798458-92182e662485?auto=format&fit=crop&q=80&w=1200',
    altText: 'Engagement Reception Party',
    location: 'Mumbai, MH',
    date: 'December 2025',
    featured: true,
    hidden: false,
    watermarked: true,
    displayOrder: 11
  },

  // BABY SHOOT CATEGORY (3 PHOTOS)
  {
    id: 'img-baby1',
    categoryId: 'cat-babyshoot',
    category: 'Baby Shoot',
    title: 'Little Prince Newborn Milestone Shoot',
    description: 'Cute newborn baby portraits with soft pastel props and fluffy blankets.',
    image: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&q=80&w=1200',
    altText: 'Newborn Baby Shoot by Chitrakatha',
    location: 'Satana, MH',
    date: 'January 2026',
    featured: true,
    hidden: false,
    watermarked: true,
    displayOrder: 12
  },
  {
    id: 'img-baby2',
    categoryId: 'cat-babyshoot',
    category: 'Baby Shoot',
    title: 'First Birthday Cake Smash Fun',
    description: 'Joyous 1st birthday cake smash portraits with colorful balloon arch.',
    image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=1200',
    altText: 'Baby Cake Smash Photography',
    location: 'Nashik, MH',
    date: 'February 2026',
    featured: true,
    hidden: false,
    watermarked: true,
    displayOrder: 13
  },
  {
    id: 'img-baby3',
    categoryId: 'cat-babyshoot',
    category: 'Baby Shoot',
    title: 'Adorable Baby Smile & Warm Swaddle',
    description: 'Sweet sleeping baby portrait captured in natural studio light.',
    image: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&q=80&w=1200',
    altText: 'Adorable Baby Portrait Shoot',
    location: 'Pune, MH',
    date: 'November 2025',
    featured: true,
    hidden: false,
    watermarked: true,
    displayOrder: 14
  },

  // MATERNITY CATEGORY (3 PHOTOS)
  {
    id: 'img-mat1',
    categoryId: 'cat-maternity',
    category: 'Maternity',
    title: 'Blissful Motherhood Outdoor Portrait',
    description: 'Graceful maternity gown portrait in golden sunset field.',
    image: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&q=80&w=1200',
    altText: 'Maternity Photography by Chitrakatha',
    location: 'Nashik, MH',
    date: 'January 2026',
    featured: true,
    hidden: false,
    watermarked: true,
    displayOrder: 15
  },
  {
    id: 'img-mat2',
    categoryId: 'cat-maternity',
    category: 'Maternity',
    title: 'Parents-to-Be Warm Embrace',
    description: 'Heartwarming couple portrait celebrating upcoming parenthood.',
    image: 'https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?auto=format&fit=crop&q=80&w=1200',
    altText: 'Parents to be Maternity Shoot',
    location: 'Pune, MH',
    date: 'December 2025',
    featured: true,
    hidden: false,
    watermarked: true,
    displayOrder: 16
  },
  {
    id: 'img-mat3',
    categoryId: 'cat-maternity',
    category: 'Maternity',
    title: 'Floral Studio Maternity Glow',
    description: 'Studio maternity shoot with fresh flower arrangements.',
    image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=1200',
    altText: 'Studio Maternity Portrait',
    location: 'Satana, MH',
    date: 'February 2026',
    featured: true,
    hidden: false,
    watermarked: true,
    displayOrder: 17
  },

  // FASHION CATEGORY (3 PHOTOS)
  {
    id: 'img-fas1',
    categoryId: 'cat-fashion',
    category: 'Fashion',
    title: 'High-Fashion Designer Editorial',
    description: 'Contemporary ethnic couture model shoot with dramatic lighting.',
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=1200',
    altText: 'High Fashion Editorial Shoot',
    location: 'Mumbai, MH',
    date: 'January 2026',
    featured: true,
    hidden: false,
    watermarked: true,
    displayOrder: 18
  },
  {
    id: 'img-fas2',
    categoryId: 'cat-fashion',
    category: 'Fashion',
    title: 'Contemporary Saree Lookbook',
    description: 'Elegant Maharashtrian saree lookbook photography.',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=1200',
    altText: 'Saree Lookbook Fashion Shoot',
    location: 'Pune, MH',
    date: 'February 2026',
    featured: true,
    hidden: false,
    watermarked: true,
    displayOrder: 19
  },
  {
    id: 'img-fas3',
    categoryId: 'cat-fashion',
    category: 'Fashion',
    title: 'Urban Street Style Portrait',
    description: 'Modern urban fashion model portraits with moody tones.',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=1200',
    altText: 'Urban Street Style Model Shoot',
    location: 'Nashik, MH',
    date: 'December 2025',
    featured: true,
    hidden: false,
    watermarked: true,
    displayOrder: 20
  },

  // DRONE & AERIAL CATEGORY (3 PHOTOS)
  {
    id: 'img-[#8B0000]dr1',
    categoryId: 'cat-drone',
    category: 'Drone',
    title: 'Aerial View of Grand Palace Wedding Venue',
    description: 'DGCA licensed 4K aerial photography of sprawling venue and guests.',
    image: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&q=80&w=1200',
    altText: 'Drone Aerial Wedding Venue View',
    location: 'Pune, MH',
    date: 'December 2025',
    featured: true,
    hidden: false,
    watermarked: true,
    displayOrder: 21
  },
  {
    id: 'img-[#8B0000]dr2',
    categoryId: 'cat-drone',
    category: 'Drone',
    title: 'Top-Down Beach Pre-Wedding Silhouette',
    description: 'Stunning overhead drone shot of couple walking on sea shore.',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1200',
    altText: 'Top Down Drone Beach Pre Wedding',
    location: 'Alibaug, MH',
    date: 'January 2026',
    featured: true,
    hidden: false,
    watermarked: true,
    displayOrder: 22
  },
  {
    id: 'img-[#8B0000]dr3',
    categoryId: 'cat-drone',
    category: 'Drone',
    title: 'Misty Sahyadri Mountain Landscape Aerial',
    description: 'Cinematic mountain valley aerial view during pre-wedding shoot.',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1200',
    altText: 'Sahyadri Mountain Drone Photography',
    location: 'Mahabaleshwar, MH',
    date: 'February 2026',
    featured: true,
    hidden: false,
    watermarked: true,
    displayOrder: 23
  }
];

export const INITIAL_VIDEOS = [
  // WEDDING FILMS (4 VIDEOS)
  {
    id: 'vid-w1',
    title: 'Aditya & Ananya - Royal Destination Wedding Film',
    description: '4K Cinematic Feature Film capturing sacred vows, sangeet night, and grand reception.',
    category: 'Wedding Film',
    duration: '04:25',
    thumbnail: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-photographer-taking-photos-of-a-bride-and-groom-43889-large.mp4',
    location: 'Satana & Nashik',
    views: '24k',
    featured: true,
    hidden: false,
    displayOrder: 1
  },
  {
    id: 'vid-w2',
    title: 'Rohan & Sneha - Grand Maharashtrian Heritage Wedding',
    description: 'Traditional rituals, Shehnai melodies, and emotional Vidai moments in 4K resolution.',
    category: 'Wedding Film',
    duration: '05:10',
    thumbnail: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=800',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-wedding-couple-walking-and-holding-hands-43892-large.mp4',
    location: 'Pune, MH',
    views: '18k',
    featured: true,
    hidden: false,
    displayOrder: 2
  },
  {
    id: 'vid-w3',
    title: 'Karan & Pooja - Palace Royal Vows Highlights',
    description: 'Bespoke bridal entry, varmala celebration, and fireworks show.',
    category: 'Wedding Film',
    duration: '03:45',
    thumbnail: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&q=80&w=800',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-bride-and-groom-posing-for-photos-43891-large.mp4',
    location: 'Mumbai, MH',
    views: '15k',
    featured: true,
    hidden: false,
    displayOrder: 3
  },
  {
    id: 'vid-w4',
    title: 'Vikas & Shruti - Traditional Saptapadi Highlights',
    description: 'Emotional family moments and traditional rituals captured in slow-motion cinema.',
    category: 'Wedding Film',
    duration: '04:00',
    thumbnail: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=800',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-photographer-taking-photos-of-a-bride-and-groom-43889-large.mp4',
    location: 'Nashik, MH',
    views: '12k',
    featured: true,
    hidden: false,
    displayOrder: 4
  },

  // ENGAGEMENT VIDEOS (4 VIDEOS)
  {
    id: 'vid-eng1',
    title: 'Siddharth & Neha - Magical Ring Ceremony & Engagement Film',
    description: 'Golden hour ring exchange, champagne toast, and romantic couple dance performance.',
    category: 'Engagement',
    duration: '03:30',
    thumbnail: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&q=80&w=800',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-wedding-couple-walking-and-holding-hands-43892-large.mp4',
    location: 'Nashik Vineyards, MH',
    views: '19k',
    featured: true,
    hidden: false,
    displayOrder: 5
  },
  {
    id: 'vid-eng2',
    title: 'Pranav & Tanvi - Sunset Cocktail & Engagement Bash',
    description: 'Lively ring ceremony night with family dance numbers and sparkler entrance.',
    category: 'Engagement',
    duration: '04:15',
    thumbnail: 'https://images.unsplash.com/photo-1529636798458-92182e662485?auto=format&fit=crop&q=80&w=800',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-bride-and-groom-posing-for-photos-43891-large.mp4',
    location: 'Pune, MH',
    views: '14k',
    featured: true,
    hidden: false,
    displayOrder: 6
  },
  {
    id: 'vid-eng3',
    title: 'Sameer & Riya - Romantic Vineyard Engagement Vows',
    description: 'Bespoke ring exchange against sunset vineyard rows and floral arches.',
    category: 'Engagement',
    duration: '03:10',
    thumbnail: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&q=80&w=800',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-photographer-taking-photos-of-a-bride-and-groom-43889-large.mp4',
    location: 'Sula Vineyards, MH',
    views: '11k',
    featured: true,
    hidden: false,
    displayOrder: 7
  },
  {
    id: 'vid-eng4',
    title: 'Gaurav & Ishita - Candlelight Engagement Night',
    description: 'Intimate rooftop engagement film filled with heartwarming speeches and music.',
    category: 'Engagement',
    duration: '03:50',
    thumbnail: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-wedding-couple-walking-and-holding-hands-43892-large.mp4',
    location: 'Satana, MH',
    views: '9.5k',
    featured: true,
    hidden: false,
    displayOrder: 8
  },

  // PRE-WEDDING FILMS (4 VIDEOS)
  {
    id: 'vid-pw1',
    title: 'Harsh & Meera - Misty Hills Pre-Wedding Film',
    description: 'Breathtaking 4K love story shot across misty mountain peaks and serene lakes.',
    category: 'Pre-Wedding',
    duration: '04:40',
    thumbnail: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=800',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-wedding-couple-walking-and-holding-hands-43892-large.mp4',
    location: 'Mahabaleshwar, MH',
    views: '22k',
    featured: true,
    hidden: false,
    displayOrder: 9
  },
  {
    id: 'vid-pw2',
    title: 'Varun & Priya - Fort & Heritage Architecture Pre-Wedding',
    description: 'Royal couple teaser filmed against historic stone fort gates and palatial courtyards.',
    category: 'Pre-Wedding',
    duration: '03:25',
    thumbnail: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&q=80&w=800',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-bride-and-groom-posing-for-photos-43891-large.mp4',
    location: 'Fort Jadhavgadh, MH',
    views: '16k',
    featured: true,
    hidden: false,
    displayOrder: 10
  },
  {
    id: 'vid-pw3',
    title: 'Kunal & Diya - Pawna Lakeside Romance',
    description: 'Golden reflections, boat rides, and romantic slow-motion moments.',
    category: 'Pre-Wedding',
    duration: '03:55',
    thumbnail: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&q=80&w=800',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-photographer-taking-photos-of-a-bride-and-groom-43889-large.mp4',
    location: 'Pawna Lake, MH',
    views: '13k',
    featured: true,
    hidden: false,
    displayOrder: 11
  },
  {
    id: 'vid-pw4',
    title: 'Akash & Maya - Vintage Beachside Love Tale',
    description: 'Sunset beach walk and wave reflections in cinematic 4K.',
    category: 'Pre-Wedding',
    duration: '04:10',
    thumbnail: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&q=80&w=800',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-wedding-couple-walking-and-holding-hands-43892-large.mp4',
    location: 'Alibaug, MH',
    views: '10k',
    featured: true,
    hidden: false,
    displayOrder: 12
  },

  // MATERNITY FILMS (4 VIDEOS)
  {
    id: 'vid-mat1',
    title: 'Pooja & Nikhil - Blissful Motherhood Journey Film',
    description: 'Emotional 4K film celebrating upcoming parenthood and glowing maternity portraits.',
    category: 'Maternity',
    duration: '03:15',
    thumbnail: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&q=80&w=800',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-wedding-couple-walking-and-holding-hands-43892-large.mp4',
    location: 'Nashik, MH',
    views: '11k',
    featured: true,
    hidden: false,
    displayOrder: 13
  },
  {
    id: 'vid-mat2',
    title: 'Snehal & Rajesh - Sunset Field Maternity Glow',
    description: 'Golden hour outdoor maternity shoot with lush green meadows.',
    category: 'Maternity',
    duration: '02:50',
    thumbnail: 'https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?auto=format&fit=crop&q=80&w=800',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-photographer-taking-photos-of-a-bride-and-groom-43889-large.mp4',
    location: 'Pune, MH',
    views: '8.5k',
    featured: true,
    hidden: false,
    displayOrder: 14
  },
  {
    id: 'vid-mat3',
    title: 'Anita & Chetan - Floral Studio Maternity Teaser',
    description: 'Studio floral decorations and graceful mother-to-be portraits.',
    category: 'Maternity',
    duration: '03:05',
    thumbnail: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=800',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-bride-and-groom-posing-for-photos-43891-large.mp4',
    location: 'Satana, MH',
    views: '7k',
    featured: true,
    hidden: false,
    displayOrder: 15
  },
  {
    id: 'vid-mat4',
    title: 'Kavita & Amit - Warm Family Welcome Film',
    description: 'Heartfelt family film capturing anticipation and joy.',
    category: 'Maternity',
    duration: '03:20',
    thumbnail: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&q=80&w=800',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-wedding-couple-walking-and-holding-hands-43892-large.mp4',
    location: 'Mumbai, MH',
    views: '6k',
    featured: true,
    hidden: false,
    displayOrder: 16
  },

  // FASHION & COMMERCIAL FILMS (4 VIDEOS)
  {
    id: 'vid-fas1',
    title: 'Ethnic Couture - Luxury Saree Lookbook Film',
    description: 'High-fashion editorial showcase with dramatic lighting and traditional music.',
    category: 'Fashion',
    duration: '02:45',
    thumbnail: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=800',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-bride-and-groom-posing-for-photos-43891-large.mp4',
    location: 'Mumbai, MH',
    views: '28k',
    featured: true,
    hidden: false,
    displayOrder: 17
  },
  {
    id: 'vid-fas2',
    title: 'Royal Designer Jewelry Brand Commercial',
    description: 'Cinematic brand commercial highlighting intricate Kundan & gold bridal jewelry.',
    category: 'Fashion',
    duration: '03:00',
    thumbnail: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-photographer-taking-photos-of-a-bride-and-groom-43889-large.mp4',
    location: 'Pune, MH',
    views: '21k',
    featured: true,
    hidden: false,
    displayOrder: 18
  },
  {
    id: 'vid-fas3',
    title: 'Urban Street Style Model Promo',
    description: 'Modern aesthetic model portfolio shoot with moody tones.',
    category: 'Fashion',
    duration: '02:30',
    thumbnail: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=800',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-wedding-couple-walking-and-holding-hands-43892-large.mp4',
    location: 'Nashik, MH',
    views: '15k',
    featured: true,
    hidden: false,
    displayOrder: 19
  },
  {
    id: 'vid-fas4',
    title: 'Contemporary Bridal Lehenga Showcase',
    description: 'Studio commercial showcasing rich silk lehengas and slow-motion details.',
    category: 'Fashion',
    duration: '02:55',
    thumbnail: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=800',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-photographer-taking-photos-of-a-bride-and-groom-43889-large.mp4',
    location: 'Mumbai, MH',
    views: '12k',
    featured: true,
    hidden: false,
    displayOrder: 20
  },

  // CINEMATIC DRONE FILMS (4 VIDEOS)
  {
    id: 'vid-dr1',
    title: 'Grand Palace Destination Wedding Venue Aerials',
    description: '4K Drone Reel showcasing palatial architecture, gardens, and fireworks.',
    category: 'Drone',
    duration: '03:40',
    thumbnail: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-wedding-couple-walking-and-holding-hands-43892-large.mp4',
    location: 'Udaipur & Nashik',
    views: '35k',
    featured: true,
    hidden: false,
    displayOrder: 21
  },
  {
    id: 'vid-dr2',
    title: 'Misty Sahyadri Mountain Sunset Aerial Cinema',
    description: 'Panoramic drone flight over mountain ranges and lush green valleys.',
    category: 'Drone',
    duration: '03:15',
    thumbnail: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-bride-and-groom-posing-for-photos-43891-large.mp4',
    location: 'Mahabaleshwar, MH',
    views: '26k',
    featured: true,
    hidden: false,
    displayOrder: 22
  },
  {
    id: 'vid-dr3',
    title: 'Lakeside Sunset & Island Aerial Flyover',
    description: 'High-altitude drone shoot over calm waters and sunset horizons.',
    category: 'Drone',
    duration: '03:30',
    thumbnail: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&q=80&w=800',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-photographer-taking-photos-of-a-bride-and-groom-43889-large.mp4',
    location: 'Pawna Lake, MH',
    views: '20k',
    featured: true,
    hidden: false,
    displayOrder: 23
  },
  {
    id: 'vid-dr4',
    title: 'Fort Jadhavgadh Royal Courtyard Drone Reel',
    description: 'Birds-eye view of royal barat procession and fort architecture.',
    category: 'Drone',
    duration: '03:00',
    thumbnail: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&q=80&w=800',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-wedding-couple-walking-and-holding-hands-43892-large.mp4',
    location: 'Jadhavgadh, MH',
    views: '17k',
    featured: true,
    hidden: false,
    displayOrder: 24
  }
];

export const INITIAL_PACKAGES = [
  {
    id: 'pkg-wedding-1',
    category: 'Wedding',
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
    eventType: 'Wedding',
    date: '2026-11-20',
    time: 'Morning (09:00 AM)',
    notes: '2-Day Wedding at Oxford Golf Resort, Pune. Need drone and luxury albums.',
    source: 'Website Booking Form',
    status: 'Confirmed',
    createdAt: '2026-08-01'
  }
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

export const INITIAL_SITE_IMAGES = [
  {
    id: 'img-about-main',
    section: 'about',
    image_url: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&q=80&w=1000',
    title: 'Hemant Mandawade Profile Photo',
    category: 'About Me',
    display_order: 1,
    is_active: true
  },
  {
    id: 'img-hero-1',
    section: 'hero',
    image_url: 'https://assets.mixkit.co/videos/preview/mixkit-photographer-taking-photos-of-a-bride-and-groom-43889-large.mp4',
    title: 'Hero Background Video / Image 1',
    category: 'Hero',
    display_order: 1,
    is_active: true
  },
  {
    id: 'img-logo-main',
    section: 'logo',
    image_url: '',
    title: 'Website Main Logo',
    category: 'Logo',
    display_order: 1,
    is_active: true
  }
];
