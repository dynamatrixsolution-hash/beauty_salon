'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, Check, AlertCircle, Sparkles, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    type: 'general',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setStatus('loading');

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          type: formData.type,
          details: formData.message,
        }),
      });

      if (res.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', phone: '', type: 'general', message: '' });
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  const handleWhatsAppChat = () => {
    const number = '9779800000000';
    const text = encodeURIComponent('Hello Glow & Grace Studio, I would like to ask some questions...');
    window.open(`https://wa.me/${number}?text=${text}`, '_blank');
  };

  return (
    <div className="py-28 bg-gradient-to-b from-brand-beige to-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-16">
        
        {/* Header */}
        <div className="text-center flex flex-col items-center gap-4">
          <h1 className="font-serif text-4xl sm:text-6xl font-light text-brand-charcoal">
            Visit Our <span className="font-normal italic text-rose-gold-gradient">Studio Sanctuary</span>
          </h1>
          <p className="text-brand-charcoal/70 text-sm max-w-lg font-light leading-relaxed">
            Located in the heart of Kathmandu's luxury shopping district. Reach out for appointments, wedding booking requests, or brand collaborations.
          </p>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Studio Info Column */}
          <div className="lg:col-span-5 flex flex-col gap-8 text-left">
            <div className="flex flex-col gap-2">
              <h2 className="font-serif text-2xl font-light text-brand-charcoal">Glow &amp; Grace Studio</h2>
              <p className="text-xs text-brand-charcoal/60 leading-normal font-light">3rd Floor, Luxury Hub, Durbarmarg (Opposite to Royal Palace), Kathmandu, Nepal</p>
            </div>

            {/* List details */}
            <div className="flex flex-col gap-6 text-sm text-brand-charcoal/80">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-brand-pink-medium/60 text-brand-rosegold-dark flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-bold text-brand-charcoal/40 tracking-wide">Phone &amp; Hotline</span>
                  <a href="tel:+977014220000" className="font-semibold text-brand-charcoal-dark hover:text-brand-rosegold">+977 1 4220000</a>
                  <a href="tel:+9779800000000" className="text-xs hover:text-brand-rosegold">+977 9800000000 (WhatsApp)</a>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-brand-pink-medium/60 text-brand-rosegold-dark flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-bold text-brand-charcoal/40 tracking-wide">Email Inquiries</span>
                  <a href="mailto:info@glowandgrace.com" className="font-semibold text-brand-charcoal-dark hover:text-brand-rosegold">info@glowandgrace.com</a>
                  <a href="mailto:bridal@glowandgrace.com" className="text-xs hover:text-brand-rosegold">bridal@glowandgrace.com</a>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-brand-pink-medium/60 text-brand-rosegold-dark flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-bold text-brand-charcoal/40 tracking-wide">Studio Hours</span>
                  <span className="font-semibold text-brand-charcoal-dark">Monday - Sunday: 10:00 AM - 7:30 PM</span>
                  <span className="text-[11px] text-brand-rosegold-dark font-medium">Including public holidays (reservations required)</span>
                </div>
              </div>
            </div>

            {/* WhatsApp CTA card */}
            <div className="bg-brand-charcoal text-brand-beige p-6 rounded-2xl flex items-center justify-between gap-4 mt-2">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] uppercase tracking-wider text-brand-rosegold font-bold">Instant Support</span>
                <h4 className="text-sm font-semibold text-white">Chat on WhatsApp</h4>
                <p className="text-[10px] text-brand-beige/50 font-light">Get quick replies for service listings or details.</p>
              </div>
              <button
                onClick={handleWhatsAppChat}
                className="bg-emerald-500 hover:bg-emerald-600 text-white p-3 rounded-full flex items-center justify-center transition-colors cursor-pointer shadow-md"
              >
                <MessageCircle className="w-5 h-5 fill-current" />
              </button>
            </div>
          </div>

          {/* Form Column */}
          <div className="lg:col-span-7">
            <div className="bg-white/80 p-8 rounded-3xl border border-brand-pink-accent/25 glass-card shadow-lg flex flex-col gap-6">
              <div className="text-left">
                <h3 className="font-serif text-xl font-semibold text-brand-charcoal">Send Us a Message</h3>
                <p className="text-xs text-brand-charcoal/60 mt-0.5 font-light">Have general questions, wedding packages queries, or feedback? Send a note.</p>
              </div>

              {status === 'success' ? (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-3 text-left">
                  <Check className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-bold text-emerald-800">Inquiry Sent</span>
                    <span className="text-[11px] text-emerald-700 leading-normal">
                      Namaste! We have received your inquiry. A salon executive will review it and follow up within 24 hours.
                    </span>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleInquirySubmit} className="flex flex-col gap-4 text-left">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-brand-charcoal/50">Full Name</label>
                    <input
                      type="text"
                      placeholder="Samikshya Karki"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2.5 border border-brand-pink-accent/30 rounded-lg text-xs focus:outline-none focus:border-brand-rosegold text-brand-charcoal bg-white/50"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-brand-charcoal/50">Email</label>
                      <input
                        type="email"
                        placeholder="samikshya@gmail.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-2.5 border border-brand-pink-accent/30 rounded-lg text-xs focus:outline-none focus:border-brand-rosegold text-brand-charcoal bg-white/50"
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-brand-charcoal/50">Phone Number</label>
                      <input
                        type="tel"
                        placeholder="980XXXXXXX"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-2.5 border border-brand-pink-accent/30 rounded-lg text-xs focus:outline-none focus:border-brand-rosegold text-brand-charcoal bg-white/50"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-brand-charcoal/50">Inquiry Type</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full px-4 py-2.5 border border-brand-pink-accent/30 rounded-lg text-xs focus:outline-none focus:border-brand-rosegold text-brand-charcoal bg-white/50"
                    >
                      <option value="general">General Salon Inquiry</option>
                      <option value="bridal">Bridal Packages Consultation</option>
                      <option value="collab">Stylist Collaboration / Career</option>
                      <option value="feedback">Client Feedback</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-brand-charcoal/50">Details / Message</label>
                    <textarea
                      placeholder="Write your detailed query here..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      rows={5}
                      className="w-full px-4 py-2.5 border border-brand-pink-accent/30 rounded-lg text-xs focus:outline-none focus:border-brand-rosegold text-brand-charcoal bg-white/50 resize-none"
                      required
                    />
                  </div>

                  {status === 'error' && (
                    <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-2 text-rose-700 text-[10px]">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>Failed to submit message. Please try again.</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full py-3 bg-brand-charcoal hover:bg-brand-charcoal-dark text-white rounded-lg text-xs font-semibold tracking-wider uppercase transition-colors cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    {status === 'loading' ? 'Submitting Details...' : 'Send Inquiry Message'}
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>

        {/* Full-width Map Mockup */}
        <div className="flex flex-col gap-4 text-left pt-8 border-t border-brand-pink-accent/20">
          <h3 className="font-serif text-xl text-brand-charcoal">Location Maps</h3>
          <div className="relative w-full h-[350px] rounded-3xl overflow-hidden border border-brand-pink-accent/20 bg-brand-pink-light/35 shadow-md">
            <div className="absolute top-6 left-6 bg-brand-charcoal/90 text-brand-beige p-5 rounded-2xl max-w-xs shadow-lg z-10 text-left flex flex-col gap-1 leading-normal font-sans border border-brand-rosegold/20">
              <span className="text-[9px] uppercase font-bold text-brand-rosegold tracking-widest">Main Studio</span>
              <h4 className="text-sm font-semibold text-white">Glow &amp; Grace Studio</h4>
              <p className="text-[11px] text-brand-beige/70 leading-normal">
                3rd Floor, Luxury Hub (next to Rolex Showroom), Durbarmarg, Kathmandu.
              </p>
              <span className="text-[10px] text-brand-rosegold font-medium mt-1">Free underground parking available</span>
            </div>
            {/* Standard embedded map iframe for Kathmandu */}
            <iframe
              src="https://maps.google.com/maps?q=Durbarmarg%20Kathmandu%20Nepal&t=&z=16&ie=UTF8&iwloc=&output=embed"
              className="w-full h-full border-0 filter grayscale-[15%] contrast-[101%] sepia-[4%]"
              allowFullScreen
              loading="lazy"
              title="Glow & Grace Studio Durbarmarg Map"
            ></iframe>
          </div>
        </div>

      </div>
    </div>
  );
}
