'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Loader2, Plus, Trash2, Scissors, Sparkles } from 'lucide-react';
import ImageUploadField from '@/components/admin/ImageUploadField';

interface Category {
  id: string;
  name: string;
}

type ServiceFaq = {
  question: string;
  answer: string;
};

function serializeFaqs(faqs: ServiceFaq[]) {
  return JSON.stringify(
    faqs
      .map((faq) => ({
        question: faq.question.trim(),
        answer: faq.answer.trim(),
      }))
      .filter((faq) => faq.question && faq.answer)
  );
}

export default function NewServicePage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCats, setLoadingCats] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form fields
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [duration, setDuration] = useState('');
  const [pricing, setPricing] = useState('');
  const [description, setDescription] = useState('');
  const [benefits, setBenefits] = useState('');
  const [image, setImage] = useState('');
  const [featured, setFeatured] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [tags, setTags] = useState('');
  const [faqs, setFaqs] = useState<ServiceFaq[]>([]);

  // Fetch categories on mount
  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch('/api/categories');
        const data = await res.json();
        if (data.success) {
          setCategories(data.data);
          if (data.data.length > 0) {
            setCategoryId(data.data[0].id);
          }
        }
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      } finally {
        setLoadingCats(false);
      }
    }
    fetchCategories();
  }, []);

  const handleAddFaq = () => {
    setFaqs([...faqs, { question: '', answer: '' }]);
  };

  const handleUpdateFaq = (index: number, key: 'question' | 'answer', val: string) => {
    setFaqs(prev => prev.map((faq, i) => i === index ? { ...faq, [key]: val } : faq));
  };

  const handleRemoveFaq = (index: number) => {
    setFaqs(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryId) {
      setError('Please select a category.');
      return;
    }
    if (!image) {
      setError('Please upload a service image.');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const payload = {
        title,
        categoryId,
        duration: parseInt(duration) || 0,
        pricing: pricing ? parseFloat(pricing) : 0,
        description,
        benefits,
        image,
        beforeAfterImage: null,
        featured,
        isActive,
        tags: tags.split(',').map(t => t.trim()).filter(Boolean),
        faqs: serializeFaqs(faqs),
      };

      const res = await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        router.push('/admin/services');
        router.refresh();
      } else {
        setError(data.error || 'Failed to create service.');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.push('/admin/services')}
          className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Services</span>
        </button>
        <h1 className="font-serif text-xl text-white flex items-center gap-2">
          <Scissors className="w-5 h-5 text-brand-rosegold" />
          Create New Service
        </h1>
      </div>

      {error && (
        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-xl text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Core details card */}
        <div className="bg-brand-charcoal/50 rounded-2xl border border-white/[0.04] p-6 space-y-4">
          <h2 className="text-white font-medium text-base border-b border-white/[0.06] pb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-brand-rosegold" /> General Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-white/50 mb-2 font-medium">Service Title *</label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
                placeholder="e.g., Hydra Facial"
                className="w-full bg-white/5 border border-white/10 text-white px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-brand-rosegold/40"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-white/50 mb-2 font-medium">Category *</label>
              {loadingCats ? (
                <div className="h-10 w-full bg-white/5 animate-pulse rounded-xl" />
              ) : (
                <select
                  value={categoryId}
                  onChange={e => setCategoryId(e.target.value)}
                  required
                  className="w-full bg-white/5 border border-white/10 text-white px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-brand-rosegold/40"
                >
                  {categories.map(c => (
                    <option key={c.id} value={c.id} className="bg-brand-charcoal">
                      {c.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-white/50 mb-2 font-medium">Duration (minutes) *</label>
              <input
                type="number"
                value={duration}
                onChange={e => setDuration(e.target.value)}
                required
                placeholder="e.g., 30, 60, 90"
                className="w-full bg-white/5 border border-white/10 text-white px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-brand-rosegold/40"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-white/50 mb-2 font-medium">Price (NPR) – Optional</label>
              <input
                type="number"
                value={pricing}
                onChange={e => setPricing(e.target.value)}
                placeholder="Leave empty if price varies"
                className="w-full bg-white/5 border border-white/10 text-white px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-brand-rosegold/40"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-white/50 mb-2 font-medium">Description *</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              required
              rows={4}
              placeholder="Describe the service in detail..."
              className="w-full bg-white/5 border border-white/10 text-white px-4 py-2.5 rounded-xl text-sm resize-none focus:outline-none focus:border-brand-rosegold/40"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-white/50 mb-2 font-medium">Benefits (one per line)</label>
            <textarea
              value={benefits}
              onChange={e => setBenefits(e.target.value)}
              rows={4}
              placeholder="Deep cleansing and hydration&#10;Improves skin texture&#10;Visible glow after first session"
              className="w-full bg-white/5 border border-white/10 text-white px-4 py-2.5 rounded-xl text-sm resize-none focus:outline-none focus:border-brand-rosegold/40"
            />
          </div>
        </div>

        {/* Image card */}
        <div className="bg-brand-charcoal/50 rounded-2xl border border-white/[0.04] p-6 space-y-6">
          <h2 className="text-white font-medium text-base border-b border-white/[0.06] pb-3">Service Image</h2>
          <ImageUploadField
            label="Service Image"
            value={image}
            onChange={setImage}
            required
            chooseLabel="Choose service image"
          />
        </div>

        {/* FAQs card */}
        <div className="bg-brand-charcoal/50 rounded-2xl border border-white/[0.04] p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
            <h2 className="text-white font-medium text-base">Frequently Asked Questions</h2>
            <button
              type="button"
              onClick={handleAddFaq}
              className="flex items-center gap-1.5 text-xs text-brand-rosegold hover:text-brand-rosegold/80 font-medium"
            >
              <Plus className="w-3.5 h-3.5" /> Add FAQ
            </button>
          </div>

          {faqs.length === 0 ? (
            <p className="text-white/30 text-sm text-center py-4">No FAQs added yet. Click &quot;Add FAQ&quot; to define questions and answers.</p>
          ) : (
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="flex gap-4 p-4 bg-white/[0.02] border border-white/[0.06] rounded-xl relative group">
                  <div className="flex-1 space-y-3">
                    <div>
                      <input
                        type="text"
                        value={faq.question}
                        onChange={e => handleUpdateFaq(index, 'question', e.target.value)}
                        placeholder="Question"
                        className="w-full bg-white/5 border border-white/10 text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-brand-rosegold/40"
                      />
                    </div>
                    <div>
                      <textarea
                        value={faq.answer}
                        onChange={e => handleUpdateFaq(index, 'answer', e.target.value)}
                        rows={2}
                        placeholder="Answer"
                        className="w-full bg-white/5 border border-white/10 text-white px-3 py-2 rounded-lg text-sm resize-none focus:outline-none focus:border-brand-rosegold/40"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveFaq(index)}
                    className="self-start p-1.5 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Extra configuration & tags */}
        <div className="bg-brand-charcoal/50 rounded-2xl border border-white/[0.04] p-6 space-y-4">
          <h2 className="text-white font-medium text-base border-b border-white/[0.06] pb-3">Settings & Tags</h2>
          <div>
            <label className="block text-xs uppercase tracking-wider text-white/50 mb-2 font-medium">Tags (comma-separated)</label>
            <input
              type="text"
              value={tags}
              onChange={e => setTags(e.target.value)}
              placeholder="e.g., facial, skincare, gold-glow"
              className="w-full bg-white/5 border border-white/10 text-white px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-brand-rosegold/40"
            />
          </div>

          <div className="flex gap-6 items-center pt-2">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={featured}
                onChange={e => setFeatured(e.target.checked)}
                className="w-4 h-4 rounded bg-white/5 border-white/10 text-brand-rosegold focus:ring-0 cursor-pointer"
              />
              <span className="text-sm text-white/60 font-medium hover:text-white transition-colors">Featured Service</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isActive}
                onChange={e => setIsActive(e.target.checked)}
                className="w-4 h-4 rounded bg-white/5 border-white/10 text-brand-rosegold focus:ring-0 cursor-pointer"
              />
              <span className="text-sm text-white/60 font-medium hover:text-white transition-colors">Active / Visible on Menu</span>
            </label>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={() => router.push('/admin/services')}
            className="px-6 py-2.5 bg-white/5 hover:bg-white/10 text-white font-medium rounded-xl text-sm transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 bg-brand-rosegold text-brand-charcoal-dark px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-brand-rosegold-dark transition-colors disabled:opacity-55"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Service</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
