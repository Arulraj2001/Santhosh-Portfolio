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
  ThemePreset,
  ThemeColors
} from '../types';

export const THEME_PRESETS: Record<ThemePreset, { name: string; colors: ThemeColors }> = {
  'crimson-noir': {
    name: 'Crimson Noir (Default)',
    colors: {
      primary: '#D80027',
      neutral: '#09090B',
      surface: '#121216',
      surfaceElevated: '#18181F',
      border: '#27272A',
      textPrimary: '#FAFAFA',
      textSecondary: '#A1A1AA',
      textMuted: '#9E9EA7'
    }
  },
  'obsidian-emerald': {
    name: 'Obsidian Emerald',
    colors: {
      primary: '#10B981',
      neutral: '#060A08',
      surface: '#0D1410',
      surfaceElevated: '#141E19',
      border: '#1F2E25',
      textPrimary: '#F0FDF4',
      textSecondary: '#A7F3D0',
      textMuted: '#9CA3AF'
    }
  },
  'cyberpunk-amber': {
    name: 'Cyberpunk Amber',
    colors: {
      primary: '#F59E0B',
      neutral: '#0C0A07',
      surface: '#17130B',
      surfaceElevated: '#211B0E',
      border: '#332915',
      textPrimary: '#FFFBEB',
      textSecondary: '#FDE68A',
      textMuted: '#A3A3A3'
    }
  },
  'electric-cobalt': {
    name: 'Electric Cobalt',
    colors: {
      primary: '#3B82F6',
      neutral: '#080A10',
      surface: '#0F1420',
      surfaceElevated: '#171E2E',
      border: '#232D42',
      textPrimary: '#EFF6FF',
      textSecondary: '#BFDBFE',
      textMuted: '#9CA3AF'
    }
  },
  'titanium-minimal': {
    name: 'Titanium Minimalist',
    colors: {
      primary: '#E4E4E7',
      neutral: '#09090B',
      surface: '#141418',
      surfaceElevated: '#1C1C22',
      border: '#2E2E36',
      textPrimary: '#FFFFFF',
      textSecondary: '#D4D4D8',
      textMuted: '#A1A1AA'
    }
  },
  'custom': {
    name: 'Custom Palette',
    colors: {
      primary: '#D80027',
      neutral: '#09090B',
      surface: '#121216',
      surfaceElevated: '#18181F',
      border: '#27272A',
      textPrimary: '#FAFAFA',
      textSecondary: '#A1A1AA',
      textMuted: '#9E9EA7'
    }
  }
};

export const initialSiteSettings: SiteSettings = {
  id: 'current_settings',
  activeTheme: 'crimson-noir',
  customColors: THEME_PRESETS['crimson-noir'].colors,
  typographyPreset: 'outfit-geist',
  fxSettings: {
    enable3D: true,
    particleDensity: 'medium',
    cardTilt: true,
    marqueeSpeed: 35
  }
};

export const initialProfile: Profile = {
  id: 'santhosh_profile',
  name: 'SANTHOSH S',
  title: 'Digital Marketing Executive',
  tagline: 'Driving quantifiable business growth through high-precision Meta Ads, algorithmic organic reach, and full-funnel digital strategy.',
  email: 'santhos2101@gmail.com',
  phone: '+91 9597193371',
  location: 'Namakkal, Tamil Nadu, India',
  avatarUrl: '/assets/santhosh1.png',
  resumeUrl: '#',
  availableStatus: 'AVAILABLE FOR FREELANCE & FULL-TIME',
  socialLinks: {
    instagram: 'https://instagram.com',
    linkedin: 'https://linkedin.com',
    youtube: 'https://youtube.com',
    facebook: 'https://facebook.com',
    whatsapp: 'https://wa.me/919597193371'
  }
};

export const initialMetrics: Metric[] = [
  { id: '1', label: 'EXPERIENCE', value: '1+ YR', sublabel: 'Digital Marketing & Training', orderIndex: 0 },
  { id: '2', label: 'MANAGED BRANDS', value: '20+', sublabel: 'Across Instagram, FB & LinkedIn', orderIndex: 1 },
  { id: '3', label: 'CAMPAIGNS RUN', value: '100+', sublabel: 'Meta Ads & Lead Gen Funnels', orderIndex: 2 },
  { id: '4', label: 'AVERAGE ROAS', value: '4.2X', sublabel: 'Performance Ad Optimizations', orderIndex: 3 }
];

export const initialClients: Client[] = [
  { id: 'c1', name: 'Tarani Soaps', logoUrl: '/assets/clients/tarani-soaps.png', category: 'FMCG & Personal Care', featured: true, orderIndex: 0 },
  { id: 'c2', name: 'HR', logoUrl: '/assets/clients/hr.png', category: 'Corporate Services', featured: true, orderIndex: 1 },
  { id: 'c3', name: 'The Zen Park', logoUrl: '/assets/clients/the-zen-park.png', category: 'Hospitality & Leisure', featured: true, orderIndex: 2 },
  { id: 'c4', name: 'Siruvaani', logoUrl: '/assets/clients/siruvaani.png', category: 'Restaurant & Dining', featured: true, orderIndex: 3 },
  { id: 'c5', name: 'Hotel Chenthur Park', logoUrl: '/assets/clients/hotel-chenthur-park.png', category: 'Hotels & Resorts', featured: true, orderIndex: 4 },
  { id: 'c6', name: 'The Arcadia Hotel Supplies', logoUrl: '/assets/clients/the-arcadia-supplies.png', category: 'B2B Hospitality', featured: true, orderIndex: 5 },
  { id: 'c7', name: 'The Arcadia Boutique Hotel', logoUrl: '/assets/clients/the-arcadia-hotel.png', category: 'Luxury Stays', featured: true, orderIndex: 6 },
  { id: 'c8', name: 'Vanaalayam Retreat', logoUrl: '/assets/clients/vanaalayam.png', category: 'Eco Resort & Wellness', featured: true, orderIndex: 7 },
  { id: 'c9', name: 'SMB Bakery', logoUrl: '/assets/clients/smb-bakery.png', category: 'Bakery & Confectionery', featured: true, orderIndex: 8 },
  { id: 'c10', name: 'Cibo Fine Dining', logoUrl: '/assets/clients/cibo.png', category: 'Culinary Experiences', featured: true, orderIndex: 9 },
  { id: 'c11', name: 'Mayil Mark', logoUrl: '/assets/clients/mayil-mark.png', category: 'Traditional Spices & Foods', featured: true, orderIndex: 10 },
  { id: 'c12', name: 'Insta Magic', logoUrl: '/assets/clients/insta-magic.png', category: 'Instant Food Products', featured: true, orderIndex: 11 },
  { id: 'c13', name: 'Nithara Coffee', logoUrl: '/assets/clients/nithara-coffee.png', category: 'Artisan Coffee Roasters', featured: true, orderIndex: 12 },
  { id: 'c14', name: 'Cream Centre', logoUrl: '/assets/clients/cream-centre.png', category: 'Veg Fine Dine Salem', featured: true, orderIndex: 13 },
  { id: 'c15', name: 'CJ Pallazzio', logoUrl: '/assets/clients/cj-pallazzio.png', category: 'Luxury Hotel & Banquets', featured: true, orderIndex: 14 },
  { id: 'c16', name: 'KPR Quality Foods', logoUrl: '/assets/clients/kpr-foods.png', category: 'Healthy Food Products', featured: true, orderIndex: 15 },
  { id: 'c17', name: 'SKV', logoUrl: '/assets/clients/skv.png', category: 'Educational / Retail', featured: true, orderIndex: 16 },
  { id: 'c18', name: 'Pristine True Health', logoUrl: '/assets/clients/pristine-health.png', category: 'Healthcare & Wellness', featured: true, orderIndex: 17 },
  { id: 'c19', name: 'SMB', logoUrl: '/assets/clients/smb.png', category: 'Food Enterprise', featured: true, orderIndex: 18 },
  { id: 'c20', name: 'Tastee Masala', logoUrl: '/assets/clients/tastee-masala.png', category: 'Spices & Seasonings', featured: true, orderIndex: 19 }
];

export const initialProjects: Project[] = [
  {
    id: 'p1',
    title: 'High-Intent Real Estate Lead Generation Funnel',
    clientName: 'Premier Real Estate Brands',
    category: 'Performance Marketing',
    description: 'Designed and deployed targeted Meta Ad lead generation funnels with localized vernacular hooks, custom lookalike audiences, and automated WhatsApp CRM routing.',
    metrics: { roas: '5.2x', leads: '1,450+', cpa: '₹140', ctr: '4.6%' },
    tags: ['Meta Ads', 'Lead Generation', 'Real Estate', 'CRM Funnel'],
    coverUrl: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80',
    linkUrl: '#',
    featured: true,
    orderIndex: 0
  },
  {
    id: 'p2',
    title: 'Hospitality Brand Scaling & Omnichannel Presence',
    clientName: 'The Zen Park & Luxury Hotels',
    category: 'Brand & Social Media Management',
    description: 'Spearheaded organic and paid social growth across Instagram, FB and YouTube. Executed influencer collabs, dynamic video reels, and local search discovery.',
    metrics: { roas: '3.8x', leads: '850+ Bookings', cpa: '₹220', ctr: '3.9%' },
    tags: ['Social Media', 'Brand Management', 'Hospitality', 'Content Strategy'],
    coverUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
    linkUrl: '#',
    featured: true,
    orderIndex: 1
  },
  {
    id: 'p3',
    title: 'FMCG Regional Market Domination & Engagement',
    clientName: 'Tarani Soaps & Tastee Masala',
    category: 'E-commerce & Retail Growth',
    description: 'Built data-driven keyword strategies and visual campaigns targeting retail buyers and families, boosting month-on-month engagement by 180% and brand recall across South India.',
    metrics: { roas: '4.4x', leads: '2.5M Reach', cpa: '₹0.12 CPR', ctr: '4.1%' },
    tags: ['Brand Awareness', 'Keyword SEO', 'FMCG Marketing', 'Audience Growth'],
    coverUrl: 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=1200&q=80',
    linkUrl: '#',
    featured: true,
    orderIndex: 2
  }
];

export const initialWorkProcess: WorkProcessStep[] = [
  {
    id: 'wp1',
    stepNumber: '01',
    title: 'DISCOVER & AUDIT',
    description: 'Deep competitor benchmark analysis, historical campaign audit, buyer persona profiling, and search intent keyword research.',
    icon: 'search',
    orderIndex: 0
  },
  {
    id: 'wp2',
    stepNumber: '02',
    title: 'IDEATE & STRATEGIZE',
    description: 'Crafting high-converting ad angles, content calendars, messaging hooks, and data-backed channel distribution plans.',
    icon: 'lightbulb',
    orderIndex: 1
  },
  {
    id: 'wp3',
    stepNumber: '03',
    title: 'DESIGN & PRODUCE',
    description: 'Creating high-impact visual creatives, ad copy that stops the scroll, conversion landing pages, and tracking pixel setups.',
    icon: 'pen-tool',
    orderIndex: 2
  },
  {
    id: 'wp4',
    stepNumber: '04',
    title: 'OPTIMIZE & TEST',
    description: 'Rigorous A/B creative testing, budget reallocation to winning ad sets, negative keyword filtering, and CPA minimization.',
    icon: 'sliders',
    orderIndex: 3
  },
  {
    id: 'wp5',
    stepNumber: '05',
    title: 'SCALE & REPORT',
    description: 'Aggressive budget scaling on proven winners, weekly transparent ROAS reporting, and continuous customer retention loops.',
    icon: 'trending-up',
    orderIndex: 4
  }
];

export const initialExperiences: Experience[] = [
  {
    id: 'exp1',
    role: 'Digital Marketing Executive',
    company: 'Threesixty Creative Networks',
    location: 'Bangalore',
    period: '2025 – 2026',
    bullets: [
      'Managed the social media presence of 20 brands across Instagram, Facebook, and LinkedIn, maintaining consistent brand voice and content calendars.',
      'Planned, executed, and optimized paid advertising campaigns (Meta Ads) to generate quality leads and improve audience engagement.',
      'Analyzed campaign performance metrics using Google Analytics and Semrush to evaluate effectiveness and identify opportunities for optimization.',
      'Conducted extensive keyword research and competitor analysis to support digital marketing and content strategies.',
      'Supported organic content marketing, brand positioning, personal branding, and social media growth initiatives.'
    ],
    orderIndex: 0
  },
  {
    id: 'exp2',
    role: 'Digital Marketing (Live Projects)',
    company: 'Real Estate Brands',
    location: 'Tamil Nadu / Karnataka',
    period: '2024 – 2025',
    bullets: [
      'Executed performance marketing campaigns on live projects for premier real estate developers.',
      'Ran laser-targeted Meta Ads campaigns generating high-intent qualified leads and optimizing cost-per-acquisition (CPA).'
    ],
    orderIndex: 1
  },
  {
    id: 'exp3',
    role: 'HC & Insurance Operations Associate',
    company: 'NTT DATA',
    location: 'Coimbatore',
    period: '2022 – 2024',
    bullets: [
      'Performed accurate data entry and data management while handling sensitive provider information per strict compliance standards.',
      'Strengthened analytical communication, documentation, task prioritization, and cross-functional team collaboration skills.'
    ],
    orderIndex: 2
  }
];

export const initialEducation: Education[] = [
  {
    id: 'edu1',
    degree: 'Master of Commerce (M.Com) – International Business',
    institution: 'Hindusthan College of Arts and Science',
    location: 'Coimbatore',
    period: '2020 – 2022',
    isCertification: false,
    orderIndex: 0
  },
  {
    id: 'edu2',
    degree: 'Bachelor of Commerce (B.Com)',
    institution: 'Kings College of Arts and Sciences',
    location: 'Namakkal',
    period: '2017 – 2020',
    isCertification: false,
    orderIndex: 1
  },
  {
    id: 'edu3',
    degree: 'Digital Marketing Certification Course',
    institution: 'Liveware Institute',
    location: 'Salem',
    period: '2024',
    isCertification: true,
    orderIndex: 2
  }
];

export const initialSkills: Skill[] = [
  // Digital Marketing
  { id: 's1', category: 'Digital Marketing', name: 'Social Media Marketing', proficiency: 95, orderIndex: 0 },
  { id: 's2', category: 'Digital Marketing', name: 'Performance Marketing', proficiency: 92, orderIndex: 1 },
  { id: 's3', category: 'Digital Marketing', name: 'Meta Ads (FB & Insta)', proficiency: 96, orderIndex: 2 },
  { id: 's4', category: 'Digital Marketing', name: 'Lead Generation', proficiency: 94, orderIndex: 3 },
  { id: 's5', category: 'Digital Marketing', name: 'Organic Content Marketing', proficiency: 90, orderIndex: 4 },
  { id: 's6', category: 'Digital Marketing', name: 'Personal Branding', proficiency: 88, orderIndex: 5 },
  { id: 's7', category: 'Digital Marketing', name: 'Competitor Analysis', proficiency: 92, orderIndex: 6 },
  { id: 's8', category: 'Digital Marketing', name: 'Campaign Performance Analysis', proficiency: 93, orderIndex: 7 },
  // Tools & Analytics
  { id: 's9', category: 'Tools & Analytics', name: 'Google Analytics 4', proficiency: 90, orderIndex: 8 },
  { id: 's10', category: 'Tools & Analytics', name: 'Google Keyword Planner', proficiency: 92, orderIndex: 9 },
  { id: 's11', category: 'Tools & Analytics', name: 'Semrush', proficiency: 86, orderIndex: 10 },
  { id: 's12', category: 'Tools & Analytics', name: 'Ubersuggest', proficiency: 88, orderIndex: 11 },
  // Content & Website
  { id: 's13', category: 'Content & Website', name: 'Canva', proficiency: 95, orderIndex: 12 },
  { id: 's14', category: 'Content & Website', name: 'Adobe Creative Tools', proficiency: 82, orderIndex: 13 },
  { id: 's15', category: 'Content & Website', name: 'WordPress', proficiency: 85, orderIndex: 14 },
  { id: 's16', category: 'Content & Website', name: 'Wix', proficiency: 88, orderIndex: 15 }
];

