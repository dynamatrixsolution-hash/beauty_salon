'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail,
  Copy,
  Check,
  Search,
  Loader2,
  Calendar,
  Sparkles,
  Inbox,
  UserCheck,
  Send,
  X,
  FileText,
  Settings,
  Plus,
  Trash2,
  Save,
  ChevronRight
} from 'lucide-react';

export default function AdminSubscribersPage() {
  const { data: session } = useSession();
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedSingle, setCopiedSingle] = useState<string | null>(null);

  // Dynamic Templates States
  const [templates, setTemplates] = useState<any[]>([]);
  const [loadingTemplates, setLoadingTemplates] = useState(true);

  // Email Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [targetEmail, setTargetEmail] = useState<'all' | string>('all');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [activeTemplate, setActiveTemplate] = useState('');

  // Visual Template Manager States
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [editingTemplates, setEditingTemplates] = useState<any[]>([]);
  const [selectedEditTemplateId, setSelectedEditTemplateId] = useState<string>('');
  const [isSavingTemplates, setIsSavingTemplates] = useState(false);

  // 1. Fetch Subscribers
  const fetchSubscribers = async () => {
    try {
      const res = await fetch('/api/subscribers');
      const data = await res.json();
      if (data.success) {
        setSubscribers(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch subscribers:', error);
    } finally {
      setLoading(false);
    }
  };

  // 2. Fetch Templates dynamically from database/file store
  const fetchTemplates = async () => {
    try {
      const res = await fetch('/api/subscribers/templates');
      const data = await res.json();
      if (data.success && data.data.length > 0) {
        setTemplates(data.data);
        setActiveTemplate(data.data[0].id);
      }
    } catch (error) {
      console.error('Failed to fetch email templates:', error);
    } finally {
      setLoadingTemplates(false);
    }
  };

  useEffect(() => {
    if (session) {
      fetchSubscribers();
      fetchTemplates();
    }
  }, [session]);

  const handleCopyAll = () => {
    if (subscribers.length === 0) return;
    const emails = subscribers.map((s) => s.customerEmail).join(', ');
    navigator.clipboard.writeText(emails);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const handleCopySingle = (email: string) => {
    navigator.clipboard.writeText(email);
    setCopiedSingle(email);
    setTimeout(() => setCopiedSingle(null), 2000);
  };

  // Open email composer modal
  const openComposeModal = (target: 'all' | string) => {
    setTargetEmail(target);
    setIsModalOpen(true);
    // Load default selected template values from state
    if (templates.length > 0) {
      const defaultTemplate = templates.find((t) => t.id === activeTemplate) || templates[0];
      setSubject(defaultTemplate.subject);
      setBody(defaultTemplate.body);
      setActiveTemplate(defaultTemplate.id);
    } else {
      setSubject('');
      setBody('');
    }
  };

  // Handle template selection change in composer
  const handleTemplateChange = (templateId: string) => {
    setActiveTemplate(templateId);
    const selected = templates.find((t) => t.id === templateId);
    if (selected) {
      setSubject(selected.subject);
      setBody(selected.body);
    }
  };

  // Launch local email client pre-filled (BCC if "all" to preserve strict GDPR privacy)
  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (targetEmail === 'all') {
      const bccList = subscribers.map((s) => s.customerEmail).join(',');
      const mailtoUrl = `mailto:?bcc=${encodeURIComponent(bccList)}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.open(mailtoUrl);
    } else {
      const mailtoUrl = `mailto:${targetEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.open(mailtoUrl);
    }
    
    setIsModalOpen(false);
  };

  // ─── VISUAL TEMPLATE MANAGER ACTIONS ───────────────────────────────────────
  
  // Open dynamic visual editor
  const openManageModal = () => {
    const cloned = JSON.parse(JSON.stringify(templates));
    setEditingTemplates(cloned);
    if (cloned.length > 0) {
      setSelectedEditTemplateId(cloned[0].id);
    } else {
      setSelectedEditTemplateId('');
    }
    setIsManageModalOpen(true);
  };

  // Select a template inside the editor
  const selectEditTemplate = (id: string) => {
    setSelectedEditTemplateId(id);
  };

  // Update field of the active template being edited
  const updateEditTemplateField = (field: 'name' | 'subject' | 'body', value: string) => {
    setEditingTemplates((prev) =>
      prev.map((t) => (t.id === selectedEditTemplateId ? { ...t, [field]: value } : t))
    );
  };

  // Visually add a brand new template
  const handleAddTemplate = () => {
    const newId = `template_${Date.now()}`;
    const newTpl = {
      id: newId,
      name: '✨ New Custom Offer',
      subject: 'Special Offer from Glow & Grace Studio! 💖',
      body: `Dear Valued Guest,\n\nWe are delighted to bring you a brand new pampering experience...\n\nWarmest regards,\nThe Glow & Grace Team`
    };

    setEditingTemplates((prev) => [...prev, newTpl]);
    setSelectedEditTemplateId(newId);
  };

  // Visually delete a template
  const handleDeleteTemplate = (id: string) => {
    const filteredTpls = editingTemplates.filter((t) => t.id !== id);
    setEditingTemplates(filteredTpls);
    if (filteredTpls.length > 0) {
      setSelectedEditTemplateId(filteredTpls[0].id);
    } else {
      setSelectedEditTemplateId('');
    }
  };

  // Save changes back to server JSON store
  const handleSaveTemplates = async () => {
    setIsSavingTemplates(true);
    try {
      const res = await fetch('/api/subscribers/templates', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ templates: editingTemplates }),
      });
      const data = await res.json();
      if (data.success) {
        setTemplates(data.data);
        if (data.data.length > 0) {
          setActiveTemplate(data.data[0].id);
        }
        setIsManageModalOpen(false);
      } else {
        alert('Failed to save templates: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Failed to save templates:', error);
      alert('Network error saving templates');
    } finally {
      setIsSavingTemplates(false);
    }
  };

  const filtered = subscribers.filter((s) =>
    s.customerEmail.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Stats Calculations
  const totalSubscribers = subscribers.length;
  const newThisWeek = subscribers.filter((s) => {
    const subscribedDate = new Date(s.createdAt);
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    return subscribedDate >= oneWeekAgo;
  }).length;

  const currentEditTemplate = editingTemplates.find((t) => t.id === selectedEditTemplateId);

  if (loading || loadingTemplates) {
    return (
      <div className="flex items-center justify-center py-28">
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
          <h1 className="text-2xl font-semibold text-white font-sans">
            Subscribers List
          </h1>
          <p className="text-white/40 text-sm mt-1 font-sans">
            Manage your Glow & Grace exclusive circle subscribers and seasonal offer leads.
          </p>
        </div>
        
        {totalSubscribers > 0 && (
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {/* Visual Templates Manager Button */}
            <button
              onClick={openManageModal}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/[0.08] hover:border-brand-rosegold/30 text-white/60 hover:text-white hover:bg-white/[0.04] font-semibold text-xs tracking-wider uppercase transition-all duration-300 cursor-pointer shadow-sm"
              title="Manage Email Templates"
            >
              <Settings className="w-4 h-4 text-brand-rosegold" />
              Manage Templates
            </button>

            <button
              onClick={() => openComposeModal('all')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/[0.08] text-white/60 hover:text-white hover:bg-white/[0.04] font-semibold text-xs tracking-wider uppercase transition-all duration-300 cursor-pointer shadow-sm"
            >
              <Send className="w-4 h-4 text-brand-rosegold" />
              Send Campaign
            </button>
            
            <button
              onClick={handleCopyAll}
              className="flex items-center gap-2 px-4.5 py-2.5 rounded-xl bg-gradient-to-r from-brand-pink-accent to-brand-rosegold text-brand-charcoal-dark font-semibold text-xs tracking-wider uppercase transition-all duration-300 hover:scale-[1.02] cursor-pointer shadow-lg shadow-brand-rosegold/10"
            >
              {copiedAll ? (
                <>
                  <Check className="w-4 h-4" />
                  Copied Comma List!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy All Emails
                </>
              )}
            </button>
          </div>
        )}
      </motion.div>

      {/* Stats Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/[0.06] rounded-2xl p-5 flex items-center justify-between"
        >
          <div>
            <span className="text-[10px] text-white/40 font-bold uppercase tracking-wider font-sans">
              Total Active Subscribers
            </span>
            <h2 className="text-3xl font-bold text-white mt-1.5 font-sans">
              {totalSubscribers}
            </h2>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-brand-rosegold/10 border border-brand-rosegold/20 text-brand-rosegold flex items-center justify-center">
            <Mail className="w-5 h-5" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/[0.06] rounded-2xl p-5 flex items-center justify-between"
        >
          <div>
            <span className="text-[10px] text-white/40 font-bold uppercase tracking-wider font-sans">
              New This Week (Last 7 Days)
            </span>
            <h2 className="text-3xl font-bold text-white mt-1.5 font-sans">
              +{newThisWeek}
            </h2>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <UserCheck className="w-5 h-5" />
          </div>
        </motion.div>
      </div>

      {/* Search & Main List Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
        className="bg-white/[0.03] border border-white/[0.06] rounded-2xl overflow-hidden shadow-xl"
      >
        {/* Search header */}
        <div className="p-5 border-b border-white/[0.06] flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              type="text"
              placeholder="Search by email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/[0.04] border border-white/[0.08] text-white placeholder-white/30 pl-10 pr-4 py-2.5 rounded-xl text-sm font-sans focus:outline-none focus:border-brand-rosegold/40 transition-colors"
            />
          </div>

          <div className="text-xs text-white/40 font-sans tracking-wide self-end sm:self-center">
            Showing {filtered.length} of {totalSubscribers} subscribers
          </div>
        </div>

        {/* Content list */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <Inbox className="w-12 h-12 text-white/10 mx-auto mb-4" />
            <p className="text-white/30 text-sm font-sans">
              {searchQuery ? 'No matching subscribers found' : 'No subscribers in the list yet'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/[0.06] bg-white/[0.01]">
                  <th className="p-4 pl-6 text-[10px] font-bold text-white/40 uppercase tracking-widest font-sans">Email Address</th>
                  <th className="p-4 text-[10px] font-bold text-white/40 uppercase tracking-widest font-sans">Date Subscribed</th>
                  <th className="p-4 text-[10px] font-bold text-white/40 uppercase tracking-widest font-sans">Details</th>
                  <th className="p-4 pr-6 text-right text-[10px] font-bold text-white/40 uppercase tracking-widest font-sans">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {filtered.map((sub) => (
                  <tr key={sub.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-white/[0.04] text-white/40 group-hover:bg-brand-rosegold/10 group-hover:text-brand-rosegold flex items-center justify-center transition-colors">
                          <Mail className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-sm font-medium text-white/85 font-sans">
                          {sub.customerEmail}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5 text-xs text-white/50 font-sans">
                        <Calendar className="w-3.5 h-3.5 text-white/20" />
                        {new Date(sub.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </td>
                    <td className="p-4 text-xs text-white/40 font-sans max-w-[240px] truncate">
                      {sub.details || 'Newsletter Sign-up'}
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openComposeModal(sub.customerEmail)}
                          className="p-2 rounded-lg bg-white/[0.03] hover:bg-brand-rosegold/15 border border-white/[0.05] text-white/50 hover:text-brand-rosegold transition-all cursor-pointer inline-flex items-center justify-center"
                          title="Compose Custom Email"
                        >
                          <Send className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleCopySingle(sub.customerEmail)}
                          className="p-2 rounded-lg bg-white/[0.03] hover:bg-brand-rosegold/15 border border-white/[0.05] text-white/50 hover:text-brand-rosegold transition-all cursor-pointer inline-flex items-center justify-center"
                          title="Copy Email Address"
                        >
                          {copiedSingle === sub.customerEmail ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* ─── EMAIL TEMPLATE COMPOSER MODAL ────────────────────────────────────── */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
            {/* Click-out to close */}
            <div className="absolute inset-0" onClick={() => setIsModalOpen(false)} />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-brand-charcoal-dark border border-white/[0.08] rounded-3xl overflow-hidden shadow-2xl z-10 font-sans"
            >
              {/* Header */}
              <div className="px-6 py-5 border-b border-white/[0.06] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-brand-rosegold" />
                  <h3 className="text-lg font-semibold text-white">
                    {targetEmail === 'all' ? 'Compose Campaign to All Subscribers' : 'Compose Email to Subscriber'}
                  </h3>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 rounded-full bg-white/[0.03] text-white/50 hover:text-white hover:bg-white/[0.08] transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSendEmail} className="p-6 space-y-4">
                {/* Recipient */}
                <div>
                  <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">
                    Recipients
                  </label>
                  <input
                    type="text"
                    disabled
                    value={targetEmail === 'all' ? `All Active Subscribers (${totalSubscribers} emails via BCC to preserve privacy)` : targetEmail}
                    className="w-full bg-white/[0.02] border border-white/[0.05] text-white/40 px-4 py-3 rounded-xl text-sm font-sans"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Select Template */}
                  <div>
                    <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-brand-rosegold" />
                      Select Offer Template
                    </label>
                    <select
                      value={activeTemplate}
                      onChange={(e) => handleTemplateChange(e.target.value)}
                      className="w-full bg-brand-charcoal border border-white/[0.08] text-white rounded-xl text-sm py-2.5 px-3.5 focus:outline-none focus:border-brand-rosegold/50 focus:ring-1 focus:ring-brand-rosegold/20 cursor-pointer"
                    >
                      {templates.map((tpl) => (
                        <option key={tpl.id} value={tpl.id} className="bg-brand-charcoal">
                          {tpl.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Subject */}
                  <div>
                    <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">
                      Email Subject
                    </label>
                    <input
                      type="text"
                      required
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="Enter subject line..."
                      className="w-full bg-white/[0.04] border border-white/[0.08] text-white px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-brand-rosegold/50 transition-colors"
                    />
                  </div>
                </div>

                {/* Message Body */}
                <div>
                  <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">
                    Message Content
                  </label>
                  <textarea
                    required
                    rows={8}
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder="Type your exclusive email offer here..."
                    className="w-full bg-white/[0.04] border border-white/[0.08] text-white p-4 rounded-xl text-sm focus:outline-none focus:border-brand-rosegold/50 transition-colors font-sans resize-none leading-relaxed"
                  />
                </div>

                {/* Bottom Actions */}
                <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between gap-4">
                  <div className="text-[11px] text-white/30 max-w-md font-sans">
                    ✨ Clicking send will generate and open a pre-filled message inside your default desktop email client (Outlook, Gmail, Apple Mail) immediately.
                  </div>
                  <div className="flex gap-2.5">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-5 py-2.5 rounded-xl border border-white/[0.08] text-white/60 hover:text-white hover:bg-white/[0.04] text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-pink-accent to-brand-rosegold text-brand-charcoal-dark font-bold text-xs uppercase tracking-wider transition-all duration-300 hover:scale-[1.02] cursor-pointer shadow-lg shadow-brand-rosegold/10"
                    >
                      <Send className="w-3.5 h-3.5" />
                      Send via Client
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── DYNAMIC VISUAL TEMPLATE MANAGER MODAL ──────────────────────────────── */}
      <AnimatePresence>
        {isManageModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
            {/* Click-out to close */}
            <div className="absolute inset-0" onClick={() => setIsManageModalOpen(false)} />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl h-[85vh] bg-brand-charcoal-dark border border-white/[0.08] rounded-3xl overflow-hidden shadow-2xl z-10 flex flex-col font-sans"
            >
              {/* Header */}
              <div className="px-6 py-5 border-b border-white/[0.06] flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2.5">
                  <Settings className="w-5 h-5 text-brand-rosegold animate-spin-slow" />
                  <div>
                    <h3 className="text-lg font-semibold text-white leading-none">
                      Visual Email Templates Manager
                    </h3>
                    <span className="text-[10px] text-white/30 uppercase tracking-widest mt-1 block">
                      Create, Edit & Save Your Dynamic Offers Visual CMS
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setIsManageModalOpen(false)}
                  className="p-1.5 rounded-full bg-white/[0.03] text-white/50 hover:text-white hover:bg-white/[0.08] transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Two Panel Dynamic Content Area */}
              <div className="flex-1 flex overflow-hidden min-h-0 divide-x divide-white/[0.06]">
                {/* Left Panel: List of Templates */}
                <div className="w-[280px] shrink-0 flex flex-col bg-white/[0.01] p-4 min-h-0 overflow-y-auto">
                  <div className="flex items-center justify-between mb-4 shrink-0">
                    <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
                      My Templates ({editingTemplates.length})
                    </span>
                    <button
                      type="button"
                      onClick={handleAddTemplate}
                      className="flex items-center gap-1 px-2.5 py-1.5 bg-brand-rosegold/10 border border-brand-rosegold/20 text-brand-rosegold hover:bg-brand-rosegold/20 transition-all rounded-lg text-[10px] font-bold uppercase tracking-wider cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      Add New
                    </button>
                  </div>

                  {editingTemplates.length === 0 ? (
                    <div className="text-center py-10 flex-1 flex flex-col justify-center">
                      <FileText className="w-8 h-8 text-white/10 mx-auto mb-2" />
                      <p className="text-[11px] text-white/30">No templates. Click add new above!</p>
                    </div>
                  ) : (
                    <div className="space-y-2 flex-1 overflow-y-auto pr-1">
                      {editingTemplates.map((tpl) => (
                        <button
                          key={tpl.id}
                          type="button"
                          onClick={() => selectEditTemplate(tpl.id)}
                          className={`w-full p-3 rounded-xl text-left border flex items-center justify-between transition-all group ${
                            selectedEditTemplateId === tpl.id
                              ? 'bg-brand-rosegold/15 text-brand-rosegold border-brand-rosegold/25 shadow-md'
                              : 'bg-white/[0.02] border-transparent text-white/60 hover:text-white hover:bg-white/[0.04]'
                          }`}
                        >
                          <div className="min-w-0 flex-1 pr-2">
                            <p className="text-xs font-semibold truncate leading-tight">
                              {tpl.name}
                            </p>
                            <p className="text-[10px] text-white/35 truncate mt-1">
                              Sub: {tpl.subject}
                            </p>
                          </div>
                          <ChevronRight className={`w-3.5 h-3.5 shrink-0 transition-transform ${
                            selectedEditTemplateId === tpl.id ? 'translate-x-0.5 text-brand-rosegold' : 'text-white/20 group-hover:text-white/40'
                          }`} />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Right Panel: Template Sizing Editor */}
                <div className="flex-1 p-6 flex flex-col gap-4 overflow-y-auto bg-brand-charcoal-dark/45 min-h-0">
                  {currentEditTemplate ? (
                    <div className="space-y-4 flex-1 flex flex-col">
                      {/* Name & Actions Header */}
                      <div className="flex items-center justify-between gap-4 border-b border-white/[0.06] pb-3 shrink-0">
                        <div>
                          <h4 className="text-sm font-semibold text-white">Edit Template Details</h4>
                          <p className="text-[10px] text-white/30 uppercase mt-0.5 font-sans">
                            TEMPLATE ID: {currentEditTemplate.id}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeleteTemplate(currentEditTemplate.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/25 transition-all text-xs font-medium cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Delete Template
                        </button>
                      </div>

                      {/* Editing Fields */}
                      <div className="space-y-4 flex-1 flex flex-col min-h-0">
                        {/* Name */}
                        <div className="shrink-0">
                          <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2">
                            Template Display Name
                          </label>
                          <input
                            type="text"
                            required
                            value={currentEditTemplate.name}
                            onChange={(e) => updateEditTemplateField('name', e.target.value)}
                            placeholder="e.g. 🎉 Seasonal Festive Offer (15% Off)"
                            className="w-full bg-white/[0.04] border border-white/[0.08] text-white px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-brand-rosegold/50 transition-colors"
                          />
                        </div>

                        {/* Subject */}
                        <div className="shrink-0">
                          <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2">
                            Default Subject Line
                          </label>
                          <input
                            type="text"
                            required
                            value={currentEditTemplate.subject}
                            onChange={(e) => updateEditTemplateField('subject', e.target.value)}
                            placeholder="e.g. Exclusive Festive Offer from Glow & Grace Studio! ✨"
                            className="w-full bg-white/[0.04] border border-white/[0.08] text-white px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-brand-rosegold/50 transition-colors"
                          />
                        </div>

                        {/* Body Textarea */}
                        <div className="flex-1 flex flex-col min-h-0">
                          <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2 shrink-0">
                            Email Body (Comports Newlines)
                          </label>
                          <textarea
                            required
                            value={currentEditTemplate.body}
                            onChange={(e) => updateEditTemplateField('body', e.target.value)}
                            placeholder="Write your email body copy..."
                            className="w-full flex-1 bg-white/[0.04] border border-white/[0.08] text-white p-4 rounded-xl text-sm focus:outline-none focus:border-brand-rosegold/50 transition-colors font-sans resize-none leading-relaxed min-h-[220px]"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center">
                      <Inbox className="w-16 h-16 text-white/10 mb-4 animate-bounce-slow" />
                      <h4 className="text-white text-base font-semibold">No Template Selected</h4>
                      <p className="text-xs text-white/30 mt-1 max-w-sm">
                        Create a template on the left panel or select an existing one to configure its layout visually.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-5 border-t border-white/[0.06] flex items-center justify-between shrink-0">
                <div className="text-[10px] text-white/30 font-sans max-w-lg">
                  💡 Editing these templates will save them globally into your admin settings. They will instantly load inside the campaign dropdown menu, allowing code-free promotions.
                </div>
                <div className="flex gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsManageModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl border border-white/[0.08] text-white/60 hover:text-white hover:bg-white/[0.04] text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveTemplates}
                    disabled={isSavingTemplates}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-pink-accent to-brand-rosegold text-brand-charcoal-dark font-bold text-xs uppercase tracking-wider transition-all duration-300 hover:scale-[1.02] cursor-pointer shadow-lg shadow-brand-rosegold/10 disabled:opacity-50"
                  >
                    {isSavingTemplates ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        Saving CMS...
                      </>
                    ) : (
                      <>
                        <Save className="w-3.5 h-3.5" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
