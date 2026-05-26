'use client';

import React, { useState } from 'react';
import { Send, Check, Calendar, ArrowRight, ArrowLeft, Users, MapPin, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PACKAGES = [
  { id: 'engagement', name: 'Engagement Glamour Package', price: 'NPR 8,000' },
  { id: 'wedding', name: 'Royal Wedding Airbrush Package', price: 'NPR 18,000' },
  { id: 'reception', name: 'Grand Reception Package', price: 'NPR 10,000' },
  { id: 'complete', name: 'Complete Bridal Ritual (All Events)', price: 'NPR 30,000' },
  { id: 'custom', name: 'Custom Bridal Styling Inquiry', price: 'Varies' },
];

export default function BridalInquiryForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    weddingDate: '',
    venue: '',
    packageId: 'wedding',
    guestCount: '0',
    notes: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const selectedPackageName = PACKAGES.find((p) => p.id === formData.packageId)?.name || 'Custom Package';

  const handleNext = () => {
    if (step === 1 && !formData.packageId) return;
    if (step === 2 && (!formData.weddingDate || !formData.venue)) return;
    setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setStep((prev) => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) return;
    setStatus('loading');

    const details = `Bridal Inquiry details:
- Selected Package: ${selectedPackageName}
- Wedding Date: ${formData.weddingDate}
- Venue/Location: ${formData.venue}
- Additional bridal party styling required: ${formData.guestCount} guests
- Client Notes: ${formData.notes}`;

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          type: 'bridal',
          itemId: formData.packageId,
          itemTitle: `Bridal Package: ${selectedPackageName}`,
          details: details,
        }),
      });

      if (res.ok) {
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="bg-white/80 p-8 rounded-3xl border border-brand-pink-accent/25 glass-card shadow-lg max-w-xl w-full mx-auto">
      {/* Steps Indicator */}
      <div className="flex justify-between items-center mb-8">
        <span className="text-[10px] uppercase font-bold tracking-wider text-brand-rosegold-dark">
          Bridal Booking Wizard
        </span>
        <div className="flex gap-1.5">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`w-5 h-1.5 rounded-full transition-colors ${
                step >= s ? 'bg-brand-rosegold' : 'bg-brand-pink-medium/40'
              }`}
            />
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {status === 'success' ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-8 flex flex-col items-center gap-4"
          >
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <Check className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-2xl text-brand-charcoal">Consultation Booked</h3>
            <p className="text-xs text-brand-charcoal/70 leading-relaxed font-light max-w-sm">
              Congratulations on your wedding! We have saved your booking inquiry. Our lead bridal artist (Neha Thapa) will review and reach out on WhatsApp/phone to finalize dates and trials.
            </p>
          </motion.div>
        ) : (
          <div className="text-left">
            {/* STEP 1: Select Bridal Package */}
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex flex-col gap-4"
              >
                <h3 className="font-serif text-lg font-semibold text-brand-charcoal">
                  Choose Your Bridal Ritual
                </h3>
                <div className="flex flex-col gap-3">
                  {PACKAGES.map((pkg) => (
                    <label
                      key={pkg.id}
                      className={`flex justify-between items-center p-4 rounded-xl border transition-all cursor-pointer ${
                        formData.packageId === pkg.id
                          ? 'border-brand-rosegold bg-brand-pink-medium/20'
                          : 'border-brand-pink-accent/20 bg-white/50 hover:bg-white/90'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="packageId"
                          value={pkg.id}
                          checked={formData.packageId === pkg.id}
                          onChange={(e) => setFormData({ ...formData, packageId: e.target.value })}
                          className="accent-brand-rosegold"
                        />
                        <span className="text-xs font-semibold text-brand-charcoal">{pkg.name}</span>
                      </div>
                      <span className="text-xs font-serif font-bold text-brand-rosegold-dark">{pkg.price}</span>
                    </label>
                  ))}
                </div>
                <button
                  onClick={handleNext}
                  className="mt-4 flex items-center justify-center gap-1 bg-brand-charcoal hover:bg-brand-charcoal-dark text-white font-medium py-3 rounded-xl text-xs uppercase tracking-wider cursor-pointer"
                >
                  Continue
                  <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            )}

            {/* STEP 2: Wedding Logistics */}
            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex flex-col gap-4"
              >
                <h3 className="font-serif text-lg font-semibold text-brand-charcoal">
                  Wedding Logistics
                </h3>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-brand-charcoal/50 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-brand-rosegold" />
                    Wedding / Event Date
                  </label>
                  <input
                    type="date"
                    value={formData.weddingDate}
                    onChange={(e) => setFormData({ ...formData, weddingDate: e.target.value })}
                    className="w-full px-4 py-2.5 border border-brand-pink-accent/30 rounded-lg text-xs focus:outline-none focus:border-brand-rosegold text-brand-charcoal bg-white/50"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-brand-charcoal/50 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-brand-rosegold" />
                    Wedding Venue / Hotel Location
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Hyatt Regency, Bouddha, Kathmandu"
                    value={formData.venue}
                    onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                    className="w-full px-4 py-2.5 border border-brand-pink-accent/30 rounded-lg text-xs focus:outline-none focus:border-brand-rosegold text-brand-charcoal bg-white/50"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-brand-charcoal/50 flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-brand-rosegold" />
                    Number of Guests/Bridesmaids requiring makeup (Optional)
                  </label>
                  <select
                    value={formData.guestCount}
                    onChange={(e) => setFormData({ ...formData, guestCount: e.target.value })}
                    className="w-full px-4 py-2.5 border border-brand-pink-accent/30 rounded-lg text-xs focus:outline-none focus:border-brand-rosegold text-brand-charcoal bg-white/50"
                  >
                    <option value="0">Just Me (Bride Only)</option>
                    <option value="1-3">1 to 3 Guests</option>
                    <option value="4-6">4 to 6 Guests</option>
                    <option value="7+">7+ Guests (Requires Assistant Stylists)</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-4">
                  <button
                    onClick={handleBack}
                    className="flex items-center justify-center gap-1 border border-brand-charcoal/20 hover:border-brand-charcoal hover:bg-brand-charcoal/5 text-brand-charcoal py-3 rounded-xl text-xs uppercase tracking-wider cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </button>
                  <button
                    onClick={handleNext}
                    className="flex items-center justify-center gap-1 bg-brand-charcoal hover:bg-brand-charcoal-dark text-white py-3 rounded-xl text-xs uppercase tracking-wider cursor-pointer"
                  >
                    Next
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: Contact & Notes */}
            {step === 3 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex flex-col gap-4"
              >
                <h3 className="font-serif text-lg font-semibold text-brand-charcoal">
                  Your Details
                </h3>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-brand-charcoal/50">Full Name</label>
                  <input
                    type="text"
                    placeholder="Prerna Shrestha"
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
                      placeholder="prerna@gmail.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2.5 border border-brand-pink-accent/30 rounded-lg text-xs focus:outline-none focus:border-brand-rosegold text-brand-charcoal bg-white/50"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-brand-charcoal/50">Phone / WhatsApp</label>
                    <input
                      type="tel"
                      placeholder="980XXXXXXX"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-2.5 border border-brand-pink-accent/30 rounded-lg text-xs focus:outline-none focus:border-brand-rosegold text-brand-charcoal bg-white/50"
                      required
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-brand-charcoal/50">Special Notes / Themes / Details</label>
                  <textarea
                    placeholder="Let us know if you want engagement makeup, wedding makeup, reception look, or mehendi styling. Mention preferred color schemes or skin issues..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-2.5 border border-brand-pink-accent/30 rounded-lg text-xs focus:outline-none focus:border-brand-rosegold text-brand-charcoal bg-white/50 resize-none"
                  />
                </div>

                {status === 'error' && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-2 text-rose-700 text-[10px]">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>Failed to submit bridal inquiry. Try again.</span>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3 mt-4">
                  <button
                    onClick={handleBack}
                    disabled={status === 'loading'}
                    className="flex items-center justify-center gap-1 border border-brand-charcoal/20 hover:border-brand-charcoal hover:bg-brand-charcoal/5 text-brand-charcoal py-3 rounded-xl text-xs uppercase tracking-wider cursor-pointer disabled:opacity-50"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={status === 'loading'}
                    className="flex items-center justify-center gap-1.5 bg-brand-charcoal hover:bg-brand-charcoal-dark text-white py-3 rounded-xl text-xs font-semibold uppercase tracking-wider cursor-pointer disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    {status === 'loading' ? 'Submitting...' : 'Submit Inquiry'}
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
