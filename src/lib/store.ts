import { useState, useEffect } from 'react';
import {
  SiteSettings,
  Profile,
  Metric,
  Client,
  Project,
  WorkProcessStep,
  Experience,
  Education,
  Skill,
  Inquiry,
  ThemePreset,
  ThemeColors
} from '../types';
import {
  initialSiteSettings,
  initialProfile,
  initialMetrics,
  initialClients,
  initialProjects,
  initialWorkProcess,
  initialExperiences,
  initialEducation,
  initialSkills,
  THEME_PRESETS
} from '../data/initialData';
import { getSupabaseClient, isSupabaseConfigured } from './supabase';

const STORAGE_KEY = 'santhosh_portfolio_cms_v1';

export interface AppState {
  settings: SiteSettings;
  profile: Profile;
  metrics: Metric[];
  clients: Client[];
  projects: Project[];
  workProcess: WorkProcessStep[];
  experiences: Experience[];
  education: Education[];
  skills: Skill[];
  inquiries: Inquiry[];
}

function getInitialState(): AppState {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      const profile = parsed.profile || initialProfile;
      // Auto-migrate legacy avatar URLs to the user's transparent cutout santhosh1.png
      if (
        profile.avatarUrl === '/assets/santhosh.jpg' ||
        profile.avatarUrl === '/assets/santhosh-seamless.png' ||
        !profile.avatarUrl
      ) {
        profile.avatarUrl = '/assets/santhosh1.png';
      }

      // Ensure socialLinks has full default fallback so links always work
      profile.socialLinks = {
        linkedin: profile.socialLinks?.linkedin || 'https://linkedin.com',
        instagram: profile.socialLinks?.instagram || 'https://instagram.com',
        youtube: profile.socialLinks?.youtube || 'https://youtube.com',
        facebook: profile.socialLinks?.facebook || 'https://facebook.com',
        whatsapp: profile.socialLinks?.whatsapp || 'https://wa.me/919597193371',
        ...profile.socialLinks
      };

      return {
        settings: parsed.settings || initialSiteSettings,
        profile,
        metrics: parsed.metrics || initialMetrics,
        clients: parsed.clients || initialClients,
        projects: parsed.projects || initialProjects,
        workProcess: parsed.workProcess || initialWorkProcess,
        experiences: parsed.experiences || initialExperiences,
        education: parsed.education || initialEducation,
        skills: parsed.skills || initialSkills,
        inquiries: parsed.inquiries || []
      };
    } catch (e) {
      console.error('Failed to parse cached state:', e);
    }
  }
  return {
    settings: initialSiteSettings,
    profile: initialProfile,
    metrics: initialMetrics,
    clients: initialClients,
    projects: initialProjects,
    workProcess: initialWorkProcess,
    experiences: initialExperiences,
    education: initialEducation,
    skills: initialSkills,
    inquiries: []
  };
}

// Global listeners for reactive updates across components
type Listener = () => void;
const listeners = new Set<Listener>();

let currentState: AppState = getInitialState();

export function applyThemeToDOM(colors: ThemeColors, typographyPreset?: string): void {
  const root = document.documentElement;
  root.style.setProperty('--theme-primary', colors.primary);
  root.style.setProperty('--theme-neutral', colors.neutral);
  root.style.setProperty('--theme-surface', colors.surface);
  root.style.setProperty('--theme-surface-elevated', colors.surfaceElevated);
  root.style.setProperty('--theme-border', colors.border);
  root.style.setProperty('--theme-text-primary', colors.textPrimary);
  root.style.setProperty('--theme-text-secondary', colors.textSecondary);
  root.style.setProperty('--theme-text-muted', colors.textMuted);
  
  // Calculate alpha glow for buttons and cards
  root.style.setProperty('--theme-glow', `${colors.primary}33`);

  if (typographyPreset === 'cabinet-satoshi') {
    root.style.setProperty('--theme-font-display', "'Outfit', sans-serif");
    root.style.setProperty('--theme-font-body', "'Geist', sans-serif");
  } else if (typographyPreset === 'space-grotesk') {
    root.style.setProperty('--theme-font-display', "'Space Grotesk', sans-serif");
    root.style.setProperty('--theme-font-body', "'Geist', sans-serif");
  } else {
    root.style.setProperty('--theme-font-display', "'Outfit', sans-serif");
    root.style.setProperty('--theme-font-body', "'Geist', sans-serif");
  }
}

// Initialize theme on page load
applyThemeToDOM(currentState.settings.customColors, currentState.settings.typographyPreset);

function notify(): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(currentState));
  applyThemeToDOM(currentState.settings.customColors, currentState.settings.typographyPreset);
  listeners.forEach((listener) => listener());
}

export function usePortfolioStore() {
  const [state, setState] = useState<AppState>(currentState);

  useEffect(() => {
    const onChange = () => setState({ ...currentState });
    listeners.add(onChange);
    return () => {
      listeners.delete(onChange);
    };
  }, []);

  // Fetch from Supabase if connected
  useEffect(() => {
    if (isSupabaseConfigured()) {
      fetchFromSupabase();
    }
  }, []);

  return {
    state,
    updateThemePreset: (preset: ThemePreset) => {
      const colors = THEME_PRESETS[preset]?.colors || currentState.settings.customColors;
      currentState.settings = {
        ...currentState.settings,
        activeTheme: preset,
        customColors: { ...colors }
      };
      notify();
      syncSettingToSupabase();
    },
    updateCustomColors: (colors: Partial<ThemeColors>) => {
      currentState.settings = {
        ...currentState.settings,
        activeTheme: 'custom',
        customColors: {
          ...currentState.settings.customColors,
          ...colors
        }
      };
      notify();
      syncSettingToSupabase();
    },
    updateTypography: (preset: string) => {
      currentState.settings = {
        ...currentState.settings,
        typographyPreset: preset
      };
      notify();
      syncSettingToSupabase();
    },
    updateFxSettings: (fx: Partial<SiteSettings['fxSettings']>) => {
      currentState.settings = {
        ...currentState.settings,
        fxSettings: {
          ...currentState.settings.fxSettings,
          ...fx
        }
      };
      notify();
      syncSettingToSupabase();
    },
    updateProfile: (profile: Partial<Profile>) => {
      currentState.profile = {
        ...currentState.profile,
        ...profile
      };
      notify();
      syncProfileToSupabase();
    },
    updateProjects: (projects: Project[]) => {
      currentState.projects = [...projects];
      notify();
    },
    updateClients: (clients: Client[]) => {
      currentState.clients = [...clients];
      notify();
    },
    updateMetrics: (metrics: Metric[]) => {
      currentState.metrics = [...metrics];
      notify();
    },
    updateWorkProcess: (steps: WorkProcessStep[]) => {
      currentState.workProcess = [...steps];
      notify();
    },
    updateExperiences: (exps: Experience[]) => {
      currentState.experiences = [...exps];
      notify();
    },
    updateEducation: (edu: Education[]) => {
      currentState.education = [...edu];
      notify();
    },
    updateSkills: (skills: Skill[]) => {
      currentState.skills = [...skills];
      notify();
    },
    addInquiry: async (inquiryData: Omit<Inquiry, 'id' | 'createdAt' | 'status'>) => {
      const newInquiry: Inquiry = {
        ...inquiryData,
        id: `inq_${Date.now()}`,
        createdAt: new Date().toISOString(),
        status: 'new'
      };
      currentState.inquiries = [newInquiry, ...currentState.inquiries];
      notify();

      // Submit to Supabase if connected
      const client = getSupabaseClient();
      if (client) {
        try {
          await client.from('inquiries').insert([{
            client_name: newInquiry.clientName,
            email: newInquiry.email,
            phone: newInquiry.phone,
            service_needed: newInquiry.serviceNeeded,
            budget: newInquiry.budget,
            message: newInquiry.message,
            status: 'new'
          }]);
        } catch (err) {
          console.warn('Failed to insert inquiry into Supabase:', err);
        }
      }
      return newInquiry;
    },
    updateInquiryStatus: (id: string, status: Inquiry['status']) => {
      currentState.inquiries = currentState.inquiries.map((inq) =>
        inq.id === id ? { ...inq, status } : inq
      );
      notify();
    },
    deleteInquiry: (id: string) => {
      currentState.inquiries = currentState.inquiries.filter((inq) => inq.id !== id);
      notify();
    },
    exportBackupJSON: () => {
      return JSON.stringify(currentState, null, 2);
    },
    importBackupJSON: (jsonString: string) => {
      try {
        const parsed = JSON.parse(jsonString);
        currentState = {
          settings: parsed.settings || currentState.settings,
          profile: parsed.profile || currentState.profile,
          metrics: parsed.metrics || currentState.metrics,
          clients: parsed.clients || currentState.clients,
          projects: parsed.projects || currentState.projects,
          workProcess: parsed.workProcess || currentState.workProcess,
          experiences: parsed.experiences || currentState.experiences,
          education: parsed.education || currentState.education,
          skills: parsed.skills || currentState.skills,
          inquiries: parsed.inquiries || currentState.inquiries
        };
        notify();
        return { success: true };
      } catch (err: any) {
        return { success: false, error: err.message };
      }
    },
    resetToDefaults: () => {
      currentState = {
        settings: initialSiteSettings,
        profile: initialProfile,
        metrics: initialMetrics,
        clients: initialClients,
        projects: initialProjects,
        workProcess: initialWorkProcess,
        experiences: initialExperiences,
        education: initialEducation,
        skills: initialSkills,
        inquiries: currentState.inquiries
      };
      notify();
    }
  };
}

// Supabase sync helpers
async function fetchFromSupabase() {
  const client = getSupabaseClient();
  if (!client) return;

  try {
    const { data: settingsData } = await client.from('site_settings').select('*').single();
    if (settingsData) {
      currentState.settings = {
        id: settingsData.id,
        activeTheme: settingsData.active_theme,
        customColors: settingsData.custom_colors,
        typographyPreset: settingsData.typography_preset,
        fxSettings: settingsData.fx_settings
      };
    }

    const { data: profileData } = await client.from('profile').select('*').single();
    if (profileData) {
      currentState.profile = {
        id: profileData.id,
        name: profileData.name,
        title: profileData.title,
        tagline: profileData.tagline,
        email: profileData.email,
        phone: profileData.phone,
        location: profileData.location,
        avatarUrl: profileData.avatar_url,
        resumeUrl: profileData.resume_url,
        availableStatus: profileData.available_status,
        socialLinks: profileData.social_links
      };
    }

    const { data: clientsData } = await client.from('clients').select('*').order('order_index');
    if (clientsData && clientsData.length > 0) {
      currentState.clients = clientsData.map((c: any) => ({
        id: c.id,
        name: c.name,
        logoUrl: c.logo_url,
        category: c.category,
        featured: c.featured,
        orderIndex: c.order_index
      }));
    }

    const { data: inqData } = await client.from('inquiries').select('*').order('created_at', { ascending: false });
    if (inqData) {
      currentState.inquiries = inqData.map((i: any) => ({
        id: i.id,
        clientName: i.client_name,
        email: i.email,
        phone: i.phone,
        serviceNeeded: i.service_needed,
        budget: i.budget,
        message: i.message,
        createdAt: i.created_at,
        status: i.status
      }));
    }

    notify();
  } catch (err) {
    console.warn('Supabase fetch failed, continuing with local store:', err);
  }
}

async function syncSettingToSupabase() {
  const client = getSupabaseClient();
  if (!client) return;

  try {
    await client.from('site_settings').upsert({
      id: 'current_settings',
      active_theme: currentState.settings.activeTheme,
      custom_colors: currentState.settings.customColors,
      typography_preset: currentState.settings.typographyPreset,
      fx_settings: currentState.settings.fxSettings,
      updated_at: new Date().toISOString()
    });
  } catch (e) {
    console.warn('Failed to sync setting to Supabase:', e);
  }
}

async function syncProfileToSupabase() {
  const client = getSupabaseClient();
  if (!client) return;

  try {
    await client.from('profile').upsert({
      id: 'santhosh_profile',
      name: currentState.profile.name,
      title: currentState.profile.title,
      tagline: currentState.profile.tagline,
      email: currentState.profile.email,
      phone: currentState.profile.phone,
      location: currentState.profile.location,
      avatar_url: currentState.profile.avatarUrl,
      resume_url: currentState.profile.resumeUrl,
      available_status: currentState.profile.availableStatus,
      social_links: currentState.profile.socialLinks,
      updated_at: new Date().toISOString()
    });
  } catch (e) {
    console.warn('Failed to sync profile to Supabase:', e);
  }
}

export async function uploadAllToSupabase(): Promise<{ success: boolean; message: string }> {
  const client = getSupabaseClient();
  if (!client) {
    return { success: false, message: 'Supabase credentials are not configured.' };
  }

  try {
    // 1. Settings
    await syncSettingToSupabase();
    // 2. Profile
    await syncProfileToSupabase();
    // 3. Clients
    for (const c of currentState.clients) {
      await client.from('clients').upsert({
        id: c.id.startsWith('c') ? undefined : c.id,
        name: c.name,
        logo_url: c.logoUrl,
        category: c.category,
        featured: c.featured,
        order_index: c.orderIndex
      });
    }
    // 4. Projects
    for (const p of currentState.projects) {
      await client.from('projects').upsert({
        id: p.id.startsWith('p') ? undefined : p.id,
        title: p.title,
        client_name: p.clientName,
        category: p.category,
        description: p.description,
        metrics: p.metrics,
        tags: p.tags,
        cover_url: p.coverUrl,
        link_url: p.linkUrl,
        featured: p.featured,
        order_index: p.orderIndex
      });
    }

    return { success: true, message: 'All portfolio data synced successfully to Supabase!' };
  } catch (err: any) {
    return { success: false, message: err.message || 'Sync failed.' };
  }
}

