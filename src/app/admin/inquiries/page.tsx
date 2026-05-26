'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import {
  MessageSquare,
  Check,
  Loader2,
  Phone,
  Mail,
  ExternalLink,
  Filter,
} from 'lucide-react';

const STATUS_TABS = ['all', 'pending', 'resolved'];

const statusColors: Record<string, string> = {
  pending: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
  resolved: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
};

const typeColors: Record<string, string> = {
  service: 'bg-blue-500/15 text-blue-400',
  product: 'bg-purple-500/15 text-purple-400',
  bridal: 'bg-pink-500/15 text-pink-400',
  general: 'bg-gray-500/15 text-gray-400',
  collab: 'bg-cyan-500/15 text-cyan-400',
};

export default function AdminInquiriesPage() {
  const { data: session } = useSession();
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchInquiries = async () => {
    try {
      const res = await fetch('/api/inquiries');
      const data = await res.json();
      if (data.success) {
        setInquiries(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch inquiries:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session) fetchInquiries();
  }, [session]);

  const markResolved = async (id: string) => {
    setUpdating(id);
    try {
      const res = await fetch('/api/inquiries', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: 'resolved' }),
      });
      const data = await res.json();
      if (data.success) {
        setInquiries((prev) =>
          prev.map((i) => (i.id === id ? { ...i, status: 'resolved' } : i))
        );
      }
    } catch (error) {
      console.error('Failed to update inquiry:', error);
    } finally {
      setUpdating(null);
    }
  };

  const filtered =
    activeTab === 'all'
      ? inquiries
      : inquiries.filter((i) => i.status === activeTab);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-brand-rosegold animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="font-serif text-2xl font-semibold text-white">
            Inquiries
          </h1>
          <p className="text-white/40 text-sm mt-1 font-sans">
            Customer questions and service inquiries
          </p>
        </div>
        <div className="flex items-center gap-2 text-white/40 text-sm">
          <MessageSquare className="w-4 h-4" />
          <span>{inquiries.length} total</span>
        </div>
      </motion.div>

      {/* Filter Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="flex items-center gap-2"
      >
        <Filter className="w-4 h-4 text-white/30 shrink-0" />
        {STATUS_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
              activeTab === tab
                ? 'bg-brand-rosegold/15 text-brand-rosegold border border-brand-rosegold/25'
                : 'text-white/40 hover:text-white/60 hover:bg-white/[0.04] border border-transparent'
            }`}
          >
            {tab}
          </button>
        ))}
      </motion.div>

      {/* Inquiries List */}
      {filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <MessageSquare className="w-12 h-12 text-white/10 mx-auto mb-4" />
          <p className="text-white/30 font-sans">No inquiries found</p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((inq, idx) => (
            <motion.div
              key={inq.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              className="bg-white/[0.03] rounded-2xl border border-white/[0.06] p-5 hover:bg-white/[0.05] transition-colors"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="min-w-0">
                  <p className="text-white font-medium text-sm truncate font-sans">
                    {inq.customerName}
                  </p>
                  <p className="text-white/30 text-xs font-sans mt-0.5">
                    {new Date(inq.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                      typeColors[inq.type] || typeColors.general
                    }`}
                  >
                    {inq.type}
                  </span>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                      statusColors[inq.status] || statusColors.pending
                    }`}
                  >
                    {inq.status}
                  </span>
                </div>
              </div>

              {/* Item reference */}
              {inq.itemTitle && (
                <p className="text-white/50 text-xs font-sans mb-2">
                  Re: <span className="text-brand-rosegold">{inq.itemTitle}</span>
                </p>
              )}

              {/* Message */}
              <p className="text-white/60 text-sm font-sans leading-relaxed mb-4">
                {inq.details}
              </p>

              {/* Contact & Actions */}
              <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-white/[0.06]">
                {inq.customerPhone && (
                  <a
                    href={`https://wa.me/${inq.customerPhone.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-colors text-xs font-medium"
                  >
                    <Phone className="w-3 h-3" />
                    WhatsApp
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
                <a
                  href={`mailto:${inq.customerEmail}`}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors text-xs font-medium"
                >
                  <Mail className="w-3 h-3" />
                  Email
                </a>

                {inq.status === 'pending' && (
                  <button
                    onClick={() => markResolved(inq.id)}
                    disabled={updating === inq.id}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-rosegold/10 text-brand-rosegold hover:bg-brand-rosegold/20 transition-colors text-xs font-medium ml-auto cursor-pointer disabled:opacity-50"
                  >
                    {updating === inq.id ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <Check className="w-3 h-3" />
                    )}
                    Mark Resolved
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
