import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { usePortfolioStore } from '../lib/store';

export function ContactSection() {
  const { state, addInquiry } = usePortfolioStore();
  const { profile, settings } = state;
  const primaryColor = settings.customColors.primary;

  const [formData, setFormData] = useState({
    clientName: '',
    email: '',
    phone: '',
    serviceNeeded: 'Meta Ads & Paid Acquisition',
    budget: '₹25K – ₹50K',
    message: ''
  });

  const [isCustomBudget, setIsCustomBudget] = useState(false);
  const [customBudgetText, setCustomBudgetText] = useState('');
  const [isCustomService, setIsCustomService] = useState(false);
  const [customServiceText, setCustomServiceText] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const budgetOptions = ['₹25K – ₹50K', '₹50K – ₹1.5L', '₹1.5L+', 'Custom'];

  const handleBudgetSelect = (b: string) => {
    if (b === 'Custom') {
      setIsCustomBudget(true);
      setFormData({ ...formData, budget: 'Custom' });
    } else {
      setIsCustomBudget(false);
      setFormData({ ...formData, budget: b });
    }
  };

  const handleServiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === 'Custom') {
      setIsCustomService(true);
      setFormData({ ...formData, serviceNeeded: 'Custom' });
    } else {
      setIsCustomService(false);
      setFormData({ ...formData, serviceNeeded: val });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.clientName || !formData.email || !formData.message) return;

    setIsSubmitting(true);
    try {
      const finalBudget =
        isCustomBudget && customBudgetText.trim()
          ? customBudgetText.trim()
          : formData.budget;

      const finalService =
        isCustomService && customServiceText.trim()
          ? customServiceText.trim()
          : formData.serviceNeeded;

      await addInquiry({
        clientName: formData.clientName,
        email: formData.email,
        phone: formData.phone,
        serviceNeeded: finalService,
        budget: finalBudget,
        message: formData.message
      });

      setIsSubmitting(false);
      setSubmitted(true);

      // Trigger celebratory confetti
      confetti({
        particleCount: 85,
        spread: 75,
        origin: { y: 0.7 },
        colors: [primaryColor, '#FFFFFF', '#FAFAFA']
      });

      // Reset form
      setFormData({
        clientName: '',
        email: '',
        phone: '',
        serviceNeeded: 'Meta Ads & Paid Acquisition',
        budget: '₹25K – ₹50K',
        message: ''
      });
      setIsCustomBudget(false);
      setCustomBudgetText('');
      setIsCustomService(false);
      setCustomServiceText('');
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 relative overflow-hidden bg-[#0A0A0D] border-t border-[#27272A]/80">
      {/* Background ambient glow */}
      <div
        className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full blur-[160px] opacity-15 pointer-events-none"
        style={{ backgroundColor: primaryColor }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Direct Info & 3D Interactive Laptop Mockup */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono uppercase tracking-widest text-[#9E9EA7] border border-[#27272A] bg-[#121216] mb-3">
                <Sparkles className="w-3.5 h-3.5" style={{ color: primaryColor }} />
                <span>Let's Build Something High-Growth</span>
              </div>
              <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl tracking-tight text-white uppercase">
                Let's Work Together
              </h2>
              <p className="text-sm text-[#A1A1AA] mt-3 leading-relaxed">
                Currently open for performance marketing campaigns, brand scaling, agency retainers, and high-growth opportunities.
              </p>
            </div>

            {/* Direct Contact Cards */}
            <div className="space-y-3 font-mono text-xs">
              <a
                href={`mailto:${profile.email}`}
                className="p-4 rounded-2xl bg-[#121216] border border-[#27272A] hover:border-[#3F3F46] flex items-center gap-3.5 transition-all text-[#FAFAFA] group"
              >
                <div className="w-10 h-10 rounded-xl bg-[#18181F] flex items-center justify-center text-white group-hover:scale-105 transition-transform"
                     style={{ color: primaryColor }}>
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] uppercase text-[#9E9EA7] block">Direct Email</span>
                  <span className="font-bold text-sm">{profile.email}</span>
                </div>
              </a>

              <a
                href={`tel:${profile.phone.replace(/[^0-9+]/g, '')}`}
                className="p-4 rounded-2xl bg-[#121216] border border-[#27272A] hover:border-[#3F3F46] flex items-center gap-3.5 transition-all text-[#FAFAFA] group"
              >
                <div className="w-10 h-10 rounded-xl bg-[#18181F] flex items-center justify-center text-white group-hover:scale-105 transition-transform"
                     style={{ color: primaryColor }}>
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] uppercase text-[#9E9EA7] block">Phone / WhatsApp</span>
                  <span className="font-bold text-sm">{profile.phone}</span>
                </div>
              </a>

              <div className="p-4 rounded-2xl bg-[#121216] border border-[#27272A] flex items-center gap-3.5 text-[#FAFAFA]">
                <div className="w-10 h-10 rounded-xl bg-[#18181F] flex items-center justify-center text-white"
                     style={{ color: primaryColor }}>
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] uppercase text-[#9E9EA7] block">Headquarters</span>
                  <span className="font-bold text-sm">{profile.location}</span>
                </div>
              </div>
            </div>

            {/* 3D Dashboard Mockup Screen (as shown in reference image) */}
            <div className="p-5 rounded-3xl bg-[#121216] border border-[#27272A] shadow-2xl relative overflow-hidden group">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
                </div>
                <span className="text-[10px] font-mono text-[#9E9EA7]">LIVE AD ENGINE // ROAS: 4.2x</span>
              </div>

              {/* Graphic Mockup Area */}
              <div className="h-32 rounded-2xl bg-[#09090B] border border-[#27272A] p-3 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-white font-bold">Meta Ads Conversion Radar</span>
                  <span className="text-[10px] font-mono text-[#10B981] font-bold">+28.4% WoW</span>
                </div>
                <div className="flex items-end gap-1.5 h-16 pt-2">
                  {[45, 60, 52, 78, 65, 88, 95, 80, 110, 125].map((val, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-t transition-all group-hover:brightness-125"
                      style={{
                        height: `${val}%`,
                        backgroundColor: i === 9 ? primaryColor : '#27272A'
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Direct Lead Submission Form */}
          <div className="lg:col-span-7">
            <div className="p-8 sm:p-10 rounded-3xl bg-[#121216] border border-[#27272A] shadow-2xl relative">
              {submitted ? (
                <div className="text-center py-12 space-y-4 animate-fadeIn">
                  <div
                    className="w-16 h-16 rounded-full mx-auto flex items-center justify-center text-white"
                    style={{ backgroundColor: primaryColor }}
                  >
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="font-display font-extrabold text-2xl text-white">
                    Inquiry Transmitted Successfully
                  </h3>
                  <p className="text-sm text-[#A1A1AA] max-w-md mx-auto">
                    Thank you! Santhosh has received your message and will review your campaign objectives within 24 hours.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-4 px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider text-white"
                    style={{ backgroundColor: '#18181F', border: '1px solid #27272A' }}
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono uppercase text-[#A1A1AA] mb-1.5">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.clientName}
                        onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                        placeholder="e.g. Rahul Sharma"
                        className="w-full px-4 py-3 rounded-xl bg-[#18181F] border border-[#27272A] text-white text-sm focus:outline-none focus:border-white transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase text-[#A1A1AA] mb-1.5">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="rahul@company.com"
                        className="w-full px-4 py-3 rounded-xl bg-[#18181F] border border-[#27272A] text-white text-sm focus:outline-none focus:border-white transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono uppercase text-[#A1A1AA] mb-1.5">
                        Phone / WhatsApp
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                        className="w-full px-4 py-3 rounded-xl bg-[#18181F] border border-[#27272A] text-white text-sm focus:outline-none focus:border-white transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase text-[#A1A1AA] mb-1.5">
                        Service Objective
                      </label>
                      <select
                        value={isCustomService ? 'Custom' : formData.serviceNeeded}
                        onChange={handleServiceChange}
                        className="w-full px-4 py-3 rounded-xl bg-[#18181F] border border-[#27272A] text-white text-sm focus:outline-none focus:border-white transition-colors"
                      >
                        <option value="Meta Ads & Paid Acquisition">Meta Ads (Lead Gen & ROAS)</option>
                        <option value="Social Media Brand Management">20-Brand Social Growth Retainer</option>
                        <option value="SEO & Search Intent">Search Engine & Keyword Optimization</option>
                        <option value="Personal Branding & Content">Personal Branding & Influencer Collabs</option>
                        <option value="Corporate Digital Training">Digital Marketing Corporate Training</option>
                        <option value="Custom">Custom / Other Marketing Need</option>
                      </select>

                      {/* Custom Service Input */}
                      {isCustomService && (
                        <input
                          type="text"
                          required
                          value={customServiceText}
                          onChange={(e) => setCustomServiceText(e.target.value)}
                          placeholder="Specify custom marketing objective (e.g. TikTok Ads, Influencer PR)..."
                          className="w-full mt-2 px-4 py-2.5 rounded-xl bg-[#14141A] border border-[#3F3F46] text-white text-xs focus:outline-none focus:border-white transition-all animate-fadeIn"
                        />
                      )}
                    </div>
                  </div>

                  {/* Estimated Ad Budget */}
                  <div>
                    <label className="block text-xs font-mono uppercase text-[#A1A1AA] mb-1.5">
                      Estimated Ad Budget
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {budgetOptions.map((b) => (
                        <button
                          key={b}
                          type="button"
                          onClick={() => handleBudgetSelect(b)}
                          className={`py-2 px-3 rounded-xl text-xs font-mono transition-all text-center ${
                            (b === 'Custom' && isCustomBudget) || (!isCustomBudget && formData.budget === b)
                              ? 'bg-white text-black font-bold shadow'
                              : 'bg-[#18181F] border border-[#27272A] text-[#A1A1AA] hover:text-white'
                          }`}
                        >
                          {b}
                        </button>
                      ))}
                    </div>

                    {/* Custom Budget Input */}
                    {isCustomBudget && (
                      <div className="mt-2 animate-fadeIn">
                        <input
                          type="text"
                          required
                          value={customBudgetText}
                          onChange={(e) => setCustomBudgetText(e.target.value)}
                          placeholder="Enter your custom budget (e.g. ₹10,000 / month, $2,500, or Flexible)..."
                          className="w-full px-4 py-2.5 rounded-xl bg-[#14141A] border border-[#3F3F46] text-white text-xs focus:outline-none focus:border-white transition-all"
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-[#A1A1AA] mb-1.5">
                      Project Goals & Message *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Briefly describe your product, current monthly spend, and target conversion KPI..."
                      className="w-full px-4 py-3 rounded-xl bg-[#18181F] border border-[#27272A] text-white text-sm focus:outline-none focus:border-white transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-full text-xs font-bold uppercase tracking-wider text-white shadow-xl flex items-center justify-center gap-2 hover:brightness-110 active:scale-98 transition-all disabled:opacity-50"
                    style={{ backgroundColor: primaryColor }}
                  >
                    {isSubmitting ? (
                      <span>Transmitting...</span>
                    ) : (
                      <>
                        <span>Submit Campaign Inquiry</span>
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
