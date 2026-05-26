'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Sparkles, Calendar, ArrowRight, Check, Star, 
  MessageSquare, Camera, ShieldAlert, Award, Clock, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import BeforeAfterSlider from '../ui/BeforeAfterSlider';

interface HomeClientProps {
  services: any[];
  products: any[];
  stylists: any[];
  blogPosts: any[];
  reviews: any[];
}

export default function HomeClient({
  services,
  products,
  stylists,
  blogPosts,
  reviews,
}: HomeClientProps) {
  const [activeReview, setActiveReview] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [popupEmail, setPopupEmail] = useState('');
  const [popupStatus, setPopupStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  // Trigger popup after 4 seconds
  useEffect(() => {
    const shown = localStorage.getItem('glow_popup_shown');
    if (!shown) {
      const timer = setTimeout(() => {
        setShowPopup(true);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, []);

  // Automatic testimonial rotation
  useEffect(() => {
    if (reviews.length === 0) return;
    const interval = setInterval(() => {
      setActiveReview((prev) => (prev + 1) % reviews.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [reviews]);

  const handlePopupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!popupEmail) return;
    setPopupStatus('loading');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: popupEmail }),
      });
      if (res.ok) {
        setPopupStatus('success');
        localStorage.setItem('glow_popup_shown', 'true');
        setTimeout(() => setShowPopup(false), 2000);
      } else {
        setPopupStatus('error');
      }
    } catch {
      setPopupStatus('error');
    }
  };

  const closePopup = () => {
    setShowPopup(false);
    localStorage.setItem('glow_popup_shown', 'true');
  };

  return (
    <div className="relative overflow-hidden font-sans">
      {/* 1. CINEMATIC HERO SECTION */}
      <section className="relative h-[95vh] flex items-center justify-center overflow-hidden bg-brand-charcoal-dark">
        {/* Background Visual Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-35 mix-blend-luminosity scale-105 transform transition-transform duration-10000"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=1600&auto=format&fit=crop')` }}
        />
        {/* Luxury Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-charcoal-dark via-transparent to-brand-charcoal-dark/60 z-0" />
        
        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center flex flex-col items-center gap-6">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-pink-medium/10 border border-brand-pink-accent/20 backdrop-blur-md"
          >
            <Sparkles className="w-4 h-4 text-brand-rosegold" />
            <span className="text-xs uppercase tracking-widest font-semibold text-brand-pink-accent">
              Nepal's Elite Beauty Sanctuary
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-serif text-4xl sm:text-6xl lg:text-7xl font-light text-brand-beige leading-tight tracking-tight"
          >
            Luxury Beauty &amp; <br />
            <span className="font-normal italic text-rose-gold-gradient">Wellness Experience</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-brand-beige/70 text-sm sm:text-lg max-w-2xl font-light leading-relaxed"
          >
            Escape the ordinary at Durbarmarg, Kathmandu. Revel in curated Korean skincare, bespoke hair coloring, and royal bridal makeovers designed for the modern connoisseur.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 mt-4"
          >
            <Link href="/book">
              <button className="w-full sm:w-auto bg-gradient-to-r from-brand-pink-accent to-brand-rosegold hover:from-brand-rosegold hover:to-brand-rosegold-dark text-brand-charcoal-dark font-medium px-8 py-3.5 rounded-full shadow-md text-sm cursor-pointer transition-all duration-300">
                Book Your Experience
              </button>
            </Link>
            <Link href="/services">
              <button className="w-full sm:w-auto border border-brand-beige/30 hover:border-brand-rosegold hover:bg-brand-beige/5 text-white font-medium px-8 py-3.5 rounded-full text-sm transition-all duration-300 cursor-pointer">
                Explore Services
              </button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* 2. BRAND INTRODUCTION & PHILOSOPHY */}
      <section className="py-24 bg-gradient-to-b from-brand-beige to-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            {/* Visual Column */}
            <div className="lg:col-span-6 relative flex justify-center">
              <div className="relative w-full max-w-[400px] aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl z-10 border border-brand-pink-accent/20">
                <img 
                  src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=600&auto=format&fit=crop" 
                  alt="Bride styling" 
                  className="w-full h-full object-cover" 
                />
              </div>
              <div className="absolute -bottom-6 -left-6 w-3/5 aspect-square rounded-2xl overflow-hidden shadow-2xl z-20 border-4 border-white">
                <img 
                  src="https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?q=80&w=400&auto=format&fit=crop" 
                  alt="Korean skincare facial" 
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Luxury Accent */}
              <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full border border-brand-rosegold/20 flex items-center justify-center animate-pulse-slow">
                <Sparkles className="w-8 h-8 text-brand-gold/60" />
              </div>
            </div>

            {/* Narrative Column */}
            <div className="lg:col-span-6 flex flex-col gap-6">
              <div className="text-brand-rosegold-dark text-xs font-semibold uppercase tracking-widest flex items-center gap-2">
                <span className="w-8 h-px bg-brand-rosegold shrink-0"></span>
                Glow &amp; Grace Heritage
              </div>
              <h2 className="font-serif text-3xl sm:text-5xl font-light text-brand-charcoal leading-tight">
                Where Science Meets <br />
                <span className="font-normal italic text-rose-gold-gradient">Pure Luxury Artistry</span>
              </h2>
              <p className="text-brand-charcoal/80 text-sm sm:text-base leading-relaxed font-light">
                Glow &amp; Grace Studio redefines the premium beauty salon experience in Kathmandu. Combining clinical skincare advancements with high-fashion bridal styling, our aesthetic values detail, pampering, and timeless grace.
              </p>
              <div className="grid grid-cols-2 gap-6 pt-4 border-t border-brand-pink-accent/25">
                <div className="flex flex-col gap-1">
                  <span className="font-serif text-2xl font-semibold text-brand-rosegold-dark">100%</span>
                  <span className="text-xs text-brand-charcoal/70 uppercase tracking-wider font-semibold">Premium Products Only</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="font-serif text-2xl font-semibold text-brand-rosegold-dark">8+ Years</span>
                  <span className="text-xs text-brand-charcoal/70 uppercase tracking-wider font-semibold">Average Specialist Exp.</span>
                </div>
              </div>
              <Link href="/contact" className="mt-4 flex items-center gap-2 text-brand-rosegold-dark text-sm font-semibold hover:text-brand-charcoal transition-colors group">
                Visit Our Durbarmarg Sanctuary
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FEATURED SERVICES SECTION */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center flex flex-col items-center gap-4 mb-16">
            <span className="text-brand-rosegold-dark text-xs font-semibold uppercase tracking-widest">
              Pampering Experiences
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-light text-brand-charcoal">
              Our Signature <span className="font-normal italic text-rose-gold-gradient">Rituals</span>
            </h2>
            <p className="text-brand-charcoal/70 text-sm max-w-lg font-light">
              Carefully conceptualized salon treatments designed to bring out your inner radiance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.slice(0, 3).map((service) => (
              <div
                key={service.id}
                className="glass-card glass-card-hover rounded-2xl overflow-hidden flex flex-col h-full group"
              >
                <div className="relative aspect-[3/2] overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 bg-brand-beige/90 backdrop-blur-sm text-brand-charcoal-dark text-[10px] font-semibold tracking-wider uppercase px-3 py-1.5 rounded-full">
                    {service.category}
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-grow justify-between gap-4">
                  <div className="flex flex-col gap-2">
                    <h3 className="font-serif text-xl text-brand-charcoal group-hover:text-brand-rosegold transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-xs text-brand-charcoal/70 leading-relaxed line-clamp-3">
                      {service.description}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-brand-pink-accent/20">
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase text-brand-charcoal/40 font-semibold">Starting At</span>
                      <span className="font-serif font-semibold text-brand-rosegold-dark text-sm sm:text-base">
                        NPR {service.pricing.toLocaleString()}
                      </span>
                    </div>
                    <Link href={`/services/${service.slug}`}>
                      <button className="flex items-center gap-1.5 text-xs font-semibold text-brand-charcoal-dark hover:text-brand-rosegold transition-colors cursor-pointer">
                        Details
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-12">
            <Link href="/services">
              <button className="bg-brand-pink-medium hover:bg-brand-pink-accent text-brand-charcoal-dark font-medium px-8 py-3 rounded-full text-sm transition-all duration-300 cursor-pointer">
                View All Experiences
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* 4. DYNAMIC SEASONAL FESTIVAL OFFER BANNER */}
      <section className="bg-brand-charcoal py-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-10 mix-blend-luminosity" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=600&auto=format&fit=crop')` }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col lg:flex-row justify-between items-center gap-6 text-center lg:text-left">
          <div className="flex flex-col gap-2">
            <div className="inline-flex self-center lg:self-start items-center gap-1.5 px-3 py-1 rounded-full bg-brand-rosegold/10 text-brand-rosegold text-[10px] font-semibold uppercase tracking-wider border border-brand-rosegold/20">
              <Sparkles className="w-3 h-3 animate-pulse" />
              Teej &amp; Festive Season Exclusive
            </div>
            <h3 className="font-serif text-xl sm:text-2xl text-white">
              Glow Like Royalty: Get <span className="text-brand-rosegold font-semibold">15% Off</span> on All Bridal Makeup Packages
            </h3>
            <p className="text-xs text-brand-beige/60 font-sans">
              Book before the slots fill up. Valid for upcoming autumn wedding seasons.
            </p>
          </div>
          <Link href="/bridal">
            <button className="bg-gradient-to-r from-brand-pink-accent to-brand-rosegold hover:from-brand-rosegold hover:to-brand-rosegold-dark text-brand-charcoal-dark font-medium px-6 py-3 rounded-full text-sm shadow-sm transition-all duration-300 cursor-pointer">
              Secure Bridal Slot
            </button>
          </Link>
        </div>
      </section>

      {/* 5. INTERACTIVE BEFORE & AFTER GALLERY */}
      <section className="py-24 bg-brand-beige/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            {/* Description Column */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              <span className="text-brand-rosegold-dark text-xs font-semibold uppercase tracking-widest">
                Visible Transformations
              </span>
              <h2 className="font-serif text-3xl sm:text-5xl font-light text-brand-charcoal">
                See the <span className="font-normal italic text-rose-gold-gradient">Glow &amp; Grace</span> Difference
              </h2>
              <p className="text-brand-charcoal/80 text-sm leading-relaxed font-light">
                Use the interactive slider to drag and see the clinical results of our Korean hydra-glow skin facials and custom creative hair blow-out services.
              </p>
              
              <div className="flex flex-col gap-4 pt-4 border-t border-brand-pink-accent/25">
                {[
                  'Korean Glass Skin facials improve moisture content by 40%',
                  'Signature balayage retains hair cuticle shine and color richness',
                  'Acne scar treatments reveal smooth skin in 4-6 sessions',
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-3 text-xs text-brand-charcoal/80">
                    <div className="w-5 h-5 rounded-full bg-brand-pink-medium/60 text-brand-rosegold-dark flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3" />
                    </div>
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <Link href="/gallery" className="mt-2 flex items-center gap-1.5 text-brand-rosegold-dark text-sm font-semibold hover:text-brand-charcoal transition-colors">
                View Full Transformation Gallery
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Slider Column */}
            <div className="lg:col-span-7 flex justify-center">
              <div className="w-full max-w-[500px]">
                <BeforeAfterSlider
                  beforeImage="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=600&auto=format&fit=crop"
                  afterImage="https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?q=80&w=600&auto=format&fit=crop"
                  beforeLabel="Dull / Dehydrated"
                  afterLabel="Korean Hydra Glow"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FEATURED PRODUCTS SHOWCASE */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center flex flex-col items-center gap-4 mb-16">
            <span className="text-brand-rosegold-dark text-xs font-semibold uppercase tracking-widest">
              Available at Studio
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-light text-brand-charcoal">
              Bespoke Beauty <span className="font-normal italic text-rose-gold-gradient">Boutique</span>
            </h2>
            <p className="text-brand-charcoal/70 text-sm max-w-lg font-light">
              Premium, display-only items recommended by our expert stylists for your home care routine.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.slice(0, 3).map((product) => (
              <div
                key={product.id}
                className="glass-card rounded-2xl overflow-hidden flex flex-col group border border-brand-pink-accent/20"
              >
                <div className="relative aspect-square overflow-hidden bg-brand-beige/10">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 bg-brand-rosegold-dark text-white text-[9px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full">
                    Salon Recommended
                  </div>
                </div>
                <div className="p-6 flex flex-col justify-between flex-grow gap-4">
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] text-brand-charcoal/40 font-bold uppercase tracking-widest">{product.brand}</span>
                    <h3 className="font-serif text-lg text-brand-charcoal">{product.title}</h3>
                    <p className="text-xs text-brand-charcoal/60 line-clamp-2 leading-relaxed font-light">{product.description}</p>
                  </div>
                  
                  <div className="pt-4 border-t border-brand-pink-accent/10 flex items-center justify-between">
                    <span className="text-[10px] text-brand-rosegold-dark font-bold uppercase tracking-wider bg-brand-pink-medium/50 px-2.5 py-1 rounded">
                      Available in Studio
                    </span>
                    <Link href={`/products`}>
                      <button className="text-xs font-semibold text-brand-charcoal-dark hover:text-brand-rosegold transition-colors cursor-pointer">
                        Inquire Details
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. VERIFIED TESTIMONIAL SYSTEM */}
      <section className="py-24 bg-brand-charcoal-dark text-brand-beige relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 text-center flex flex-col items-center gap-8">
          <div className="w-12 h-12 rounded-full bg-brand-rosegold/10 text-brand-rosegold flex items-center justify-center">
            <MessageSquare className="w-6 h-6" />
          </div>
          
          <span className="text-brand-rosegold text-xs font-semibold uppercase tracking-widest">
            Loved by Nepal's Discerning Clients
          </span>

          <div className="h-[200px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              {reviews.length > 0 && (
                <motion.div
                  key={activeReview}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5 }}
                  className="flex flex-col items-center gap-4"
                >
                  <p className="font-serif text-lg sm:text-2xl italic font-light leading-relaxed text-white">
                    "{reviews[activeReview].text}"
                  </p>
                  
                  <div className="flex gap-1">
                    {Array.from({ length: reviews[activeReview].rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-brand-gold text-brand-gold" />
                    ))}
                  </div>

                  <div className="flex items-center gap-3 mt-4">
                    {reviews[activeReview].image && (
                      <img
                        src={reviews[activeReview].image}
                        alt={reviews[activeReview].customerName}
                        className="w-10 h-10 rounded-full object-cover border border-brand-rosegold"
                      />
                    )}
                    <div className="text-left">
                      <h4 className="text-sm font-semibold text-white">{reviews[activeReview].customerName}</h4>
                      <p className="text-[10px] text-brand-beige/50 font-medium uppercase tracking-widest">{reviews[activeReview].serviceType}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Bullet Indicators */}
          <div className="flex gap-2">
            {reviews.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveReview(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                  activeReview === idx ? 'bg-brand-rosegold w-6' : 'bg-brand-beige/25'
                }`}
                aria-label={`Go to testimonial ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 8. TEAM / STYLIST SECTION */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center flex flex-col items-center gap-4 mb-16">
            <span className="text-brand-rosegold-dark text-xs font-semibold uppercase tracking-widest">
              Meet Our Specialists
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-light text-brand-charcoal">
              Architects of <span className="font-normal italic text-rose-gold-gradient">Glow &amp; Grace</span>
            </h2>
            <p className="text-brand-charcoal/70 text-sm max-w-lg font-light">
              Our industry-certified experts hold certifications from leading global academies.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {stylists.slice(0, 3).map((stylist) => (
              <div
                key={stylist.id}
                className="glass-card rounded-2xl overflow-hidden flex flex-col group border border-brand-pink-accent/20"
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-brand-beige/10">
                  <img
                    src={stylist.image}
                    alt={stylist.name}
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                  />
                  {/* Subtle details overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-charcoal-dark/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                    <div className="flex flex-col text-white">
                      <span className="text-xs text-brand-rosegold font-semibold uppercase tracking-wider">Certifications</span>
                      <span className="text-[10px] text-white/80 line-clamp-2">{stylist.certifications}</span>
                    </div>
                  </div>
                </div>
                <div className="p-6 flex flex-col gap-4 justify-between flex-grow">
                  <div className="flex flex-col gap-1">
                    <h3 className="font-serif text-lg text-brand-charcoal">{stylist.name}</h3>
                    <p className="text-xs text-brand-rosegold-dark font-medium">{stylist.specialization}</p>
                    <div className="flex items-center gap-1.5 text-[11px] text-brand-charcoal/60 mt-1 font-sans">
                      <Award className="w-3.5 h-3.5 text-brand-gold shrink-0" />
                      <span>{stylist.experience} Experience</span>
                    </div>
                  </div>
                  
                  <Link href="/book" className="w-full">
                    <button className="w-full py-2.5 rounded-lg border border-brand-rosegold/30 hover:border-brand-rosegold hover:bg-brand-pink-light/40 text-brand-charcoal text-xs font-semibold tracking-wider uppercase transition-all duration-300 cursor-pointer">
                      Book With {stylist.name.split(' ')[0]}
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. PROMOTIONAL DISCOUNT MODAL POPUP */}
      <AnimatePresence>
        {showPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-brand-charcoal-dark/70 flex items-center justify-center p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-brand-beige w-full max-w-md rounded-2xl overflow-hidden shadow-2xl relative border border-brand-pink-accent/40"
            >
              <button
                onClick={closePopup}
                className="absolute top-4 right-4 text-brand-charcoal/60 hover:text-brand-charcoal p-1 rounded-full bg-white/50 backdrop-blur-sm transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="p-8 flex flex-col items-center text-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-brand-pink-accent to-brand-rosegold text-brand-charcoal-dark flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-brand-rosegold-dark font-bold uppercase tracking-widest">
                    Exclusive Welcome Gift
                  </span>
                  <h3 className="font-serif text-2xl text-brand-charcoal">
                    Join the Glow Circle
                  </h3>
                </div>

                <p className="text-xs text-brand-charcoal/80 font-light leading-relaxed">
                  Enter your email to unlock an instant <strong className="text-brand-rosegold-dark">15% discount voucher</strong> for your next hair or facial service.
                </p>

                <div className="w-full bg-white/70 p-4 rounded-xl border border-brand-pink-accent/20">
                  <div className="text-3xl font-serif text-brand-rosegold-dark font-semibold">15% OFF</div>
                  <div className="text-[9px] uppercase tracking-wider text-brand-charcoal/40 font-bold mt-1">Your First Booking</div>
                </div>

                <form onSubmit={handlePopupSubmit} className="w-full flex flex-col gap-2.5 mt-2">
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    value={popupEmail}
                    onChange={(e) => setPopupEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-brand-pink-accent/30 text-sm focus:outline-none focus:border-brand-rosegold text-brand-charcoal"
                    required
                  />
                  <button
                    type="submit"
                    disabled={popupStatus === 'loading'}
                    className="w-full py-2.5 bg-brand-charcoal text-white hover:bg-brand-charcoal-dark text-xs font-semibold tracking-wider uppercase rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {popupStatus === 'loading' ? 'Verifying...' : popupStatus === 'success' ? 'Voucher Unlocked!' : 'Get My 15% Voucher'}
                  </button>
                </form>

                {popupStatus === 'success' && (
                  <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                    <Check className="w-4 h-4" /> Check your email for the voucher code!
                  </p>
                )}
                {popupStatus === 'error' && (
                  <p className="text-xs text-rose-600 font-medium">
                    Something went wrong. Please try again.
                  </p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
