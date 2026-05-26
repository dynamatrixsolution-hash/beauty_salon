'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Plus, Search, Edit2, Trash2, ShieldCheck, Sparkles,
  X, Save, Loader2, Brain, Database, AlertTriangle,
  Tag, MessageSquare, CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Types ────────────────────────────────────────────────────────────────────

interface KBEntry {
  id: string;
  question: string;
  answer: string;
  category: string;
  isPriority: boolean;
  createdAt?: string;
}

interface FormData {
  question: string;
  answer: string;
  category: string;
  isPriority: boolean;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const CATEGORIES = ['Bridal', 'Hair', 'Facial', 'Pricing', 'General Info'];
const CATEGORY_COLORS: Record<string, string> = {
  Bridal: '#D9A7A0',
  Hair: '#C5A059',
  Facial: '#9CB8A8',
  Pricing: '#A0B5D9',
  'General Info': '#BFA0D9',
};

const EMPTY_FORM: FormData = {
  question: '',
  answer: '',
  category: 'General Info',
  isPriority: true,
};

// ─── Toast ────────────────────────────────────────────────────────────────────

function Toast({ message, type, onClose }: { message: string; type: 'success' | 'error'; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, x: '-50%' }}
      animate={{ opacity: 1, y: 0, x: '-50%' }}
      exit={{ opacity: 0, y: -20, x: '-50%' }}
      className="fixed top-6 left-1/2 z-[100] flex items-center gap-3 px-5 py-3 rounded-xl shadow-xl text-sm font-medium"
      style={{
        background: type === 'success' ? 'rgba(240,253,244,0.98)' : 'rgba(254,242,242,0.98)',
        border: `1px solid ${type === 'success' ? '#86efac' : '#fca5a5'}`,
        color: type === 'success' ? '#15803d' : '#dc2626',
        backdropFilter: 'blur(12px)',
      }}
    >
      {type === 'success' ? (
        <CheckCircle2 className="w-4 h-4 shrink-0" />
      ) : (
        <AlertTriangle className="w-4 h-4 shrink-0" />
      )}
      {message}
    </motion.div>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────

interface ModalProps {
  isOpen: boolean;
  mode: 'add' | 'edit';
  formData: FormData;
  isSaving: boolean;
  onChange: (field: keyof FormData, value: string | boolean) => void;
  onSubmit: () => void;
  onClose: () => void;
}

function QAModal({ isOpen, mode, formData, isSaving, onChange, onSubmit, onClose }: ModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 24 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="w-full max-w-xl pointer-events-auto rounded-2xl flex flex-col"
              style={{
                background: 'rgba(253,251,247,0.97)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(236,200,197,0.40)',
                boxShadow: '0 32px 80px rgba(42,36,36,0.18)',
              }}
            >
              {/* Modal header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-[#ECC8C5]/20">
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, #ECC8C5, #D9A7A0)' }}
                  >
                    {mode === 'add' ? (
                      <Plus className="w-4.5 h-4.5 text-white" />
                    ) : (
                      <Edit2 className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <div>
                    <h2 className="font-serif text-lg font-semibold text-[#2A2424]">
                      {mode === 'add' ? 'Add New Q&A Pair' : 'Edit Q&A Pair'}
                    </h2>
                    <p className="text-[11px] text-[#2A2424]/45">
                      This will be used to train the AI Concierge
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-[#2A2424]/40 hover:text-[#2A2424] hover:bg-[#2A2424]/5 transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Form */}
              <div className="px-6 py-5 flex flex-col gap-4">
                {/* Question */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-[#2A2424]/50">
                    Trigger Question
                  </label>
                  <textarea
                    value={formData.question}
                    onChange={(e) => onChange('question', e.target.value)}
                    placeholder="e.g. What is the starting price for bridal makeup?"
                    rows={2}
                    className="w-full text-[13px] text-[#2A2424] placeholder:text-[#2A2424]/30 px-4 py-3 rounded-xl resize-none focus:outline-none transition-all"
                    style={{
                      background: 'rgba(255,255,255,0.8)',
                      border: '1px solid rgba(217,167,160,0.30)',
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(217,167,160,0.70)';
                      e.currentTarget.style.boxShadow = '0 0 0 3px rgba(236,200,197,0.20)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(217,167,160,0.30)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  />
                </div>

                {/* Answer */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-[#2A2424]/50">
                    Admin Answer (Override)
                  </label>
                  <textarea
                    value={formData.answer}
                    onChange={(e) => onChange('answer', e.target.value)}
                    placeholder="e.g. Our Royal Bridal Packages begin at NPR 25,000..."
                    rows={4}
                    className="w-full text-[13px] text-[#2A2424] placeholder:text-[#2A2424]/30 px-4 py-3 rounded-xl resize-none focus:outline-none transition-all"
                    style={{
                      background: 'rgba(255,255,255,0.8)',
                      border: '1px solid rgba(217,167,160,0.30)',
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(217,167,160,0.70)';
                      e.currentTarget.style.boxShadow = '0 0 0 3px rgba(236,200,197,0.20)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(217,167,160,0.30)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  />
                </div>

                {/* Category + Priority row */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Category */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-widest text-[#2A2424]/50">
                      Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => onChange('category', e.target.value)}
                      className="text-[13px] text-[#2A2424] px-4 py-2.5 rounded-xl focus:outline-none cursor-pointer transition-all"
                      style={{
                        background: 'rgba(255,255,255,0.8)',
                        border: '1px solid rgba(217,167,160,0.30)',
                      }}
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Priority toggle */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-widest text-[#2A2424]/50">
                      Override AI?
                    </label>
                    <button
                      type="button"
                      onClick={() => onChange('isPriority', !formData.isPriority)}
                      className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl transition-all cursor-pointer text-[13px] font-medium"
                      style={{
                        background: formData.isPriority
                          ? 'rgba(197,160,89,0.12)'
                          : 'rgba(255,255,255,0.8)',
                        border: `1px solid ${formData.isPriority ? 'rgba(197,160,89,0.40)' : 'rgba(217,167,160,0.30)'}`,
                        color: formData.isPriority ? '#C5A059' : '#2A2424',
                      }}
                    >
                      <ShieldCheck className="w-4 h-4 shrink-0" />
                      {formData.isPriority ? 'Priority Override' : 'Standard'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-[#ECC8C5]/20 flex items-center justify-end gap-3">
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl text-[13px] font-medium text-[#2A2424]/60 hover:text-[#2A2424] hover:bg-[#2A2424]/5 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={onSubmit}
                  disabled={isSaving || !formData.question.trim() || !formData.answer.trim()}
                  className="px-6 py-2.5 rounded-xl text-[13px] font-semibold text-white flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    background: 'linear-gradient(135deg, #D9A7A0 0%, #C58B82 100%)',
                    boxShadow: '0 4px 16px rgba(197,139,130,0.30)',
                  }}
                >
                  {isSaving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  {mode === 'add' ? 'Add to Knowledge Base' : 'Save Changes'}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Delete Confirm Modal ──────────────────────────────────────────────────────

function DeleteModal({
  entry,
  isDeleting,
  onConfirm,
  onClose,
}: {
  entry: KBEntry | null;
  isDeleting: boolean;
  onConfirm: () => void;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {entry && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="w-full max-w-sm pointer-events-auto rounded-2xl p-6 flex flex-col gap-4"
              style={{
                background: 'rgba(253,251,247,0.97)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(236,200,197,0.40)',
                boxShadow: '0 32px 80px rgba(42,36,36,0.18)',
              }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center">
                  <Trash2 className="w-5 h-5 text-rose-500" />
                </div>
                <div>
                  <h3 className="font-serif text-base font-semibold text-[#2A2424]">
                    Delete Entry?
                  </h3>
                  <p className="text-[11px] text-[#2A2424]/45">
                    This cannot be undone
                  </p>
                </div>
              </div>
              <p className="text-[13px] text-[#2A2424]/70 leading-relaxed bg-[#2A2424]/[0.03] rounded-xl p-3 border border-[#2A2424]/5">
                &ldquo;{entry.question}&rdquo;
              </p>
              <div className="flex items-center justify-end gap-3 pt-1">
                <button
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl text-[13px] font-medium text-[#2A2424]/60 hover:bg-[#2A2424]/5 transition-all cursor-pointer"
                >
                  Keep it
                </button>
                <button
                  onClick={onConfirm}
                  disabled={isDeleting}
                  className="px-5 py-2.5 rounded-xl text-[13px] font-semibold text-white bg-rose-500 hover:bg-rose-600 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-60"
                >
                  {isDeleting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Delete
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({ label, value, icon: Icon, color }: {
  label: string;
  value: number;
  icon: React.ElementType;
  color: string;
}) {
  return (
    <div
      className="rounded-2xl p-4 flex items-center gap-3"
      style={{
        background: 'rgba(255,255,255,0.70)',
        border: '1px solid rgba(236,200,197,0.30)',
        boxShadow: '0 4px 16px rgba(217,167,160,0.08)',
      }}
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: `${color}18`, border: `1px solid ${color}30` }}
      >
        <Icon className="w-5 h-5" style={{ color }} />
      </div>
      <div>
        <p className="text-[11px] font-bold uppercase tracking-widest text-[#2A2424]/45">{label}</p>
        <p className="text-2xl font-serif font-semibold text-[#2A2424]">{value}</p>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AIKnowledgeBaseAdmin() {
  const [entries, setEntries] = useState<KBEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [editingEntry, setEditingEntry] = useState<KBEntry | null>(null);
  const [formData, setFormData] = useState<FormData>(EMPTY_FORM);
  const [isSaving, setIsSaving] = useState(false);

  // Delete state
  const [deleteEntry, setDeleteEntry] = useState<KBEntry | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Toast state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
  };

  // Fetch data
  const fetchEntries = useCallback(async () => {
    try {
      const res = await fetch('/api/concierge');
      const data = await res.json();
      setEntries(Array.isArray(data) ? data : []);
    } catch {
      showToast('Failed to load knowledge base entries', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  // Filter
  const filtered = entries.filter((item) => {
    const catMatch = activeCategory === 'All' || item.category === activeCategory;
    const q = searchQuery.toLowerCase();
    const textMatch =
      !q ||
      item.question.toLowerCase().includes(q) ||
      item.answer.toLowerCase().includes(q);
    return catMatch && textMatch;
  });

  // Stats
  const priorityCount = entries.filter((e) => e.isPriority).length;
  const categoryCount = new Set(entries.map((e) => e.category)).size;

  // Open add modal
  const openAdd = () => {
    setModalMode('add');
    setEditingEntry(null);
    setFormData(EMPTY_FORM);
    setModalOpen(true);
  };

  // Open edit modal
  const openEdit = (entry: KBEntry) => {
    setModalMode('edit');
    setEditingEntry(entry);
    setFormData({
      question: entry.question,
      answer: entry.answer,
      category: entry.category,
      isPriority: entry.isPriority,
    });
    setModalOpen(true);
  };

  const handleFormChange = (field: keyof FormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.question.trim() || !formData.answer.trim()) return;
    setIsSaving(true);
    try {
      if (modalMode === 'add') {
        const res = await fetch('/api/concierge', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        if (!res.ok) throw new Error();
        const newEntry = await res.json();
        setEntries((prev) => [newEntry, ...prev]);
        showToast('Q&A pair added successfully!', 'success');
      } else if (editingEntry) {
        const res = await fetch(`/api/concierge/${editingEntry.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        if (!res.ok) throw new Error();
        const updated = await res.json();
        setEntries((prev) =>
          prev.map((e) => (e.id === editingEntry.id ? updated : e))
        );
        showToast('Entry updated successfully!', 'success');
      }
      setModalOpen(false);
    } catch {
      showToast('Failed to save entry. Please try again.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteEntry) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/concierge/${deleteEntry.id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error();
      setEntries((prev) => prev.filter((e) => e.id !== deleteEntry.id));
      setDeleteEntry(null);
      showToast('Entry deleted.', 'success');
    } catch {
      showToast('Failed to delete entry.', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="font-sans max-w-7xl mx-auto">
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </AnimatePresence>

      {/* Modals */}
      <QAModal
        isOpen={modalOpen}
        mode={modalMode}
        formData={formData}
        isSaving={isSaving}
        onChange={handleFormChange}
        onSubmit={handleSubmit}
        onClose={() => setModalOpen(false)}
      />
      <DeleteModal
        entry={deleteEntry}
        isDeleting={isDeleting}
        onConfirm={handleDelete}
        onClose={() => setDeleteEntry(null)}
      />

      {/* ── Page Header ──────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-5 mb-8">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2.5">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #ECC8C5, #D9A7A0)' }}
            >
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-serif text-2xl font-semibold text-white">
                AI Knowledge Base
              </h1>
              <p className="text-[11px] text-white/40 uppercase tracking-widest font-medium">
                Hybrid Concierge Control
              </p>
            </div>
          </div>
          <p className="text-sm text-white/50 mt-1 max-w-lg">
            Manage predefined Q&A pairs. Priority entries override the AI model
            when a visitor&apos;s question closely matches.
          </p>
        </div>

        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all cursor-pointer shrink-0 shadow-md"
          style={{
            background: 'linear-gradient(135deg, #D9A7A0 0%, #C58B82 100%)',
            boxShadow: '0 4px 16px rgba(197,139,130,0.35)',
          }}
        >
          <Plus className="w-4 h-4" />
          Add Q&A Pair
        </button>
      </div>

      {/* ── Stats Row ────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Entries" value={entries.length} icon={Database} color="#D9A7A0" />
        <StatCard label="Priority Overrides" value={priorityCount} icon={ShieldCheck} color="#C5A059" />
        <StatCard label="Categories" value={categoryCount} icon={Tag} color="#9CB8A8" />
        <StatCard label="Standard Entries" value={entries.length - priorityCount} icon={MessageSquare} color="#A0B5D9" />
      </div>

      {/* ── Filters & Table ───────────────────────── */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.08)',
          backdropFilter: 'blur(12px)',
        }}
      >
        {/* Filter bar */}
        <div className="px-6 py-4 border-b border-white/[0.06] flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Category pills */}
          <div className="flex flex-wrap gap-2">
            {['All', ...CATEGORIES].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className="px-3.5 py-1.5 rounded-full text-[11px] font-semibold uppercase tracking-wider transition-all cursor-pointer"
                style={
                  activeCategory === cat
                    ? {
                        background: 'rgba(217,167,160,0.20)',
                        border: '1px solid rgba(217,167,160,0.45)',
                        color: '#ECC8C5',
                      }
                    : {
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        color: 'rgba(255,255,255,0.45)',
                      }
                }
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full md:w-72 shrink-0">
            <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              type="text"
              placeholder="Search questions or answers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-[12.5px] text-white/80 placeholder:text-white/25 rounded-xl focus:outline-none transition-all"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'rgba(236,200,197,0.30)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
              }}
            />
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="py-20 flex flex-col items-center gap-3 text-white/30">
            <Loader2 className="w-6 h-6 animate-spin" />
            <p className="text-sm">Loading knowledge base...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 flex flex-col items-center gap-3 text-white/30">
            <Sparkles className="w-8 h-8 opacity-40" />
            <p className="text-sm font-medium">
              {entries.length === 0
                ? 'No entries yet. Add your first Q&A pair!'
                : 'No entries match your filters.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="px-6 py-3.5 text-[10px] font-bold uppercase tracking-widest text-white/30">
                    Question Trigger
                  </th>
                  <th className="px-6 py-3.5 text-[10px] font-bold uppercase tracking-widest text-white/30">
                    Admin Answer
                  </th>
                  <th className="px-6 py-3.5 text-[10px] font-bold uppercase tracking-widest text-white/30 text-center">
                    Priority
                  </th>
                  <th className="px-6 py-3.5 text-[10px] font-bold uppercase tracking-widest text-white/30 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filtered.map((item, idx) => (
                    <motion.tr
                      key={item.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ delay: idx * 0.03 }}
                      className="border-b border-white/[0.04] hover:bg-white/[0.03] transition-colors group"
                    >
                      {/* Question */}
                      <td className="px-6 py-4 w-1/3">
                        <div className="flex flex-col gap-1.5">
                          <span className="text-[13px] font-medium text-white/85 leading-snug">
                            {item.question}
                          </span>
                          <span
                            className="inline-flex w-max items-center px-2 py-0.5 rounded-md text-[9.5px] font-bold uppercase tracking-widest"
                            style={{
                              background: `${CATEGORY_COLORS[item.category] || '#D9A7A0'}18`,
                              color: CATEGORY_COLORS[item.category] || '#D9A7A0',
                              border: `1px solid ${CATEGORY_COLORS[item.category] || '#D9A7A0'}30`,
                            }}
                          >
                            {item.category}
                          </span>
                        </div>
                      </td>

                      {/* Answer */}
                      <td className="px-6 py-4">
                        <p className="text-[13px] text-white/55 leading-relaxed line-clamp-3 max-w-md">
                          {item.answer}
                        </p>
                      </td>

                      {/* Priority */}
                      <td className="px-6 py-4 text-center">
                        {item.isPriority ? (
                          <span
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9.5px] font-bold uppercase tracking-wider"
                            style={{
                              background: 'rgba(197,160,89,0.12)',
                              border: '1px solid rgba(197,160,89,0.28)',
                              color: '#C5A059',
                            }}
                          >
                            <ShieldCheck className="w-3 h-3" />
                            Override AI
                          </span>
                        ) : (
                          <span className="text-[10px] uppercase text-white/25 font-semibold tracking-wider">
                            Standard
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => openEdit(item)}
                            className="p-2 rounded-lg text-white/30 hover:text-[#D9A7A0] hover:bg-[#D9A7A0]/10 transition-all cursor-pointer"
                            title="Edit entry"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteEntry(item)}
                            className="p-2 rounded-lg text-white/30 hover:text-rose-400 hover:bg-rose-400/10 transition-all cursor-pointer"
                            title="Delete entry"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}

        {/* Footer */}
        {!loading && entries.length > 0 && (
          <div className="px-6 py-3.5 border-t border-white/[0.04] flex items-center justify-between">
            <p className="text-[11px] text-white/25">
              Showing {filtered.length} of {entries.length} entries
            </p>
            <div className="flex items-center gap-1.5 text-[11px] text-white/25">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/60" />
              Hybrid System Active
            </div>
          </div>
        )}
      </div>

      {/* ── How It Works section ─────────────────── */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            icon: Database,
            color: '#D9A7A0',
            title: 'Knowledge Base First',
            desc: "When a visitor asks a question, the system checks your Q&A database first. If a close match is found, your admin answer is returned instantly.",
          },
          {
            icon: Brain,
            color: '#C5A059',
            title: 'AI Model Fallback',
            desc: 'If no match is found, the request is sent to OpenAI or Gemini (when configured). The AI responds with personalized beauty advice.',
          },
          {
            icon: Sparkles,
            color: '#9CB8A8',
            title: 'Smart Fallback',
            desc: 'If no AI model is configured, a curated set of intent-based responses ensures visitors always receive helpful, on-brand answers.',
          },
        ].map(({ icon: Icon, color, title, desc }) => (
          <div
            key={title}
            className="rounded-2xl p-5 flex flex-col gap-3"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: `${color}18`, border: `1px solid ${color}28` }}
            >
              <Icon className="w-4.5 h-4.5" style={{ color }} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white/80 mb-1">{title}</h3>
              <p className="text-[12px] text-white/35 leading-relaxed">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
