'use client';

import React, { useState } from 'react';
import { Search, Sparkles, X, MessageSquare, Check, ShieldAlert, AlertCircle, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ProductsClientProps {
  products: any[];
}

const CATEGORIES = [
  { id: 'all', label: 'All Products' },
  { id: 'skincare', label: 'Skincare' },
  { id: 'haircare', label: 'Hair Care' },
  { id: 'makeup', label: 'Cosmetics' },
  { id: 'spa', label: 'Spa Wellness' },
  { id: 'tools', label: 'Beauty Tools' },
];

export default function ProductsClient({ products }: ProductsClientProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  
  // Inquiry Form State
  const [inquiryData, setInquiryData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [inquiryStatus, setInquiryStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const filteredProducts = products.filter((prod) => {
    const matchesSearch =
      prod.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prod.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prod.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory =
      activeCategory === 'all' || prod.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct || !inquiryData.name || !inquiryData.email || !inquiryData.message) return;
    setInquiryStatus('loading');

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: inquiryData.name,
          email: inquiryData.email,
          phone: inquiryData.phone,
          type: 'product',
          itemId: selectedProduct.id,
          itemTitle: `${selectedProduct.brand} - ${selectedProduct.title}`,
          details: inquiryData.message,
        }),
      });

      if (res.ok) {
        setInquiryStatus('success');
        setInquiryData({ name: '', email: '', phone: '', message: '' });
      } else {
        setInquiryStatus('error');
      }
    } catch {
      setInquiryStatus('error');
    }
  };

  const openProduct = (prod: any) => {
    setSelectedProduct(prod);
    setInquiryStatus('idle');
    setInquiryData((prev) => ({
      ...prev,
      message: `Hello, I'd like to check the availability and price of "${prod.brand} - ${prod.title}" at your Kathmandu studio.`,
    }));
  };

  const closeProduct = () => {
    setSelectedProduct(null);
  };

  return (
    <div className="py-28 bg-gradient-to-b from-brand-beige to-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-12">
        {/* Header */}
        <div className="text-center flex flex-col items-center gap-4">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-pink-medium/40 border border-brand-pink-accent/40 text-brand-rosegold-dark text-[10px] font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
            Exquisite Product Catalog
          </div>
          <h1 className="font-serif text-4xl sm:text-6xl font-light text-brand-charcoal">
            Premium <span className="font-normal italic text-rose-gold-gradient">Studio Boutique</span>
          </h1>
          <p className="text-brand-charcoal/70 text-sm max-w-lg font-light leading-relaxed">
            We source our skincare and haircare directly from top global brands. These products are for display and in-salon pickup only.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col md:flex-row gap-6 justify-between items-center bg-white/40 p-4 rounded-2xl glass-card border border-brand-pink-accent/20">
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-brand-charcoal text-white'
                    : 'bg-white/50 text-brand-charcoal hover:bg-brand-pink-medium/30'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-charcoal/40" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/70 border border-brand-pink-accent/30 text-sm focus:outline-none focus:border-brand-rosegold text-brand-charcoal placeholder-brand-charcoal/45"
            />
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((prod) => (
                <motion.div
                  key={prod.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="glass-card rounded-2xl overflow-hidden flex flex-col group border border-brand-pink-accent/20"
                >
                  <div className="relative aspect-square overflow-hidden bg-brand-beige/10">
                    <img
                      src={prod.image}
                      alt={prod.title}
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4 bg-brand-beige/90 backdrop-blur-sm text-brand-charcoal-dark text-[9px] font-bold tracking-wider uppercase px-3 py-1.5 rounded-full">
                      {prod.category}
                    </div>
                  </div>
                  
                  <div className="p-6 flex flex-col flex-grow justify-between gap-4">
                    <div className="flex flex-col gap-1.5 text-left">
                      <span className="text-[10px] text-brand-charcoal/40 font-bold uppercase tracking-widest">
                        {prod.brand}
                      </span>
                      <h3 className="font-serif text-lg text-brand-charcoal group-hover:text-brand-rosegold transition-colors">
                        {prod.title}
                      </h3>
                      <p className="text-xs text-brand-charcoal/60 line-clamp-2 leading-relaxed font-light">
                        {prod.description}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-brand-pink-accent/10 flex items-center justify-between">
                      <span className="text-[9px] text-brand-rosegold-dark font-bold uppercase tracking-wider bg-brand-pink-medium/50 px-2.5 py-1 rounded">
                        In-Salon Purchase
                      </span>
                      <button
                        onClick={() => openProduct(prod)}
                        className="px-4 py-2 bg-brand-charcoal text-white hover:bg-brand-charcoal-dark rounded-full text-xs font-semibold tracking-wide transition-colors cursor-pointer"
                      >
                        Inquire Details
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full py-16 text-center text-brand-charcoal/50 font-light text-sm">
                No products found matching your selection.
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* 9. PRODUCT DETAIL & INQUIRY MODAL OVERLAY */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-brand-charcoal-dark/70 flex items-center justify-center p-4 backdrop-blur-sm overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.9, y: 25 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 25 }}
              className="bg-brand-beige w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl relative border border-brand-pink-accent/40 max-h-[90vh] overflow-y-auto"
            >
              {/* Close Button */}
              <button
                onClick={closeProduct}
                className="absolute top-4 right-4 z-10 text-brand-charcoal/60 hover:text-brand-charcoal p-1.5 rounded-full bg-white/50 backdrop-blur-sm cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2">
                {/* Visual Column */}
                <div className="relative aspect-square md:aspect-auto md:h-full bg-brand-beige/25 flex items-center justify-center p-6 border-r border-brand-pink-accent/10">
                  <img
                    src={selectedProduct.image}
                    alt={selectedProduct.title}
                    className="w-full h-full max-h-[400px] object-contain rounded-xl"
                  />
                  <div className="absolute bottom-6 left-6 right-6 bg-brand-charcoal/90 text-brand-beige p-4 rounded-xl flex gap-2 items-center z-10">
                    <Info className="w-5 h-5 text-brand-rosegold shrink-0" />
                    <p className="text-[10px] sm:text-xs leading-normal font-light">
                      This product is available exclusively for purchase at our Durbarmarg studio. We do not ship items online.
                    </p>
                  </div>
                </div>

                {/* Detail and Form Column */}
                <div className="p-8 flex flex-col gap-6 max-h-[90vh] overflow-y-auto">
                  {/* Brand Header */}
                  <div className="flex flex-col gap-1.5 text-left">
                    <span className="text-[10px] text-brand-charcoal/40 font-bold uppercase tracking-widest">
                      {selectedProduct.brand}
                    </span>
                    <h2 className="font-serif text-2xl sm:text-3xl text-brand-charcoal">
                      {selectedProduct.title}
                    </h2>
                  </div>

                  {/* Tabs info */}
                  <div className="flex flex-col gap-4 text-left">
                    <div className="flex flex-col gap-1">
                      <span className="text-[9px] uppercase font-bold text-brand-rosegold-dark tracking-wider">Stylist Recommendation</span>
                      <p className="text-xs text-brand-charcoal/80 italic font-light bg-brand-pink-medium/20 p-3 rounded-lg border-l-2 border-brand-rosegold">
                        "{selectedProduct.recommendation}"
                      </p>
                    </div>

                    <div className="flex flex-col gap-1">
                      <span className="text-[9px] uppercase font-bold text-brand-rosegold-dark tracking-wider">Description</span>
                      <p className="text-xs text-brand-charcoal/70 leading-relaxed font-light">
                        {selectedProduct.description}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-[9px] uppercase font-bold text-brand-rosegold-dark tracking-wider">Ingredients</span>
                        <p className="text-[10px] text-brand-charcoal/60 leading-normal line-clamp-3 hover:line-clamp-none transition-all cursor-pointer">
                          {selectedProduct.ingredients}
                        </p>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-[9px] uppercase font-bold text-brand-rosegold-dark tracking-wider">Usage Instructions</span>
                        <p className="text-[10px] text-brand-charcoal/60 leading-normal">
                          {selectedProduct.instructions}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Inquiry Section */}
                  <div className="pt-6 border-t border-brand-pink-accent/20 text-left">
                    <h3 className="text-sm font-serif font-semibold text-brand-charcoal mb-4 flex items-center gap-1.5">
                      <MessageSquare className="w-4 h-4 text-brand-rosegold" />
                      Ask Availability &amp; Price
                    </h3>

                    {inquiryStatus === 'success' ? (
                      <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-3">
                        <Check className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                        <div className="flex flex-col gap-0.5">
                          <span className="text-xs font-bold text-emerald-800">Inquiry Submitted</span>
                          <span className="text-[11px] text-emerald-700 leading-normal">
                            Thank you! We have logged your request. We will ping you on WhatsApp/email with pricing and stock details.
                          </span>
                        </div>
                      </div>
                    ) : (
                      <form onSubmit={handleInquirySubmit} className="flex flex-col gap-3">
                        <div className="grid grid-cols-2 gap-3">
                          <input
                            type="text"
                            placeholder="Your Name"
                            value={inquiryData.name}
                            onChange={(e) => setInquiryData({ ...inquiryData, name: e.target.value })}
                            className="w-full px-3 py-2 border border-brand-pink-accent/30 rounded-lg text-xs focus:outline-none focus:border-brand-rosegold text-brand-charcoal bg-white/50"
                            required
                          />
                          <input
                            type="email"
                            placeholder="Your Email"
                            value={inquiryData.email}
                            onChange={(e) => setInquiryData({ ...inquiryData, email: e.target.value })}
                            className="w-full px-3 py-2 border border-brand-pink-accent/30 rounded-lg text-xs focus:outline-none focus:border-brand-rosegold text-brand-charcoal bg-white/50"
                            required
                          />
                        </div>
                        <input
                          type="tel"
                          placeholder="WhatsApp Phone Number"
                          value={inquiryData.phone}
                          onChange={(e) => setInquiryData({ ...inquiryData, phone: e.target.value })}
                          className="w-full px-3 py-2 border border-brand-pink-accent/30 rounded-lg text-xs focus:outline-none focus:border-brand-rosegold text-brand-charcoal bg-white/50"
                        />
                        <textarea
                          placeholder="Your message..."
                          value={inquiryData.message}
                          onChange={(e) => setInquiryData({ ...inquiryData, message: e.target.value })}
                          rows={3}
                          className="w-full px-3 py-2 border border-brand-pink-accent/30 rounded-lg text-xs focus:outline-none focus:border-brand-rosegold text-brand-charcoal bg-white/50 resize-none"
                          required
                        />

                        {inquiryStatus === 'error' && (
                          <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-2 text-rose-700 text-[10px]">
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            <span>Failed to send product inquiry. Please try again.</span>
                          </div>
                        )}

                        <button
                          type="submit"
                          disabled={inquiryStatus === 'loading'}
                          className="w-full py-2.5 bg-brand-charcoal hover:bg-brand-charcoal-dark text-white rounded-lg text-xs font-semibold tracking-wider uppercase transition-colors cursor-pointer disabled:opacity-50"
                        >
                          {inquiryStatus === 'loading' ? 'Submitting...' : 'Send Inquiry'}
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
