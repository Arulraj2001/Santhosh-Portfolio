import React, { useState } from 'react';
import { Briefcase, GraduationCap, Award, CheckCircle2, ChevronRight, BarChart2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { usePortfolioStore } from '../lib/store';

export function SkillsExperience() {
  const { state } = usePortfolioStore();
  const { experiences, education, skills, settings } = state;
  const primaryColor = settings.customColors.primary;
  const [activeTab, setActiveTab] = useState<'experience' | 'skills' | 'education'>('experience');

  const categories = ['All', 'Digital Marketing', 'Tools & Analytics', 'Content & Website'];
  const [selectedSkillCategory, setSelectedSkillCategory] = useState('All');

  const filteredSkills =
    selectedSkillCategory === 'All'
      ? skills
      : skills.filter((s) => s.category === selectedSkillCategory);

  return (
    <section id="experience" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono uppercase tracking-widest text-[#9E9EA7] border border-[#27272A] bg-[#121216] mb-3">
              <Briefcase className="w-3.5 h-3.5" style={{ color: primaryColor }} />
              <span>Career Trajectory & Technical Mastery</span>
            </div>
            <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl tracking-tight text-white uppercase">
              Experience & Skills
            </h2>
          </div>

          {/* Tab Selector */}
          <div className="flex items-center p-1 rounded-full bg-[#121216] border border-[#27272A] self-start sm:self-auto">
            <button
              onClick={() => setActiveTab('experience')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all ${
                activeTab === 'experience'
                  ? 'bg-[#18181F] text-white shadow'
                  : 'text-[#9E9EA7] hover:text-white'
              }`}
            >
              Experience
            </button>
            <button
              onClick={() => setActiveTab('skills')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all ${
                activeTab === 'skills'
                  ? 'bg-[#18181F] text-white shadow'
                  : 'text-[#9E9EA7] hover:text-white'
              }`}
            >
              Skills Matrix
            </button>
            <button
              onClick={() => setActiveTab('education')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all ${
                activeTab === 'education'
                  ? 'bg-[#18181F] text-white shadow'
                  : 'text-[#9E9EA7] hover:text-white'
              }`}
            >
              Education
            </button>
          </div>
        </div>

        {/* Tab 1: Experience */}
        {activeTab === 'experience' && (
          <div className="space-y-6">
            {experiences.map((exp, idx) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="p-6 sm:p-8 rounded-3xl bg-[#121216] border border-[#27272A] hover:border-[#3F3F46] transition-all duration-300 group shadow-lg"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-4">
                  <div>
                    <h3 className="font-display font-extrabold text-xl sm:text-2xl text-white group-hover:text-primary transition-colors">
                      {exp.role}
                    </h3>
                    <p className="text-sm font-semibold tracking-wide text-[#A1A1AA] mt-1">
                      {exp.company} • <span className="text-[#9E9EA7] font-normal">{exp.location}</span>
                    </p>
                  </div>

                  <span
                    className="px-3.5 py-1 rounded-full text-xs font-mono font-bold self-start sm:self-auto border border-[#27272A] bg-[#18181F] text-white"
                    style={{ borderColor: primaryColor }}
                  >
                    {exp.period}
                  </span>
                </div>

                <ul className="space-y-2.5 mt-4 text-xs sm:text-sm text-[#A1A1AA] leading-relaxed">
                  {exp.bullets.map((bullet, bIdx) => (
                    <li key={bIdx} className="flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: primaryColor }} />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        )}

        {/* Tab 2: Skills Matrix */}
        {activeTab === 'skills' && (
          <div className="space-y-8">
            {/* Category Filter Chips */}
            <div className="flex flex-wrap items-center gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedSkillCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-xs font-mono tracking-wider uppercase transition-all ${
                    selectedSkillCategory === cat
                      ? 'bg-white text-black font-bold shadow'
                      : 'bg-[#121216] text-[#A1A1AA] border border-[#27272A] hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Skills Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSkills.map((skill) => (
                <div
                  key={skill.id}
                  className="p-5 rounded-2xl bg-[#121216] border border-[#27272A] hover:border-[#3F3F46] transition-all duration-300 group shadow-sm flex flex-col justify-between space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-white group-hover:text-primary transition-colors">
                      {skill.name}
                    </span>
                    <span className="text-xs font-mono font-bold" style={{ color: primaryColor }}>
                      {skill.proficiency}%
                    </span>
                  </div>

                  <div className="w-full h-1.5 bg-[#18181F] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${skill.proficiency}%`,
                        backgroundColor: primaryColor
                      }}
                    />
                  </div>

                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#9E9EA7]">
                    {skill.category}
                  </span>
                </div>
              ))}
            </div>

            {/* Key Strengths Chips from Resume */}
            <div className="p-6 rounded-3xl bg-[#121216] border border-[#27272A]">
              <p className="text-xs font-mono uppercase tracking-widest text-[#9E9EA7] mb-3">
                Core Strengths & Executive Capabilities
              </p>
              <div className="flex flex-wrap gap-2.5">
                {[
                  'Analytical Thinking',
                  'High-ROI Paid Advertising',
                  'Audience Retargeting',
                  'Competitor Intelligence',
                  'Lead Funnel Architecture',
                  'Cross-Functional Collaboration',
                  'Adaptive Problem-Solving',
                  'Attention to Campaign Detail'
                ].map((strength) => (
                  <span
                    key={strength}
                    className="px-3.5 py-1.5 rounded-full text-xs font-medium text-white border border-[#27272A] bg-[#18181F] flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" style={{ color: primaryColor }} />
                    {strength}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Education & Certifications */}
        {activeTab === 'education' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {education.map((edu) => (
              <div
                key={edu.id}
                className="p-6 rounded-3xl bg-[#121216] border border-[#27272A] hover:border-[#3F3F46] transition-all duration-300 flex flex-col justify-between space-y-4 shadow-lg group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className="w-10 h-10 rounded-2xl flex items-center justify-center text-white"
                      style={{ backgroundColor: '#18181F' }}
                    >
                      {edu.isCertification ? (
                        <Award className="w-5 h-5" style={{ color: primaryColor }} />
                      ) : (
                        <GraduationCap className="w-5 h-5" style={{ color: primaryColor }} />
                      )}
                    </div>
                    <span className="text-xs font-mono font-bold text-[#9E9EA7] px-2.5 py-1 rounded bg-[#18181F] border border-[#27272A]">
                      {edu.period}
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-lg text-white group-hover:text-primary transition-colors leading-snug">
                    {edu.degree}
                  </h3>
                  <p className="text-xs text-[#A1A1AA] mt-2 font-medium">
                    {edu.institution}
                  </p>
                  <p className="text-[11px] font-mono text-[#9E9EA7] mt-0.5">
                    {edu.location}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#27272A] flex items-center gap-1.5 text-[11px] font-mono text-[#9E9EA7]">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: primaryColor }} />
                  <span>{edu.isCertification ? 'Professional Certification' : 'Degree Completed'}</span>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}

