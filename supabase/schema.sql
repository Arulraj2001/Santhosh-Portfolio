-- ================================================================
-- SANTHOSH S PORTFOLIO DATABASE SCHEMA
-- PostgreSQL / Supabase Schema for Dynamic Zero-Code CMS
-- ================================================================

-- 1. Site Settings (Theme, colors, typography, 3D flags)
CREATE TABLE IF NOT EXISTS site_settings (
  id TEXT PRIMARY KEY DEFAULT 'current_settings',
  active_theme TEXT DEFAULT 'crimson-noir',
  custom_colors JSONB DEFAULT '{
    "primary": "#D80027",
    "neutral": "#09090B",
    "surface": "#121216",
    "surfaceElevated": "#18181F",
    "border": "#27272A",
    "textPrimary": "#FAFAFA",
    "textSecondary": "#A1A1AA",
    "textMuted": "#9E9EA7"
  }'::jsonb,
  typography_preset TEXT DEFAULT 'outfit-geist',
  fx_settings JSONB DEFAULT '{
    "enable3D": true,
    "particleDensity": "medium",
    "cardTilt": true,
    "marqueeSpeed": 35
  }'::jsonb,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. Profile Details
CREATE TABLE IF NOT EXISTS profile (
  id TEXT PRIMARY KEY DEFAULT 'santhosh_profile',
  name TEXT DEFAULT 'SANTHOSH S',
  title TEXT DEFAULT 'Digital Marketing Executive',
  tagline TEXT DEFAULT 'Turning brand vision into high-ROI conversion pipelines through data-backed Meta Ads, SEO, and personal branding.',
  email TEXT DEFAULT 'santhos2101@gmail.com',
  phone TEXT DEFAULT '+91 9597193371',
  location TEXT DEFAULT 'Namakkal, Tamil Nadu, India',
  avatar_url TEXT DEFAULT '/assets/santhosh1.png',
  resume_url TEXT DEFAULT '#',
  available_status TEXT DEFAULT 'AVAILABLE FOR FREELANCE & FULL-TIME',
  social_links JSONB DEFAULT '{
    "instagram": "https://instagram.com",
    "linkedin": "https://linkedin.com",
    "youtube": "https://youtube.com",
    "facebook": "https://facebook.com",
    "whatsapp": "https://wa.me/919597193371"
  }'::jsonb,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 3. Key Metrics
CREATE TABLE IF NOT EXISTS metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label TEXT NOT NULL,
  value TEXT NOT NULL,
  sublabel TEXT,
  order_index INTEGER DEFAULT 0
);

-- 4. Managed Brands / Clients (All 20 Brands)
CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  logo_url TEXT NOT NULL,
  category TEXT DEFAULT 'Brand Partner',
  featured BOOLEAN DEFAULT true,
  order_index INTEGER DEFAULT 0
);

-- 5. Case Studies / Projects
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  client_name TEXT NOT NULL,
  description TEXT NOT NULL,
  metrics JSONB DEFAULT '{"roas": "4.2x", "leads": "1,200+", "ctr": "3.8%"}'::jsonb,
  tags TEXT[] DEFAULT ARRAY['Meta Ads', 'Performance Marketing', 'Lead Gen'],
  cover_url TEXT,
  link_url TEXT,
  featured BOOLEAN DEFAULT true,
  order_index INTEGER DEFAULT 0
);

-- 6. Work Process
CREATE TABLE IF NOT EXISTS work_process (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  step_number TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT DEFAULT 'search',
  order_index INTEGER DEFAULT 0
);

-- 7. Experience
CREATE TABLE IF NOT EXISTS experiences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role TEXT NOT NULL,
  company TEXT NOT NULL,
  location TEXT NOT NULL,
  period TEXT NOT NULL,
  bullets TEXT[] NOT NULL,
  order_index INTEGER DEFAULT 0
);

-- 8. Education & Certifications
CREATE TABLE IF NOT EXISTS education (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  degree TEXT NOT NULL,
  institution TEXT NOT NULL,
  location TEXT NOT NULL,
  period TEXT NOT NULL,
  is_certification BOOLEAN DEFAULT false,
  order_index INTEGER DEFAULT 0
);

-- 9. Skills
CREATE TABLE IF NOT EXISTS skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL,
  name TEXT NOT NULL,
  proficiency INTEGER DEFAULT 90,
  order_index INTEGER DEFAULT 0
);

-- 10. Contact Inquiries (Lead Capture)
CREATE TABLE IF NOT EXISTS inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  service_needed TEXT,
  budget TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable Row Level Security (RLS)
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_process ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE education ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;

-- Public Read Policies
CREATE POLICY "Public Read Settings" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Public Read Profile" ON profile FOR SELECT USING (true);
CREATE POLICY "Public Read Metrics" ON metrics FOR SELECT USING (true);
CREATE POLICY "Public Read Clients" ON clients FOR SELECT USING (true);
CREATE POLICY "Public Read Projects" ON projects FOR SELECT USING (true);
CREATE POLICY "Public Read Process" ON work_process FOR SELECT USING (true);
CREATE POLICY "Public Read Experiences" ON experiences FOR SELECT USING (true);
CREATE POLICY "Public Read Education" ON education FOR SELECT USING (true);
CREATE POLICY "Public Read Skills" ON skills FOR SELECT USING (true);

-- Public Insert for Inquiries
CREATE POLICY "Public Submit Inquiries" ON inquiries FOR INSERT WITH CHECK (true);

-- Authenticated Full Access for Admin
CREATE POLICY "Admin Full Access Settings" ON site_settings FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin Full Access Profile" ON profile FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin Full Access Metrics" ON metrics FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin Full Access Clients" ON clients FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin Full Access Projects" ON projects FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin Full Access Process" ON work_process FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin Full Access Experiences" ON experiences FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin Full Access Education" ON education FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin Full Access Skills" ON skills FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin Full Access Inquiries" ON inquiries FOR ALL USING (auth.role() = 'authenticated');

-- Storage Bucket Setup for Images & Resumes
INSERT INTO storage.buckets (id, name, public) 
VALUES ('portfolio-assets', 'portfolio-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies
CREATE POLICY "Public Read Portfolio Assets" ON storage.objects FOR SELECT USING (bucket_id = 'portfolio-assets');
CREATE POLICY "Public Upload Portfolio Assets" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'portfolio-assets');
CREATE POLICY "Public Update Portfolio Assets" ON storage.objects FOR UPDATE USING (bucket_id = 'portfolio-assets');

