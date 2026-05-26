'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  User,
  CalendarDays,
  Share2,
  Copy,
  Check,
  ArrowRight,
} from 'lucide-react';
import { motion } from 'framer-motion';

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

interface BlogPostClientProps {
  post: BlogPost;
  relatedPosts: BlogPost[];
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/** Renders a single line of markdown-like text to React nodes */
function renderInlineMarkdown(text: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  // Pattern: **bold**, *italic*
  const regex = /(\*\*(.+?)\*\*|\*(.+?)\*)/g;
  let lastIndex = 0;
  let match;
  let key = 0;

  while ((match = regex.exec(text)) !== null) {
    // Push text before match
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }

    if (match[2]) {
      // Bold
      nodes.push(
        <strong key={key++} className="font-semibold text-brand-charcoal">
          {match[2]}
        </strong>
      );
    } else if (match[3]) {
      // Italic
      nodes.push(
        <em key={key++} className="italic">
          {match[3]}
        </em>
      );
    }

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes.length > 0 ? nodes : [text];
}

/** Simple markdown renderer that handles headings, bold, italic, bullet lists, and paragraphs */
function renderMarkdown(content: string): React.ReactNode[] {
  const blocks = content.split('\n\n');
  const elements: React.ReactNode[] = [];

  blocks.forEach((block, blockIdx) => {
    const trimmedBlock = block.trim();
    if (!trimmedBlock) return;

    // Check for heading (## or ###)
    if (trimmedBlock.startsWith('### ')) {
      elements.push(
        <h3
          key={blockIdx}
          className="font-serif text-lg font-medium text-brand-charcoal mt-8 mb-3"
        >
          {renderInlineMarkdown(trimmedBlock.slice(4))}
        </h3>
      );
      return;
    }

    if (trimmedBlock.startsWith('## ')) {
      elements.push(
        <h2
          key={blockIdx}
          className="font-serif text-xl sm:text-2xl font-medium text-brand-charcoal mt-10 mb-4 pb-2 border-b border-brand-pink-accent/20"
        >
          {renderInlineMarkdown(trimmedBlock.slice(3))}
        </h2>
      );
      return;
    }

    // Check for bullet list (lines starting with - )
    const lines = trimmedBlock.split('\n');
    const isList = lines.every((line) => line.trim().startsWith('- '));

    if (isList) {
      elements.push(
        <ul
          key={blockIdx}
          className="space-y-2 my-4 pl-1"
        >
          {lines.map((line, lineIdx) => (
            <li
              key={lineIdx}
              className="flex items-start gap-2.5 text-sm text-brand-charcoal/80 leading-relaxed"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-brand-rosegold mt-2 shrink-0" />
              <span>{renderInlineMarkdown(line.trim().slice(2))}</span>
            </li>
          ))}
        </ul>
      );
      return;
    }

    // Default: paragraph
    elements.push(
      <p
        key={blockIdx}
        className="text-sm sm:text-base text-brand-charcoal/80 leading-relaxed font-light"
      >
        {renderInlineMarkdown(trimmedBlock)}
      </p>
    );
  });

  return elements;
}

export default function BlogPostClient({ post, relatedPosts }: BlogPostClientProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareWhatsApp = () => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`Check out this article: ${post.title}`);
    window.open(`https://wa.me/?text=${text}%20${url}`, '_blank');
  };

  return (
    <div className="bg-gradient-to-b from-brand-beige via-white to-brand-beige/30 min-h-screen">
      {/* Hero Image Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative w-full h-[50vh] sm:h-[60vh] overflow-hidden"
      >
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover"
        />
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-charcoal-dark/80 via-brand-charcoal-dark/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-charcoal-dark/20 to-transparent" />

        {/* Hero Content */}
        <div className="absolute inset-0 flex flex-col justify-end">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16 w-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col gap-4"
            >
              <span className="inline-block self-start bg-brand-rosegold/90 backdrop-blur-sm text-white text-[9px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full">
                {post.category}
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-white leading-tight max-w-3xl">
                {post.title}
              </h1>
              <div className="flex items-center gap-5 text-white/70 text-xs font-medium">
                <span className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-brand-rosegold" />
                  {post.author}
                </span>
                <span className="flex items-center gap-1.5">
                  <CalendarDays className="w-3.5 h-3.5 text-brand-rosegold" />
                  {formatDate(post.createdAt)}
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Article Body */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Back Link */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-charcoal/60 hover:text-brand-rosegold-dark mb-10 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Beauty Journal
          </Link>
        </motion.div>

        {/* Content */}
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-col gap-5"
        >
          {/* Excerpt / Lead */}
          <p className="text-base sm:text-lg text-brand-charcoal/90 font-light leading-relaxed font-serif italic border-l-2 border-brand-rosegold/40 pl-5 py-1">
            {post.excerpt}
          </p>

          {/* Markdown Content */}
          <div className="mt-4 flex flex-col gap-4">
            {renderMarkdown(post.content)}
          </div>
        </motion.article>

        {/* Share Section */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="mt-14 pt-8 border-t border-brand-pink-accent/20"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-brand-charcoal/70">
              <Share2 className="w-4 h-4 text-brand-rosegold" />
              <span className="font-medium">Share this article</span>
            </div>
            <div className="flex items-center gap-3">
              {/* WhatsApp Share */}
              <button
                onClick={handleShareWhatsApp}
                className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] text-xs font-semibold transition-all duration-300 cursor-pointer border border-[#25D366]/20"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                WhatsApp
              </button>

              {/* Copy Link */}
              <button
                onClick={handleCopyLink}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-semibold transition-all duration-300 cursor-pointer border ${
                  copied
                    ? 'bg-green-50 border-green-200 text-green-600'
                    : 'bg-white/60 border-brand-pink-accent/30 text-brand-charcoal/70 hover:bg-brand-pink-medium/20 hover:border-brand-pink-accent/50'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Copy Link
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="mt-16"
          >
            <h2 className="font-serif text-2xl sm:text-3xl font-light text-brand-charcoal mb-8">
              You May Also <span className="italic text-rose-gold-gradient">Enjoy</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPosts.map((rp, idx) => (
                <motion.div
                  key={rp.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.9 + idx * 0.1 }}
                >
                  <Link
                    href={`/blog/${rp.slug}`}
                    className="glass-card glass-card-hover rounded-xl overflow-hidden flex flex-col group block"
                  >
                    <div className="relative aspect-[3/2] overflow-hidden bg-brand-cream">
                      <img
                        src={rp.image}
                        alt={rp.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute top-3 left-3 bg-brand-beige/95 backdrop-blur-sm text-brand-charcoal-dark text-[8px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full">
                        {rp.category}
                      </div>
                    </div>
                    <div className="p-4 flex flex-col gap-2">
                      <span className="text-[10px] text-brand-charcoal/45 font-medium flex items-center gap-1">
                        <CalendarDays className="w-3 h-3" />
                        {formatDate(rp.createdAt)}
                      </span>
                      <h3 className="font-serif text-sm text-brand-charcoal group-hover:text-brand-rosegold-dark transition-colors line-clamp-2 leading-snug">
                        {rp.title}
                      </h3>
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-brand-rosegold-dark mt-1">
                        Read More
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Bottom CTA - Back to Journal */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
          className="mt-16 text-center"
        >
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-brand-charcoal text-white text-sm font-semibold hover:bg-brand-charcoal-dark transition-colors duration-300"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Beauty Journal
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
