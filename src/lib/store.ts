import { useState, useEffect } from 'react';
import {
  SiteSettings,
  Profile,
  Metric,
  Client,
  LiveClient,
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
  initialLiveClients,
  initialProjects,
  initialWorkProcess,
  initialExperiences,
  initialEducation,
  initialSkills,
  THEME_PRESETS
} from '../data/initialData';
import { getSupabaseClient, isSupabaseConfigured } from './supabase';

const STORAGE_KEY = 'santhosh_portfolio_cms_v2';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isValidUUID(id?: string): boolean {
  return Boolean(id && UUID_REGEX.test(id));
}

export function generateUUID(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export interface AppState {
  settings: SiteSettings;
  profile: Profile;
  metrics: Metric[];
  clients: Client[];
  liveClients: LiveClient[];
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

      // Auto-migrate clients if legacy logos (named after old files) or count mismatch exist
      let clients = parsed.clients || initialClients;
      const hasOldLogo = clients.some((c: any) =>
        c.logoUrl && (
          c.logoUrl.includes('tarani-soaps') ||
          c.logoUrl.includes('siruvaani') ||
          c.logoUrl.includes('mayil-mark') ||
          c.logoUrl.includes('cibo') ||
          c.logoUrl.includes('the-zen-park') ||
          c.logoUrl.includes('hotel-chenthur-park')
        )
      );
      if (hasOldLogo || !clients || clients.length < 22) {
        clients = initialClients;
      }

      const settings: SiteSettings = {
        ...initialSiteSettings,
        ...(parsed.settings || {}),
        showExperience: parsed.settings?.showExperience !== undefined ? parsed.settings.showExperience : true,
        showLiveClients: parsed.settings?.showLiveClients !== undefined ? parsed.settings.showLiveClients : true
      };

      return {
        settings,
        profile,
        metrics: parsed.metrics || initialMetrics,
        clients,
        liveClients: parsed.liveClients || initialLiveClients,
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
    liveClients: initialLiveClients,
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

  if (typographyPreset === 'space-grotesk') {
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

  // Fetch from Supabase on mount
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
    updateSectionVisibility: (vis: { showExperience?: boolean; showLiveClients?: boolean }) => {
      currentState.settings = {
        ...currentState.settings,
        ...vis
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
      syncProjectsToSupabase();
    },
    updateClients: (clients: Client[]) => {
      currentState.clients = [...clients];
      notify();
      syncClientsToSupabase();
    },
    updateLiveClients: (liveClients: LiveClient[]) => {
      currentState.liveClients = [...liveClients];
      notify();
      syncLiveClientsToSupabase();
    },
    updateMetrics: (metrics: Metric[]) => {
      currentState.metrics = [...metrics];
      notify();
      syncMetricsToSupabase();
    },
    updateWorkProcess: (steps: WorkProcessStep[]) => {
      currentState.workProcess = [...steps];
      notify();
      syncWorkProcessToSupabase();
    },
    updateExperiences: (exps: Experience[]) => {
      currentState.experiences = [...exps];
      notify();
      syncExperiencesToSupabase();
    },
    updateEducation: (edu: Education[]) => {
      currentState.education = [...edu];
      notify();
      syncEducationToSupabase();
    },
    updateSkills: (skills: Skill[]) => {
      currentState.skills = [...skills];
      notify();
      syncSkillsToSupabase();
    },
    addInquiry: async (inquiryData: Omit<Inquiry, 'id' | 'createdAt' | 'status'>) => {
      const newInquiry: Inquiry = {
        ...inquiryData,
        id: generateUUID(),
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
            id: newInquiry.id,
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
    updateInquiryStatus: async (id: string, status: Inquiry['status']) => {
      currentState.inquiries = currentState.inquiries.map((inq) =>
        inq.id === id ? { ...inq, status } : inq
      );
      notify();
      const client = getSupabaseClient();
      if (client && isValidUUID(id)) {
        try {
          await client.from('inquiries').update({ status }).eq('id', id);
        } catch (e) {
          console.warn('Failed to update inquiry status in Supabase:', e);
        }
      }
    },
    deleteInquiry: async (id: string) => {
      currentState.inquiries = currentState.inquiries.filter((inq) => inq.id !== id);
      notify();
      const client = getSupabaseClient();
      if (client && isValidUUID(id)) {
        try {
          await client.from('inquiries').delete().eq('id', id);
        } catch (e) {
          console.warn('Failed to delete inquiry from Supabase:', e);
        }
      }
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
          liveClients: parsed.liveClients || currentState.liveClients,
          projects: parsed.projects || currentState.projects,
          workProcess: parsed.workProcess || currentState.workProcess,
          experiences: parsed.experiences || currentState.experiences,
          education: parsed.education || currentState.education,
          skills: parsed.skills || currentState.skills,
          inquiries: parsed.inquiries || currentState.inquiries
        };
        notify();
        uploadAllToSupabase();
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
        liveClients: initialLiveClients,
        projects: initialProjects,
        workProcess: initialWorkProcess,
        experiences: initialExperiences,
        education: initialEducation,
        skills: initialSkills,
        inquiries: currentState.inquiries
      };
      notify();
      uploadAllToSupabase();
    }
  };
}

// Supabase sync helpers
export async function fetchFromSupabase() {
  const client = getSupabaseClient();
  if (!client) return;

  try {
    // 1. Settings
    const { data: settingsData } = await client.from('site_settings').select('*').single();
    if (settingsData) {
      currentState.settings = {
        id: settingsData.id,
        activeTheme: settingsData.active_theme || currentState.settings.activeTheme,
        customColors: settingsData.custom_colors || currentState.settings.customColors,
        typographyPreset: settingsData.typography_preset || currentState.settings.typographyPreset,
        fxSettings: settingsData.fx_settings || currentState.settings.fxSettings,
        showExperience: settingsData.fx_settings?.showExperience !== undefined
          ? settingsData.fx_settings.showExperience
          : (currentState.settings.showExperience ?? true),
        showLiveClients: settingsData.fx_settings?.showLiveClients !== undefined
          ? settingsData.fx_settings.showLiveClients
          : (currentState.settings.showLiveClients ?? true)
      };

      if (Array.isArray(settingsData.fx_settings?.liveClients) && settingsData.fx_settings.liveClients.length > 0) {
        currentState.liveClients = settingsData.fx_settings.liveClients;
      }
    }

    // 2. Profile
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

    // 3. Clients (Worked Clients)
    const { data: clientsData } = await client.from('clients').select('*').order('order_index');
    if (clientsData && clientsData.length > 0) {
      const hasOldLogo = clientsData.some((c: any) =>
        c.logo_url && (
          c.logo_url.includes('tarani-soaps') ||
          c.logo_url.includes('siruvaani') ||
          c.logo_url.includes('mayil-mark') ||
          c.logo_url.includes('cibo') ||
          c.logo_url.includes('the-zen-park') ||
          c.logo_url.includes('hotel-chenthur-park')
        )
      );
      if (!hasOldLogo) {
        currentState.clients = clientsData.map((c: any) => ({
          id: c.id,
          name: c.name,
          logoUrl: c.logo_url,
          category: c.category,
          featured: c.featured,
          orderIndex: c.order_index
        }));
      }
    }

    // 4. Live Clients (table or fxSettings fallback)
    try {
      const { data: liveClientsData, error: lcErr } = await client.from('live_clients').select('*').order('order_index');
      if (!lcErr && liveClientsData && liveClientsData.length > 0) {
        currentState.liveClients = liveClientsData.map((lc: any) => ({
          id: lc.id,
          name: lc.name,
          logoUrl: lc.logo_url,
          category: lc.category,
          status: lc.status,
          deliverables: lc.deliverables,
          impactMetric: lc.impact_metric,
          featured: lc.featured,
          orderIndex: lc.order_index
        }));
      }
    } catch {
      // Gracefully retained from fx_settings
    }

    // 5. Projects
    const { data: projectsData } = await client.from('projects').select('*').order('order_index');
    if (projectsData && projectsData.length > 0) {
      currentState.projects = projectsData.map((p: any) => ({
        id: p.id,
        title: p.title,
        clientName: p.client_name,
        category: p.category,
        description: p.description,
        metrics: p.metrics || {},
        tags: p.tags || [],
        coverUrl: p.cover_url,
        linkUrl: p.link_url,
        featured: p.featured,
        orderIndex: p.order_index
      }));
    }

    // 6. Metrics
    const { data: metricsData } = await client.from('metrics').select('*').order('order_index');
    if (metricsData && metricsData.length > 0) {
      currentState.metrics = metricsData.map((m: any) => ({
        id: m.id,
        label: m.label,
        value: m.value,
        sublabel: m.sublabel,
        orderIndex: m.order_index
      }));
    }

    // 7. Work Process
    const { data: processData } = await client.from('work_process').select('*').order('order_index');
    if (processData && processData.length > 0) {
      currentState.workProcess = processData.map((wp: any) => ({
        id: wp.id,
        stepNumber: wp.step_number,
        title: wp.title,
        description: wp.description,
        icon: wp.icon,
        orderIndex: wp.order_index
      }));
    }

    // 8. Experiences
    const { data: expData } = await client.from('experiences').select('*').order('order_index');
    if (expData && expData.length > 0) {
      currentState.experiences = expData.map((e: any) => ({
        id: e.id,
        role: e.role,
        company: e.company,
        location: e.location,
        period: e.period,
        bullets: e.bullets || [],
        orderIndex: e.order_index
      }));
    }

    // 9. Education
    const { data: eduData } = await client.from('education').select('*').order('order_index');
    if (eduData && eduData.length > 0) {
      currentState.education = eduData.map((ed: any) => ({
        id: ed.id,
        degree: ed.degree,
        institution: ed.institution,
        location: ed.location,
        period: ed.period,
        isCertification: ed.is_certification,
        orderIndex: ed.order_index
      }));
    }

    // 10. Skills
    const { data: skillsData } = await client.from('skills').select('*').order('order_index');
    if (skillsData && skillsData.length > 0) {
      currentState.skills = skillsData.map((s: any) => ({
        id: s.id,
        category: s.category,
        name: s.name,
        proficiency: s.proficiency,
        orderIndex: s.order_index
      }));
    }

    // 11. Inquiries
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

export async function syncSettingToSupabase() {
  const client = getSupabaseClient();
  if (!client) return;

  try {
    await client.from('site_settings').upsert({
      id: 'current_settings',
      active_theme: currentState.settings.activeTheme,
      custom_colors: currentState.settings.customColors,
      typography_preset: currentState.settings.typographyPreset,
      fx_settings: {
        ...currentState.settings.fxSettings,
        showExperience: currentState.settings.showExperience !== false,
        showLiveClients: currentState.settings.showLiveClients !== false,
        liveClients: currentState.liveClients
      },
      updated_at: new Date().toISOString()
    });
  } catch (e) {
    console.warn('Failed to sync setting to Supabase:', e);
  }
}

export async function syncProfileToSupabase() {
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

export async function syncClientsToSupabase() {
  const client = getSupabaseClient();
  if (!client) return;

  try {
    for (const c of currentState.clients) {
      const rowId = isValidUUID(c.id) ? c.id : generateUUID();
      c.id = rowId;
      await client.from('clients').upsert({
        id: rowId,
        name: c.name,
        logo_url: c.logoUrl,
        category: c.category,
        featured: c.featured,
        order_index: c.orderIndex
      });
    }
  } catch (e) {
    console.warn('Failed to sync clients to Supabase:', e);
  }
}

export async function syncLiveClientsToSupabase() {
  // Always persist liveClients securely to site_settings.fx_settings
  await syncSettingToSupabase();

  const client = getSupabaseClient();
  if (!client) return;

  // Also attempt sync to live_clients table if available
  try {
    for (const lc of currentState.liveClients) {
      const rowId = isValidUUID(lc.id) ? lc.id : generateUUID();
      lc.id = rowId;
      await client.from('live_clients').upsert({
        id: rowId,
        name: lc.name,
        logo_url: lc.logoUrl,
        category: lc.category,
        status: lc.status,
        deliverables: lc.deliverables,
        impact_metric: lc.impactMetric,
        featured: lc.featured ?? true,
        order_index: lc.orderIndex
      });
    }
  } catch {
    // live_clients table might not exist in Supabase yet, safely stored in fx_settings
  }
}

export async function syncProjectsToSupabase() {
  const client = getSupabaseClient();
  if (!client) return;

  try {
    for (const p of currentState.projects) {
      const rowId = isValidUUID(p.id) ? p.id : generateUUID();
      p.id = rowId;
      await client.from('projects').upsert({
        id: rowId,
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
  } catch (e) {
    console.warn('Failed to sync projects to Supabase:', e);
  }
}

export async function syncMetricsToSupabase() {
  const client = getSupabaseClient();
  if (!client) return;

  try {
    for (const m of currentState.metrics) {
      const rowId = isValidUUID(m.id) ? m.id : generateUUID();
      m.id = rowId;
      await client.from('metrics').upsert({
        id: rowId,
        label: m.label,
        value: m.value,
        sublabel: m.sublabel,
        order_index: m.orderIndex
      });
    }
  } catch (e) {
    console.warn('Failed to sync metrics to Supabase:', e);
  }
}

export async function syncWorkProcessToSupabase() {
  const client = getSupabaseClient();
  if (!client) return;

  try {
    for (const wp of currentState.workProcess) {
      const rowId = isValidUUID(wp.id) ? wp.id : generateUUID();
      wp.id = rowId;
      await client.from('work_process').upsert({
        id: rowId,
        step_number: wp.stepNumber,
        title: wp.title,
        description: wp.description,
        icon: wp.icon,
        order_index: wp.orderIndex
      });
    }
  } catch (e) {
    console.warn('Failed to sync work_process to Supabase:', e);
  }
}

export async function syncExperiencesToSupabase() {
  const client = getSupabaseClient();
  if (!client) return;

  try {
    for (const exp of currentState.experiences) {
      const rowId = isValidUUID(exp.id) ? exp.id : generateUUID();
      exp.id = rowId;
      await client.from('experiences').upsert({
        id: rowId,
        role: exp.role,
        company: exp.company,
        location: exp.location,
        period: exp.period,
        bullets: exp.bullets,
        order_index: exp.orderIndex
      });
    }
  } catch (e) {
    console.warn('Failed to sync experiences to Supabase:', e);
  }
}

export async function syncEducationToSupabase() {
  const client = getSupabaseClient();
  if (!client) return;

  try {
    for (const edu of currentState.education) {
      const rowId = isValidUUID(edu.id) ? edu.id : generateUUID();
      edu.id = rowId;
      await client.from('education').upsert({
        id: rowId,
        degree: edu.degree,
        institution: edu.institution,
        location: edu.location,
        period: edu.period,
        is_certification: edu.isCertification,
        order_index: edu.orderIndex
      });
    }
  } catch (e) {
    console.warn('Failed to sync education to Supabase:', e);
  }
}

export async function syncSkillsToSupabase() {
  const client = getSupabaseClient();
  if (!client) return;

  try {
    for (const s of currentState.skills) {
      const rowId = isValidUUID(s.id) ? s.id : generateUUID();
      s.id = rowId;
      await client.from('skills').upsert({
        id: rowId,
        category: s.category,
        name: s.name,
        proficiency: s.proficiency,
        order_index: s.orderIndex
      });
    }
  } catch (e) {
    console.warn('Failed to sync skills to Supabase:', e);
  }
}

export async function uploadAllToSupabase(): Promise<{ success: boolean; message: string }> {
  const client = getSupabaseClient();
  if (!client) {
    return { success: false, message: 'Supabase credentials are not configured.' };
  }

  try {
    await syncSettingToSupabase();
    await syncProfileToSupabase();
    await syncClientsToSupabase();
    await syncLiveClientsToSupabase();
    await syncProjectsToSupabase();
    await syncMetricsToSupabase();
    await syncWorkProcessToSupabase();
    await syncExperiencesToSupabase();
    await syncEducationToSupabase();
    await syncSkillsToSupabase();

    return { success: true, message: 'All portfolio collections synced successfully to Supabase cloud!' };
  } catch (err: any) {
    return { success: false, message: err.message || 'Sync failed.' };
  }
}
