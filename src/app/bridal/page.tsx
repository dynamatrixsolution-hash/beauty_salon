import React from 'react';
import { Sparkles, Heart, Award, ShieldCheck, Check } from 'lucide-react';
import BridalInquiryForm from '@/components/bridal/BridalInquiryForm';

const LOOKS = [
  {
    title: 'The Engagement Look',
    desc: 'Soft, dew-fresh makeup with elegant hairstyles, customized to complement your engagement ensemble.',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=400&auto=format&fit=crop',
  },
  {
    title: 'The Royal Wedding Look',
    desc: 'Traditional Nepalese bridal look with HD airbrush makeup, secure veil draping, and flawless heavy jewelry settings.',
    image: 'https://images.unsplash.com/photo-1481824429379-07aa5e5b0739?q=80&w=400&auto=format&fit=crop',
  },
  {
    title: 'The Grand Reception Look',
    desc: 'Contemporary, glamorous, bold eye-makeups paired with sleek modern hairstyling for your evening reception.',
    image: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?q=80&w=400&auto=format&fit=crop',
  },
  {
    title: 'Mehendi & Sangeet Style',
    desc: 'Playful, vibrant makeup with floral hair ornaments and chic, manageable braids to dance the night away.',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400&auto=format&fit=crop',
  },
];

export default function BridalPage() {
  return (
    <div className="py-28 bg-gradient-to-b from-brand-beige to-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-20">
        
        {/* Intro Header */}
        <div className="text-center flex flex-col items-center gap-4">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-pink-medium/40 border border-brand-pink-accent/40 text-brand-rosegold-dark text-[10px] font-bold uppercase tracking-wider">
            <Heart className="w-3.5 h-3.5 text-brand-rosegold-dark animate-pulse" />
            Royal Wedding Portfolios
          </div>
          <h1 className="font-serif text-4xl sm:text-6xl font-light text-brand-charcoal">
            The Dream Bridal <span className="font-normal italic text-rose-gold-gradient">Glow</span>
          </h1>
          <p className="text-brand-charcoal/70 text-sm max-w-lg font-light leading-relaxed">
            Crafting flawless memories. From traditional red-and-gold drapes to modern pastel silhouettes, we make you look radiant on your wedding day.
          </p>
        </div>

        {/* Portfolio Gallery */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {LOOKS.map((look, idx) => (
            <div key={idx} className="glass-card rounded-2xl overflow-hidden border border-brand-pink-accent/20 flex flex-col group">
              <div className="relative aspect-[3/4] overflow-hidden bg-brand-beige/25">
                <img
                  src={look.image}
                  alt={look.title}
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                />
              </div>
              <div className="p-5 text-left flex flex-col gap-2">
                <h3 className="font-serif text-lg text-brand-charcoal">{look.title}</h3>
                <p className="text-xs text-brand-charcoal/60 leading-relaxed font-light">{look.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Brand Promises */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 bg-brand-pink-light/30 border border-brand-pink-accent/15 p-8 rounded-3xl text-left">
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-brand-pink-medium/70 flex items-center justify-center shrink-0 text-brand-rosegold-dark">
              <Award className="w-5 h-5" />
            </div>
            <div className="flex flex-col gap-1">
              <h4 className="font-serif text-sm font-semibold text-brand-charcoal">MAC &amp; Kryolan Makeup</h4>
              <p className="text-xs text-brand-charcoal/60 leading-relaxed font-light">We use only ultra-premium, sweatproof, flash-friendly bridal foundations.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-brand-pink-medium/70 flex items-center justify-center shrink-0 text-brand-rosegold-dark">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="flex flex-col gap-1">
              <h4 className="font-serif text-sm font-semibold text-brand-charcoal">Trial Sessions Included</h4>
              <p className="text-xs text-brand-charcoal/60 leading-relaxed font-light">Includes a complete styling and makeup test run to select the perfect shades.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-brand-pink-medium/70 flex items-center justify-center shrink-0 text-brand-rosegold-dark">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="flex flex-col gap-1">
              <h4 className="font-serif text-sm font-semibold text-brand-charcoal">Venue Travel Services</h4>
              <p className="text-xs text-brand-charcoal/60 leading-relaxed font-light">Our bridal squad is fully equipped to travel to any venue across Nepal.</p>
            </div>
          </div>
        </div>

        {/* Inquiry Wizard Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-6 text-left flex flex-col gap-6">
            <span className="text-brand-rosegold-dark text-xs font-semibold uppercase tracking-widest">
              Plan Your Dream Day
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-light text-brand-charcoal leading-tight">
              Begin Your Bridal <br />
              <span className="font-normal italic text-rose-gold-gradient">Journey With Us</span>
            </h2>
            <p className="text-brand-charcoal/70 text-sm leading-relaxed font-light">
              We recommend reserving wedding slots at least 2-3 months in advance, especially during peak seasons in Nepal (Baisakh, Manshir, Magh, Falgun). 
            </p>
            <div className="flex flex-col gap-3 text-xs text-brand-charcoal/80 font-light">
              <div className="flex items-center gap-2">
                <Check className="w-4.5 h-4.5 text-brand-rosegold-dark" />
                <span>Custom hairstyles matched with lehenga draping</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4.5 h-4.5 text-brand-rosegold-dark" />
                <span>Specialized pre-wedding glow-prep skin checkups</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4.5 h-4.5 text-brand-rosegold-dark" />
                <span>Hair flower extensions and jewelry positioning assistance</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 w-full">
            <BridalInquiryForm />
          </div>
        </div>

      </div>
    </div>
  );
}
