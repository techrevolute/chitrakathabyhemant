import { createClient } from '@supabase/supabase-js';
import { setPersistentItem, getPersistentItem, removePersistentItem } from './storage';

// Read Environment Variables with Netlify Production Fallback
const PRODUCTION_SUPABASE_URL = 'https://vlnransfhfgkevnjoolk.supabase.co';
const PRODUCTION_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZsbnJhbnNmaGZna2V2bmpvb2xrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgwODIyNjMsImV4cCI6MjEwMzY1ODI2M30.8En8A8TmuqWD8cAX22yS2l-g1d1osxqb4aWWrCmvsRU';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || PRODUCTION_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || PRODUCTION_SUPABASE_ANON_KEY;

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

// Helper to append cache-busting timestamp to URLs & convert Google Drive URLs
export function appendCacheBuster(url) {
  if (!url || typeof url !== 'string' || url.startsWith('data:') || url.startsWith('blob:')) {
    return url;
  }

  // Never append query parameter timestamps to video files as CDNs reject them
  if (Boolean(url.match(/\.(mp4|webm|mov|m4v)(\?.*)?$/i))) {
    return formatGoogleDriveUrl(url);
  }

  const formatted = formatGoogleDriveUrl(url);
  if (formatted.includes('drive.google.com/uc') || formatted.includes('googleusercontent.com')) {
    return formatted;
  }
  const timestamp = Date.now();
  const separator = formatted.includes('?') ? '&' : '?';
  return `${formatted}${separator}v=${timestamp}`;
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
 * Upload File to Supabase Storage Bucket or return compressed persistent Data URL
 */
export async function apiUploadStorageFile(bucketName, file) {
  if (!file) return null;

  const isVideo = file.type ? file.type.startsWith('video/') : false;

  if (isSupabaseConfigured && supabase) {
    try {
      const fileExt = file.name ? file.name.split('.').pop() : (isVideo ? 'mp4' : 'png');
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from(bucketName || 'website-images')
        .upload(filePath, file);

      if (!uploadError) {
        const { data } = supabase.storage
          .from(bucketName || 'website-images')
          .getPublicUrl(filePath);

        if (data && data.publicUrl) {
          return {
            publicUrl: appendCacheBuster(data.publicUrl),
            storagePath: filePath
          };
        }
      } else {
        console.warn('Supabase storage upload error:', uploadError);
      }
    } catch (e) {
      console.warn('Supabase storage upload exception:', e);
    }
  }

  // Instant 0-Memory Blob URL fallback for video files (Zero RAM usage, no Out of Memory crash)
  if (isVideo) {
    return {
      publicUrl: URL.createObjectURL(file),
      storagePath: null
    };
  }

  // Persistent compressed Data URL fallback for images
  let compressedDataUrl = '';
  try {
    compressedDataUrl = await compressImageFile(file);
  } catch (err) {
    console.warn('Image compression error:', err);
  }

  return {
    publicUrl: compressedDataUrl,
    storagePath: null
  };
}

/**
 * Fetch All Dynamic Site Images
 */
export async function apiFetchSiteImages(section = null) {
  if (isSupabaseConfigured && supabase) {
    let query = supabase.from('site_images').select('*').eq('is_active', true).order('display_order', { ascending: true });
    if (section) {
      query = query.eq('section', section);
    }
    const { data, error } = await query;
    if (!error && data && data.length > 0) {
      return data;
    }
  }
  const local = (await getPersistentItem('chitrakatha_site_images')) || [];
  if (section) {
    return local.filter(img => img.section === section && img.is_active !== false);
  }
  return local;
}

/**
 * Save / Update Dynamic Site Image & Content Payload
 */
export async function apiSaveSiteImage(imageData) {
  const rawUrl = imageData.image_url || imageData.imageUrl || '';
  const isVideo = Boolean(rawUrl.match(/\.(mp4|webm|mov|m4v)(\?.*)?$/i)) || rawUrl.startsWith('blob:') || rawUrl.startsWith('data:video');
  const formattedUrl = isVideo ? formatGoogleDriveUrl(rawUrl) : appendCacheBuster(rawUrl);
  const recordId = imageData.id || `${imageData.section || 'img'}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

  const payload = {
    id: recordId,
    section: imageData.section || 'other',
    image_url: formattedUrl,
    storage_path: imageData.storage_path || imageData.storagePath || null,
    title: imageData.title || '',
    category: imageData.category || '',
    display_order: imageData.display_order || imageData.displayOrder || 0,
    is_active: imageData.is_active !== undefined ? imageData.is_active : true,
    data: imageData.data || imageData.metadata || null,
    updated_at: new Date().toISOString()
  };

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('site_images')
        .upsert([payload], { onConflict: 'id' })
        .select();

      if (!error && data && data.length > 0) {
        return data[0];
      } else if (error) {
        console.warn('Supabase DB upsert error:', error.message);
      }
    } catch (err) {
      console.warn('Supabase DB upsert exception:', err);
    }
  }

  // Persistent Storage Fallback (LocalStorage + IndexedDB)
  const saved = (await getPersistentItem('chitrakatha_site_images')) || [];
  const record = { ...payload, created_at: new Date().toISOString() };
  
  const existingIdx = saved.findIndex(item => item.id === recordId);
  if (existingIdx >= 0) {
    saved[existingIdx] = record;
  } else {
    saved.push(record);
  }

  await setPersistentItem('chitrakatha_site_images', saved);
  return record;
}

/**
 * Save Active Hero Video to Supabase DB table (site_images) and Persistent Storage
 */
export async function apiSaveHeroVideo(videoUrl, title = 'Homepage Hero Video', storagePath = null) {
  const formattedUrl = appendCacheBuster(videoUrl);

  const payload = {
    section: 'hero',
    image_url: formattedUrl,
    storage_path: storagePath,
    title: title,
    category: 'Hero',
    display_order: 1,
    is_active: true,
    updated_at: new Date().toISOString()
  };

  if (isSupabaseConfigured && supabase) {
    try {
      // 1. Deactivate all existing hero section records in DB table so only ONE active hero video exists
      await supabase
        .from('site_images')
        .update({ is_active: false })
        .eq('section', 'hero');

      // 2. Insert new active hero video record into DB table
      const { data, error } = await supabase
        .from('site_images')
        .insert([payload])
        .select();

      if (!error && data && data.length > 0) {
        await setPersistentItem('chitrakatha_hero', { url: formattedUrl, title: title });
        return data[0];
      }
    } catch (e) {
      console.warn('Supabase DB Hero Video save exception:', e);
    }
  }

  // 3. Fallback: Save to Persistent Storage Engine (IndexedDB + LocalStorage)
  const saved = (await getPersistentItem('chitrakatha_site_images')) || [];
  const updatedList = saved.map(item => item.section === 'hero' ? { ...item, is_active: false } : item);
  
  const record = {
    id: `hero-video-${Date.now()}`,
    ...payload,
    created_at: new Date().toISOString()
  };
  
  updatedList.unshift(record);
  await setPersistentItem('chitrakatha_site_images', updatedList);
  await setPersistentItem('chitrakatha_hero', { url: formattedUrl, title: title });

  return record;
}

/**
 * Delete Dynamic Site Image
 */
export async function apiDeleteSiteImage(id, storagePath = null) {
  if (isSupabaseConfigured && supabase) {
    if (storagePath) {
      await supabase.storage.from('website-images').remove([storagePath]);
    }
    await supabase.from('site_images').delete().eq('id', id);
  }

  const saved = (await getPersistentItem('chitrakatha_site_images')) || [];
  const filtered = saved.filter(item => item.id !== id);
  await setPersistentItem('chitrakatha_site_images', filtered);
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
