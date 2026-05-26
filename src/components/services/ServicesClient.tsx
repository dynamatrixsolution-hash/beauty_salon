'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, Sparkles, Clock, Calendar, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ServicesClientProps {
  initialServices: any[];
}

const CATEGORIES = [
  { id: 'all', label: 'All Services' },
  { id: 'hair', label: 'Hair Care' },
  { id: 'facial', label: 'Facials & Glow' },
  { id: 'bridal', label: 'Bridal Packages' },
  { id: 'nails', label: 'Nail Art' },
  { id: 'spa', label: 'Spa Therapies' },
  { id: 'skin', label: 'Clinical Skin' },
];

export default function ServicesClient({ initialServices }: ServicesClientProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredServices = initialServices.filter((service) => {
    const matchesSearch =
      service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory =
      activeCategory === 'all' || service.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="py-28 bg-gradient-to-b from-brand-beige to-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-12">
        {/* Header */}
        <div className="text-center flex flex-col items-center gap-4">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-pink-medium/40 border border-brand-pink-accent/40 text-brand-rosegold-dark text-[10px] font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
            Signature Treatment Menu
          </div>
          <h1 className="font-serif text-4xl sm:text-6xl font-light text-brand-charcoal">
            Elevate Your <span className="font-normal italic text-rose-gold-gradient">Self-Care</span>
          </h1>
          <p className="text-brand-charcoal/70 text-sm max-w-lg font-light leading-relaxed">
            From Korean glass skin therapies to bespoke hair transformations, browse our premium selections.
          </p>
        </div>

        {/* Filter Bar (Search + Categories) */}
        <div className="flex flex-col md:flex-row gap-6 justify-between items-center bg-white/40 p-4 rounded-2xl glass-card border border-brand-pink-accent/20">
          {/* Categories */}
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-brand-charcoal text-white shadow-sm'
                    : 'bg-white/50 text-brand-charcoal hover:bg-brand-pink-medium/30'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-charcoal/40" />
            <input
              type="text"
              placeholder="Search rituals..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/70 border border-brand-pink-accent/30 text-sm focus:outline-none focus:border-brand-rosegold text-brand-charcoal placeholder-brand-charcoal/45"
            />
          </div>
        </div>

        {/* Service Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="wait">
            {filteredServices.length > 0 ? (
              filteredServices.map((service) => (
                <motion.div
                  key={service.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="glass-card glass-card-hover rounded-2xl overflow-hidden flex flex-col h-full group"
                >
                  <div className="relative aspect-[3/2] overflow-hidden bg-brand-beige/25">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4 bg-brand-beige/95 backdrop-blur-sm text-brand-charcoal-dark text-[9px] font-bold tracking-wider uppercase px-3 py-1.5 rounded-full">
                      {service.category}
                    </div>
                  </div>
                  
                  <div className="p-6 flex flex-col flex-grow justify-between gap-4">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-1.5 text-[10px] text-brand-charcoal/50 font-semibold font-sans">
                        <Clock className="w-3.5 h-3.5 text-brand-rosegold-dark shrink-0" />
                        <span>{service.duration} Mins</span>
                      </div>
                      <h3 className="font-serif text-xl text-brand-charcoal group-hover:text-brand-rosegold transition-colors">
                        {service.title}
                      </h3>
                      <p className="text-xs text-brand-charcoal/70 leading-relaxed line-clamp-3">
                        {service.description}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-brand-pink-accent/20 flex justify-between items-center">
                      <div className="flex flex-col">
                        <span className="text-[9px] uppercase text-brand-charcoal/40 font-bold">Price</span>
                        <span className="font-serif font-bold text-brand-rosegold-dark text-base">
                          NPR {service.pricing.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Link href={`/services/${service.slug}`}>
                          <button className="px-4 py-2 border border-brand-rosegold/30 hover:border-brand-rosegold rounded-full text-xs font-semibold text-brand-charcoal transition-all duration-300 cursor-pointer">
                            Info
                          </button>
                        </Link>
                        <Link href={`/book?service=${service.id}`}>
                          <button className="flex items-center gap-1 bg-gradient-to-r from-brand-pink-accent to-brand-rosegold hover:from-brand-rosegold hover:to-brand-rosegold-dark text-brand-charcoal-dark font-semibold px-4 py-2 rounded-full text-xs shadow-sm cursor-pointer transition-all">
                            Book
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full py-16 text-center text-brand-charcoal/50 font-light text-sm">
                No beauty rituals found matching your selection.
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
