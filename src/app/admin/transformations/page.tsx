'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Plus,
  Pencil,
  Trash2,
  X,
  Loader2,
  Save,
  Image as ImageIcon,
} from 'lucide-react';
import ConfirmModal from '@/components/ui/ConfirmModal';

const emptyForm = {
  title: '',
  category: 'skin', // skin, hair, makeup
  desc: '',
  beforeImg: '',
  afterImg: '',
  beforeLabel: 'Before',
  afterLabel: 'After',
};

export default function AdminTransformationsPage() {
  const { data: session } = useSession();
  const [transformations, setTransformations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [beforePreview, setBeforePreview] = useState<string | null>(null);
  const [afterPreview, setAfterPreview] = useState<string | null>(null);
  const [uploadingBefore, setUploadingBefore] = useState(false);
  const [uploadingAfter, setUploadingAfter] = useState(false);

  // Custom Confirmation Dialog State
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const fetchTransformations = async () => {
    try {
      const res = await fetch('/api/transformations');
      const data = await res.json();
      if (data.success) setTransformations(data.data);
    } catch (error) {
      console.error('Failed to fetch transformations:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session) fetchTransformations();
  }, [session]);

  const openNewForm = () => {
    setForm(emptyForm);
    setBeforePreview(null);
    setAfterPreview(null);
    setEditingId(null);
    setShowForm(true);
  };

  const openEditForm = (trans: any) => {
    setForm({
      title: trans.title,
      category: trans.category,
      desc: trans.desc,
      beforeImg: trans.beforeImg,
      afterImg: trans.afterImg,
      beforeLabel: trans.beforeLabel || 'Before',
      afterLabel: trans.afterLabel || 'After',
    });
    setBeforePreview(trans.beforeImg);
    setAfterPreview(trans.afterImg);
    setEditingId(trans.id);
    setShowForm(true);
  };

  const uploadImage = async (file: File, type: 'before' | 'after') => {
    const setUploading = type === 'before' ? setUploadingBefore : setUploadingAfter;
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();

      if (!data.success) {
        alert(data.error || 'Failed to upload image');
        return;
      }

      if (type === 'before') {
        setForm((prev) => ({ ...prev, beforeImg: data.url }));
        setBeforePreview(data.url);
      } else {
        setForm((prev) => ({ ...prev, afterImg: data.url }));
        setAfterPreview(data.url);
      }
    } catch (error) {
      console.error('Failed to upload image:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleImageSelect = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'before' | 'after'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file.');
      e.target.value = '';
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    if (type === 'before') setBeforePreview(previewUrl);
    else setAfterPreview(previewUrl);

    uploadImage(file, type);
    e.target.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (uploadingBefore || uploadingAfter) {
      alert('Please wait for images to finish uploading.');
      return;
    }

    if (!form.beforeImg || !form.afterImg) {
      alert('Please upload both before and after images.');
      return;
    }

    setSaving(true);

    try {
      const method = editingId ? 'PUT' : 'POST';
      const body = editingId
        ? { id: editingId, ...form }
        : form;

      const res = await fetch('/api/transformations', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (data.success) {
        await fetchTransformations();
        setShowForm(false);
        setEditingId(null);
        setForm(emptyForm);
        setBeforePreview(null);
        setAfterPreview(null);
      } else {
        alert(data.error || 'Failed to save transformation');
      }
    } catch (error) {
      console.error('Failed to save transformation:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeleting(id);

    try {
      const res = await fetch(`/api/transformations?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setTransformations((prev) => prev.filter((t) => t.id !== id));
        setItemToDelete(null); // Close the confirmation modal
      }
    } catch (error) {
      console.error('Failed to delete transformation:', error);
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
            Before & After Gallery
          </h1>
          <p className="text-white/40 text-sm mt-1">
            Manage public transformation sliders (skincare, hair care, bridal makeup)
          </p>
        </div>
        <button
          onClick={openNewForm}
          className="flex items-center gap-2 bg-brand-rosegold text-brand-charcoal-dark px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-brand-rosegold-dark transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add Transformation
        </button>
      </motion.div>

      {/* Grid */}
      {transformations.length === 0 ? (
        <div className="text-center py-16">
          <Sparkles className="w-12 h-12 text-white/10 mx-auto mb-4" />
          <p className="text-white/30">No transformations added yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {transformations.map((trans, idx) => (
            <motion.div
              key={trans.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              className="group rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4 transition-colors hover:bg-white/[0.05]"
            >
              <div className="flex gap-4">
                <div className="grid h-24 w-28 shrink-0 grid-cols-2 gap-1 overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.04]">
                  <div className="relative overflow-hidden">
                    <img
                      src={trans.beforeImg}
                      alt="Before"
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <span className="absolute bottom-1 left-1 rounded bg-black/60 px-1.5 py-0.5 text-[7px] font-bold uppercase tracking-wider text-white backdrop-blur-sm">
                      {trans.beforeLabel || 'Before'}
                    </span>
                  </div>
                  <div className="relative overflow-hidden">
                    <img
                      src={trans.afterImg}
                      alt="After"
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <span className="absolute bottom-1 right-1 rounded bg-brand-rosegold/90 px-1.5 py-0.5 text-[7px] font-bold uppercase tracking-wider text-brand-charcoal-dark">
                      {trans.afterLabel || 'After'}
                    </span>
                  </div>
                </div>

                <div className="flex min-w-0 flex-1 flex-col justify-between gap-3">
                  <div className="min-w-0 space-y-2">
                    <span className="inline-block rounded-full bg-brand-rosegold/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-brand-rosegold">
                      {trans.category === 'skin'
                        ? 'Skincare'
                        : trans.category === 'hair'
                          ? 'Hair Care'
                          : 'Bridal Makeup'}
                    </span>
                    <div>
                      <h3 className="truncate font-serif text-base font-semibold text-white">
                        {trans.title}
                      </h3>
                      <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-white/40">
                        {trans.desc}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 border-t border-white/[0.06] pt-3">
                    <button
                      onClick={() => openEditForm(trans)}
                      className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-white/[0.05] px-3 py-1.5 text-xs font-medium text-white/60 transition-colors hover:bg-white/[0.08] hover:text-white"
                    >
                      <Pencil className="h-3 w-3" />
                      Edit
                    </button>
                    <button
                      onClick={() => setItemToDelete(trans.id)}
                      disabled={deleting === trans.id}
                      className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-rose-500/10 px-3 py-1.5 text-xs font-medium text-rose-400 transition-colors hover:bg-rose-500/20 disabled:opacity-50"
                    >
                      {deleting === trans.id ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <Trash2 className="h-3 w-3" />
                      )}
                      Remove
                    </button>
                  </div>
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
                  {editingId ? 'Edit Transformation' : 'Add Transformation'}
                </h2>
                <button
                  onClick={() => setShowForm(false)}
                  className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/[0.05] transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                {/* Title */}
                <div>
                  <label className="block text-xs font-medium text-white/50 uppercase tracking-wider mb-2">
                    Transformation Title *
                  </label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    required
                    className="w-full bg-white/[0.05] border border-white/[0.08] text-white px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-brand-rosegold/50 transition-colors"
                    placeholder="e.g. Ash Brown Balayage & Blow-out"
                  />
                </div>

                {/* Category & Description */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-1">
                    <label className="block text-xs font-medium text-white/50 uppercase tracking-wider mb-2">
                      Category *
                    </label>
                    <select
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      required
                      className="w-full bg-brand-charcoal border border-white/[0.08] text-white px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-brand-rosegold/50 transition-colors cursor-pointer"
                    >
                      <option value="skin">Skincare</option>
                      <option value="hair">Hair Care</option>
                      <option value="makeup">Bridal Makeup</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-white/50 uppercase tracking-wider mb-2">
                      Short Description *
                    </label>
                    <input
                      type="text"
                      value={form.desc}
                      onChange={(e) => setForm({ ...form, desc: e.target.value })}
                      required
                      className="w-full bg-white/[0.05] border border-white/[0.08] text-white px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-brand-rosegold/50 transition-colors"
                      placeholder="e.g. Flawless airbrush base with elegant styling details."
                    />
                  </div>
                </div>

                {/* Before Image and Label */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-white/50 uppercase tracking-wider mb-2 flex items-center gap-1">
                      <ImageIcon className="w-3.5 h-3.5" />
                      Before Image *
                    </label>
                    <div className="space-y-3">
                      {beforePreview && (
                        <div className="relative aspect-video w-full max-w-xs overflow-hidden rounded-xl border border-white/[0.08]">
                          <img
                            src={beforePreview}
                            alt="Before preview"
                            className="h-full w-full object-cover"
                          />
                        </div>
                      )}
                      <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-white/[0.15] bg-white/[0.03] px-4 py-3 text-sm text-white/60 transition-colors hover:border-brand-rosegold/40 hover:bg-white/[0.05] hover:text-white/80">
                        {uploadingBefore ? (
                          <Loader2 className="h-4 w-4 animate-spin text-brand-rosegold" />
                        ) : (
                          <ImageIcon className="h-4 w-4" />
                        )}
                        {uploadingBefore
                          ? 'Uploading...'
                          : beforePreview
                            ? 'Replace before image'
                            : 'Choose before image from device'}
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          disabled={uploadingBefore}
                          onChange={(e) => handleImageSelect(e, 'before')}
                        />
                      </label>
                    </div>
                  </div>
                  <div className="md:col-span-1">
                    <label className="block text-xs font-medium text-white/50 uppercase tracking-wider mb-2">
                      Before Label *
                    </label>
                    <input
                      type="text"
                      value={form.beforeLabel}
                      onChange={(e) => setForm({ ...form, beforeLabel: e.target.value })}
                      required
                      className="w-full bg-white/[0.05] border border-white/[0.08] text-white px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-brand-rosegold/50 transition-colors"
                      placeholder="e.g. Dull Skin"
                    />
                  </div>
                </div>

                {/* After Image and Label */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-white/50 uppercase tracking-wider mb-2 flex items-center gap-1">
                      <ImageIcon className="w-3.5 h-3.5 animate-pulse" />
                      After Image *
                    </label>
                    <div className="space-y-3">
                      {afterPreview && (
                        <div className="relative aspect-video w-full max-w-xs overflow-hidden rounded-xl border border-white/[0.08]">
                          <img
                            src={afterPreview}
                            alt="After preview"
                            className="h-full w-full object-cover"
                          />
                        </div>
                      )}
                      <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-white/[0.15] bg-white/[0.03] px-4 py-3 text-sm text-white/60 transition-colors hover:border-brand-rosegold/40 hover:bg-white/[0.05] hover:text-white/80">
                        {uploadingAfter ? (
                          <Loader2 className="h-4 w-4 animate-spin text-brand-rosegold" />
                        ) : (
                          <ImageIcon className="h-4 w-4" />
                        )}
                        {uploadingAfter
                          ? 'Uploading...'
                          : afterPreview
                            ? 'Replace after image'
                            : 'Choose after image from device'}
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          disabled={uploadingAfter}
                          onChange={(e) => handleImageSelect(e, 'after')}
                        />
                      </label>
                    </div>
                  </div>
                  <div className="md:col-span-1">
                    <label className="block text-xs font-medium text-white/50 uppercase tracking-wider mb-2">
                      After Label *
                    </label>
                    <input
                      type="text"
                      value={form.afterLabel}
                      onChange={(e) => setForm({ ...form, afterLabel: e.target.value })}
                      required
                      className="w-full bg-white/[0.05] border border-white/[0.08] text-white px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-brand-rosegold/50 transition-colors"
                      placeholder="e.g. Glass Skin"
                    />
                  </div>
                </div>

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
                    {editingId ? 'Update Transformation' : 'Add Transformation'}
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
        isOpen={itemToDelete !== null}
        title="Remove Transformation?"
        message="Are you sure you want to remove this transformation slider from your public gallery? This action cannot be undone."
        isLoading={deleting === itemToDelete && deleting !== null}
        onConfirm={() => {
          if (itemToDelete) handleDelete(itemToDelete);
        }}
        onCancel={() => setItemToDelete(null)}
      />
    </div>
  );
}
