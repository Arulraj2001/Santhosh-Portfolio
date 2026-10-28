import React, { useState } from 'react';
import { ArrowUpRight, TrendingUp, Users, Target, Layers, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { usePortfolioStore } from '../lib/store';
import { Project } from '../types';

export function CaseStudies() {
  const { state } = usePortfolioStore();
  const { projects, settings } = state;
  const primaryColor = settings.customColors.primary;
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  return (
    <section id="projects" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-14">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono uppercase tracking-widest text-[#9E9EA7] border border-[#27272A] bg-[#121216] mb-3">
              <Layers className="w-3.5 h-3.5" style={{ color: primaryColor }} />
              <span>Proven Conversion Results</span>
            </div>
            <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl tracking-tight text-white uppercase">
              Selected Case Studies
            </h2>
          </div>

          <p className="text-xs font-mono uppercase tracking-widest text-[#9E9EA7]">
            01 — 0{projects.length} Campaigns
          </p>
        </div>

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, idx) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              onClick={() => setSelectedProject(project)}
              className="group cursor-pointer rounded-3xl bg-[#121216] border border-[#27272A] hover:border-[#3F3F46] overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1.5 shadow-xl hover:shadow-2xl relative"
            >
              {/* Card Cover Image with Hover Zoom */}
              <div className="relative aspect-[16/10] overflow-hidden bg-[#18181F]">
                <img
                  src={project.coverUrl || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80'}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#121216] via-transparent to-transparent opacity-80" />

                {/* Index badge */}
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full glass-panel border border-[#27272A] text-xs font-mono font-bold text-white">
                  0{idx + 1}
                </div>

                {/* Category tag */}
                <div className="absolute top-4 right-4 px-3 py-1 rounded-full text-[11px] font-mono tracking-wider uppercase text-white shadow-lg"
                     style={{ backgroundColor: primaryColor }}>
                  {project.category}
                </div>
              </div>

              {/* Card Content */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <p className="text-[11px] font-mono uppercase tracking-widest text-[#9E9EA7] mb-1">
                    {project.clientName}
                  </p>
                  <h3 className="font-display font-bold text-lg sm:text-xl text-white group-hover:text-primary transition-colors leading-snug">
                    {project.title}
                  </h3>
                  <p className="text-xs text-[#A1A1AA] mt-2 line-clamp-2 leading-relaxed">
                    {project.description}
                  </p>
                </div>

                {/* Metrics Highlight Pills */}
                {project.metrics && (
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#27272A]/70">
                    {project.metrics.roas && (
                      <div className="p-2.5 rounded-xl bg-[#18181F] border border-[#27272A]">
                        <span className="text-[10px] font-mono uppercase text-[#9E9EA7] block">Avg ROAS</span>
                        <span className="font-display font-black text-base text-white" style={{ color: primaryColor }}>
                          {project.metrics.roas}
                        </span>
                      </div>
                    )}
                    {project.metrics.leads && (
                      <div className="p-2.5 rounded-xl bg-[#18181F] border border-[#27272A]">
                        <span className="text-[10px] font-mono uppercase text-[#9E9EA7] block">Leads Gen</span>
                        <span className="font-display font-black text-base text-white">
                          {project.metrics.leads}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Tags and Action */}
                <div className="flex items-center justify-between pt-2">
                  <div className="flex flex-wrap gap-1.5">
                    {project.tags.slice(0, 2).map((t) => (
                      <span key={t} className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#18181F] text-[#A1A1AA] border border-[#27272A]">
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="w-8 h-8 rounded-full flex items-center justify-center border border-[#27272A] group-hover:border-white transition-colors"
                       style={{ backgroundColor: '#18181F' }}>
                    <ArrowUpRight className="w-4 h-4 text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Case Study Detail Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-2xl rounded-3xl bg-[#121216] border border-[#27272A] p-6 sm:p-8 max-h-[90vh] overflow-y-auto shadow-2xl">
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#18181F] text-white flex items-center justify-center hover:bg-[#27272A] transition-colors"
            >
              ✕
            </button>

            <span className="text-xs font-mono uppercase tracking-widest text-[#9E9EA7]">
              {selectedProject.clientName} // {selectedProject.category}
            </span>
            <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-white mt-2 mb-4">
              {selectedProject.title}
            </h3>

            {selectedProject.coverUrl && (
              <img
                src={selectedProject.coverUrl}
                alt={selectedProject.title}
                className="w-full h-56 object-cover rounded-2xl mb-6 border border-[#27272A]"
              />
            )}

            <div className="space-y-4 text-sm text-[#A1A1AA] leading-relaxed">
              <p>{selectedProject.description}</p>
            </div>

            {/* Metrics Overview */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-6">
              {Object.entries(selectedProject.metrics).map(([k, v]) => (
                <div key={k} className="p-3 rounded-2xl bg-[#18181F] border border-[#27272A]">
                  <span className="text-[10px] font-mono uppercase text-[#9E9EA7] block">{k}</span>
                  <span className="font-display font-bold text-lg text-white" style={{ color: primaryColor }}>
                    {v}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {selectedProject.tags.map((t) => (
                <span key={t} className="px-3 py-1 rounded-full text-xs font-mono bg-[#18181F] text-[#FAFAFA] border border-[#27272A]">
                  {t}
                </span>
              ))}
            </div>

            <button
              onClick={() => setSelectedProject(null)}
              className="w-full py-3 rounded-full text-xs font-semibold uppercase tracking-wider text-white"
              style={{ backgroundColor: primaryColor }}
            >
              Close Case Study
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

