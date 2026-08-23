import { createClient } from '@supabase/supabase-js';

// Read Environment Variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

// Create Supabase Client instance (or null fallback)
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Helper to append cache-busting timestamp to URLs
export function appendCacheBuster(url) {
  if (!url || typeof url !== 'string' || url.startsWith('data:') || url.startsWith('blob:')) {
    return url;
  }
  const timestamp = Date.now();
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}v=${timestamp}`;
}

// ============================================================================
// HYBRID DATA SERVICE ENGINE (SUPABASE + LOCALSTORAGE FALLBACK)
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

  // Fallback to LocalStorage
  const saved = JSON.parse(localStorage.getItem('chitrakatha_bookings') || '[]');
  const newBooking = {
    id: `bk-${Date.now()}`,
    ...bookingData,
    status: 'New',
    createdAt: new Date().toISOString().split('T')[0]
  };
  saved.unshift(newBooking);
  localStorage.setItem('chitrakatha_bookings', JSON.stringify(saved));
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

  return JSON.parse(localStorage.getItem('chitrakatha_bookings') || '[]');
}

/**
 * Upload File to Supabase Storage Bucket or return persistent Data URL
 */
export async function apiUploadStorageFile(bucketName, file) {
  if (!file) return null;

  // Convert to Data URL fallback first to ensure instant local availability
  const readFileAsDataUrl = (fileToRead) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(fileToRead);
    });
  };

  let fallbackDataUrl = '';
  try {
    fallbackDataUrl = await readFileAsDataUrl(file);
  } catch (err) {
    console.warn('FileReader error:', err);
  }

  if (isSupabaseConfigured && supabase) {
    try {
      const fileExt = file.name ? file.name.split('.').pop() : 'png';
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

  // Persistent Data URL fallback
  return {
    publicUrl: fallbackDataUrl,
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
  const local = JSON.parse(localStorage.getItem('chitrakatha_site_images') || '[]');
  if (section) {
    return local.filter(img => img.section === section && img.is_active !== false);
  }
  return local;
}

/**
 * Save / Update Dynamic Site Image
 */
export async function apiSaveSiteImage(imageData) {
  const payload = {
    section: imageData.section || 'other',
    image_url: appendCacheBuster(imageData.image_url || imageData.imageUrl),
    storage_path: imageData.storage_path || imageData.storagePath || null,
    title: imageData.title || '',
    category: imageData.category || '',
    display_order: imageData.display_order || imageData.displayOrder || 0,
    is_active: imageData.is_active !== undefined ? imageData.is_active : true,
    updated_at: new Date().toISOString()
  };

  if (isSupabaseConfigured && supabase) {
    if (imageData.id && !imageData.id.startsWith('img-local-')) {
      const { data, error } = await supabase
        .from('site_images')
        .update(payload)
        .eq('id', imageData.id)
        .select();
      if (!error && data && data.length > 0) {
        return data[0];
      }
    } else {
      const { data, error } = await supabase
        .from('site_images')
        .insert([payload])
        .select();
      if (!error && data && data.length > 0) {
        return data[0];
      }
    }
  }

  // LocalStorage Fallback
  const saved = JSON.parse(localStorage.getItem('chitrakatha_site_images') || '[]');
  const newId = imageData.id || `img-local-${Date.now()}`;
  const record = { id: newId, ...payload, created_at: new Date().toISOString() };
  
  const existingIdx = saved.findIndex(item => item.id === newId);
  if (existingIdx >= 0) {
    saved[existingIdx] = record;
  } else {
    saved.push(record);
  }

  localStorage.setItem('chitrakatha_site_images', JSON.stringify(saved));
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

  const saved = JSON.parse(localStorage.getItem('chitrakatha_site_images') || '[]');
  const filtered = saved.filter(item => item.id !== id);
  localStorage.setItem('chitrakatha_site_images', JSON.stringify(filtered));
  return true;
}
