import { createClient, SupabaseClient } from '@supabase/supabase-js';

const STORAGE_KEY_URL = 'santhosh_portfolio_supabase_url';
const STORAGE_KEY_ANON = 'santhosh_portfolio_supabase_anon';

export function getSupabaseCredentials(): { url: string; key: string } {
  const localUrl = localStorage.getItem(STORAGE_KEY_URL);
  const localKey = localStorage.getItem(STORAGE_KEY_ANON);
  const envUrl = (import.meta.env.VITE_SUPABASE_URL as string) || '';
  const envKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || '';

  return {
    url: localUrl || envUrl,
    key: localKey || envKey
  };
}

export function saveSupabaseCredentials(url: string, key: string): void {
  localStorage.setItem(STORAGE_KEY_URL, url.trim());
  localStorage.setItem(STORAGE_KEY_ANON, key.trim());
}

export function clearSupabaseCredentials(): void {
  localStorage.removeItem(STORAGE_KEY_URL);
  localStorage.removeItem(STORAGE_KEY_ANON);
}

let supabaseInstance: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  const { url, key } = getSupabaseCredentials();
  if (!url || !key) {
    return null;
  }

  if (!supabaseInstance) {
    try {
      supabaseInstance = createClient(url, key);
    } catch (e) {
      console.warn('Failed to initialize Supabase client:', e);
      return null;
    }
  }
  return supabaseInstance;
}

export function isSupabaseConfigured(): boolean {
  const { url, key } = getSupabaseCredentials();
  return Boolean(url && key);
}

export async function uploadAssetFile(file: File, folder = 'uploads'): Promise<string | null> {
  const client = getSupabaseClient();
  if (!client) {
    // If Supabase not connected, fallback to local Object URL or base64 data URL for instant zero-code preview
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });
  }

  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${folder}/${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
    const { data, error } = await client.storage
      .from('portfolio-assets')
      .upload(fileName, file, { upsert: true });

    if (error) {
      console.error('Supabase upload error:', error);
      // Fallback to data URL
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    }

    const { data: publicData } = client.storage
      .from('portfolio-assets')
      .getPublicUrl(data.path);

    return publicData.publicUrl;
  } catch (err) {
    console.error('Upload exception:', err);
    return null;
  }
}

