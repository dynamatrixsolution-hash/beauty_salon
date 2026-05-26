'use client';

import React, { useState } from 'react';
import { Send, Check, AlertCircle } from 'lucide-react';

interface ServiceInquiryFormProps {
  serviceId: string;
  serviceTitle: string;
}

export default function ServiceInquiryForm({
  serviceId,
  serviceTitle,
}: ServiceInquiryFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
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
          type: 'service',
          itemId: serviceId,
          itemTitle: serviceTitle,
          details: formData.message,
        }),
      });

      if (res.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', phone: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="bg-white/80 p-6 rounded-2xl border border-brand-pink-accent/25 glass-card flex flex-col gap-4 shadow-sm">
      <h3 className="font-serif text-lg font-semibold text-brand-charcoal">
        Inquire About Service
      </h3>
      <p className="text-xs text-brand-charcoal/60 leading-relaxed font-light -mt-2">
        Have questions about this ritual? Send us a quick inquiry and our salon concierge will reach out via WhatsApp/email.
      </p>

      {status === 'success' ? (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-3">
          <Check className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div className="flex flex-col gap-0.5">
            <span className="text-xs font-bold text-emerald-800">Inquiry Received</span>
            <span className="text-[11px] text-emerald-700 leading-normal">
              Thank you! Our concierge will review your message and reach out shortly.
            </span>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="flex flex-col gap-1 text-left">
            <label className="text-[10px] font-bold uppercase tracking-wider text-brand-charcoal/50">Full Name</label>
            <input
              type="text"
              placeholder="Aayusha Sen"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-brand-pink-accent/30 rounded-lg text-xs focus:outline-none focus:border-brand-rosegold text-brand-charcoal bg-white/50"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3 text-left">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-brand-charcoal/50">Email</label>
              <input
                type="email"
                placeholder="aayusha@gmail.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border border-brand-pink-accent/30 rounded-lg text-xs focus:outline-none focus:border-brand-rosegold text-brand-charcoal bg-white/50"
                required
              />
            </div>
            <div className="flex flex-col gap-1 text-left">
              <label className="text-[10px] font-bold uppercase tracking-wider text-brand-charcoal/50">Phone / WhatsApp</label>
              <input
                type="tel"
                placeholder="980XXXXXXX"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 border border-brand-pink-accent/30 rounded-lg text-xs focus:outline-none focus:border-brand-rosegold text-brand-charcoal bg-white/50"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1 text-left">
            <label className="text-[10px] font-bold uppercase tracking-wider text-brand-charcoal/50">Message / Inquiry Details</label>
            <textarea
              placeholder="I would like to ask if this service is suitable for sensitive skin or pregnant women..."
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 border border-brand-pink-accent/30 rounded-lg text-xs focus:outline-none focus:border-brand-rosegold text-brand-charcoal bg-white/50 resize-none"
              required
            ></textarea>
          </div>

          {status === 'error' && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-2 text-rose-700 text-[11px]">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>Failed to send inquiry. Please try again.</span>
            </div>
          )}

          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full py-2.5 bg-brand-charcoal hover:bg-brand-charcoal-dark text-white rounded-lg text-xs font-semibold tracking-wider uppercase transition-colors cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            {status === 'loading' ? 'Sending Inquiry...' : 'Submit Inquiry'}
          </button>
        </form>
      )}
    </div>
  );
}
