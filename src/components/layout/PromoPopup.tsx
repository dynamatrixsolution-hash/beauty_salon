'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Check, Copy, Gift } from 'lucide-react';

export default function PromoPopup() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [promoCode, setPromoCode] = useState('GLOW15');
  const [copied, setCopied] = useState(false);
  const [hasClosedOnce, setHasClosedOnce] = useState(false);

  const isAdminPath = pathname?.startsWith('/admin');

  useEffect(() => {
    setMounted(true);
    if (isAdminPath) return;

    // Check if the user has already subscribed or seen it in this browser
    const isShown = localStorage.getItem('glow_popup_shown');
    if (!isShown) {
      const timer = setTimeout(() => {
        setShowPopup(true);
      }, 5000); // 5 seconds delay
      return () => clearTimeout(timer);
    } else {
      setHasClosedOnce(true);
    }
  }, [isAdminPath]);

  if (!mounted || isAdminPath) return null;

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
      const data = await res.json();
      if (res.ok) {
        setStatus('success');
        if (data.code) {
          setPromoCode(data.code);
        }
        localStorage.setItem('glow_popup_shown', 'true');
        setHasClosedOnce(true);
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error('Subscription failed:', error);
      setStatus('error');
    }
  };

  const closePopup = () => {
    setShowPopup(false);
    localStorage.setItem('glow_popup_shown', 'true');
    setHasClosedOnce(true);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(promoCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      {/* Floating elegant gift trigger button (visible when popup is hidden and has been dismissed once) */}
      <AnimatePresence>
        {!showPopup && hasClosedOnce && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            whileHover={{ scale: 1.05 }}
            onClick={() => setShowPopup(true)}
            className="fixed bottom-6 left-6 z-40 bg-gradient-to-r from-brand-charcoal-dark to-brand-charcoal text-white hover:text-brand-rosegold px-4 py-3 rounded-full shadow-2xl border border-white/[0.08] hover:border-brand-rosegold/30 flex items-center gap-2 cursor-pointer group"
          >
            <div className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-rosegold opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand-rosegold"></span>
            </div>
            <Gift className="w-4 h-4 text-brand-rosegold group-hover:rotate-12 transition-transform" />
            <span className="text-[10px] sm:text-xs font-semibold tracking-wider font-sans uppercase">
              15% OFF GIFT
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Main Promo Popup Modal */}
      <AnimatePresence>
        {showPopup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
            {/* Dark background click-out */}
            <div className="absolute inset-0" onClick={closePopup} />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="relative w-full max-w-md overflow-hidden rounded-3xl bg-brand-charcoal-dark border border-white/[0.08] shadow-2xl z-10"
            >
              {/* Decorative backgrounds */}
              <div className="absolute -top-32 -right-32 w-64 h-64 bg-brand-rosegold/5 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-brand-pink-accent/5 rounded-full blur-3xl pointer-events-none" />

              {/* Close Button */}
              <button
                onClick={closePopup}
                className="absolute top-4 right-4 z-20 p-1.5 rounded-full bg-white/[0.03] border border-white/[0.05] text-white/50 hover:text-white hover:bg-white/[0.08] transition-all cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="p-8 sm:p-10 flex flex-col items-center text-center relative z-10">
                {/* Star Accent */}
                <div className="w-12 h-12 rounded-2xl bg-brand-rosegold/10 border border-brand-rosegold/20 text-brand-rosegold flex items-center justify-center mb-6 shadow-inner animate-pulse-slow">
                  <Sparkles className="w-6 h-6" />
                </div>

                {status !== 'success' ? (
                  <>
                    <span className="text-[10px] text-brand-rosegold font-bold uppercase tracking-[0.25em] mb-2 font-sans">
                      Glow & Grace Circle
                    </span>
                    <h3 className="font-serif text-2xl sm:text-3xl text-white font-medium tracking-wide mb-3">
                      Unlock 15% Off Your First Visit
                    </h3>
                    <p className="text-white/60 text-xs sm:text-sm font-sans font-light leading-relaxed max-w-sm mb-6">
                      Join our inner circle today. Enter your email to receive an instant <strong className="text-brand-rosegold font-semibold">15% discount voucher</strong> on any hair, skin, or bridal beauty treatment.
                    </p>

                    {/* Form */}
                    <form onSubmit={handleSubscribe} className="w-full space-y-3">
                      <input
                        type="email"
                        placeholder="Enter your email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full bg-white/[0.04] border border-white/[0.08] text-white placeholder-white/35 px-4 py-3.5 rounded-xl text-sm font-sans focus:outline-none focus:border-brand-rosegold/40 focus:bg-white/[0.06] focus:ring-1 focus:ring-brand-rosegold/20 transition-all duration-300"
                      />

                      <button
                        type="submit"
                        disabled={status === 'loading'}
                        className="w-full bg-gradient-to-r from-brand-rosegold to-brand-rosegold-dark hover:from-brand-rosegold-dark hover:to-brand-rosegold text-white font-semibold py-3.5 rounded-xl text-xs sm:text-sm uppercase tracking-widest transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-lg shadow-brand-rosegold/10 flex items-center justify-center gap-2"
                      >
                        {status === 'loading' ? 'Activating Offer...' : 'Get My 15% Voucher'}
                      </button>
                    </form>

                    {status === 'error' && (
                      <p className="text-xs text-rose-400 font-medium mt-3 font-sans">
                        Something went wrong. Please try again.
                      </p>
                    )}
                  </>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full"
                  >
                    <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-4">
                      <Check className="w-6 h-6" />
                    </div>

                    <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-[0.25em] mb-2 block font-sans">
                      Subscription Active
                    </span>
                    <h3 className="font-serif text-2xl sm:text-3xl text-white font-medium tracking-wide mb-3">
                      Welcome to the Circle!
                    </h3>
                    <p className="text-white/60 text-xs sm:text-sm font-sans font-light leading-relaxed max-w-sm mb-6">
                      Thank you for joining. Use your exclusive Kathmandu studio code below during booking to claim your discount:
                    </p>

                    {/* Code Copy Box */}
                    <div className="w-full bg-white/[0.03] border border-white/[0.06] rounded-2xl p-4 flex items-center justify-between gap-4 mb-6 shadow-inner">
                      <div className="text-left">
                        <span className="text-[9px] uppercase tracking-wider text-white/40 block font-bold">VOUCHER CODE</span>
                        <span className="text-lg font-serif font-bold text-brand-rosegold tracking-wider">{promoCode}</span>
                      </div>
                      <button
                        onClick={copyToClipboard}
                        className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand-rosegold/10 border border-brand-rosegold/20 text-brand-rosegold hover:bg-brand-rosegold/20 transition-all text-xs font-semibold cursor-pointer"
                      >
                        {copied ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            Copy Code
                          </>
                        )}
                      </button>
                    </div>

                    <button
                      onClick={closePopup}
                      className="text-xs text-white/40 hover:text-white underline underline-offset-4 transition-colors cursor-pointer font-sans"
                    >
                      Dismiss & Continue Browsing
                    </button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
