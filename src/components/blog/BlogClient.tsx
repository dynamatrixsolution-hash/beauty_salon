'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, User, CalendarDays } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  category: string;
  author: string;
  image: string;
  published: boolean;
  createdAt: string;
}

interface BlogClientProps {
  initialPosts: BlogPost[];
}

const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'skincare', label: 'Skincare' },
  { id: 'haircare', label: 'Haircare' },
  { id: 'bridal', label: 'Bridal' },
  { id: 'wellness', label: 'Wellness' },
  { id: 'trends', label: 'Trends' },
];

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants: any = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.25 },
  },
};

export default function BlogClient({ initialPosts }: BlogClientProps) {
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredPosts = initialPosts.filter((post) => {
    if (activeCategory === 'all') return true;
    return post.category.toLowerCase() === activeCategory;
  });

  return (
    <div className="py-28 bg-gradient-to-b from-brand-beige via-white to-brand-beige/30 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-14">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center flex flex-col items-center gap-5"
        >
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-pink-medium/40 border border-brand-pink-accent/40 text-brand-rosegold-dark text-[10px] font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
            Expert Beauty Insights
          </div>
          <h1 className="font-serif text-4xl sm:text-6xl font-light text-brand-charcoal">
            Beauty <span className="font-normal italic text-rose-gold-gradient">Journal</span>
          </h1>
          <p className="text-brand-charcoal/70 text-sm sm:text-base max-w-xl font-light leading-relaxed">
            Curated tips, trends, and behind-the-scenes wisdom from the artisans of Glow&nbsp;&amp;&nbsp;Grace Studio.
          </p>
        </motion.div>

        {/* Category Filter Pills */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-2"
        >
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-5 py-2 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-brand-charcoal text-white shadow-md'
                  : 'bg-white/60 text-brand-charcoal/80 border border-brand-pink-accent/30 hover:bg-brand-pink-medium/30 hover:border-brand-pink-accent/50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </motion.div>

        {/* Blog Cards Grid */}
        <AnimatePresence mode="wait">
          {filteredPosts.length > 0 ? (
            <motion.div
              key={activeCategory}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredPosts.map((post) => (
                <motion.div
                  key={post.id}
                  variants={cardVariants}
                  layout
                  className="glass-card glass-card-hover rounded-2xl overflow-hidden flex flex-col h-full group"
                >
                  {/* Card Image */}
                  <Link href={`/blog/${post.slug}`} className="block">
                    <div className="relative aspect-[3/2] overflow-hidden bg-brand-cream">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      {/* Category badge */}
                      <div className="absolute top-4 left-4 bg-brand-beige/95 backdrop-blur-sm text-brand-charcoal-dark text-[9px] font-bold tracking-wider uppercase px-3 py-1.5 rounded-full">
                        {post.category}
                      </div>
                    </div>
                  </Link>

                  {/* Card Content */}
                  <div className="p-6 flex flex-col flex-grow justify-between gap-4">
                    <div className="flex flex-col gap-3">
                      {/* Meta info */}
                      <div className="flex items-center gap-4 text-[10px] text-brand-charcoal/50 font-medium">
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3 text-brand-rosegold" />
                          {post.author}
                        </span>
                        <span className="flex items-center gap-1">
                          <CalendarDays className="w-3 h-3 text-brand-rosegold" />
                          {formatDate(post.createdAt)}
                        </span>
                      </div>

                      {/* Title */}
                      <Link href={`/blog/${post.slug}`}>
                        <h3 className="font-serif text-lg sm:text-xl text-brand-charcoal group-hover:text-brand-rosegold-dark transition-colors duration-300 leading-snug line-clamp-2">
                          {post.title}
                        </h3>
                      </Link>

                      {/* Excerpt */}
                      <p className="text-xs text-brand-charcoal/65 leading-relaxed line-clamp-3 font-light">
                        {post.excerpt}
                      </p>
                    </div>

                    {/* Read More */}
                    <div className="pt-4 border-t border-brand-pink-accent/20">
                      <Link
                        href={`/blog/${post.slug}`}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-rosegold-dark hover:text-brand-rosegold transition-colors group/link"
                      >
                        Read Article
                        <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform duration-300" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="py-24 text-center flex flex-col items-center gap-4"
            >
              <div className="w-16 h-16 rounded-full bg-brand-pink-medium/40 flex items-center justify-center">
                <Sparkles className="w-7 h-7 text-brand-rosegold" />
              </div>
              <p className="text-brand-charcoal/50 font-light text-sm max-w-sm">
                No articles found in this category yet. Our beauty experts are crafting new stories — check back soon.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
