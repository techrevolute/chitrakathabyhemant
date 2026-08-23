import { createClient } from '@supabase/supabase-js';

// Read Environment Variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

// Create Supabase Client instance (or null fallback)
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

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
    } else {
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
 * Update Booking Status (Admin Only)
 */
export async function apiUpdateBookingStatus(bookingId, status) {
  if (isSupabaseConfigured && supabase) {
    await supabase
      .from('booking_requests')
      .update({ status, updated_at: new Date() })
      .eq('id', bookingId);
  }

  const saved = JSON.parse(localStorage.getItem('chitrakatha_bookings') || '[]');
  const updated = saved.map(b => b.id === bookingId ? { ...b, status } : b);
  localStorage.setItem('chitrakatha_bookings', JSON.stringify(updated));
  return updated;
}

/**
 * Fetch Portfolio Items
 */
export async function apiFetchPortfolio() {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('portfolio_media')
      .select('*')
      .order('display_order', { ascending: true });

    if (!error && data && data.length > 0) {
      return data.map(p => ({
        id: p.id,
        title: p.title,
        category: p.category_name,
        image: p.url,
        location: p.location,
        featured: p.featured
      }));
    }
  }

  return JSON.parse(localStorage.getItem('chitrakatha_portfolio') || '[]');
}

/**
 * Upload Asset to Supabase Storage Bucket
 */
export async function apiUploadStorageFile(bucketName, file) {
  if (!isSupabaseConfigured || !supabase) {
    // Return mock object URL for local environment preview
    return URL.createObjectURL(file);
  }

  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
  const filePath = `${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from(bucketName)
    .upload(filePath, file);

  if (uploadError) {
    console.error(`Error uploading to ${bucketName}:`, uploadError);
    return null;
  }

  const { data } = supabase.storage
    .from(bucketName)
    .getPublicUrl(filePath);

  return data.publicUrl;
}
