'use client';

import React, { useState } from 'react';
import { Sparkles, Camera, Heart, HelpCircle, ArrowRight } from 'lucide-react';
import BeforeAfterSlider from '@/components/ui/BeforeAfterSlider';
import Link from 'next/link';

const TRANSFORMATIONS = [
  {
    title: 'Korean Hydra-Glow Facial',
    category: 'skin',
    desc: 'Targeting dry patches, dullness and fine lines with clinical-grade active serum infusions.',
    beforeImg: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=600&auto=format&fit=crop',
    afterImg: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?q=80&w=600&auto=format&fit=crop',
    beforeLabel: 'Dull Skin',
    afterLabel: 'Glass Skin Results',
  },
  {
    title: 'Ash Brown Balayage & Cut',
    category: 'hair',
    desc: 'Bespoke hand-painted highlights, restoring structural integrity with Plex bond builders.',
    beforeImg: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?q=80&w=600&auto=format&fit=crop',
    afterImg: 'https://images.unsplash.com/photo-1605497746444-12961b4777a0?q=80&w=600&auto=format&fit=crop',
    beforeLabel: 'Frizzy / Solid Tone',
    afterLabel: 'Seamless Balayage',
  },
  {
    title: 'Bridal HD Airbrush Makeup',
    category: 'makeup',
    desc: 'Flawless 18-hour waterproof finish, covering blemishes with lightweight light-diffusing base.',
    beforeImg: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=600&auto=format&fit=crop',
    afterImg: 'https://images.unsplash.com/photo-1481824429379-07aa5e5b0739?q=80&w=600&auto=format&fit=crop',
    beforeLabel: 'Natural Skin',
    afterLabel: 'Bridal Glamour',
  },
];

const GALLERY_PHOTOS = [
  { url: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?q=80&w=400&auto=format&fit=crop', tag: 'Nail Art' },
  { url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=400&auto=format&fit=crop', tag: 'Eyebrow Lash' },
  { url: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?q=80&w=400&auto=format&fit=crop', tag: 'Spa Ritual' },
  { url: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=400&auto=format&fit=crop', tag: 'Products' },
];

export default function GalleryPage() {
  const [filter, setFilter] = useState('all');

  const filteredTrans = TRANSFORMATIONS.filter(
    (t) => filter === 'all' || t.category === filter
  );

  return (
    <div className="py-28 bg-gradient-to-b from-brand-beige to-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-16">
        
        {/* Header */}
        <div className="text-center flex flex-col items-center gap-4">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-pink-medium/40 border border-brand-pink-accent/40 text-brand-rosegold-dark text-[10px] font-bold uppercase tracking-wider">
            <Camera className="w-3.5 h-3.5 text-brand-rosegold-dark" />
            Interactive Portfolio
          </div>
          <h1 className="font-serif text-4xl sm:text-6xl font-light text-brand-charcoal">
            Before &amp; After <span className="font-normal italic text-rose-gold-gradient">Gallery</span>
          </h1>
          <p className="text-brand-charcoal/70 text-sm max-w-lg font-light leading-relaxed">
            Witness the real, unedited transformations of our clients. Drag the slider to compare before and after treatments.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex justify-center gap-3">
          {[
            { id: 'all', label: 'All Transformations' },
            { id: 'skin', label: 'Skincare' },
            { id: 'hair', label: 'Hair Care' },
            { id: 'makeup', label: 'Bridal Makeup' },
          ].map((btn) => (
            <button
              key={btn.id}
              onClick={() => setFilter(btn.id)}
              className={`px-5 py-2.5 rounded-xl text-xs font-semibold tracking-wider transition-colors cursor-pointer ${
                filter === btn.id
                  ? 'bg-brand-charcoal text-white shadow-sm'
                  : 'bg-white border border-brand-pink-accent/25 text-brand-charcoal hover:bg-brand-pink-medium/20'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>

        {/* Sliders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          {filteredTrans.map((trans, idx) => (
            <div key={idx} className="flex flex-col gap-4 text-left">
              <BeforeAfterSlider
                beforeImage={trans.beforeImg}
                afterImage={trans.afterImg}
                beforeLabel={trans.beforeLabel}
                afterLabel={trans.afterLabel}
              />
              <div className="flex flex-col gap-1.5 px-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-brand-rosegold-dark">{trans.category} Treatment</span>
                <h3 className="font-serif text-xl text-brand-charcoal">{trans.title}</h3>
                <p className="text-xs text-brand-charcoal/60 leading-relaxed font-light">{trans.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Secondary Gallery Grid */}
        <div className="flex flex-col gap-8 pt-16 border-t border-brand-pink-accent/20">
          <div className="text-left">
            <h2 className="font-serif text-2xl font-light text-brand-charcoal">
              Instagram Spotlights &amp; <span className="font-normal italic text-rose-gold-gradient">Details</span>
            </h2>
            <p className="text-brand-charcoal/60 text-xs mt-1 font-light">Fine closeups and trending nail arts from our Kathmandu studio.</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {GALLERY_PHOTOS.map((photo, idx) => (
              <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden shadow-sm border border-brand-pink-accent/15 group">
                <img
                  src={photo.url}
                  alt={photo.tag}
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-brand-charcoal-dark/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
                  <span className="bg-white/90 backdrop-blur-sm text-brand-charcoal-dark text-[9px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full">
                    {photo.tag}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-brand-pink-accent to-brand-rosegold p-10 rounded-3xl flex flex-col sm:flex-row justify-between items-center gap-6 text-center sm:text-left">
          <div className="flex flex-col gap-2">
            <h3 className="font-serif text-2xl text-brand-charcoal-dark font-medium">Ready for your own transformation?</h3>
            <p className="text-xs text-brand-charcoal/70 max-w-md font-light leading-relaxed">Book a consultation with Aayusha Shrestha or Neha Thapa and let us customize a beauty plan for you.</p>
          </div>
          <Link href="/book">
            <button className="bg-brand-charcoal hover:bg-brand-charcoal-dark text-white font-medium px-8 py-3.5 rounded-full text-xs uppercase tracking-wider shadow-md transition-colors cursor-pointer">
              Book Consultation Now
            </button>
          </Link>
        </div>

      </div>
    </div>
  );
}
