export type ThemePreset =
  | 'crimson-noir'
  | 'obsidian-emerald'
  | 'cyberpunk-amber'
  | 'electric-cobalt'
  | 'titanium-minimal'
  | 'custom';

export interface ThemeColors {
  primary: string;
  neutral: string;
  surface: string;
  surfaceElevated: string;
  border: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
}

export interface FxSettings {
  enable3D: boolean;
  particleDensity: 'low' | 'medium' | 'high';
  cardTilt: boolean;
  marqueeSpeed: number;
}

export interface SiteSettings {
  id: string;
  activeTheme: ThemePreset;
  customColors: ThemeColors;
  typographyPreset: string;
  fxSettings: FxSettings;
}

export interface Profile {
  id: string;
  name: string;
  title: string;
  tagline: string;
  email: string;
  phone: string;
  location: string;
  avatarUrl: string;
  resumeUrl: string;
  availableStatus: string;
  socialLinks: {
    instagram?: string;
    linkedin?: string;
    youtube?: string;
    facebook?: string;
    whatsapp?: string;
  };
}

export interface Metric {
  id: string;
  label: string;
  value: string;
  sublabel?: string;
  orderIndex: number;
}

export interface Client {
  id: string;
  name: string;
  logoUrl: string;
  category: string;
  featured: boolean;
  orderIndex: number;
}

export interface Project {
  id: string;
  title: string;
  clientName: string;
  category: string;
  description: string;
  metrics: {
    roas?: string;
    leads?: string;
    cpa?: string;
    ctr?: string;
  };
  tags: string[];
  coverUrl?: string;
  linkUrl?: string;
  featured: boolean;
  orderIndex: number;
}

export interface WorkProcessStep {
  id: string;
  stepNumber: string;
  title: string;
  description: string;
  icon: string;
  orderIndex: number;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  location: string;
  period: string;
  bullets: string[];
  orderIndex: number;
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  location: string;
  period: string;
  isCertification?: boolean;
  orderIndex: number;
}

export interface Skill {
  id: string;
  category: string;
  name: string;
  proficiency: number;
  orderIndex: number;
}

export interface Inquiry {
  id: string;
  clientName: string;
  email: string;
  phone?: string;
  serviceNeeded?: string;
  budget?: string;
  message: string;
  createdAt: string;
  status: 'new' | 'contacted' | 'archived';
}

