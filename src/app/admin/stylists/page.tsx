'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Plus,
  Pencil,
  Trash2,
  X,
  Loader2,
  Star,
  Award,
  Save,
  Globe,
} from 'lucide-react';
import ConfirmModal from '@/components/ui/ConfirmModal';

const emptyForm = {
  name: '',
  specialization: '',
  experience: '',
  certifications: '',
  socials: '',
  image: '',
  featured: false,
};

export default function AdminStylistsPage() {
  const { data: session } = useSession();
  const [stylists, setStylists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  
  // Custom Confirmation Dialog State
  const [stylistToDelete, setStylistToDelete] = useState<string | null>(null);

  const fetchStylists = async () => {
    try {
      const res = await fetch('/api/stylists');
      const data = await res.json();
      if (data.success) setStylists(data.data);
    } catch (error) {
      console.error('Failed to fetch stylists:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session) fetchStylists();
  }, [session]);

  const openNewForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
  };

  const openEditForm = (stylist: any) => {
    setForm({
      name: stylist.name,
      specialization: stylist.specialization,
      experience: stylist.experience,
      certifications: stylist.certifications || '',
      socials: stylist.socials || '',
      image: stylist.image,
      featured: stylist.featured,
    });
    setEditingId(stylist.id);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const method = editingId ? 'PUT' : 'POST';
      const body = editingId
        ? { id: editingId, ...form }
        : form;

      const res = await fetch('/api/stylists', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (data.success) {
        await fetchStylists();
        setShowForm(false);
        setEditingId(null);
        setForm(emptyForm);
      } else {
        alert(data.error || 'Failed to save stylist');
      }
    } catch (error) {
      console.error('Failed to save stylist:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeleting(id);

    try {
      const res = await fetch(`/api/stylists?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setStylists((prev) => prev.filter((s) => s.id !== id));
        setStylistToDelete(null); // Close the confirmation modal
      }
    } catch (error) {
      console.error('Failed to delete stylist:', error);
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-brand-rosegold animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="font-serif text-2xl font-semibold text-white">
            Team Specialists
          </h1>
          <p className="text-white/40 text-sm mt-1">
            Manage salon specialists, stylists and therapists
          </p>
        </div>
        <button
          onClick={openNewForm}
          className="flex items-center gap-2 bg-brand-rosegold text-brand-charcoal-dark px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-brand-rosegold-dark transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add Team Member
        </button>
      </motion.div>

      {/* Stylists Grid */}
      {stylists.length === 0 ? (
        <div className="text-center py-16">
          <Users className="w-12 h-12 text-white/10 mx-auto mb-4" />
          <p className="text-white/30">No team members yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stylists.map((stylist, idx) => (
            <motion.div
              key={stylist.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              className="bg-white/[0.03] rounded-2xl border border-white/[0.06] overflow-hidden group flex flex-col justify-between"
            >
              <div>
                {/* Image */}
                <div className="relative aspect-[3/2] overflow-hidden bg-white/[0.02]">
                  <img
                    src={stylist.image}
                    alt={stylist.name}
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                  />
                  {stylist.featured && (
                    <div className="absolute top-3 left-3 flex items-center gap-1 bg-brand-gold/90 text-brand-charcoal-dark text-[9px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full">
                      <Star className="w-3 h-3" />
                      Featured
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-5 space-y-3">
                  <div>
                    <h3 className="text-white font-serif text-base font-semibold">
                      {stylist.name}
                    </h3>
                    <p className="text-brand-rosegold text-xs font-semibold mt-0.5">
                      {stylist.specialization}
                    </p>
                  </div>

                  <div className="space-y-1.5 text-xs text-white/60">
                    <div className="flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-brand-gold shrink-0" />
                      <span>{stylist.experience} Experience</span>
                    </div>
                    {stylist.certifications && (
                      <p className="line-clamp-2 leading-relaxed text-[11px] text-white/40">
                        <strong>Certs:</strong> {stylist.certifications}
                      </p>
                    )}
                    {stylist.socials && (
                      <p className="line-clamp-1 text-[11px] text-white/40 flex items-center gap-1">
                        <Globe className="w-3 h-3 text-white/30" />
                        <span>{stylist.socials}</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="p-5 pt-0">
                <div className="flex items-center gap-2 pt-3 border-t border-white/[0.06]">
                  <button
                    onClick={() => openEditForm(stylist)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.05] text-white/60 hover:text-white hover:bg-white/[0.08] transition-colors text-xs font-medium cursor-pointer"
                  >
                    <Pencil className="w-3 h-3" />
                    Edit
                  </button>
                  <button
                    onClick={() => setStylistToDelete(stylist.id)}
                    disabled={deleting === stylist.id}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-colors text-xs font-medium cursor-pointer disabled:opacity-50"
                  >
                    {deleting === stylist.id ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <Trash2 className="w-3 h-3" />
                    )}
                    Remove
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-brand-charcoal w-full max-w-2xl rounded-2xl border border-white/[0.08] max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between p-6 border-b border-white/[0.06]">
                <h2 className="font-serif text-lg font-semibold text-white">
                  {editingId ? 'Edit Team Member' : 'Add Team Member'}
                </h2>
                <button
                  onClick={() => setShowForm(false)}
                  className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/[0.05] transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                {/* Name */}
                <div>
                  <label className="block text-xs font-medium text-white/50 uppercase tracking-wider mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                    className="w-full bg-white/[0.05] border border-white/[0.08] text-white px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-brand-rosegold/50 transition-colors"
                    placeholder="e.g. Kelsang Dolma"
                  />
                </div>

                {/* Specialization & Experience */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-white/50 uppercase tracking-wider mb-2">
                      Specialization *
                    </label>
                    <input
                      type="text"
                      value={form.specialization}
                      onChange={(e) =>
                        setForm({ ...form, specialization: e.target.value })
                      }
                      required
                      className="w-full bg-white/[0.05] border border-white/[0.08] text-white px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-brand-rosegold/50 transition-colors"
                      placeholder="e.g. Korean Glass Skin, Micro-needling"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-white/50 uppercase tracking-wider mb-2">
                      Experience (e.g. 8+ Years) *
                    </label>
                    <input
                      type="text"
                      value={form.experience}
                      onChange={(e) =>
                        setForm({ ...form, experience: e.target.value })
                      }
                      required
                      className="w-full bg-white/[0.05] border border-white/[0.08] text-white px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-brand-rosegold/50 transition-colors"
                      placeholder="e.g. 8+ Years"
                    />
                  </div>
                </div>

                {/* Certifications */}
                <div>
                  <label className="block text-xs font-medium text-white/50 uppercase tracking-wider mb-2">
                    Certifications (comma separated) *
                  </label>
                  <input
                    type="text"
                    value={form.certifications}
                    onChange={(e) =>
                      setForm({ ...form, certifications: e.target.value })
                    }
                    required
                    className="w-full bg-white/[0.05] border border-white/[0.08] text-white px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-brand-rosegold/50 transition-colors"
                    placeholder="e.g. CIDESCO Diploma, Korean Skin Academy Cert"
                  />
                </div>

                {/* Social Links */}
                <div>
                  <label className="block text-xs font-medium text-white/50 uppercase tracking-wider mb-2">
                    Socials (comma separated, e.g. instagram:url,facebook:url)
                  </label>
                  <input
                    type="text"
                    value={form.socials}
                    onChange={(e) =>
                      setForm({ ...form, socials: e.target.value })
                    }
                    className="w-full bg-white/[0.05] border border-white/[0.08] text-white px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-brand-rosegold/50 transition-colors"
                    placeholder="e.g. instagram:https://instagram.com/user,facebook:https://facebook.com/user"
                  />
                </div>

                {/* Image URL */}
                <div>
                  <label className="block text-xs font-medium text-white/50 uppercase tracking-wider mb-2">
                    Image URL *
                  </label>
                  <input
                    type="url"
                    value={form.image}
                    onChange={(e) => setForm({ ...form, image: e.target.value })}
                    required
                    className="w-full bg-white/[0.05] border border-white/[0.08] text-white px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-brand-rosegold/50 transition-colors"
                    placeholder="https://images.unsplash.com/..."
                  />
                </div>

                {/* Featured toggle */}
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(e) =>
                      setForm({ ...form, featured: e.target.checked })
                    }
                    className="w-4 h-4 rounded border-white/20 bg-white/5 text-brand-rosegold focus:ring-brand-rosegold cursor-pointer"
                  />
                  <span className="text-sm text-white/60">
                    Featured on homepage team slider
                  </span>
                </label>

                {/* Submit */}
                <div className="flex items-center gap-3 pt-4 border-t border-white/[0.06]">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center gap-2 bg-brand-rosegold text-brand-charcoal-dark px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-brand-rosegold-dark transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {saving ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    {editingId ? 'Update Team Member' : 'Add Team Member'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-6 py-2.5 rounded-xl text-sm font-medium text-white/40 hover:text-white/60 hover:bg-white/[0.04] transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dynamic Confirmation Dialog Modal */}
      <ConfirmModal
        isOpen={stylistToDelete !== null}
        title="Remove Team Member?"
        message="Are you sure you want to remove this team member? This action cannot be undone."
        isLoading={deleting === stylistToDelete && deleting !== null}
        onConfirm={() => {
          if (stylistToDelete) handleDelete(stylistToDelete);
        }}
        onCancel={() => setStylistToDelete(null)}
      />
    </div>
  );
}
