'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, Phone, MapPin, Clock, Sparkles, Send, Check } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const pathname = usePathname();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setStatus('success');
        setEmail('');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  const isAdminPath = pathname?.startsWith('/admin');

  if (isAdminPath) return null;

  return (
    <footer className="bg-brand-charcoal text-brand-beige border-t border-brand-rosegold/10 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Info */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/salonlogo.png"
                alt="Dynamatrix Salon logo"
                width={48}
                height={48}
                className="h-11 w-11 rounded-md object-cover ring-1 ring-brand-beige/15"
              />
              <span className="font-serif text-xl font-semibold tracking-wider text-white">
                DYNAMATRIX SALON
              </span>
            </Link>
            <p className="text-sm text-brand-beige/70 leading-relaxed font-sans">
              Nepal's premium luxury beauty studio. We offer state-of-the-art hair, skincare, and bridal transformations tailored to highlight your natural elegance.
            </p>
            <div className="flex items-center gap-3 mt-2">
              {['instagram', 'facebook', 'tiktok'].map((social) => (
                <a
                  key={social}
                  href={`https://${social}.com`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-full bg-brand-beige/10 hover:bg-brand-rosegold hover:text-brand-charcoal-dark flex items-center justify-center text-sm transition-all duration-300 capitalize text-brand-beige"
                >
                  {social[0]}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-serif text-lg font-medium text-white mb-6 tracking-wide flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-brand-rosegold" />
              Quick Links
            </h3>
            <ul className="space-y-3.5 text-sm font-sans text-brand-beige/70">
              <li>
                <Link href="/services" className="hover:text-brand-rosegold transition-colors">Salon Services</Link>
              </li>
              <li>
                <Link href="/team" className="hover:text-brand-rosegold transition-colors">Our Team</Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-brand-rosegold transition-colors">Product Boutique</Link>
              </li>
              <li>
                <Link href="/bridal" className="hover:text-brand-rosegold transition-colors">Bridal Packages</Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-brand-rosegold transition-colors">Before &amp; Afters</Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-brand-rosegold transition-colors">Beauty Tips</Link>
              </li>
              <li>
                <Link href="/book" className="hover:text-brand-rosegold transition-colors">Book Appointment</Link>
              </li>
            </ul>
          </div>

          {/* Contact Details & Hours */}
          <div>
            <h3 className="font-serif text-lg font-medium text-white mb-6 tracking-wide flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-brand-rosegold" />
              Studio Details
            </h3>
            <ul className="space-y-4 text-sm font-sans text-brand-beige/70">
              <li className="flex gap-3">
                <MapPin className="w-5 h-5 text-brand-rosegold shrink-0" />
                <span>3rd Floor, Luxury Hub, Durbarmarg, Kathmandu, Nepal</span>
              </li>
              <li className="flex gap-3">
                <Phone className="w-5 h-5 text-brand-rosegold shrink-0" />
                <div className="flex flex-col">
                  <a href="tel:+977014220000" className="hover:text-brand-rosegold">+977 1 4220000</a>
                  <a href="tel:+9779800000000" className="hover:text-brand-rosegold">+977 9800000000</a>
                </div>
              </li>
              <li className="flex gap-3">
                <Mail className="w-5 h-5 text-brand-rosegold shrink-0" />
                <a href="mailto:info@glowandgrace.com" className="hover:text-brand-rosegold">info@glowandgrace.com</a>
              </li>
              <li className="flex gap-3 pt-2 border-t border-brand-beige/10">
                <Clock className="w-5 h-5 text-brand-rosegold shrink-0" />
                <div className="flex flex-col">
                  <span className="font-semibold text-white">Mon - Sun: 10:00 AM - 7:30 PM</span>
                  <span className="text-[11px] text-brand-rosegold-dark font-medium">Prior booking recommended</span>
                </div>
              </li>
            </ul>
          </div>

          {/* Newsletter & Map Mockup */}
          <div className="flex flex-col gap-6">
            <div>
              <h3 className="font-serif text-lg font-medium text-white mb-4 tracking-wide">
                Join the Glow Circle
              </h3>
              <p className="text-xs text-brand-beige/70 mb-4 font-sans leading-relaxed">
                Subscribe to get 10% off your first service and receive secret seasonal offers in Nepal.
              </p>
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-brand-beige/10 border border-brand-beige/20 text-brand-beige placeholder-brand-beige/40 px-3.5 py-2 rounded-lg text-sm focus:outline-none focus:border-brand-rosegold grow min-w-0"
                  required
                />
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="bg-gradient-to-r from-brand-pink-accent to-brand-rosegold hover:from-brand-rosegold hover:to-brand-rosegold-dark text-brand-charcoal-dark px-3.5 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer flex items-center justify-center shrink-0 disabled:opacity-55"
                >
                  {status === 'success' ? <Check className="w-4 h-4" /> : <Send className="w-4 h-4" />}
                </button>
              </form>
              {status === 'success' && (
                <p className="text-xs text-emerald-400 mt-2 font-medium">Thank you! Check your inbox for the voucher.</p>
              )}
              {status === 'error' && (
                <p className="text-xs text-rose-400 mt-2 font-medium">Subscription failed. Try again.</p>
              )}
            </div>

            {/* Embedded Map Mockup */}
            <div className="relative w-full h-24 rounded-lg overflow-hidden border border-brand-beige/10 bg-brand-beige/5">
              <div className="absolute inset-0 flex flex-col justify-center items-center p-2 text-center bg-brand-charcoal-dark/60 z-10">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-brand-rosegold">Find Us on Map</span>
                <span className="text-[10px] text-brand-beige/60">Durbarmarg (next to Royal Palace)</span>
              </div>
              <iframe
                src="about:blank"
                className="w-full h-full border-0 pointer-events-none opacity-40"
                title="Durbarmarg Kathmandu Location Map"
              ></iframe>
            </div>
          </div>
        </div>

        {/* Lower Footer */}
        <div className="pt-8 mt-12 border-t border-brand-beige/10 text-center flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-sans text-brand-beige/50">
          <p>© 2026 Glow &amp; Grace Studio. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-brand-rosegold">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-brand-rosegold">Terms of Service</Link>
            <Link href="/admin/login" className="hover:text-brand-rosegold">Admin Access</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
