'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/services', label: 'Services' },
  { href: '/products', label: 'Products' },
  { href: '/bridal', label: 'Bridal' },
  { href: '/gallery', label: 'Transformations' },
  { href: '/blog', label: 'Beauty Blog' },
  { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  const isHome = pathname === '/';
  const isLightText = isHome && !scrolled;

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile nav when clicking a link
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const isAdminPath = pathname?.startsWith('/admin');

  if (isAdminPath) return null;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled 
          ? 'glass-nav py-3 shadow-sm' 
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <Image
              src="/salonlogo.png"
              alt="Dynamatrix Salon logo"
              width={48}
              height={48}
              priority
              className="h-11 w-11 rounded-md object-cover shadow-sm ring-1 ring-brand-pink-accent/30 sm:h-12 sm:w-12"
            />
            <div className="flex flex-col">
              <span className={`font-serif text-lg sm:text-xl font-semibold tracking-wider transition-colors ${
                isLightText 
                  ? 'text-brand-cream group-hover:text-brand-rosegold' 
                  : 'text-brand-charcoal group-hover:text-brand-rosegold'
              }`}>
                DYNAMATRIX
              </span>
              <span className={`text-[9px] uppercase tracking-widest font-medium -mt-1 transition-colors ${
                isLightText
                  ? 'text-brand-pink-accent/90'
                  : 'text-brand-rosegold-dark'
              }`}>
                Salon
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex space-x-1 items-center">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3.5 py-2 text-sm font-medium transition-all duration-300 relative rounded-md ${
                    isActive 
                      ? isLightText 
                        ? 'text-brand-rosegold' 
                        : 'text-brand-rosegold-dark' 
                      : isLightText 
                        ? 'text-brand-cream/80 hover:text-brand-rosegold' 
                        : 'text-brand-charcoal hover:text-brand-rosegold'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="activeNavLine"
                      className="absolute bottom-0 left-3.5 right-3.5 h-0.5 bg-brand-rosegold"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Booking CTA Button */}
          <div className="hidden sm:flex items-center gap-3">
            <Link href="/book">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 bg-gradient-to-r from-brand-pink-accent to-brand-rosegold hover:from-brand-rosegold hover:to-brand-rosegold-dark text-brand-charcoal-dark font-medium px-5 py-2.5 rounded-full text-sm shadow-sm transition-all duration-300 cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                Book Appoint
              </motion.button>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2 rounded-md focus:outline-none transition-colors ${
                isLightText 
                  ? 'text-brand-cream hover:text-brand-rosegold' 
                  : 'text-brand-charcoal hover:text-brand-rosegold'
              }`}
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden glass-nav overflow-hidden border-t border-brand-pink-accent/20"
          >
            <div className="px-4 pt-2 pb-6 space-y-1.5 flex flex-col">
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3 py-2.5 rounded-lg text-base font-medium transition-colors ${
                      isActive 
                        ? 'bg-brand-pink-medium/60 text-brand-rosegold-dark pl-5 border-l-4 border-brand-rosegold' 
                        : 'text-brand-charcoal hover:bg-brand-pink-light/40 hover:text-brand-rosegold'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <div className="pt-4 border-t border-brand-pink-accent/20 flex flex-col gap-3">
                <Link href="/book" className="w-full">
                  <button className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-brand-pink-accent to-brand-rosegold text-brand-charcoal-dark font-medium px-5 py-3 rounded-xl text-sm shadow-sm">
                    <Calendar className="w-4 h-4" />
                    Book Free Consultation
                  </button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
