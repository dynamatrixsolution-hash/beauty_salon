'use client';

import React, { useState, useEffect } from 'react';
import { MessageCircle, X, Sparkles, PhoneCall } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';

export default function WhatsAppFloatingButton() {
  const [showTooltip, setShowTooltip] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Show tooltip after 5 seconds
    const timer = setTimeout(() => {
      setShowTooltip(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const isAdminPath = pathname?.startsWith('/admin');

  if (isAdminPath) return null;

  const handleWhatsAppRedirect = () => {
    const number = '9779800000000'; // Placeholder premium salon number
    const text = encodeURIComponent("Hello Glow & Grace Studio! I'm interested in booking an appointment/inquiring about your services.");
    window.open(`https://wa.me/${number}?text=${text}`, '_blank');
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3 pointer-events-none">
      {/* Interactive Floating Greeting Badge */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            className="pointer-events-auto glass-card p-4 rounded-2xl max-w-[260px] shadow-xl border border-brand-pink-accent/40 flex flex-col gap-2"
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-1.5 text-brand-rosegold-dark text-xs font-semibold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
                Glow Concierge
              </div>
              <button 
                onClick={() => setShowTooltip(false)}
                className="text-brand-charcoal/50 hover:text-brand-charcoal cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-xs text-brand-charcoal/80 font-medium">
              Namaste! Ready to pamper yourself? Chat with our lead stylist on WhatsApp for custom consultation.
            </p>
            <button
              onClick={handleWhatsAppRedirect}
              className="w-full flex items-center justify-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-1.5 px-3 rounded-lg text-xs transition-colors shadow-sm cursor-pointer"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-current" />
              Chat on WhatsApp
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Pulse Button */}
      <motion.button
        onClick={handleWhatsAppRedirect}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="pointer-events-auto flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg cursor-pointer relative group"
        aria-label="Contact WhatsApp"
      >
        <span className="absolute inset-0 rounded-full bg-emerald-500/30 animate-ping opacity-75"></span>
        <MessageCircle className="w-6 h-6 fill-current relative z-10" />
        
        {/* Hover mini-badge */}
        <span className="absolute -left-20 bg-brand-charcoal text-white text-[10px] font-semibold py-1 px-2.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none shadow-md">
          Chat With Us
        </span>
      </motion.button>
    </div>
  );
}
