import React, { useState } from 'react';
import {
  Palette,
  User,
  Building2,
  FolderKanban,
  FileText,
  Briefcase,
  GraduationCap,
  Wrench,
  Inbox,
  Database,
  X,
  Plus,
  Trash2,
  Edit3,
  Upload,
  Save,
  CheckCircle2,
  RefreshCw,
  Copy,
  ExternalLink,
  Sliders,
  Sparkles,
  Download,
  UploadCloud,
  Check
} from 'lucide-react';
import { usePortfolioStore } from '../../lib/store';
import { THEME_PRESETS } from '../../data/initialData';
import { ThemePreset, Client, Project, Skill, Experience, Education, WorkProcessStep, Metric } from '../../types';
import {
  isSupabaseConfigured,
  getSupabaseCredentials,
  saveSupabaseCredentials,
  uploadAssetFile
} from '../../lib/supabase';
import { uploadAllToSupabase } from '../../lib/store';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AdminDashboard({ isOpen, onClose }: AdminDashboardProps) {
  const store = usePortfolioStore();
  const { state } = store;
  const primaryColor = state.settings.customColors.primary;

  const [activeTab, setActiveTab] = useState<
    'theme' | 'profile' | 'clients' | 'projects' | 'experience' | 'skills' | 'process' | 'inquiries' | 'supabase'
  >('theme');

  // Supabase state
  const creds = getSupabaseCredentials();
  const [supabaseUrl, setSupabaseUrl] = useState(creds.url);
  const [supabaseKey, setSupabaseKey] = useState(creds.key);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);
  const [backupStatus, setBackupStatus] = useState<string | null>(null);

  // Editing Project Modal state
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  // New Client Form state
  const [newClient, setNewClient] = useState({
    name: '',
    category: 'Brand Partner',
    logoUrl: '/assets/clients/tarani-soaps.png'
  });

  // New Project Form state
  const [newProject, setNewProject] = useState({
    title: '',
    clientName: '',
    category: 'Performance Marketing',
    description: '',
    roas: '4.5x',
    leads: '1,000+',
    cpa: '₹150',
    tags: 'Meta Ads, Lead Gen',
    coverUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80'
  });

  // New Experience Form state
  const [newExp, setNewExp] = useState({
    role: '',
    company: '',
    location: '',
    period: '',
    bullets: ''
  });

  // New Education Form state
  const [newEdu, setNewEdu] = useState({
    degree: '',
    institution: '',
    location: '',
    period: '',
    isCertification: false
  });

  // New Skill Form state
  const [newSkill, setNewSkill] = useState({
    category: 'Digital Marketing',
    name: '',
    proficiency: 90
  });

  if (!isOpen) return null;

  const handleSaveSupabase = () => {
    saveSupabaseCredentials(supabaseUrl, supabaseKey);
    setSyncStatus('Credentials saved in local config!');
    setTimeout(() => setSyncStatus(null), 3000);
  };

  const handleCloudSync = async () => {
    setSyncStatus('Syncing all portfolio data to Supabase...');
    const result = await uploadAllToSupabase();
    setSyncStatus(result.message);
    setTimeout(() => setSyncStatus(null), 5000);
  };

  const handleExportBackup = () => {
    const jsonStr = store.exportBackupJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `santhosh-portfolio-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setBackupStatus('Backup JSON downloaded successfully!');
    setTimeout(() => setBackupStatus(null), 4000);
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        const res = store.importBackupJSON(content);
        if (res.success) {
          setBackupStatus('Portfolio restored from backup file!');
        } else {
          setBackupStatus(`Import failed: ${res.error}`);
        }
        setTimeout(() => setBackupStatus(null), 4000);
      };
      reader.readAsText(e.target.files[0]);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = await uploadAssetFile(file, 'avatars');
      if (url) {
        store.updateProfile({ avatarUrl: url });
      }
    }
  };

  const handleClientLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = await uploadAssetFile(file, 'clients');
      if (url) {
        setNewClient({ ...newClient, logoUrl: url });
      }
    }
  };

  // CLIENT CRUD
  const handleAddClient = () => {
    if (!newClient.name) return;
    const clientItem: Client = {
      id: `c_${Date.now()}`,
      name: newClient.name,
      category: newClient.category,
      logoUrl: newClient.logoUrl,
      featured: true,
      orderIndex: state.clients.length
    };
    store.updateClients([...state.clients, clientItem]);
    setNewClient({
      name: '',
      category: 'Brand Partner',
      logoUrl: '/assets/clients/tarani-soaps.png'
    });
  };

  const handleDeleteClient = (id: string) => {
    store.updateClients(state.clients.filter((c) => c.id !== id));
  };

  // PROJECT CRUD
  const handleAddProject = () => {
    if (!newProject.title || !newProject.clientName) return;
    const projectItem: Project = {
      id: `p_${Date.now()}`,
      title: newProject.title,
      clientName: newProject.clientName,
      category: newProject.category,
      description: newProject.description,
      metrics: {
        roas: newProject.roas,
        leads: newProject.leads,
        cpa: newProject.cpa
      },
      tags: newProject.tags.split(',').map((t) => t.trim()),
      coverUrl: newProject.coverUrl,
      featured: true,
      orderIndex: state.projects.length
    };
    store.updateProjects([...state.projects, projectItem]);
    setNewProject({
      title: '',
      clientName: '',
      category: 'Performance Marketing',
      description: '',
      roas: '4.5x',
      leads: '1,000+',
      cpa: '₹150',
      tags: 'Meta Ads, Lead Gen',
      coverUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80'
    });
  };

  const handleUpdateEditingProject = () => {
    if (!editingProject) return;
    store.updateProjects(
      state.projects.map((p) => (p.id === editingProject.id ? editingProject : p))
    );
    setEditingProject(null);
  };

  const handleDeleteProject = (id: string) => {
    store.updateProjects(state.projects.filter((p) => p.id !== id));
  };

  // EXPERIENCE CRUD
  const handleAddExperience = () => {
    if (!newExp.role || !newExp.company) return;
    const expItem: Experience = {
      id: `exp_${Date.now()}`,
      role: newExp.role,
      company: newExp.company,
      location: newExp.location,
      period: newExp.period,
      bullets: newExp.bullets.split('\n').filter((b) => b.trim().length > 0),
      orderIndex: state.experiences.length
    };
    store.updateExperiences([...state.experiences, expItem]);
    setNewExp({ role: '', company: '', location: '', period: '', bullets: '' });
  };

  const handleDeleteExperience = (id: string) => {
    store.updateExperiences(state.experiences.filter((e) => e.id !== id));
  };

  // EDUCATION CRUD
  const handleAddEducation = () => {
    if (!newEdu.degree || !newEdu.institution) return;
    const eduItem: Education = {
      id: `edu_${Date.now()}`,
      degree: newEdu.degree,
      institution: newEdu.institution,
      location: newEdu.location,
      period: newEdu.period,
      isCertification: newEdu.isCertification,
      orderIndex: state.education.length
    };
    store.updateEducation([...state.education, eduItem]);
    setNewEdu({ degree: '', institution: '', location: '', period: '', isCertification: false });
  };

  const handleDeleteEducation = (id: string) => {
    store.updateEducation(state.education.filter((e) => e.id !== id));
  };

  // SKILLS CRUD
  const handleAddSkill = () => {
    if (!newSkill.name) return;
    const skillItem: Skill = {
      id: `skill_${Date.now()}`,
      category: newSkill.category,
      name: newSkill.name,
      proficiency: Number(newSkill.proficiency) || 90,
      orderIndex: state.skills.length
    };
    store.updateSkills([...state.skills, skillItem]);
    setNewSkill({ category: 'Digital Marketing', name: '', proficiency: 90 });
  };

  const handleDeleteSkill = (id: string) => {
    store.updateSkills(state.skills.filter((s) => s.id !== id));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-xl animate-fadeIn">
      <div className="relative w-full max-w-6xl h-[94vh] rounded-3xl bg-[#0E0E12] border border-[#27272A] shadow-2xl flex flex-col overflow-hidden">
        
        {/* Top Bar */}
        <div className="px-6 py-4 border-b border-[#27272A] flex items-center justify-between bg-[#121216]">
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center text-white"
              style={{ backgroundColor: primaryColor }}
            >
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-display font-extrabold text-base sm:text-lg text-white flex items-center gap-2">
                Zero-Code Admin Studio
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  FULL CRUD CMS
                </span>
              </h2>
              <p className="text-[11px] font-mono text-[#9E9EA7]">
                Update colors, text, stats, photos, case studies, & brands without editing code
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={store.resetToDefaults}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono text-[#9E9EA7] hover:text-white border border-[#27272A] bg-[#18181F]"
              title="Reset state to initial default data"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset Defaults</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-[#18181F] text-[#9E9EA7] hover:text-white hover:bg-[#27272A] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex overflow-x-auto border-b border-[#27272A] bg-[#0A0A0D] px-6 py-2 gap-2 text-xs font-mono scrollbar-none">
          {[
            { id: 'theme', label: 'Theme & Colors', icon: <Palette className="w-3.5 h-3.5" /> },
            { id: 'profile', label: 'Profile & Metrics', icon: <User className="w-3.5 h-3.5" /> },
            { id: 'clients', label: `20 Brands (${state.clients.length})`, icon: <Building2 className="w-3.5 h-3.5" /> },
            { id: 'projects', label: `Case Studies (${state.projects.length})`, icon: <FolderKanban className="w-3.5 h-3.5" /> },
            { id: 'experience', label: 'Experience & Edu', icon: <Briefcase className="w-3.5 h-3.5" /> },
            { id: 'skills', label: `Skills (${state.skills.length})`, icon: <Wrench className="w-3.5 h-3.5" /> },
            { id: 'process', label: '5-Stage Process', icon: <FileText className="w-3.5 h-3.5" /> },
            { id: 'inquiries', label: `Inquiries (${state.inquiries.length})`, icon: <Inbox className="w-3.5 h-3.5" /> },
            { id: 'supabase', label: 'Supabase Cloud & Backup', icon: <Database className="w-3.5 h-3.5" /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-[#18181F] text-white border border-[#3F3F46] font-bold shadow'
                  : 'text-[#9E9EA7] hover:text-white hover:bg-[#121216]'
              }`}
            >
              <span style={{ color: activeTab === tab.id ? primaryColor : undefined }}>
                {tab.icon}
              </span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-[#09090C]">
          
          {/* TAB 1: THEME & VISUAL CUSTOMIZER */}
          {activeTab === 'theme' && (
            <div className="max-w-4xl space-y-8">
              {/* Presets */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-bold text-lg text-white">
                    1-Click Curated Theme Presets
                  </h3>
                  <span className="text-xs font-mono text-[#9E9EA7]">
                    Instant full-site restyling
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {(Object.keys(THEME_PRESETS) as ThemePreset[]).filter(k => k !== 'custom').map((key) => {
                    const preset = THEME_PRESETS[key];
                    const isSelected = state.settings.activeTheme === key;
                    return (
                      <button
                        key={key}
                        onClick={() => store.updateThemePreset(key)}
                        className={`p-4 rounded-2xl border text-left transition-all ${
                          isSelected
                            ? 'border-white bg-[#18181F] ring-2'
                            : 'border-[#27272A] bg-[#121216] hover:border-[#3F3F46]'
                        }`}
                        style={{
                          borderColor: isSelected ? preset.colors.primary : undefined,
                          boxShadow: isSelected ? `0 0 15px ${preset.colors.primary}44` : undefined
                        }}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span className="font-display font-bold text-sm text-white">
                            {preset.name}
                          </span>
                          {isSelected && (
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full text-white"
                                  style={{ backgroundColor: preset.colors.primary }}>
                              ACTIVE
                            </span>
                          )}
                        </div>

                        {/* Color swatches */}
                        <div className="flex items-center gap-2">
                          <div
                            className="w-6 h-6 rounded-full border border-black/30 shadow-sm"
                            style={{ backgroundColor: preset.colors.primary }}
                            title="Primary Accent"
                          />
                          <div
                            className="w-6 h-6 rounded-full border border-white/10"
                            style={{ backgroundColor: preset.colors.neutral }}
                            title="Canvas Background"
                          />
                          <div
                            className="w-6 h-6 rounded-full border border-white/10"
                            style={{ backgroundColor: preset.colors.surface }}
                            title="Card Surface"
                          />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Live Color Picker for Fine Tuning */}
              <div className="space-y-4 pt-6 border-t border-[#27272A]">
                <h3 className="font-display font-bold text-lg text-white">
                  Custom Palette Live Color Pickers
                </h3>
                <p className="text-xs text-[#A1A1AA]">
                  Adjust any color token; changes inject live into CSS variables immediately.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { label: 'Primary Brand Accent', key: 'primary' },
                    { label: 'Dark Canvas Background', key: 'neutral' },
                    { label: 'Card Surface Base', key: 'surface' },
                    { label: 'Elevated Surface / Inputs', key: 'surfaceElevated' },
                    { label: 'Structural Borders', key: 'border' },
                    { label: 'Primary Text Ink', key: 'textPrimary' },
                    { label: 'Secondary Text Ink', key: 'textSecondary' },
                    { label: 'Muted Text / Labels', key: 'textMuted' }
                  ].map((field) => (
                    <div key={field.key} className="p-4 rounded-2xl bg-[#121216] border border-[#27272A] space-y-2">
                      <label className="text-xs font-mono uppercase text-[#A1A1AA] block">
                        {field.label}
                      </label>
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          value={(state.settings.customColors as any)[field.key]}
                          onChange={(e) =>
                            store.updateCustomColors({ [field.key]: e.target.value })
                          }
                          className="w-9 h-9 rounded-lg border-0 cursor-pointer bg-transparent"
                        />
                        <input
                          type="text"
                          value={(state.settings.customColors as any)[field.key]}
                          onChange={(e) =>
                            store.updateCustomColors({ [field.key]: e.target.value })
                          }
                          className="flex-1 px-3 py-1.5 rounded-lg bg-[#18181F] border border-[#27272A] text-white font-mono text-xs"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Typography Preset Switcher */}
              <div className="space-y-4 pt-6 border-t border-[#27272A]">
                <h3 className="font-display font-bold text-lg text-white">
                  Typography Pairing
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'outfit-geist', label: 'Outfit + Geist', desc: 'Modern Condensed Display (Default)' },
                    { id: 'cabinet-satoshi', label: 'Editorial Sans', desc: 'Clean Swiss Architecture' },
                    { id: 'space-grotesk', label: 'Space Grotesk + Mono', desc: 'Tech & Performance Aesthetic' }
                  ].map((font) => (
                    <button
                      key={font.id}
                      onClick={() => store.updateTypography(font.id)}
                      className={`p-4 rounded-2xl border text-left transition-all ${
                        state.settings.typographyPreset === font.id
                          ? 'border-white bg-[#18181F]'
                          : 'border-[#27272A] bg-[#121216] hover:border-[#3F3F46]'
                      }`}
                    >
                      <p className="font-bold text-sm text-white">{font.label}</p>
                      <p className="text-[11px] text-[#A1A1AA] mt-1">{font.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* 3D Visualizer & FX Controls */}
              <div className="space-y-4 pt-6 border-t border-[#27272A]">
                <h3 className="font-display font-bold text-lg text-white">
                  3D Visualizer & Motion Controls
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-[#121216] border border-[#27272A] flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-white">Interactive 3D WebGL Canvas</p>
                      <p className="text-xs text-[#A1A1AA]">Three.js particle field & floating geometry</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={state.settings.fxSettings.enable3D}
                      onChange={(e) =>
                        store.updateFxSettings({ enable3D: e.target.checked })
                      }
                      className="w-5 h-5 rounded cursor-pointer accent-[#D80027]"
                    />
                  </div>

                  <div className="p-4 rounded-2xl bg-[#121216] border border-[#27272A] space-y-2">
                    <label className="text-xs font-mono uppercase text-[#A1A1AA] block">
                      3D Particle Density
                    </label>
                    <select
                      value={state.settings.fxSettings.particleDensity}
                      onChange={(e) =>
                        store.updateFxSettings({ particleDensity: e.target.value as any })
                      }
                      className="w-full px-3 py-2 rounded-lg bg-[#18181F] border border-[#27272A] text-white text-xs font-mono"
                    >
                      <option value="low">Low (60 particles - Lightweight)</option>
                      <option value="medium">Medium (120 particles - Balanced)</option>
                      <option value="high">High (240 particles - Rich)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PROFILE & METRICS CMS */}
          {activeTab === 'profile' && (
            <div className="max-w-4xl space-y-8">
              <div className="space-y-4">
                <h3 className="font-display font-bold text-lg text-white">
                  Hero Identity & Bio
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase text-[#A1A1AA] mb-1">Full Name</label>
                    <input
                      type="text"
                      value={state.profile.name}
                      onChange={(e) => store.updateProfile({ name: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#121216] border border-[#27272A] text-white text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-[#A1A1AA] mb-1">Executive Title</label>
                    <input
                      type="text"
                      value={state.profile.title}
                      onChange={(e) => store.updateProfile({ title: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#121216] border border-[#27272A] text-white text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-[#A1A1AA] mb-1">Availability Status Pill</label>
                  <input
                    type="text"
                    value={state.profile.availableStatus}
                    onChange={(e) => store.updateProfile({ availableStatus: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#121216] border border-[#27272A] text-white text-sm font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-[#A1A1AA] mb-1">Professional Tagline / Hook</label>
                  <textarea
                    rows={3}
                    value={state.profile.tagline}
                    onChange={(e) => store.updateProfile({ tagline: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#121216] border border-[#27272A] text-white text-sm resize-none"
                  />
                </div>

                {/* Photo Upload & Preview */}
                <div className="p-5 rounded-2xl bg-[#121216] border border-[#27272A] flex flex-col sm:flex-row items-center gap-6">
                  <img
                    src={state.profile.avatarUrl}
                    alt={state.profile.name}
                    className="w-24 h-24 rounded-2xl object-cover border border-[#27272A] bg-black"
                  />
                  <div className="space-y-2 text-center sm:text-left flex-1">
                    <p className="text-sm font-bold text-white">Hero Portrait Image</p>
                    <p className="text-xs text-[#A1A1AA]">
                      Current Path: <code className="text-white font-mono">{state.profile.avatarUrl}</code>
                    </p>
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <label className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider text-white cursor-pointer shadow"
                             style={{ backgroundColor: primaryColor }}>
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload Photo File</span>
                        <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
                      </label>
                      <input
                        type="text"
                        placeholder="Or enter direct image URL"
                        value={state.profile.avatarUrl}
                        onChange={(e) => store.updateProfile({ avatarUrl: e.target.value })}
                        className="px-3 py-1.5 rounded-lg bg-[#18181F] border border-[#27272A] text-white text-xs font-mono flex-1 min-w-[200px]"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase text-[#A1A1AA] mb-1">Email</label>
                    <input
                      type="email"
                      value={state.profile.email}
                      onChange={(e) => store.updateProfile({ email: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#121216] border border-[#27272A] text-white text-sm font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-[#A1A1AA] mb-1">Phone</label>
                    <input
                      type="text"
                      value={state.profile.phone}
                      onChange={(e) => store.updateProfile({ phone: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#121216] border border-[#27272A] text-white text-sm font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-[#A1A1AA] mb-1">Location</label>
                    <input
                      type="text"
                      value={state.profile.location}
                      onChange={(e) => store.updateProfile({ location: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#121216] border border-[#27272A] text-white text-sm"
                    />
                  </div>
                </div>

                {/* Full Social Media Management */}
                <div className="space-y-3 pt-2">
                  <p className="text-xs font-mono uppercase text-[#A1A1AA] font-bold">Social Media Profiles & Channels</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-mono uppercase text-[#9E9EA7] mb-1">LinkedIn Profile</label>
                      <input
                        type="text"
                        placeholder="https://linkedin.com/in/..."
                        value={state.profile.socialLinks?.linkedin || ''}
                        onChange={(e) =>
                          store.updateProfile({
                            socialLinks: { ...state.profile.socialLinks, linkedin: e.target.value }
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-[#121216] border border-[#27272A] text-white text-xs font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono uppercase text-[#9E9EA7] mb-1">Instagram Profile</label>
                      <input
                        type="text"
                        placeholder="https://instagram.com/..."
                        value={state.profile.socialLinks?.instagram || ''}
                        onChange={(e) =>
                          store.updateProfile({
                            socialLinks: { ...state.profile.socialLinks, instagram: e.target.value }
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-[#121216] border border-[#27272A] text-white text-xs font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono uppercase text-[#9E9EA7] mb-1">WhatsApp URL / Number</label>
                      <input
                        type="text"
                        placeholder="https://wa.me/919597193371"
                        value={state.profile.socialLinks?.whatsapp || ''}
                        onChange={(e) =>
                          store.updateProfile({
                            socialLinks: { ...state.profile.socialLinks, whatsapp: e.target.value }
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-[#121216] border border-[#27272A] text-white text-xs font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono uppercase text-[#9E9EA7] mb-1">YouTube Channel</label>
                      <input
                        type="text"
                        placeholder="https://youtube.com/@..."
                        value={state.profile.socialLinks?.youtube || ''}
                        onChange={(e) =>
                          store.updateProfile({
                            socialLinks: { ...state.profile.socialLinks, youtube: e.target.value }
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-[#121216] border border-[#27272A] text-white text-xs font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono uppercase text-[#9E9EA7] mb-1">Facebook Page</label>
                      <input
                        type="text"
                        placeholder="https://facebook.com/..."
                        value={state.profile.socialLinks?.facebook || ''}
                        onChange={(e) =>
                          store.updateProfile({
                            socialLinks: { ...state.profile.socialLinks, facebook: e.target.value }
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-[#121216] border border-[#27272A] text-white text-xs font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 4 Live Hero Metrics Stack CRUD */}
              <div className="space-y-4 pt-6 border-t border-[#27272A]">
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-bold text-lg text-white">
                    4 Live Hero Performance Metrics
                  </h3>
                  <button
                    onClick={() => {
                      const newM: Metric = {
                        id: `m_${Date.now()}`,
                        value: '99%',
                        label: 'CLIENT RETENTION',
                        sublabel: 'Custom KPI Metric',
                        orderIndex: state.metrics.length
                      };
                      store.updateMetrics([...state.metrics, newM]);
                    }}
                    className="px-3 py-1.5 rounded-full text-xs font-mono text-white flex items-center gap-1.5 shadow"
                    style={{ backgroundColor: primaryColor }}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Metric</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {state.metrics.map((m, idx) => (
                    <div key={m.id} className="p-4 rounded-2xl bg-[#121216] border border-[#27272A] space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono uppercase text-[#9E9EA7]">Card 0{idx + 1}</span>
                        {state.metrics.length > 1 && (
                          <button
                            onClick={() => store.updateMetrics(state.metrics.filter((x) => x.id !== m.id))}
                            className="p-1 rounded bg-red-500/20 text-red-400 hover:bg-red-500/30"
                            title="Delete Metric"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="Value (e.g. 20+)"
                          value={m.value}
                          onChange={(e) => {
                            const updated = [...state.metrics];
                            updated[idx].value = e.target.value;
                            store.updateMetrics(updated);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-[#18181F] border border-[#27272A] text-white text-sm font-bold"
                        />
                        <input
                          type="text"
                          placeholder="Label (e.g. MANAGED BRANDS)"
                          value={m.label}
                          onChange={(e) => {
                            const updated = [...state.metrics];
                            updated[idx].label = e.target.value;
                            store.updateMetrics(updated);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-[#18181F] border border-[#27272A] text-white text-xs font-semibold"
                        />
                      </div>
                      <input
                        type="text"
                        placeholder="Sublabel description"
                        value={m.sublabel || ''}
                        onChange={(e) => {
                          const updated = [...state.metrics];
                          updated[idx].sublabel = e.target.value;
                          store.updateMetrics(updated);
                        }}
                        className="w-full px-3 py-1.5 rounded-lg bg-[#18181F] border border-[#27272A] text-white text-xs"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: 20 BRANDS CLIENTS CMS */}
          {activeTab === 'clients' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-display font-bold text-lg text-white">
                    20 Client Brands Portfolio
                  </h3>
                  <p className="text-xs text-[#A1A1AA]">
                    Manage brand logos, categories, and real-time order in the 3D ticker.
                  </p>
                </div>

                {/* Add New Brand Box */}
                <div className="flex flex-wrap items-center gap-2">
                  <input
                    type="text"
                    placeholder="Brand Name"
                    value={newClient.name}
                    onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                    className="px-3 py-1.5 rounded-lg bg-[#121216] border border-[#27272A] text-white text-xs"
                  />
                  <input
                    type="text"
                    placeholder="Category"
                    value={newClient.category}
                    onChange={(e) => setNewClient({ ...newClient, category: e.target.value })}
                    className="px-3 py-1.5 rounded-lg bg-[#121216] border border-[#27272A] text-white text-xs"
                  />
                  <label className="px-3 py-1.5 rounded-lg bg-[#18181F] border border-[#27272A] text-xs text-[#FAFAFA] cursor-pointer flex items-center gap-1.5 hover:bg-[#27272A]">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Logo</span>
                    <input type="file" accept="image/*" onChange={handleClientLogoUpload} className="hidden" />
                  </label>
                  <button
                    onClick={handleAddClient}
                    className="px-4 py-1.5 rounded-lg text-xs font-bold text-white uppercase shadow"
                    style={{ backgroundColor: primaryColor }}
                  >
                    Add Brand
                  </button>
                </div>
              </div>

              {/* Grid of All Brands with Inline Editing */}
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
                {state.clients.map((c, idx) => (
                  <div
                    key={c.id}
                    className="p-3 rounded-2xl bg-[#121216] border border-[#27272A] hover:border-[#3F3F46] flex flex-col items-center justify-between group relative space-y-2"
                  >
                    <button
                      onClick={() => handleDeleteClient(c.id)}
                      className="absolute top-2 right-2 p-1 rounded-full bg-red-500/20 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                      title="Delete brand"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>

                    <div className="w-full h-16 flex items-center justify-center bg-white/95 rounded-xl p-1.5">
                      <img src={c.logoUrl} alt={c.name} className="max-h-full max-w-full object-contain" />
                    </div>

                    <input
                      type="text"
                      value={c.name}
                      onChange={(e) => {
                        const updated = [...state.clients];
                        updated[idx].name = e.target.value;
                        store.updateClients(updated);
                      }}
                      className="w-full text-center text-xs font-bold text-white bg-transparent border-b border-transparent hover:border-[#3F3F46] focus:border-white focus:outline-none"
                    />

                    <input
                      type="text"
                      value={c.category}
                      onChange={(e) => {
                        const updated = [...state.clients];
                        updated[idx].category = e.target.value;
                        store.updateClients(updated);
                      }}
                      className="w-full text-center text-[10px] font-mono text-[#9E9EA7] bg-transparent border-b border-transparent hover:border-[#3F3F46] focus:border-white focus:outline-none"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: CASE STUDIES CMS */}
          {activeTab === 'projects' && (
            <div className="space-y-6">
              <h3 className="font-display font-bold text-lg text-white">
                Featured Case Studies & Campaigns
              </h3>

              {/* Add Project Form */}
              <div className="p-5 rounded-2xl bg-[#121216] border border-[#27272A] space-y-4">
                <p className="text-xs font-mono uppercase text-[#A1A1AA] font-bold">Add New Case Study</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Project Title *"
                    value={newProject.title}
                    onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                    className="px-3 py-2 rounded-xl bg-[#18181F] border border-[#27272A] text-white text-xs"
                  />
                  <input
                    type="text"
                    placeholder="Client Name *"
                    value={newProject.clientName}
                    onChange={(e) => setNewProject({ ...newProject, clientName: e.target.value })}
                    className="px-3 py-2 rounded-xl bg-[#18181F] border border-[#27272A] text-white text-xs"
                  />
                </div>

                <textarea
                  rows={2}
                  placeholder="Case study summary and execution..."
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#18181F] border border-[#27272A] text-white text-xs resize-none"
                />

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <input
                    type="text"
                    placeholder="ROAS (e.g. 4.8x)"
                    value={newProject.roas}
                    onChange={(e) => setNewProject({ ...newProject, roas: e.target.value })}
                    className="px-3 py-1.5 rounded-lg bg-[#18181F] border border-[#27272A] text-white text-xs"
                  />
                  <input
                    type="text"
                    placeholder="Leads (e.g. 1,400+)"
                    value={newProject.leads}
                    onChange={(e) => setNewProject({ ...newProject, leads: e.target.value })}
                    className="px-3 py-1.5 rounded-lg bg-[#18181F] border border-[#27272A] text-white text-xs"
                  />
                  <input
                    type="text"
                    placeholder="CPA (e.g. ₹140)"
                    value={newProject.cpa}
                    onChange={(e) => setNewProject({ ...newProject, cpa: e.target.value })}
                    className="px-3 py-1.5 rounded-lg bg-[#18181F] border border-[#27272A] text-white text-xs"
                  />
                  <input
                    type="text"
                    placeholder="Tags (comma separated)"
                    value={newProject.tags}
                    onChange={(e) => setNewProject({ ...newProject, tags: e.target.value })}
                    className="px-3 py-1.5 rounded-lg bg-[#18181F] border border-[#27272A] text-white text-xs"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Cover Image URL"
                    value={newProject.coverUrl}
                    onChange={(e) => setNewProject({ ...newProject, coverUrl: e.target.value })}
                    className="flex-1 px-3 py-1.5 rounded-lg bg-[#18181F] border border-[#27272A] text-white text-xs"
                  />
                  <button
                    onClick={handleAddProject}
                    className="px-5 py-2 rounded-full text-xs font-bold text-white uppercase shadow"
                    style={{ backgroundColor: primaryColor }}
                  >
                    Save Case Study
                  </button>
                </div>
              </div>

              {/* Projects List with Edit Modal Trigger */}
              <div className="space-y-3">
                {state.projects.map((p) => (
                  <div
                    key={p.id}
                    className="p-4 rounded-2xl bg-[#121216] border border-[#27272A] flex items-center justify-between gap-4"
                  >
                    <div>
                      <span className="text-[10px] font-mono uppercase text-[#9E9EA7]">{p.clientName}</span>
                      <h4 className="font-bold text-white text-sm">{p.title}</h4>
                      <p className="text-xs text-[#A1A1AA] line-clamp-1">{p.description}</p>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-xs font-mono font-bold mr-2" style={{ color: primaryColor }}>
                        {p.metrics.roas || p.metrics.leads}
                      </span>
                      <button
                        onClick={() => setEditingProject({ ...p })}
                        className="p-2 rounded-lg bg-[#18181F] text-white hover:bg-[#27272A]"
                        title="Edit Project"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteProject(p.id)}
                        className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30"
                        title="Delete Project"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* EDIT PROJECT MODAL */}
              {editingProject && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
                  <div className="relative w-full max-w-lg rounded-3xl bg-[#121216] border border-[#27272A] p-6 space-y-4 shadow-2xl">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-white text-base">Edit Case Study</h4>
                      <button onClick={() => setEditingProject(null)} className="p-1 rounded bg-[#18181F] text-[#9E9EA7]">
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <input
                      type="text"
                      value={editingProject.title}
                      onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                      placeholder="Title"
                      className="w-full px-3 py-2 rounded-xl bg-[#18181F] border border-[#27272A] text-white text-xs"
                    />
                    <input
                      type="text"
                      value={editingProject.clientName}
                      onChange={(e) => setEditingProject({ ...editingProject, clientName: e.target.value })}
                      placeholder="Client Name"
                      className="w-full px-3 py-2 rounded-xl bg-[#18181F] border border-[#27272A] text-white text-xs"
                    />
                    <textarea
                      rows={3}
                      value={editingProject.description}
                      onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                      placeholder="Description"
                      className="w-full px-3 py-2 rounded-xl bg-[#18181F] border border-[#27272A] text-white text-xs resize-none"
                    />

                    <div className="grid grid-cols-3 gap-2">
                      <input
                        type="text"
                        value={editingProject.metrics.roas || ''}
                        onChange={(e) =>
                          setEditingProject({
                            ...editingProject,
                            metrics: { ...editingProject.metrics, roas: e.target.value }
                          })
                        }
                        placeholder="ROAS"
                        className="px-3 py-1.5 rounded-lg bg-[#18181F] border border-[#27272A] text-white text-xs"
                      />
                      <input
                        type="text"
                        value={editingProject.metrics.leads || ''}
                        onChange={(e) =>
                          setEditingProject({
                            ...editingProject,
                            metrics: { ...editingProject.metrics, leads: e.target.value }
                          })
                        }
                        placeholder="Leads"
                        className="px-3 py-1.5 rounded-lg bg-[#18181F] border border-[#27272A] text-white text-xs"
                      />
                      <input
                        type="text"
                        value={editingProject.metrics.cpa || ''}
                        onChange={(e) =>
                          setEditingProject({
                            ...editingProject,
                            metrics: { ...editingProject.metrics, cpa: e.target.value }
                          })
                        }
                        placeholder="CPA"
                        className="px-3 py-1.5 rounded-lg bg-[#18181F] border border-[#27272A] text-white text-xs"
                      />
                    </div>

                    <input
                      type="text"
                      value={editingProject.coverUrl || ''}
                      onChange={(e) => setEditingProject({ ...editingProject, coverUrl: e.target.value })}
                      placeholder="Cover Image URL"
                      className="w-full px-3 py-1.5 rounded-lg bg-[#18181F] border border-[#27272A] text-white text-xs"
                    />

                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        onClick={() => setEditingProject(null)}
                        className="px-4 py-2 rounded-full text-xs font-mono text-[#9E9EA7]"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleUpdateEditingProject}
                        className="px-5 py-2 rounded-full text-xs font-bold text-white uppercase shadow"
                        style={{ backgroundColor: primaryColor }}
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: EXPERIENCE & EDUCATION CMS */}
          {activeTab === 'experience' && (
            <div className="space-y-8 max-w-4xl">
              {/* Experience Timeline Section */}
              <div className="space-y-4">
                <h3 className="font-display font-bold text-lg text-white">
                  Professional Experience Timeline
                </h3>

                {/* Add Experience Form */}
                <div className="p-5 rounded-2xl bg-[#121216] border border-[#27272A] space-y-3">
                  <p className="text-xs font-mono uppercase text-[#A1A1AA] font-bold">Add Work Experience</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Role Title (e.g. Digital Marketing Executive)"
                      value={newExp.role}
                      onChange={(e) => setNewExp({ ...newExp, role: e.target.value })}
                      className="px-3 py-2 rounded-xl bg-[#18181F] border border-[#27272A] text-white text-xs"
                    />
                    <input
                      type="text"
                      placeholder="Company (e.g. Threesixty Creative Networks)"
                      value={newExp.company}
                      onChange={(e) => setNewExp({ ...newExp, company: e.target.value })}
                      className="px-3 py-2 rounded-xl bg-[#18181F] border border-[#27272A] text-white text-xs"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Location (e.g. Bangalore)"
                      value={newExp.location}
                      onChange={(e) => setNewExp({ ...newExp, location: e.target.value })}
                      className="px-3 py-2 rounded-xl bg-[#18181F] border border-[#27272A] text-white text-xs"
                    />
                    <input
                      type="text"
                      placeholder="Period (e.g. 2025 – 2026)"
                      value={newExp.period}
                      onChange={(e) => setNewExp({ ...newExp, period: e.target.value })}
                      className="px-3 py-2 rounded-xl bg-[#18181F] border border-[#27272A] text-white text-xs"
                    />
                  </div>
                  <textarea
                    rows={3}
                    placeholder="Achievement bullets (one per line)..."
                    value={newExp.bullets}
                    onChange={(e) => setNewExp({ ...newExp, bullets: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#18181F] border border-[#27272A] text-white text-xs resize-none"
                  />
                  <button
                    onClick={handleAddExperience}
                    className="px-5 py-2 rounded-full text-xs font-bold text-white uppercase shadow"
                    style={{ backgroundColor: primaryColor }}
                  >
                    Add Experience Item
                  </button>
                </div>

                {/* Experience List */}
                <div className="space-y-3">
                  {state.experiences.map((exp, idx) => (
                    <div key={exp.id} className="p-4 rounded-2xl bg-[#121216] border border-[#27272A] space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-bold text-white text-sm">{exp.role}</h4>
                          <p className="text-xs text-[#A1A1AA]">{exp.company} • {exp.location} ({exp.period})</p>
                        </div>
                        <button
                          onClick={() => handleDeleteExperience(exp.id)}
                          className="p-1.5 rounded bg-red-500/20 text-red-400 hover:bg-red-500/30"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <ul className="text-xs text-[#A1A1AA] list-disc list-inside space-y-1">
                        {exp.bullets.map((b, i) => (
                          <li key={i}>{b}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Education & Certifications Section */}
              <div className="space-y-4 pt-6 border-t border-[#27272A]">
                <h3 className="font-display font-bold text-lg text-white">
                  Education & Certifications
                </h3>

                {/* Add Education Form */}
                <div className="p-5 rounded-2xl bg-[#121216] border border-[#27272A] space-y-3">
                  <p className="text-xs font-mono uppercase text-[#A1A1AA] font-bold">Add Degree or Certificate</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Degree / Certificate Name *"
                      value={newEdu.degree}
                      onChange={(e) => setNewEdu({ ...newEdu, degree: e.target.value })}
                      className="px-3 py-2 rounded-xl bg-[#18181F] border border-[#27272A] text-white text-xs"
                    />
                    <input
                      type="text"
                      placeholder="Institution Name *"
                      value={newEdu.institution}
                      onChange={(e) => setNewEdu({ ...newEdu, institution: e.target.value })}
                      className="px-3 py-2 rounded-xl bg-[#18181F] border border-[#27272A] text-white text-xs"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input
                      type="text"
                      placeholder="Location (e.g. Coimbatore)"
                      value={newEdu.location}
                      onChange={(e) => setNewEdu({ ...newEdu, location: e.target.value })}
                      className="px-3 py-2 rounded-xl bg-[#18181F] border border-[#27272A] text-white text-xs"
                    />
                    <input
                      type="text"
                      placeholder="Period (e.g. 2020 – 2022)"
                      value={newEdu.period}
                      onChange={(e) => setNewEdu({ ...newEdu, period: e.target.value })}
                      className="px-3 py-2 rounded-xl bg-[#18181F] border border-[#27272A] text-white text-xs"
                    />
                    <label className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#18181F] border border-[#27272A] text-xs text-white cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newEdu.isCertification}
                        onChange={(e) => setNewEdu({ ...newEdu, isCertification: e.target.checked })}
                        className="accent-[#D80027]"
                      />
                      <span>Is Certification</span>
                    </label>
                  </div>
                  <button
                    onClick={handleAddEducation}
                    className="px-5 py-2 rounded-full text-xs font-bold text-white uppercase shadow"
                    style={{ backgroundColor: primaryColor }}
                  >
                    Save Education / Certificate
                  </button>
                </div>

                {/* Education List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {state.education.map((edu) => (
                    <div key={edu.id} className="p-4 rounded-2xl bg-[#121216] border border-[#27272A] flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-mono uppercase text-[#9E9EA7]">
                          {edu.isCertification ? 'Certification' : 'Degree'} • {edu.period}
                        </span>
                        <h4 className="font-bold text-white text-xs sm:text-sm">{edu.degree}</h4>
                        <p className="text-[11px] text-[#A1A1AA]">{edu.institution} ({edu.location})</p>
                      </div>
                      <button
                        onClick={() => handleDeleteEducation(edu.id)}
                        className="p-1.5 rounded bg-red-500/20 text-red-400 hover:bg-red-500/30"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: SKILLS MATRIX CMS */}
          {activeTab === 'skills' && (
            <div className="space-y-6 max-w-4xl">
              <h3 className="font-display font-bold text-lg text-white">
                Core Skills & Tools Matrix
              </h3>

              {/* Add Skill Form */}
              <div className="p-5 rounded-2xl bg-[#121216] border border-[#27272A] flex flex-wrap items-center gap-3">
                <select
                  value={newSkill.category}
                  onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })}
                  className="px-3 py-2 rounded-xl bg-[#18181F] border border-[#27272A] text-white text-xs"
                >
                  <option value="Digital Marketing">Digital Marketing</option>
                  <option value="Tools & Analytics">Tools & Analytics</option>
                  <option value="Content & Website">Content & Website</option>
                </select>

                <input
                  type="text"
                  placeholder="Skill Name (e.g. Meta Ads, Google Analytics)"
                  value={newSkill.name}
                  onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                  className="flex-1 px-3 py-2 rounded-xl bg-[#18181F] border border-[#27272A] text-white text-xs min-w-[200px]"
                />

                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#18181F] border border-[#27272A]">
                  <span className="text-xs font-mono text-[#9E9EA7]">Proficiency:</span>
                  <input
                    type="number"
                    min={50}
                    max={100}
                    value={newSkill.proficiency}
                    onChange={(e) => setNewSkill({ ...newSkill, proficiency: Number(e.target.value) })}
                    className="w-14 bg-transparent text-white font-mono font-bold text-xs"
                  />
                  <span className="text-xs text-[#9E9EA7]">%</span>
                </div>

                <button
                  onClick={handleAddSkill}
                  className="px-5 py-2 rounded-full text-xs font-bold text-white uppercase shadow"
                  style={{ backgroundColor: primaryColor }}
                >
                  Add Skill
                </button>
              </div>

              {/* Skills List by Category with Inline Sliders */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {state.skills.map((skill, idx) => (
                  <div key={skill.id} className="p-3.5 rounded-2xl bg-[#121216] border border-[#27272A] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{skill.name}</span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-mono font-bold" style={{ color: primaryColor }}>
                          {skill.proficiency}%
                        </span>
                        <button
                          onClick={() => handleDeleteSkill(skill.id)}
                          className="p-1 rounded bg-red-500/20 text-red-400 hover:bg-red-500/30"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    <input
                      type="range"
                      min={50}
                      max={100}
                      value={skill.proficiency}
                      onChange={(e) => {
                        const updated = [...state.skills];
                        updated[idx].proficiency = Number(e.target.value);
                        store.updateSkills(updated);
                      }}
                      className="w-full accent-[#D80027] cursor-pointer"
                    />

                    <span className="text-[10px] font-mono text-[#9E9EA7] uppercase block">
                      {skill.category}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: 5-STAGE PROCESS CMS */}
          {activeTab === 'process' && (
            <div className="space-y-6 max-w-4xl">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-bold text-lg text-white">
                  5-Stage Work Process Roadmap
                </h3>
                <button
                  onClick={() => {
                    const newStep: WorkProcessStep = {
                      id: `wp_${Date.now()}`,
                      stepNumber: `0${state.workProcess.length + 1}`,
                      title: 'NEW PHASE',
                      description: 'Custom execution phase description.',
                      icon: 'sparkles',
                      orderIndex: state.workProcess.length
                    };
                    store.updateWorkProcess([...state.workProcess, newStep]);
                  }}
                  className="px-4 py-1.5 rounded-full text-xs font-mono text-white flex items-center gap-1.5 shadow"
                  style={{ backgroundColor: primaryColor }}
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Step</span>
                </button>
              </div>

              <div className="space-y-3">
                {state.workProcess.map((step, idx) => (
                  <div key={step.id} className="p-4 rounded-2xl bg-[#121216] border border-[#27272A] space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 flex-1">
                        <input
                          type="text"
                          value={step.stepNumber}
                          onChange={(e) => {
                            const updated = [...state.workProcess];
                            updated[idx].stepNumber = e.target.value;
                            store.updateWorkProcess(updated);
                          }}
                          className="w-14 px-2 py-1 rounded bg-[#18181F] border border-[#27272A] text-white text-xs font-mono font-bold text-center"
                        />
                        <input
                          type="text"
                          value={step.title}
                          onChange={(e) => {
                            const updated = [...state.workProcess];
                            updated[idx].title = e.target.value;
                            store.updateWorkProcess(updated);
                          }}
                          className="flex-1 px-3 py-1 rounded bg-[#18181F] border border-[#27272A] text-white text-xs font-bold uppercase"
                        />
                      </div>
                      {state.workProcess.length > 1 && (
                        <button
                          onClick={() =>
                            store.updateWorkProcess(state.workProcess.filter((s) => s.id !== step.id))
                          }
                          className="p-1.5 rounded bg-red-500/20 text-red-400 hover:bg-red-500/30 ml-2"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    <textarea
                      rows={2}
                      value={step.description}
                      onChange={(e) => {
                        const updated = [...state.workProcess];
                        updated[idx].description = e.target.value;
                        store.updateWorkProcess(updated);
                      }}
                      className="w-full px-3 py-1.5 rounded bg-[#18181F] border border-[#27272A] text-white text-xs resize-none"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 8: INQUIRIES INBOX */}
          {activeTab === 'inquiries' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-bold text-lg text-white">
                  Client Inquiries & Campaign Leads
                </h3>
                <span className="text-xs font-mono text-[#9E9EA7]">
                  {state.inquiries.length} Inquiries Total
                </span>
              </div>

              {state.inquiries.length === 0 ? (
                <div className="p-12 text-center rounded-2xl bg-[#121216] border border-[#27272A] text-[#9E9EA7]">
                  <Inbox className="w-10 h-10 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">No client submissions yet.</p>
                  <p className="text-xs mt-1">Submit the contact form on the portfolio to see leads appear here.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {state.inquiries.map((inq) => (
                    <div
                      key={inq.id}
                      className="p-5 rounded-2xl bg-[#121216] border border-[#27272A] space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <span className="font-bold text-white text-sm">{inq.clientName}</span>
                          <span className="text-xs text-[#9E9EA7] font-mono ml-2">({inq.email})</span>
                          {inq.phone && (
                            <span className="text-xs text-[#9E9EA7] font-mono ml-2">• {inq.phone}</span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#18181F] text-[#A1A1AA] border border-[#27272A]">
                            {inq.serviceNeeded}
                          </span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
                            {inq.budget}
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-[#A1A1AA] bg-[#18181F] p-3 rounded-xl border border-[#27272A]">
                        "{inq.message}"
                      </p>

                      <div className="flex items-center justify-between text-[11px] font-mono text-[#9E9EA7]">
                        <span>Received: {new Date(inq.createdAt).toLocaleString()}</span>
                        <div className="flex items-center gap-2">
                          <a
                            href={`mailto:${inq.email}?subject=Re: Campaign Inquiry - Santhosh S`}
                            className="px-3 py-1 rounded-full text-[10px] uppercase font-bold bg-[#18181F] text-white hover:text-primary transition-colors border border-[#27272A]"
                          >
                            Reply via Email
                          </a>
                          <button
                            onClick={() => store.updateInquiryStatus(inq.id, 'contacted')}
                            className={`px-3 py-1 rounded-full text-[10px] uppercase font-bold ${
                              inq.status === 'contacted'
                                ? 'bg-emerald-500 text-black'
                                : 'bg-[#18181F] text-white border border-[#27272A]'
                            }`}
                          >
                            Mark Contacted
                          </button>
                          <button
                            onClick={() => store.deleteInquiry(inq.id)}
                            className="p-1 rounded bg-red-500/20 text-red-400 hover:bg-red-500/30"
                            title="Delete Lead"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 9: SUPABASE CLOUD & BACKUP */}
          {activeTab === 'supabase' && (
            <div className="max-w-3xl space-y-6">
              {/* Cloud Connection Panel */}
              <div className="p-6 rounded-2xl bg-[#121216] border border-[#27272A] space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-display font-bold text-lg text-white">
                      Supabase Cloud Database & Storage
                    </h3>
                    <p className="text-xs text-[#A1A1AA]">
                      Connect your Supabase project to persist everything remotely and enable multi-device sync.
                    </p>
                  </div>

                  <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold ${
                    isSupabaseConfigured()
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  }`}>
                    {isSupabaseConfigured() ? '● CONNECTED' : '○ LOCAL MOCK MODE'}
                  </span>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-mono uppercase text-[#A1A1AA] mb-1">
                      Project URL
                    </label>
                    <input
                      type="text"
                      placeholder="https://xyzcompany.supabase.co"
                      value={supabaseUrl}
                      onChange={(e) => setSupabaseUrl(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#18181F] border border-[#27272A] text-white text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-[#A1A1AA] mb-1">
                      Anon Public Key
                    </label>
                    <input
                      type="password"
                      placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                      value={supabaseKey}
                      onChange={(e) => setSupabaseKey(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#18181F] border border-[#27272A] text-white text-xs font-mono"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={handleSaveSupabase}
                    className="px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-white shadow"
                    style={{ backgroundColor: primaryColor }}
                  >
                    Save & Test Connection
                  </button>

                  <button
                    onClick={handleCloudSync}
                    className="px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-white border border-[#27272A] bg-[#18181F] hover:bg-[#27272A]"
                  >
                    Sync All Data to Supabase Cloud
                  </button>
                </div>

                {syncStatus && (
                  <p className="text-xs font-mono text-emerald-400 animate-fadeIn">
                    ✓ {syncStatus}
                  </p>
                )}
              </div>

              {/* 1-Click JSON Backup & Restore */}
              <div className="p-6 rounded-2xl bg-[#121216] border border-[#27272A] space-y-4">
                <div>
                  <h4 className="font-bold text-sm text-white flex items-center gap-2">
                    <Download className="w-4 h-4 text-emerald-400" />
                    <span>Instant Zero-Code Backup & Restore</span>
                  </h4>
                  <p className="text-xs text-[#A1A1AA] mt-1">
                    Download a complete JSON snapshot of all your custom colors, content, case studies, and brand logos—or restore on another device with 1 click.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={handleExportBackup}
                    className="px-5 py-2.5 rounded-full text-xs font-mono font-bold text-white bg-[#18181F] border border-[#27272A] hover:bg-[#27272A] flex items-center gap-2"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export Backup (.json)</span>
                  </button>

                  <label className="px-5 py-2.5 rounded-full text-xs font-mono font-bold text-white bg-[#18181F] border border-[#27272A] hover:bg-[#27272A] flex items-center gap-2 cursor-pointer">
                    <UploadCloud className="w-3.5 h-3.5" />
                    <span>Restore Backup</span>
                    <input type="file" accept=".json" onChange={handleImportBackup} className="hidden" />
                  </label>
                </div>

                {backupStatus && (
                  <p className="text-xs font-mono text-emerald-400 animate-fadeIn">
                    ✓ {backupStatus}
                  </p>
                )}
              </div>

              {/* SQL Schema Guidance */}
              <div className="p-6 rounded-2xl bg-[#121216] border border-[#27272A] space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-white">
                    Database Schema (SQL Editor)
                  </h4>
                  <span className="text-[11px] font-mono text-[#9E9EA7]">
                    Located at <code className="text-white">supabase/schema.sql</code>
                  </span>
                </div>
                <p className="text-xs text-[#A1A1AA]">
                  To create the tables in your Supabase project, navigate to <strong>Supabase Dashboard &gt; SQL Editor</strong>, paste the schema from <code className="text-white">supabase/schema.sql</code>, and click <strong>Run</strong>.
                </p>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
