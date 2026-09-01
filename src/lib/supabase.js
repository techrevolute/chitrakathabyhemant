import { createClient } from '@supabase/supabase-js';
import { setPersistentItem, getPersistentItem, removePersistentItem } from './storage';

// Read Environment Variables (with production project fallbacks for build and multi-device sync)
const DEFAULT_SUPABASE_URL = 'https://vlnransfhfgkevnjoolk.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZsbnJhbnNmaGZna2V2bmpvb2xrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgwODIyNjMsImV4cCI6MjEwMzY1ODI2M30.8En8A8TmuqWD8cAX22yS2l-g1d1osxqb4aWWrCmvsRU';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

// Create Supabase Client instance (or null fallback)
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Neutral SVG Placeholder so failing images NEVER display another portfolio item
export const NEUTRAL_IMAGE_PLACEHOLDER = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600"><rect width="800" height="600" fill="%231c1c1c"/><path d="M400 250c-33.1 0-60 26.9-60 60s26.9 60 60 60 60-26.9 60-60-26.9-60-60-60zm0 90c-16.5 0-30-13.5-30-30s13.5-30 30-30 30 13.5 30 30-13.5 30-30 30z" fill="%238B0000"/><path d="M500 190h-50l-20-25h-60l-20 25h-50c-22.1 0-40 17.9-40 40v160c0 22.1 17.9 40 40 40h240c22.1 0 40-17.9 40-40V230c0-22.1-17.9-40-40-40zm15 200c0 8.3-6.7 15-15 15H260c-8.3 0-15-6.7-15-15V230c0-8.3 6.7-15 15-15h58.8l20-25h82.5l20 25H500c8.3 0 15 6.7 15 15v160z" fill="%238B0000"/><text x="400" y="440" font-family="sans-serif" font-size="16" fill="%23a8a29e" text-anchor="middle">Image Loading Unavailable</text></svg>`;

export const DEFAULT_FALLBACK_IMAGE = NEUTRAL_IMAGE_PLACEHOLDER;

/**
 * Extract Google Drive Folder ID from various folder URL formats
 * e.g. https://drive.google.com/drive/folders/1a2b3c4d5e?usp=sharing
 * e.g. https://drive.google.com/drive/u/0/folders/1a2b3c4d5e
 */
export function extractGoogleDriveFolderId(url) {
  if (!url || typeof url !== 'string') return null;
  const cleanUrl = url.trim();

  // Pattern A: /folders/FOLDER_ID
  const folderMatch = cleanUrl.match(/\/folders\/([a-zA-Z0-9_-]+)/);
  if (folderMatch && folderMatch[1]) {
    return folderMatch[1];
  }

  // Pattern B: ?id=FOLDER_ID or &id=FOLDER_ID (when url contains folder)
  if (cleanUrl.includes('folder')) {
    const idMatch = cleanUrl.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (idMatch && idMatch[1]) {
      return idMatch[1];
    }
  }

  // Pattern C: Direct Folder ID (20 to 50 alphanumeric chars)
  if (/^[a-zA-Z0-9_-]{20,50}$/.test(cleanUrl)) {
    return cleanUrl;
  }

  return null;
}

/**
 * Fetch and extract up to 50 image photos from a public Google Drive Folder
 * Filters out PDFs, videos, documents, and non-image files.
 */
export async function fetchGoogleDriveFolderPhotos(folderUrlOrId, categoryName = 'Wedding') {
  const folderId = extractGoogleDriveFolderId(folderUrlOrId);
  if (!folderId) {
    throw new Error('Invalid Google Drive Folder URL or Folder ID.');
  }

  const targetUrl = `https://drive.google.com/embeddedfolderview?id=${folderId}#grid`;
  let htmlText = '';

  // Try direct fetch first, fallback to CORS proxies if browser restricts direct html fetch
  const fetchEndpoints = [
    targetUrl,
    `https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}`,
    `https://corsproxy.io/?${encodeURIComponent(targetUrl)}`
  ];

  for (const endpoint of fetchEndpoints) {
    try {
      const res = await fetch(endpoint, { cache: 'no-cache' });
      if (res.ok) {
        const text = await res.text();
        if (text && (text.includes('drive-viewer') || text.includes('entry-') || text.includes('uc?id=') || text.includes('thumbnail'))) {
          htmlText = text;
          break;
        }
      }
    } catch (e) {
      console.warn(`Folder fetch attempt failed for endpoint ${endpoint}:`, e);
    }
  }

  if (!htmlText) {
    throw new Error('Unable to access this Google Drive folder. Please check folder sharing permissions.');
  }

  // Extract file IDs and Titles using Regex Scanner
  const fileIdSet = new Set();
  const photos = [];

  // Match Pattern 1: id="entry-FILE_ID"
  const entryMatches = htmlText.matchAll(/id="entry-([a-zA-Z0-9_-]{25,50})"/g);
  for (const match of entryMatches) {
    if (match[1]) fileIdSet.add(match[1]);
  }

  // Match Pattern 2: /file/d/FILE_ID
  const fileDMatches = htmlText.matchAll(/\/file\/d\/([a-zA-Z0-9_-]{25,50})/g);
  for (const match of fileDMatches) {
    if (match[1]) fileIdSet.add(match[1]);
  }

  // Match Pattern 3: thumbnail?id=FILE_ID or uc?id=FILE_ID
  const ucMatches = htmlText.matchAll(/(?:uc\?id=|thumbnail\?id=)([a-zA-Z0-9_-]{25,50})/g);
  for (const match of ucMatches) {
    if (match[1]) fileIdSet.add(match[1]);
  }

  // Filter & Build Photo Objects (Max 50 items)
  const fileIds = Array.from(fileIdSet).slice(0, 50);

  if (fileIds.length === 0) {
    throw new Error('No accessible images found in this Google Drive folder. Please ensure the folder contains public images.');
  }

  fileIds.forEach((fileId, index) => {
    photos.push({
      id: `gdrive-${fileId}`,
      categoryId: `cat-${categoryName.toLowerCase().replace(/\s+/g, '-')}`,
      category: categoryName,
      title: `${categoryName} Photograph ${index + 1}`,
      description: `Captured by Hemant Mandawade. Google Drive synced photo.`,
      image: `https://drive.google.com/uc?export=view&id=${fileId}`,
      altText: `${categoryName} Shoot Photo ${index + 1} by Chitrakatha`,
      location: 'Maharashtra',
      date: 'Latest Shoot',
      featured: true,
      hidden: false,
      watermarked: true,
      displayOrder: index + 1,
      googleDriveFileId: fileId,
      googleDriveFolderId: folderId
    });
  });

  return {
    folderId,
    folderUrl: `https://drive.google.com/drive/folders/${folderId}`,
    photos,
    totalFetched: photos.length
  };
}

/**
 * Extract Google Drive File ID & convert to streamable direct image URL
 * Converts https://drive.google.com/file/d/FILE_ID/view?usp=sharing
 * to https://drive.google.com/uc?export=view&id=FILE_ID
 */
export function formatGoogleDriveUrl(url) {
  if (!url || typeof url !== 'string') return url;
  const cleanUrl = url.trim();

  if (cleanUrl.includes('drive.google.com') || cleanUrl.includes('docs.google.com') || cleanUrl.includes('googleusercontent.com')) {
    let fileId = null;

    // Pattern A: /file/d/FILE_ID/view or /file/d/FILE_ID
    const fileDMatch = cleanUrl.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (fileDMatch && fileDMatch[1]) {
      fileId = fileDMatch[1];
    }

    // Pattern B: ?id=FILE_ID or &id=FILE_ID
    if (!fileId) {
      const idMatch = cleanUrl.match(/[?&]id=([a-zA-Z0-9_-]+)/);
      if (idMatch && idMatch[1]) {
        fileId = idMatch[1];
      }
    }

    // Pattern C: /d/FILE_ID
    if (!fileId) {
      const dMatch = cleanUrl.match(/\/d\/([a-zA-Z0-9_-]+)/);
      if (dMatch && dMatch[1]) {
        fileId = dMatch[1];
      }
    }

    if (fileId) {
      return `https://drive.google.com/uc?export=view&id=${fileId}`;
    }
  }

  return cleanUrl;
}

// Helper to append cache-busting timestamp to image URLs & convert Google Drive URLs
export function appendCacheBuster(url) {
  if (!url || typeof url !== 'string' || url.startsWith('data:') || url.startsWith('blob:')) {
    return url;
  }

  // Never corrupt video URLs (YouTube, Vimeo, Google Drive, direct video files) with query parameter timestamps
  if (
    url.includes('youtube.com') ||
    url.includes('youtu.be') ||
    url.includes('vimeo.com') ||
    url.includes('drive.google.com') ||
    url.includes('googleusercontent.com') ||
    url.includes('mixkit.co') ||
    url.includes('pexels.com') ||
    url.includes('cloudinary.com') ||
    Boolean(url.match(/\.(mp4|webm|mov|m4v|ogg)(\?.*)?$/i))
  ) {
    return formatGoogleDriveUrl(url);
  }

  const formatted = formatGoogleDriveUrl(url);
  const timestamp = Date.now();
  const separator = formatted.includes('?') ? '&' : '?';
  return `${formatted}${separator}v=${timestamp}`;
}

/**
 * Parse any Video URL (YouTube, Vimeo, Google Drive, Dropbox, Mixkit, Cloudinary, direct MP4/WebM)
 */
export function parseVideoUrl(url) {
  if (!url || typeof url !== 'string') return { isVideo: false, type: 'none', src: '' };
  const clean = url.trim();

  // YouTube match
  const ytMatch = clean.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
  if (ytMatch && ytMatch[1]) {
    return {
      isVideo: true,
      type: 'youtube',
      id: ytMatch[1],
      embedUrl: `https://www.youtube-nocookie.com/embed/${ytMatch[1]}?autoplay=1&mute=1&loop=1&playlist=${ytMatch[1]}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&enablejsapi=1`
    };
  }

  // Vimeo match
  const vimeoMatch = clean.match(/(?:vimeo\.com\/)(\d+)/i);
  if (vimeoMatch && vimeoMatch[1]) {
    return {
      isVideo: true,
      type: 'vimeo',
      id: vimeoMatch[1],
      embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1&muted=1&loop=1&background=1&autopause=0`
    };
  }

  // Google Drive
  if (clean.includes('drive.google.com') || clean.includes('docs.google.com')) {
    const dMatch = clean.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || clean.match(/[?&]id=([a-zA-Z0-9_-]+)/) || clean.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (dMatch && dMatch[1]) {
      const fileId = dMatch[1];
      return {
        isVideo: true,
        type: 'direct',
        src: `https://drive.google.com/uc?export=download&id=${fileId}`
      };
    }
  }

  // Dropbox
  if (clean.includes('dropbox.com')) {
    return {
      isVideo: true,
      type: 'direct',
      src: clean.replace('dl=0', 'raw=1')
    };
  }

  // Standard Video file formats, blob, data, or CDN video
  if (
    clean.startsWith('blob:') ||
    clean.startsWith('data:video') ||
    Boolean(clean.match(/\.(mp4|webm|mov|m4v|ogg)(\?.*)?$/i)) ||
    clean.includes('video') ||
    clean.includes('mixkit.co') ||
    clean.includes('pexels.com') ||
    clean.includes('cloudinary.com')
  ) {
    return {
      isVideo: true,
      type: 'direct',
      src: clean
    };
  }

  return {
    isVideo: false,
    type: 'image',
    src: appendCacheBuster(clean)
  };
}

export function formatImageUrl(url) {
  if (!url || typeof url !== 'string') return NEUTRAL_IMAGE_PLACEHOLDER;
  return appendCacheBuster(url);
}

/**
 * Handle broken or failing images cleanly with Google Drive CDN retries (using exact SAME FILE_ID)
 * and neutral SVG fallback so it NEVER displays another portfolio photo!
 */
export function handleImageError(e, customFallback = null) {
  if (!e || !e.target) return;
  const target = e.target;
  const currentSrc = target.src || '';

  // Extract Google Drive File ID from current URL
  let fileId = null;
  const ucMatch = currentSrc.match(/id=([a-zA-Z0-9_-]+)/);
  if (ucMatch && ucMatch[1]) {
    fileId = ucMatch[1];
  } else {
    const dMatch = currentSrc.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (dMatch && dMatch[1]) {
      fileId = dMatch[1];
    }
  }

  // Level 1 Retry: Google Content CDN endpoint with exact same FILE_ID
  if (fileId && target.getAttribute('data-tried-lh3') !== 'true') {
    target.setAttribute('data-tried-lh3', 'true');
    target.src = `https://lh3.googleusercontent.com/d/${fileId}`;
    return;
  }

  // Level 2 Retry: Google Drive Thumbnail endpoint with exact same FILE_ID
  if (fileId && target.getAttribute('data-tried-thumb') !== 'true') {
    target.setAttribute('data-tried-thumb', 'true');
    target.src = `https://drive.google.com/thumbnail?id=${fileId}&sz=w1600`;
    return;
  }

  // Final fallback: Use custom fallback or Neutral SVG Placeholder. NEVER swap to a different photo!
  const finalFallback = customFallback || NEUTRAL_IMAGE_PLACEHOLDER;
  if (target.src !== finalFallback) {
    target.src = finalFallback;
  }
}

/**
 * Compress High-Res Images for Safe LocalStorage & IndexedDB Persistence
 * Converts high-res photos (15MB+) to optimized crisp ~70-120KB Data URLs
 */
export function compressImageFile(file, maxWidth = 1200, maxHeight = 1200, quality = 0.78) {
  return new Promise((resolve) => {
    if (!file || !file.type || !file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = () => resolve('');
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const mimeType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
          const compressedDataUrl = canvas.toDataURL(mimeType, quality);
          resolve(compressedDataUrl);
        } else {
          resolve(event.target.result);
        }
      };
      img.onerror = () => resolve(event.target.result);
      img.src = event.target.result;
    };
    reader.onerror = () => resolve('');
    reader.readAsDataURL(file);
  });
}

// ============================================================================
// HYBRID DATA SERVICE ENGINE (SUPABASE + PERISTENT STORAGE FALLBACK)
// ============================================================================

/**
 * Submit New Booking Request
 */
export async function apiCreateBooking(bookingData) {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('booking_requests')
      .insert([{
        customer_name: bookingData.name,
        phone: bookingData.phone,
        email: bookingData.email,
        city: bookingData.city,
        event_type: bookingData.eventType,
        preferred_date: bookingData.date,
        preferred_time: bookingData.time,
        message: bookingData.notes,
        status: 'New'
      }])
      .select();

    if (error) {
      console.error('Supabase Booking Insert Error:', error);
    } else if (data && data.length > 0) {
      return data[0];
    }
  }

  // Fallback to Persistent Storage
  const saved = (await getPersistentItem('chitrakatha_bookings')) || [];
  const newBooking = {
    id: `bk-${Date.now()}`,
    ...bookingData,
    status: 'New',
    createdAt: new Date().toISOString().split('T')[0]
  };
  saved.unshift(newBooking);
  await setPersistentItem('chitrakatha_bookings', saved);
  return newBooking;
}

/**
 * Fetch All Bookings (Admin Only)
 */
export async function apiFetchBookings() {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('booking_requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      return data.map(b => ({
        id: b.id,
        name: b.customer_name,
        phone: b.phone,
        email: b.email,
        city: b.city,
        eventType: b.event_type,
        date: b.preferred_date,
        time: b.preferred_time,
        notes: b.message,
        status: b.status,
        createdAt: b.created_at
      }));
    }
  }

  return (await getPersistentItem('chitrakatha_bookings')) || [];
}

/**
 * Upload File to Supabase Storage Bucket and return permanent public HTTPS URL
 */
export async function apiUploadStorageFile(bucketName = 'website-images', file) {
  if (!file) return null;

  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Supabase storage is not configured.');
  }

  const isVideo = file.type ? file.type.startsWith('video/') : false;
  const fileExt = file.name ? file.name.split('.').pop() : (isVideo ? 'mp4' : 'png');
  const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
  const filePath = `${fileName}`;

  console.log(`[Storage Upload] Uploading ${file.name || 'file'} to bucket "${bucketName}"...`);

  const { error: uploadError } = await supabase.storage
    .from(bucketName)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: true
    });

  if (uploadError) {
    console.error('[Storage Upload Error]:', uploadError.message);
    throw new Error(`Storage Upload Error: ${uploadError.message || 'Bucket not found or permission denied'}`);
  }

  const { data } = supabase.storage
    .from(bucketName)
    .getPublicUrl(filePath);

  if (!data || !data.publicUrl) {
    throw new Error('Failed to retrieve permanent public HTTPS URL from Supabase Storage.');
  }

  console.log('[Storage Upload Success] Permanent HTTPS URL:', data.publicUrl);
  return {
    publicUrl: data.publicUrl,
    storagePath: filePath
  };
}

/**
 * Fetch All Dynamic Site Content & Images from Production Supabase
 */
export async function apiFetchSiteImages(section = null) {
  if (!isSupabaseConfigured || !supabase) {
    console.warn('Supabase not configured, returning empty list');
    return [];
  }

  try {
    let query = supabase.from('site_images').select('*').eq('is_active', true).order('display_order', { ascending: true });
    if (section) {
      query = query.eq('section', section);
    }
    const { data, error } = await query;
    if (error) {
      console.error('apiFetchSiteImages database error:', error.message);
      return [];
    }
    return data || [];
  } catch (err) {
    console.error('apiFetchSiteImages exception:', err);
    return [];
  }
}

/**
 * Universal Save / Upsert to Supabase `site_images` table
 * Strict Production Architecture: Throws error on failure, never fakes success.
 */
export async function apiSaveSiteImage(imageData) {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Supabase production database client is not configured.');
  }

  const rawUrl = imageData.image_url || imageData.imageUrl || '';
  if (rawUrl && (rawUrl.startsWith('blob:') || rawUrl.startsWith('data:video'))) {
    throw new Error('Temporary local blob or base64 video cannot be saved to the central database. Please wait for cloud upload to finish or provide a public video URL.');
  }

  const isVideo = Boolean(rawUrl.match(/\.(mp4|webm|mov|m4v)(\?.*)?$/i)) || rawUrl.startsWith('data:video');
  const formattedUrl = isVideo ? formatGoogleDriveUrl(rawUrl) : appendCacheBuster(rawUrl);
  const recordId = imageData.id || `${imageData.section || 'img'}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

  const payload = {
    id: recordId,
    section: imageData.section || 'other',
    image_url: formattedUrl,
    storage_path: imageData.storage_path || imageData.storagePath || null,
    title: imageData.title || '',
    category: imageData.category || '',
    display_order: imageData.display_order !== undefined ? imageData.display_order : (imageData.displayOrder || 0),
    is_active: imageData.is_active !== undefined ? imageData.is_active : true,
    data: imageData.data || (imageData.metadata ? imageData.metadata : null),
    updated_at: new Date().toISOString()
  };

  const { data, error } = await supabase
    .from('site_images')
    .upsert([payload], { onConflict: 'id' })
    .select();

  if (error) {
    console.error('Supabase DB upsert error:', error.message, error.details);
    throw new Error(error.message || 'Failed to save record to production database.');
  }

  if (!data || data.length === 0) {
    throw new Error('Database returned empty response after save.');
  }

  return data[0];
}

/**
 * Save Active Hero Banner (Title, Subtitle, Video/Image URL, Tagline) directly to Central Production Database
 * Strict Production Architecture: Throws error on failure.
 */
export async function apiSaveHeroData(heroData) {
  if (!isSupabaseConfigured || !supabase) {
    console.error('[apiSaveHeroData] Supabase production database client is not configured.');
    throw new Error('Supabase production database client is not configured.');
  }

  if (heroData.url && (heroData.url.startsWith('blob:') || heroData.url.startsWith('data:video'))) {
    console.error('[apiSaveHeroData] Temporary blob/base64 video URL rejected:', heroData.url);
    throw new Error('Temporary local blob or base64 video cannot be saved to the central database. Please wait for cloud upload to finish or provide a public video URL.');
  }

  const cleanUrl = heroData.url ? formatGoogleDriveUrl(heroData.url.trim()) : '';
  const heroTitle = heroData.title || 'Chitrakatha by Hemant';
  
  const payload = {
    id: 'hero-main',
    section: 'hero',
    image_url: cleanUrl,
    storage_path: null,
    title: heroTitle,
    category: 'Hero',
    display_order: 1,
    is_active: true,
    data: {
      title: heroTitle,
      subtitle: heroData.subtitle || '',
      tagline: heroData.tagline || 'LUXURY CINEMATIC PHOTOGRAPHY',
      url: cleanUrl
    },
    updated_at: new Date().toISOString()
  };

  console.log('[apiSaveHeroData] Sending UPSERT to Supabase table site_images:', payload);

  const { data, error } = await supabase
    .from('site_images')
    .upsert(payload, { onConflict: 'id' })
    .select()
    .single();

  if (error) {
    console.error('[apiSaveHeroData] Supabase UPSERT Error:', error.message, error);
    throw new Error(error.message || 'Failed to save hero banner to production database.');
  }

  if (!data) {
    console.error('[apiSaveHeroData] No database record returned from Supabase.');
    throw new Error('No database response returned when saving hero banner.');
  }

  console.log('[apiSaveHeroData] Supabase UPSERT Success Response:', data);
  return data;
}

/**
 * Save Active Hero Video/Slide to Supabase DB
 */
export async function apiSaveHeroVideo(videoUrl, title = 'Homepage Hero Video', storagePath = null, extraData = null) {
  const formattedUrl = appendCacheBuster(videoUrl);

  const payload = {
    id: 'hero-main',
    section: 'hero',
    image_url: formattedUrl,
    storage_path: storagePath,
    title: title,
    category: 'Hero',
    display_order: 1,
    is_active: true,
    data: extraData || {
      title: title,
      url: formattedUrl
    },
    updated_at: new Date().toISOString()
  };

  return await apiSaveSiteImage(payload);
}

/**
 * Save About Me Founder Data (Owner Name, Experience, Story, Mission, Vision, Profile Image)
 */
export async function apiSaveAboutData(aboutData) {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Supabase production database client is not configured.');
  }

  const formattedUrl = aboutData.profileImage ? (aboutData.profileImage.startsWith('blob:') || aboutData.profileImage.startsWith('data:') ? aboutData.profileImage : appendCacheBuster(aboutData.profileImage)) : '';
  
  const payload = {
    id: 'about-main',
    section: 'about',
    image_url: formattedUrl,
    storage_path: null,
    title: aboutData.ownerName || 'Hemant Mandawade',
    category: 'About Me',
    display_order: 1,
    is_active: true,
    data: {
      ownerName: aboutData.ownerName || 'Hemant Mandawade',
      experience: aboutData.experience || '12+ Years',
      story: aboutData.story || '',
      mission: aboutData.mission || '',
      vision: aboutData.vision || '',
      profileImage: formattedUrl
    },
    updated_at: new Date().toISOString()
  };

  const { data, error } = await supabase
    .from('site_images')
    .upsert([payload], { onConflict: 'id' })
    .select();

  if (error) {
    console.error('Supabase save aboutData error:', error.message);
    throw new Error(error.message || 'Failed to save about profile to production database.');
  }

  if (!data || data.length === 0) {
    throw new Error('No database response returned when saving about profile.');
  }

  return data[0];
}

/**
 * Save Global Business Info to Supabase
 */
export async function apiSaveBusinessInfo(infoData) {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Supabase production database client is not configured.');
  }

  const payload = {
    id: 'info-business-global',
    section: 'business_info',
    image_url: '',
    title: infoData.name || 'Chitrakatha by Hemant',
    category: 'Business Info',
    display_order: 0,
    is_active: true,
    data: infoData,
    updated_at: new Date().toISOString()
  };

  const { data, error } = await supabase
    .from('site_images')
    .upsert([payload], { onConflict: 'id' })
    .select();

  if (error) {
    console.error('Supabase save businessInfo error:', error.message);
    throw new Error(error.message || 'Failed to save business settings to production database.');
  }

  if (!data || data.length === 0) {
    throw new Error('No database response returned when saving business info.');
  }

  return data[0];
}

/**
 * Save / Update Single Service Offering
 */
export async function apiSaveServiceItem(serviceData) {
  const payload = {
    id: serviceData.id || `svc-${Date.now()}`,
    section: 'services',
    image_url: serviceData.image || '',
    title: serviceData.title || '',
    category: 'Services',
    display_order: serviceData.displayOrder || 0,
    is_active: true,
    data: serviceData,
    updated_at: new Date().toISOString()
  };
  return await apiSaveSiteImage(payload);
}

/**
 * Save / Update Single FAQ Item
 */
export async function apiSaveFaqItem(faqData) {
  const payload = {
    id: faqData.id || `faq-${Date.now()}`,
    section: 'faq',
    image_url: '',
    title: faqData.question || '',
    category: faqData.category || 'General',
    display_order: faqData.displayOrder || 0,
    is_active: !faqData.hidden,
    data: faqData,
    updated_at: new Date().toISOString()
  };
  return await apiSaveSiteImage(payload);
}

/**
 * Save / Update Single Brochure Item
 */
export async function apiSaveBrochureItem(brochureData) {
  const payload = {
    id: brochureData.id || `pdf-${Date.now()}`,
    section: 'brochure',
    image_url: brochureData.fileUrl || '',
    title: brochureData.name || '',
    category: brochureData.category || 'Wedding Packages',
    display_order: 0,
    is_active: brochureData.active !== false,
    data: brochureData,
    updated_at: new Date().toISOString()
  };
  return await apiSaveSiteImage(payload);
}

/**
 * Delete Dynamic Site Image or Entity by ID from Supabase
 */
export async function apiDeleteSiteImage(id, storagePath = null) {
  if (!id) return true;
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Supabase client is not configured.');
  }

  if (storagePath) {
    try {
      await supabase.storage.from('website-images').remove([storagePath]);
    } catch (sErr) {
      console.warn('Storage deletion error:', sErr);
    }
  }

  const { error } = await supabase.from('site_images').delete().eq('id', id);
  if (error) {
    console.error('Supabase delete error:', error.message);
    throw new Error(error.message || 'Failed to delete record from production database.');
  }

  return true;
}

/**
 * Subscribe to Supabase Realtime DB changes on `site_images` table
 * Fires callback instantly whenever Admin adds, edits, or deletes an item
 */
export function subscribeToRealtimeChanges(onUpdateCallback) {
  if (!isSupabaseConfigured || !supabase) return () => {};

  try {
    const channel = supabase
      .channel('site_images_realtime_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'site_images' },
        (payload) => {
          if (onUpdateCallback && typeof onUpdateCallback === 'function') {
            onUpdateCallback(payload);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  } catch (err) {
    console.warn('Realtime subscription exception:', err);
    return () => {};
  }
}
